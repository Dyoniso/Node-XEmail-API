require('dotenv').config()
const app = require('../app').app
const transporter = require('../app').transporter
const Logger = require('./utils/logger')
const logger = new Logger('app')
const emailChecker = require('./utils/emailChecker')
const md5 = require('md5')

const JsonMessage = require("./utils/jsonMessage")
const { ERROR_TYPE } = require("./utils/jsonMessage")

const SMTP_SENDER_EMAIL = `"${process.env.SMTP_SENDER_NAME}"<${process.env.SMTP_SENDER_EMAIL}>`

let X_API_KEY = process.env.X_API_KEY
if (!X_API_KEY || X_API_KEY.length === 0) X_API_KEY = '123' //Default API KEY
X_API_KEY = md5(X_API_KEY)

const middleApiKey = (req, res, next) => {
    const hrApiKey = req.headers['x-api-key']
    const jm = new JsonMessage()

    if (hrApiKey && hrApiKey === X_API_KEY) return next()
    else jm.setError('Invalid API KEY', ERROR_TYPE.FORBIDDEN)
    return res.status(jm.getStatusCode()).send(jm.getMessage()).end()
}

app.get('/', middleApiKey, (req, res) => {
    return res.send(`
        <div style="text-align:center">
            <h4> Welcome XV1-Email Api </h4>
            Usage: POST '/mail/send' to send email according to your environment variables.
            <br> [SMTP] Server Status: ${require('../app').SMTP_SERVER_STATUS}
            <hr>
            <a href="https://github.com/Dyoniso"> > Created by Dyoniso < </a>
        </div>
    `).end()
})

app.post('/mail/send', middleApiKey, async(req, res) => {
    let receiver = req.body.receiver
    let subject = req.body.subject
    let text = req.body.text
    let html = req.body.html

    const jm = new JsonMessage()

    if (!subject || subject.length == 0) {
        jm.setError('Subject cannot be empty!', ERROR_TYPE.NOT_FOUND)
    }

    if (!receiver || !emailChecker.isEmailValid(receiver)) {
        jm.setError(`Invalid receiver email address - ${receiver}`, ERROR_TYPE.SYNTAX)
    }

    if (!jm.isError()) {
        const emailObj = makeMainOption(receiver, subject, text, html)
        logger.info('[Request] Processing a new email object ', emailObj)

        await transporter.sendMail(emailObj).then((info) => {
            jm.setSuccess(`Email send to ${emailObj.to} [${info.response}]`)
        }).catch((err) => {
            jm.setError('Error after send email', ERROR_TYPE.SERVER)
            logger.error(`Internal server error after send email to ${emailObj.to}`, err.toString())
        })
    }

    return res.status(jm.getStatusCode()).send(jm.getMessage()).end()
     
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