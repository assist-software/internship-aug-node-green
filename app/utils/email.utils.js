const nodeMailer = require('nodemailer');

let send = (emailData, emailList) => {
    let transporter = nodeMailer.createTransport({
        service: 'Outlook365',
        auth: {
            user: 'intern.valentin.stratan@assist.ro',
            pass: 'valstr_8398'
        }
    });
    list = emailList.toString();
    let mailOptions = {
        from: '"Admin" <intern.valentin.stratan@assist.ro>',
        to: list,
        subject: emailData,
        text: emailData
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return false;
        }
        else {
          return true;
        }
    });
};

module.exports = send;