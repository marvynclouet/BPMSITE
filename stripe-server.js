// BPM Formation - Serveur Stripe pour les paiements
// Fichier: stripe-server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Mode LIVE pour vrais paiements avec votre carte bancaire
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here');

const app = express();

// Configuration email avec Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'bpmformation2025@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'your_gmail_app_password_here'
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Servir les fichiers statiques

// Configuration des formations
const formations = {
    'Formation Ingé/Beatmaking': {
        price: 80000, // 800€ en centimes
        name: 'Formation Ingé/Beatmaking BPM',
        description: '35h de formation présentielle + Vidéos offertes + Groupe privé + Événements + Opportunités'
    },
    'Formation Distancielle': {
        price: 50000, // 500€ en centimes
        name: 'Formation Distancielle BPM',
        description: '15h de visio + 20h de vidéos offertes'
    },
    'Formation Vidéos': {
        price: 10000, // 100€ en centimes
        name: 'Formation Vidéos BPM',
        description: '20h de vidéos de formation + Accès plateforme 12 mois'
    },
    'TEST - Formation 1€': {
        price: 100, // 1€ en centimes (POUR TEST UNIQUEMENT)
        name: 'TEST - Formation 1€',
        description: 'Formation test à 1€ - Ne pas utiliser en production'
    }
};

// Route pour créer une session de paiement Stripe
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { formation, price, paymentMode, customer } = req.body;
        
        // Vérifier que la formation existe
        if (!formations[formation]) {
            return res.status(400).json({ error: 'Formation non trouvée' });
        }
        
        const formationData = formations[formation];
        
        // Gestion des réductions selon l'âge (uniquement pour Formation Ingé/Beatmaking)
        let ageDiscount = 0;
        if (formation === 'Formation Ingé/Beatmaking' && customer && customer.age) {
            if (customer.age < 21) {
                // -21 ans : 600€
                ageDiscount = formationData.price - 60000; // 800€ - 600€ = 200€ de réduction
            } else if (customer.age < 25) {
                // -25 ans : 700€
                ageDiscount = formationData.price - 70000; // 800€ - 700€ = 100€ de réduction
            }
        }
        
        // Calculer le prix selon le mode de paiement
        let finalPrice = formationData.price - ageDiscount;
        let sessionMode = 'payment';
        let lineItems = [];
        
        if (paymentMode === 'full') {
            // Paiement intégral
            lineItems = [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: formationData.name + (ageDiscount > 0 ? ' (Tarif réduit)' : ' (Paiement intégral)'),
                        description: formationData.description + (ageDiscount > 0 ? ` - Réduction appliquée: -${ageDiscount/100}€` : ''),
                        images: ['https://lemon-paws-share.loca.lt/assets/Logo%20BPM%20Formations.png'],
                    },
                    unit_amount: finalPrice, // Prix déjà en centimes
                },
                quantity: 1,
            }];
        } else if (paymentMode === 'installments') {
            // Paiement en 3x sans frais
            lineItems = [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: formationData.name + (ageDiscount > 0 ? ' (Tarif réduit)' : '') + ' (Paiement en 3x sans frais)',
                        description: formationData.description + (ageDiscount > 0 ? ` - Réduction appliquée: -${ageDiscount/100}€` : '') + ' - Paiement échelonné',
                        images: ['https://lemon-paws-share.loca.lt/assets/Logo%20BPM%20Formations.png'],
                    },
                    unit_amount: finalPrice, // Prix déjà en centimes
                },
                quantity: 1,
            }];
        } else {
            // Mode par défaut - Stripe propose tous les moyens de paiement
            lineItems = [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: formationData.name + (ageDiscount > 0 ? ' (Tarif réduit)' : ''),
                        description: formationData.description + (ageDiscount > 0 ? ` - Réduction appliquée: -${ageDiscount/100}€` : ''),
                        images: ['https://lemon-paws-share.loca.lt/assets/Logo%20BPM%20Formations.png'],
                    },
                    unit_amount: finalPrice,
                },
                quantity: 1,
            }];
        }
        
        // URL de base pour Stripe (HTTPS obligatoire en mode LIVE)
        const baseUrl = 'https://lemon-paws-share.loca.lt';
        
        // Créer la session Stripe Checkout LIVE avec les moyens de paiement de base
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'klarna'],
            line_items: lineItems,
            mode: sessionMode,
            success_url: `https://lemon-paws-share.loca.lt/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://lemon-paws-share.loca.lt/commande.html?formation=${encodeURIComponent(req.body.formation)}`,
            customer_email: customer?.email || undefined,
            metadata: {
                formation: formation,
                paymentMode: paymentMode,
                customerName: `${customer?.firstName} ${customer?.lastName}`,
                source: 'BPM Formation Website'
            },
            // Permettre les codes promo
            allow_promotion_codes: true,
            // Configuration pour la France
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
            },
        });

        console.log('✅ Session Stripe LIVE créée:', session.id);
        console.log('📝 Formation:', formation);
        console.log('💰 Prix:', finalPrice / 100, '€');
        console.log('👤 Client:', customer?.firstName, customer?.lastName);
        console.log('📧 Email:', customer?.email);
        console.log('🔗 URL de redirection:', session.url);
        
        res.json({ 
            sessionId: session.id,
            url: session.url 
        });
        
    } catch (error) {
        console.error('Erreur Stripe:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route pour vérifier le statut du paiement
app.get('/payment-status/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        res.json({
            status: session.payment_status,
            customer_email: session.customer_details?.email,
            formation: session.metadata?.formation
        });
    } catch (error) {
        console.error('Erreur vérification paiement:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook pour les événements Stripe (optionnel)
app.post('/stripe-webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = 'whsec_VOTRE_WEBHOOK_SECRET'; // REMPLACEZ PAR VOTRE SECRET WEBHOOK
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Gérer les événements
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Paiement réussi pour:', session.metadata?.formation);
            // Ici vous pouvez envoyer un email de confirmation, créer un compte utilisateur, etc.
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({received: true});
});

// Route pour envoyer email de contact
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, phone, formation, message } = req.body;
        
        const mailOptions = {
            from: 'bpmformation2025@gmail.com',
            to: 'clouetmarvyn@gmail.com, bpmformation2025@gmail.com',
            replyTo: email,
            subject: `Nouvelle demande BPM Formation - ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #000;">Nouvelle demande de contact</h2>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>👤 Nom :</strong> ${name}</p>
                        <p><strong>📧 Email :</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>📱 Téléphone :</strong> ${phone || 'Non renseigné'}</p>
                        <p><strong>🎵 Formation :</strong> ${formation || 'Non spécifiée'}</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h3>💬 Message :</h3>
                        <p style="background: #fff; padding: 15px; border-left: 4px solid #000; margin: 10px 0;">
                            ${message || 'Demande de contact sans message spécifique'}
                        </p>
                    </div>
                    
                    <hr style="margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">
                        Envoyé automatiquement depuis <strong>bpmformation.com</strong><br>
                        Date : ${new Date().toLocaleString('fr-FR')}
                    </p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('📧 Email envoyé avec succès à:', mailOptions.to);
        res.json({ success: true, message: 'Email envoyé avec succès' });
        
    } catch (error) {
        console.error('❌ Erreur email:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur BPM Formation démarré sur le port ${PORT}`);
    console.log(`💳 Stripe LIVE configuré - Prêt pour les vrais paiements !`);
    console.log(`📧 Email Nodemailer configuré`);
    console.log(`🎵 BPM Formation - Système de paiement opérationnel`);
});