const mongoose = require('mongoose');
var user = mongoose.model('registerUser')
var cryptography = require('../helper/cryptography');
const newLocal = /@gmail\.com$/;
const chequeSchema = new mongoose.Schema({
    chequeNo: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    account: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        default: null
    },
    username: {
        type: String,
        required: true
    },

    date: {
        type: Date,

        default: Date.now
    },
    state: {
        type: String,
        default: "not received"
    },
    transactionType:{
        type:String,
        default:"Credit"
      }
});

let chequeUser = mongoose.model('chequeUser', chequeSchema);


















exports.insertData = (data) => {
    return new Promise((resolve, reject) => {
        var insertData = new chequeUser(data)

        user.find({ "accountNumber": insertData.accountNumber }).then(res => {
            if (res) {
                return insertData.save(cb)
                    .then((res1) => {


                        return resolve(res)
                    })
            }
        })


    })
        .catch((err) => {
            let badResponse = {
                msg: "Data Not Inserted",
                error: err
            }
            return reject(badResponse)
        })
}

exports.updateData = (toUpdate, data) => {
    return new Promise((resolve, reject) => {

        let firstData = { state: "received" };

        let prevData = toUpdate

        chequeUser.updateOne(prevData, firstData, { multi: true, new: true })
            .then((res) => {
                if (res.n) {
                    let response = {
                        msg: "Data Updated"
                    }
                    return resolve(response)
                } else {
                    let badResponse = {
                        msg: "No Such Email Exist",
                    }
                    return reject(badResponse)
                }
            })
            .catch((err) => {
                let badResponse = {
                    msg: "Data Not Updated",
                    error: err
                }
                return reject(badResponse)
            })
    })
}











exports.clearence = (toUpdate, data) => {
    return new Promise((resolve, reject) => {

        let firstData = { state: "sent for clearence" };

        let prevData = toUpdate

        chequeUser.updateOne(prevData, firstData, { multi: true, new: true })
            .then((res) => {
                if (res.n) {
                    let response = {
                        msg: "Data Updated"
                    }
                    return resolve(response)
                } else {
                    let badResponse = {
                        msg: "No Such Email Exist",
                    }
                    return reject(badResponse)
                }
            })
            .catch((err) => {
                let badResponse = {
                    msg: "Data Not Updated",
                    error: err
                }
                return reject(badResponse)
            })
    })
}





exports.clear = (toUpdate, data) => {
    return new Promise((resolve, reject) => {
        chequeUser.find({})
        let firstData = { state: "clear" };

        let prevData = toUpdate

        chequeUser.updateOne(prevData, firstData, { multi: true, new: true })
            .then((res) => {
                if (res.n) {
                    let response = {
                        msg: "Data Updated"
                    }
                    return resolve(response)
                } else {
                    let badResponse = {
                        msg: "No Such Email Exist",
                    }
                    return reject(badResponse)
                }
            })
            .catch((err) => {
                let badResponse = {
                    msg: "Data Not Updated",
                    error: err
                }
                return reject(badResponse)
            })
    })
}










exports.bounce = (toUpdate, data) => {
    return new Promise((resolve, reject) => {

        let firstData = { state: "bounce" };

        let prevData = toUpdate

        chequeUser.updateOne(prevData, firstData, { multi: true, new: true })
            .then((res) => {
                if (res.n) {
                    let response = {
                        msg: "Data Updated"
                    }
                    return resolve(response)
                } else {
                    let badResponse = {
                        msg: "No Such Email Exist",
                    }
                    return reject(badResponse)
                }
            })
            .catch((err) => {
                let badResponse = {
                    msg: "Data Not Updated",
                    error: err
                }
                return reject(badResponse)
            })
    })
}

