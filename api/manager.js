require('dotenv').config()
const app = require('../app').app
const transporter = require('../app').transporter
const Logger = require('./utils/logger')
const logger = new Logger('app')
const emailChecker = require('./utils/emailChecker')

const JsonMessage = require("./utils/jsonMessage")
const { ERROR_TYPE } = require("./utils/jsonMessage")

const SMTP_SERVICE = process.env.SMTP_SERVICE
const SMTP_SENDER_EMAIL = (SMTP_SERVICE === 'Zoho' ? `"senderNameSameLikeTheZohoOne"<${process.env.SMTP_SENDER_EMAIL}>` : process.env.SMTP_SENDER_EMAIL)

app.get('/', (req, res) => {
    return res.send(`
        <div style="text-align:center">
            <h4> Welcome XV1-Email Api </h4>
            Usage: POST '/mail/send' to send email according to your environment variables.
            <hr>
            <a href="https://github.com/Dyoniso"> > Created by Dyoniso < </a>
        </div>
    `).end()
})

app.post('/mail/send', (req, res) => {
    let receiver = req.body.receiver
    let subject = req.body.subject
    let text = req.body.text
    let html = req.body.html

    const jm = new JsonMessage()

    if (!subject || subject.length() == 0) {
        jm.setError('Subject cannot be empty!', ERROR_TYPE.NOT_FOUND)
    }

    if (!emailChecker.isEmailValid(receiver)) {
        jm.setError('Invalid receiver email address - ', receiver)
    }

    transporter.sendMail(makeMainOption(receiver, subject, text, html), (err, info) => {
        if (!err) jm.setError('Error after send email', ERROR_TYPE.SERVER)
        else {
            jm.setSuccess(`Email send to ${receiver}`);
        }

        return res.status(jm.getStatusCode()).send(jm.getMessage())
    })   
})

function makeMainOption(receiver, subject, text, html) {
    return {
        from: SMTP_SENDER_EMAIL,
        to: receiver,
        subject: subject,
        text : text,
        html : html
    }
}