const nodemailer = require('nodemailer');

class MailService{

        constructor(){
                this.transporter = nodemailer.createTransport({
                        host: `${process.env.SHTP_HOST}`,
                        port: process.env.SHTP_PORT,
                        secure: false,
                        auth:{
                                user: process.env.SHTP_USER,
                                pass: process.env.SHTP_PASSWORD
                        }
                })
        }

        async sendActivationMail(to, link){

                console.log(this.transporter)

                await this.transporter.sendMail({
                        from: process.env.SHTP_USER,
                        to,
                        subject: 'Активация на' + process.env.API_URL,
                        text: '',
                        html:`<div><h1>Для активации перейдите по ссылке</h1><a href="${link}">${link}</a></div>`
                })
        }
}

module.exports = new MailService();