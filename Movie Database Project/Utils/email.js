// use nodemailer for sending emails
const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //For gmail Activator
    // const transporter = nodemailer.createTransporter({
    //     service: 'Gmail',
    //     auth:{
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD,
    //     }
    //     //activate in gmail "less secure app" option
    // });
    
    // 1) make the service 
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
        //activate in gmail "less secure app" option
    });
    // 2) make the email options 
    const mailOption = {
        form: 'Moiz <admin@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    
    // 3) actually send the Email 
    await transporter.sendMail(mailOption);
    
}

module.exports  = sendEmail;