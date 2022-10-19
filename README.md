# XV1-Email-API
Convert HTTP traffic into a Simple Email

# First Step

## Install Node Server

1. Clone the repository
```
git clone https://github.com/Dyoniso/XV1-Email-API
```

2. Inside repository, run npm start
```
npm start .
```

## API Config


In order to be able to send e-mail, configure the .env file with the credentials of your e-mail server.

```
#HTTP SERVER
HTTP_HOST = localhost #Server Host
HTTP_PORT = 8081 #Server Port

#SMTP SERVER
SMTP_SERVICE = 'EMAIL-SERVICE' #ex: GMAIL
SMTP_LOGIN = 'SMTP-LOGIN'
SMTP_PASSWORD = 'SMTP-PASSWORD'
SMTP_SECURE = off #SSL? ON or OFF
SMTP_PORT = 'SMTP-PORT'
SMTP_SENDER_EMAIL = 'EMAIL OF SEND' #name@your-website.com
```

With the API running, make a POST request at the following path: ```/mail/send```
put the following parameters in the body.
```
{
   "receiver":"example@gmail.com",
   "subject":"Awesome email written in Node",
   "text":"Very easy!",
   "html":"<h1> Strong Email </h1>"
}
```
With everything finished, the ```receiver``` will receive an email in the inbox.

Happy hacking!
