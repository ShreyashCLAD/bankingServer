
//  person visiting the website and contacting for help
//  contact to website api

var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var ContactUs = require("../models/contact");
// importing nodemail npm module for sending the mail for feedback
const nodemailer = require('nodemailer');

//transporter for using the service of any mail provider
var transporter = nodemailer.createTransport({
    service: 'gmail',
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

        We received your enquiry about our Bank. Thank you so much for your interest! Your query will be process soon.
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

        TEAM 4-A
        </h2>`

    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

/***************************API FOR CONTACT US **************************** */
var contactusController = {};

//contact us api
contactusController.save = function (req, res) {
    let contactus = new ContactUs({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        subject: req.body.subject,
        message:req.body.message
    });

    // mail object is used to be passed in the parameter of sendEmail() f
    var mail = {
        to: req.body.email,
        firstName: req.body.firstName,

    }
    contactus.save((err, contactUs) => {
        if (err) {
            return res.json({
                success: false,
                err
            });
        } else {
            res.send(contactus)
            sendEmail(mail);

        };
    });
};

//fetching data from the database for user that contacted
//get api for  contact us
contactusController.list = function (err, res) {

    ContactUs.find({}).exec(function (err, contactus) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            res.send(contactus);
        }
    });
}


//fetching data from the database for user that contacted and deleting them
//delete  api for contact us
// Delete an employee
contactusController.delete = function (req, res) {

    ContactUs.deleteOne({ _id: req.params.id }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Person data deleted deleted!");
            res.redirect("/contactus");
        }
    });
}

//exporting the contact us controller
module.exports = contactusController;

