// BPM Formation - Serveur Email Simple
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// Configuration email
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'bpmformation2025@gmail.com', // Votre email d'envoi
        pass: 'VOTRE_MOT_DE_PASSE_APP_GMAIL' // Mot de passe d'application Gmail
    }
});

// Route pour envoyer email
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, phone, formation, message } = req.body;
        
        const mailOptions = {
            from: 'bpmformation2025@gmail.com',
            to: 'clouetmarvyn@gmail.com, bpmformation2025@gmail.com',
            replyTo: email,
            subject: `Nouvelle demande BPM Formation - ${name}`,
            html: `
                <h2>Nouvelle demande de contact</h2>
                <p><strong>👤 Nom :</strong> ${name}</p>
                <p><strong>📧 Email :</strong> ${email}</p>
                <p><strong>📱 Téléphone :</strong> ${phone || 'Non renseigné'}</p>
                <p><strong>🎵 Formation :</strong> ${formation || 'Non spécifiée'}</p>
                <p><strong>💬 Message :</strong></p>
                <p>${message || 'Demande de contact sans message spécifique'}</p>
                <hr>
                <p><small>Envoyé depuis bpmformation.com</small></p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email envoyé avec succès' });
        
    } catch (error) {
        console.error('Erreur email:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`📧 Serveur email BPM Formation sur le port ${PORT}`);
});