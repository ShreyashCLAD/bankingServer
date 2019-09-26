const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
  from: {
    type: String,
    default: false
  },
  to: {
    type: String,
    default: false
  },
  amount: {
    type: String,
    default: false
  },
  timestamp: {
    type: String,
    default: false
  },
  type: {
    type: String,
    default: false
  },
  transactionType:{
    type:String,
    default:"Debit"
  }
});

let transaction = mongoose.model('transaction', transactionSchema);

exports.addTransaction = async (data) => {
  const insertData = new transaction(data);
  return await insertData.save();
}
