const model = require('../models/addressBook')
const joi = require('@hapi/joi');


exports.get = (req, res) => {
    let query = req.query
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
        // confirmPassword: joi.string(),

        // role:joi.string(),
        // status:joi.string()

    };
    const { error } = joi.validate(query, schema);
    if (error) {
        res.status(400)
        res.send(error)

    }
    else {
        model.findAll(req.query)
            .then((result) => {
                res.status(200)
                res.send(result)
            })
            .catch((e) => {
                res.send(e)
            })
    }
}










exports.getOne = (req, res) => {
    let query = req.query
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
        // confirmPassword: joi.string(),

        // role:joi.string(),
        // status:joi.string()

    };
    const { error } = joi.validate(query, schema);
    if (error) {
        res.status(400)
        res.send(error)

    }
    else {
        model.findAl(req.query)
            .then((result) => {
                res.status(200)
                res.send(result)
            })
            .catch((e) => {
                res.send(e)
            })
    }
}




exports.findLockedUsers = (req, res) => {
    let query = req.query
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
    const { error } = joi.validate(query, schema);
    if (error) {
        res.status(400)
        res.send(error)

    }
    else {
        model.lockuser(req.query)
            .then((result) => {
                res.status(200)
                res.send(result)
            })
            .catch((e) => {
                res.send(e)
            })
    }
}













exports.create = (req, res) => {
    let body = req.body

    const schema = {
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        account: joi.string().required(),
        address1: joi.string().required(),
        address2: joi.string().required(),
        address3: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        pin: joi.number().required(),
        phone: joi.number().required(),
        username: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().required()
    };


    const { error } = joi.validate(body, schema);
    if (error) {
        res.status(400)
        res.send(error)

    }
    else {

        model.insertData(body)
            .then((response) => {
                res.status(200);
                res.send(response)
            })

            .catch((err) => {
                res.status(500);
                res.send(err)
            })
    }
}

exports.update = (req, res) => {
    const paramsSchema = {
        email: joi.string().email().required(),
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
            model.updateData(req.params, req.body)
                .then((response) => {
                    res.status(200);
                    res.send(response)
                })
                .catch((err) => {
                    res.status(400);
                    res.send(err)
                })
        }
    }
}



exports.statusChange = (req, res) => {
    const paramsSchema = {
        username: joi.string().required(),
    }
    const { error } = joi.validate(req.params, paramsSchema);
    if (error) {
        res.status(400)
        res.send(error)
    } else {
        let body = req.body
        const schema = {
            username: joi.string(),

        };
        const { error } = joi.validate(body, schema);
        if (error) {
            res.status(400)
            res.send(error)
        }
        else {
            model.changeStatus(req.params, req.body)
                .then((response) => {
                    res.status(200);
                    res.send(response)
                })
                .catch((err) => {
                    res.status(400);
                    res.send(err)
                })
        }
    }
}

exports.statusChangeByAdmin = (req, res) => {
    const paramsSchema = {
        email: joi.string().email().required(),
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

            city: joi.string(),
            state: joi.string(),
            pin: joi.string(),

            username: joi.string(),
            email: joi.string().email(),

        };
        const { error } = joi.validate(body, schema);
        if (error) {
            res.status(400)
            res.send(error)
        }
        else {
            model.changeStatusByAdmin(req.params, req.body)
                .then((response) => {
                    res.status(200);
                    res.send(response)
                })
                .catch((err) => {
                    res.status(400);
                    res.send(err)
                })
        }
    }
}






exports.remove = (req, res) => {
    const paramsSchema = {
        email: joi.string().email().required(),
    }
    const { error } = joi.validate(req.params, paramsSchema);
    if (error) {
        res.status(400)
        res.send(error)
    } else {
        model.removeData(req.params)
            .then((response) => {
                res.status(200);
                res.send(response)
            })
            .catch((err) => {
                res.status(400);
                res.send(err)
            })
    }
}









exports.ministatement = (req, res) => {
    let query = req.query
    const schema = {
        accountNumber: joi.string(),
        balance: joi.number(),
        // chequeNo: joi.string(),
        // amount: joi.string(),
        // account: joi.string(),


    };
    const { error } = joi.validate(query, schema);
    if (error) {
        res.status(400)
        res.send(error)

    }
    else {
        model.findmini(req.query)
            .then((result) => {
                res.status(200)
                res.send(result)
            })
            .catch((e) => {
                res.send(e)
            })
    }
}
