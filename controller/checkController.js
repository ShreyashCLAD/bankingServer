
const model = require('../models/chequeModel')
const joi = require('@hapi/joi');








exports.create = (req, res) => {
    let body = req.body

    const schema = {
        chequeNo: joi.string().required(),
        amount: joi.number().required(),
        account: joi.string().required(),
        accountNumber: joi.string().required(),
        username:joi.string().required()

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
        accountNumber: joi.string().required(),
    }
    const { error } = joi.validate(req.params, paramsSchema);
    if (error) {
        res.status(400)
        res.send(error)
    } else {
        let body = req.body
        const schema = {
            chequeNo: joi.string(),
            amount: joi.number(),
            account: joi.string(),
            accountNumber: joi.string(),
            username:joi.string()


        };
        const { error } = joi.validate(body, schema);
        if (error) {
            res.status(400)
            res.send(error)
        }
        else {
            model.updateData(req.params ,req.body)
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















exports.stateClear = (req, res) => {
    const paramsSchema = {
        accountNumber: joi.string().required(),
    }
    const { error } = joi.validate(req.params, paramsSchema);
    if (error) {
        res.status(400)
        res.send(error)
    } else {
        let body = req.body
        const schema = {
            chequeNo: joi.string(),
            amount: joi.number(),
            account: joi.string(),
            accountNumber: joi.string(),
            username:joi.string()


        };
        const { error } = joi.validate(body, schema);
        if (error) {
            res.status(400)
            res.send(error)
        }
        else {
            model.clearence(req.params ,req.body)
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





exports.cleared = (req, res) => {
    const paramsSchema = {
        accountNumber: joi.string().required(),
    }
    const { error } = joi.validate(req.params, paramsSchema);
    if (error) {
        res.status(400)
        res.send(error)
    } else {
        let body = req.body
        const schema = {
            chequeNo: joi.string(),
            amount: joi.number(),
            account: joi.string(),
            accountNumber: joi.string(),
            username:joi.string()


        };
        const { error } = joi.validate(body, schema);
        if (error) {
            res.status(400)
            res.send(error)
        }
        else {
            model.clear(req.params ,req.body)
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


exports.bounced = (req, res) => {
    const paramsSchema = {
        accountNumber: joi.string().required(),
    }
    const { error } = joi.validate(req.params, paramsSchema);
    if (error) {
        res.status(400)
        res.send(error)
    } else {
        let body = req.body
        const schema = {
            chequeNo: joi.string(),
            amount: joi.number(),
            account: joi.string(),
            accountNumber: joi.string(),
            username:joi.string()


        };
        const { error } = joi.validate(body, schema);
        if (error) {
            res.status(400)
            res.send(error)
        }
        else {
            model.bounce(req.params ,req.body)
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