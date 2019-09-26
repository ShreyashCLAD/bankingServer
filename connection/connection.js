const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/banking`, { useNewUrlParser: true, useFindAndModify: false,'useCreateIndex': true,'useUnifiedTopology': true })
    .then(() => {
        console.log("Database Connected")
    })
    .catch((err) => {
        console.log("Database Not Connected", err)
    })

module.exports = mongoose;
