const mongoose = require('mongoose');
var cryptography = require('../helper/cryptography');
var uniqueValidator = require('mongoose-unique-validator');
const newLocal = /@gmail\.com$/;
const sha256 = require('simple-sha256')

const registerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    },

    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: true
    },
    address3: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pin: {
        type: Number,
        required: true,

    },
    phone: {
        type: Number,
        required: true,

    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        $regex: newLocal
    },
    password: {
        type: String,
        required: true
    },
    role:
    {
        type: String,

        default: 'user',

        value: ['user', 'admin']
    },
    status: {
        type: String,
        default: 'not approved',
        value: ['approved', 'not approved']
    },
    verifiedUser: {
        type: Boolean,
        default: false
    },
    accountNumber: {
        type: String,
        default: null
    },
    balance: {
        type: Number,
        default: 0
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,

        default: Date.now
    }

    //    AccountDetails:[account,accountNumber]


});

let registerUser = mongoose.model('registerUser', registerSchema);
registerSchema.plugin(uniqueValidator);

function accountNumberGenerator(accountNumber) {
    let temp;
    let ac = '';
    for (let i = 0; i < 15; i++) {
        if ((accountNumber[i] >= 'a' && accountNumber[i] <= 'z') || (accountNumber[i] >= 'A' && accountNumber[i] <= 'Z')) {
            temp = accountNumber.charCodeAt(i);
        } else {
            temp = accountNumber[i];
        }
        ac += temp;
    }
    return ac.substring(0, 15);
}

exports.findAll = (data) => {
    return new Promise((resolve, reject) => {
        registerUser.find(data)
            .then((res) => {
                return resolve(res)
            })
            .catch((err) => {
                let badResponse = {
                    message: "Data Not Found",
                    error: err
                }
                return reject(badResponse)
            })
    })
}




exports.findAl = (data) => {
    return new Promise((resolve, reject) => {
        registerUser.findOne(data)
            .then((res) => {
                return resolve(res)
            })
            .catch((err) => {
                let badResponse = {
                    message: "Data Not Found",
                    error: err
                }
                return reject(badResponse)
            })
    })
}


//to get all the users whose account has been locked
exports.lockuser = (data) => {
    return new Promise((resolve, reject) => {


        registerUser.find({ isLocked: { $eq: true } })
            .then(res => {

                return resolve(res)


            })
            .catch((err) => {
                let badResponse = {
                    message: "Data Not Found",
                    error: err
                }
                return reject(badResponse)
            })
    })
}



exports.insertData = (data) => {
    return new Promise((resolve, reject) => {
        var insertData = new registerUser(data)
        if (insertData.password)
            insertData.password = cryptography.sha256(insertData.password);

        return insertData.save()
            .then((res) => {
                if (res) {
                    return resolve(res)
                } else {
                    let badResponse = {
                        msg: "Data Not Inserted"
                    }
                    return reject(badResponse)
                }
            })
            .catch((err) => {
                let badResponse = {
                    msg: "Data Not Inserted",
                    error: err
                }
                return reject(badResponse)
            })
    })
}




//for admin dashboard to approve user
exports.updateData = (toUpdate, data) => {
    return new Promise(async (resolve, reject) => {
        const hashString = Date.now().toString() + data.email + data.username;
        let accountNumber = await sha256(hashString);
        accountNumber = 'AC' + accountNumberGenerator(accountNumber);
        let firstData = { accountNumber: accountNumber, verifiedUser: true, status: "approved" };
        let prevData = toUpdate

        registerUser.updateOne(prevData, firstData, { multi: true, new: true })
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

exports.changeStatus = (toUpdate, data) => {
    return new Promise((resolve, reject) => {

        let firstData = { isLocked: true };
        let prevData = toUpdate

        registerUser.updateOne(prevData, firstData, { multi: true, new: true })
            .then((res) => {
                if (res.n) {
                    let response = {
                        msg: "Data Updated"
                    }
                    return resolve(response)
                } else {
                    let badResponse = {
                        msg: "No Such username Exist",
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




exports.changeStatusByAdmin = (toUpdate, data) => {
    return new Promise((resolve, reject) => {

        let firstData = { isLocked: false };
        let prevData = toUpdate

        registerUser.updateOne(prevData, firstData, { multi: true, new: true })
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



///////----------------------------------


exports.removeData = (data) => {
    return new Promise((resolve, reject) => {
        registerUser.remove(data)
            .then((res) => {
                if (res.n) {
                    let response = {
                        msg: "Data Deleted"
                    }
                    return resolve(response)
                } else {
                    let badResponse = {
                        msg: "no such data exist"
                    }
                    return reject(badResponse)
                }
            })
            .catch((err) => {
                let badResponse = {
                    msg: "Data Not Deleted",
                    error: err
                }
                return reject(badResponse)
            })
    })
}












exports.findmini = (data) => {
    return new Promise((resolve, reject) => {
        registerUser.findOne(data)
            .then((res) => {
                return resolve(res.accountNumber, res.balance);
            })
            .catch((err) => {
                let badResponse = {
                    message: "Data Not Found",
                    error: err
                }
                return reject(badResponse)
            })
    })
}





exports.update = async (findData, data) => {
    const resData = await registerUser.updateOne(findData, data);
    return resData;
}