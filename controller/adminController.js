const express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const registeredUser=require('../models/addressBook');
const db = require('../connection/connection');
const user = mongoose.model('registerUser');
const userModel=require('../models/addressBook')
const admin=require('../models/loginModel');
const accHandling = require('../helper/accHandling');
const joi = require('@hapi/joi');
const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        // username of gmail and password
        user: 'inbbanking01@gmail.com',
        pass: 'admin123$$'
    }
});

function sendEmail(mail) {
    var mailOptions = {
        from: 'inbbanking01@gmail.com',
        to: mail.to,
        subject: 'Sending Email for contacting',
        html: `<h3>Dear ${mail.firstName},</h3>

         Thank you so much for your interest! We are glad to inform you that your application has been successfully
         approved.
         Kindly login to the website to know your accountNumber.
         You can awail the services by using your account number.
         You can use it whenevr you want to use any services provided by INB Bank.
        Please find attached to this email details on the various services available.
        <br><b>These are our conatct details for nearest branch location:<br>
        +91 123456789 <br>
        +91 987654321
        </b><br>
        We look forward to seeing you soon so that you can enjoy our services.<br>

        Please, do contact us if you have additional queries. Thanks again!<br>
        <h2>
        Best regards, <br>

       Indian Net Bank <br>

        team-4A
        </h2>`

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
           console.log(error)
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}






exports.update = (req, res) => {
    const paramsSchema = {
        email: joi.string().email().required(),
    }
    var mail = {
        to: req.body.email,
        firstName: req.body.firstName,
        accountNumber:req.body.accountNumber
    }
    const { error } = joi.validate(req.params, paramsSchema);
    if (error) {
        res.status(400)
        res.send(error)
    } else {
        let body = req.body
        const schema = {
            firstName: joi.string(),
            lastName: joi.string(),
            account: joi.string(),
            address1: joi.string(),
            address2: joi.string(),
            address3: joi.string(),
            city: joi.string(),
            state: joi.string(),
            pin: joi.string(),
            phone: joi.string().length(10),
            username: joi.string(),
            email: joi.string().email(),
            password: joi.string(),

        };
        const { error } = joi.validate(body, schema);
        if (error) {
            res.status(400)
            res.send(error)
        }
        else {
            registeredUser.updateData(req.params ,req.body)
                .then((response) => {
                    res.status(200);
                    res.send(response)
                    sendEmail(mail);
                })
                .catch((err) => {
                    res.status(400);
                    res.send(err)
                })
        }
    }
}



exports.withdraw = async (req, res) => {
    const body = req.body;
    if(!accHandling.isEmpty(body)) {
      const user = await userModel.findAl({accountNumber: body.accountNumber});
      if(user) {
        const data = await accHandling.withdraw(user, body.amount);
        if (data.success) {
          const info = {
            msg: data.data,
            balance: parseFloat(user.balance) - parseFloat(body.amount)
          }
          data.data = info;
        }
        res.send(data)
      } else {
        res.send({success: false, error: 'User does not exists'});
      }
    } else {
      res.send({success: false, error: 'Please insert a body'});
    }
  }


  exports.deductFine = async (req, res) => {
    const body = req.body;
   

    if(!accHandling.isEmpty(body)) {
      const user = await userModel.findAl({accountNumber: body.accountNumber});
      if(user) {
        const data = await accHandling.deductFine(user, body.amount);
        if (data.success) {
          const info = {
            msg: data.data,
            balance: parseFloat(user.balance) - 100
          }
          data.data = info;
        }
        res.send(data)
      } else {
        res.send({success: false, error: 'User does not exists'});
      }
    } else {
      res.send({success: false, error: 'Please insert a body'});
    }
  }




  exports.deposit = async (req, res) => {
    const body = req.body;
  

    if(!accHandling.isEmpty(body)) {
      const user = await userModel.findAl({accountNumber: body.accountNumber});
      if(user) {
        const data = await accHandling.deposit(user, body.amount, 'user');
        if (data.success) {
          const info = {
            msg: data.data,
            balance: parseFloat(user.balance) + parseFloat(body.amount)
          }
          data.data = info;
        }
        res.send(data)
      } else {
        res.send({success: false, error: 'User does not exists'});
      }
    } else {
      res.send({success: false, error: 'Please insert a body'});
    }
  }