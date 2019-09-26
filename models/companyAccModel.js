const mongoose = require('mongoose');
var cryptography = require('../helper/cryptography');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: false
  },
  accountNumber: {
    type: String,
    default: false
  },
  balance: {
    type: String,
    default: false
  },
  email: {
    type: String,
    default: false
  }
});

let companyAccounts = mongoose.model('companyAccount', companySchema);
exports.findAll = (data) => {
  return new Promise((resolve, reject) => {
    companyAccounts.find(data)
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
    companyAccounts.findOne(data)
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

exports.insertData = (data) => {
  return new Promise((resolve, reject) => {
    var insertData = new companyAccounts(data)
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

exports.removeData = (data) => {
  return new Promise((resolve, reject) => {
    companyAccounts.remove(data)
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

exports.update = async (findData, data) => {
  const resData = await companyAccounts.updateOne(findData, data);
  return resData;
}
