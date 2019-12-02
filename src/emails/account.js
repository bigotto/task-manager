const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'brunobigotto@hotmail.com',
        subject: 'Welcome to the Task Manager',
        text: `Welcome to the app, ${name}. I hope you enjoy!`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'brunobigotto@hotmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}