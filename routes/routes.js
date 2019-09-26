var express = require('express');
const mongoose = require('mongoose')
var router = express.Router();
var cryptography = require('../helper/cryptography');
const contactCtrl = require('../controller/contactCtrl');
const chequeCtrl=require('../controller/checkController');
const userfind = mongoose.model('registerUser')
var user = require('../controller/transactionService');
var adminController = require('../controller/adminController');
var transaction=mongoose.model('transaction')
// var cheque=mongoose.model('chequeUser')
/* GET home page. */
var contactus = require("../controller/contactUs");
var admin = require("../models/loginModel");



var chequeUser = require('../models/chequeModel');
var cheque=mongoose.model('chequeUser')

/***CHEQUE API */
router.post("/cheque/Application", (req, res) => {

    var ad = new cheque({
        chequeNo: req.body.chequeNo,
        amount: req.body.amount,
        account: req.body.account,
        accountNumber: req.body.accountNumber,
        username:req.body.username,
    });
    ad.save((err, doc) => {
        if (!err) {
            res.send(doc);

        } else {
            console.log(
                "Error in  Save :" + JSON.stringify(err, undefined, 2)
            );
        }
    });

});





router.get("/cheque/Application", (req, res) => {

    cheque.find((err, doc) => {
        if (!err) {
            res.send(doc);

        } else {
            console.log(
                "Error in  Save :" + JSON.stringify(err, undefined, 2)
            );
        }
    });
});

router.get('/user/ministatement/:id', contactCtrl.ministatement);





//to update user cheque state from not received to received
router.put('/cheque/:accountNumber', chequeCtrl.update);


//to update user cheque state from received to sent for clearence
router.put('/cheque/clearence/:accountNumber', chequeCtrl.stateClear);

//to update user cheque state from  sent for clearence to cleared
router.put('/cheque/cleared/:accountNumber', chequeCtrl.cleared);

//to update user cheque state from  sent for clearence to bounce
router.put('/cheque/bounced/:accountNumber', chequeCtrl.bounced);

//to add the amount mentioned in cheque  in the account after clearenec
router.put('/user/addAmountByCheque/:accountNumber', adminController.deposit);

//deduct fine of 100rupees after cheque bounce
router.put('/user/deductFine/:accountNumber', adminController.deductFine);

/***CHEQUE API END*/

/***ADMIN REGISTRATION  FOR GETTING ALL THE USERS WHO ARE NOT APPROVED*/
router.get("/user/notApproved", (req, res) => {
    userfind.find({ "status": "not approved" }).sort({ username: 1 }).then(res1 => {


        res.send(res1);

    }).catch(err => {
        cb(true, null);//There was an error or the user is not found in the database
    });
});


router.get("/user-one/notApproved", (req, res) => {
    userfind.findOne({ "status": "not approved" }).sort({ username: 1 }).then(res1 => {

        // cb(null, res[0]);
        res.send(res1);
        console.log(res1);
    }).catch(err => {
        cb(true, null);//There was an error or the user is not found in the database
    });
});

















// ContactUs  customer api router
router.post('/contactUs', function (req, res) {
    contactus.save(req, res);
});

router.get('/contactUs', function (req, res) {
    contactus.list(req, res);
});

//deleting the data of a given person
//delete api

router.delete('/delete/:id', function (req, res) {
    contactus.delete(req, res);
});



//approve user by admin //add account number
router.put('/user/:email', adminController.update);
//when reject the application
router.delete('/user/:email', contactCtrl.remove);
//change status from approved to not approved to stop user from logging
router.put('/notApprove/:username', contactCtrl.statusChange);

// //get all the users whose account has been locked
router.get('/user/locked', contactCtrl.findLockedUsers);

//unlock account by admin manually
router.put('/Approve/:email', contactCtrl.statusChangeByAdmin);


router.get('/register', contactCtrl.get);


router.get('/register/:id', contactCtrl.getOne);

router.post('/register', contactCtrl.create);

router.put('/register/:email', contactCtrl.update);

router.delete('/register/:email', contactCtrl.remove);



//TRANSACTION
router.post('/user/transaction', user.transaction);
router.post('/admin/deposit', adminController.deposit);
router.post('/admin/withdraw', adminController.withdraw);

//at user dashboard to get all the transactions
router.get("/user/getTransaction/:from", (req, res) => {

    transaction.find({"from":req.params.from},(err, doc) => {
        if (!err) {
            res.send(doc);

        } else {
            console.log(
                "Error in  Save :" + JSON.stringify(err, undefined, 2)
            );
        }
    });
});



router.get("/user/getCheque/:accountNumber", (req, res) => {

    cheque.find({"accountNumber":req.params.accountNumber},(err, doc) => {
        if (!err) {

            res.send(doc[0]);

        } else {
            console.log(
                "Error in  Save :" + JSON.stringify(err, undefined, 2)
            );
        }
    });
});


router.get("/user/getBalanceByCheque/:accountNumber", (req, res) => {

    userfind.find({"accountNumber":req.params.accountNumber},(err, doc) => {
        if (!err) {
            console.log(doc[0])
            res.send(doc[0]);

        } else {
            console.log(
                "Error in  Save :" + JSON.stringify(err, undefined, 2)
            );
        }
    });
});

router.get("/user/getTransactionMini/:from", (req, res) => {

    transaction.find({"from":req.params.from},(err, doc) => {
        if (!err) {
            res.send(doc);

        } else {
            console.log(
                "Error in  Save :" + JSON.stringify(err, undefined, 2)
            );
        }
    }).sort({date:1}).limit(5)
});

router.get("/user/getChequeStatus/:accountNumber", (req, res) => {

    cheque.find({"accountNumber":req.params.accountNumber},(err, doc) => {
        if (!err) {
            console.log(doc[0].state)
            res.send(doc[0].state);

        } else {
            console.log(
                "Error in  Save :" + JSON.stringify(err, undefined, 2)
            );
        }
    });
});


module.exports = router;
