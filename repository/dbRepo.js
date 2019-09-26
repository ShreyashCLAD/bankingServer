const model = require('../models/addressBook')

exports.findAll = (data) => {
    return new Promise((resolve, reject) => {
        model.addressBook.find(data)
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
        var insertData = new model.addressBook(data)
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

exports.updateData = (data) => {
    return new Promise((resolve, reject) => {
        let prevData = data.toUpdate
        let newData = {
            $set: data.update
        }
        model.addressBook.update(prevData, newData, { multi: true, new: true })
            .then((res) => {
                let response = {
                    msg: "Data Updated"
                }
                return resolve(response)
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

exports.removeData = (data) => {
    return new Promise((resolve, reject) => {
        model.addressBook.remove(data)
            .then((res) => {
                if (res) {
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
