/*
EMAIL API by 7Dz
*/

require('dotenv').config()
const nodemailer = require('nodemailer')
const http = require ('http')
const express = require('express')
const cors = require('cors')
const Logger = require('./api/utils/logger')
const logger = new Logger('app')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true, 
	legacyHeaders: false, 
})

const app = express()
app.use(cookieParser())
app.use(express.json({ limit : '8mb' }))
app.use(cors())
app.use(limiter)

//Env Conf
const HTTP_PORT = process.env.HTTP_PORT
const HTTP_HOST = process.env.HTTP_HOST

const SMTP_SERVICE = process.env.SMTP_SERVICE
const SMTP_LOGIN = process.env.SMTP_LOGIN
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const SMTP_SECURE = (process.env.SMTP_SECURE === 'on' || process.env.SMTP_SECURE === 'true')
const SMTP_PORT = process.env.SMTP_PORT

//Start HTTP SERVER
const httpServer = http.createServer(app)
httpServer.listen(HTTP_PORT, HTTP_HOST, () => {
    logger.info(`OK Email API Started! Listening on port ${HTTP_HOST}:${HTTP_PORT}`)
})


//Start SMTP Connection
let transporter = nodemailer.createTransport({
    service : SMTP_SERVICE,
    port : SMTP_PORT,
    secure : SMTP_SECURE,
    auth: {
      user : SMTP_LOGIN,
      pass : SMTP_PASSWORD,
    },
    tls : {
        rejectUnauthorized: false
    }
});

exports.SMTP_SERVER_STATUS = 'pedding..'
transporter.verify((err, s) => {
    if (!err) {
        logger.info('SMTP Server sucessfull connected! ', s.toString())
        exports.SMTP_SERVER_STATUS = 'success!'
    }
    else {
        logger.error('Error after create transport SMTP Server', err.toString())
        exports.SMTP_SERVER_STATUS = 'error!'
    }
})

module.exports.app = app
module.exports.transporter = transporter

//Start Manager.js
require('./api/manager')
