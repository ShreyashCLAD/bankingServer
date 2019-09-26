const userModel = require('../models/addressBook');
const companyMddel = require('../models/companyAccModel');
const transactionModel = require('../models/transactionModel');

async function withdraw (from, amount) {
  const currentAmount = parseFloat(from.balance);
  if (currentAmount >= parseFloat(amount)) {
    try {
      const newAmount = currentAmount - parseFloat(amount);
      await userModel.update({accountNumber: from.accountNumber}, {balance: newAmount});
      return ({success: true, data: 'Money withdrawn successfully'});
    } catch (error) {
      return ({success: false, error: error.message});
    }
  } else {
    return ({success: false, error: 'don\'t have enough funds'});
  }
}


async function deductFine (from, amount) {
  const currentAmount = parseFloat(from.balance);
  if (currentAmount >= parseFloat(amount)) {
    try {
      const newAmount = currentAmount - 100;
      await userModel.update({accountNumber: from.accountNumber}, {balance: newAmount});
      return ({success: true, data: 'Fine has deducted successfully'});
    } catch (error) {
      return ({success: false, error: error.message});
    }
  } else {
    return ({success: false, error: 'problem in deduction of fine'});
  }
}



async function deposit (to, amount, type) {
  const newAmount = parseFloat(to.balance) + parseFloat(amount);
  if(type === 'company') {
    try {
      await companyMddel.update({accountNumber: to.accountNumber}, {balance: newAmount});
      return ({success: true, data: 'Money deposited to company account successfully'});
    } catch (error) {
      return ({success: false, error: error.message});
    }
  } else if (type === 'user') {
    try {
      await userModel.update({accountNumber: to.accountNumber}, {balance: newAmount});
      return ({success: true, data: 'Money deposited to user\'s account successfully'});
    } catch (error) {
      return ({success: false, error: error.message});
    }
  }
}

function modifyRecipt (body, transactionData) {
  if (body.phoneNumber) {
    transactionData['phone_number'] = body.phoneNumber;
  } else if (body.dthNumber) {
    transactionData['dth_number'] = body.dthNumber;
  } else if (body.billNumber) {
    transactionData['bill_number'] = body.billNumber;
  }
  return transactionData
}

async function transactionReceipt (from, to, remainingBalance, body) {

  const date = new Date();
  let transactionData = {
    from,
    to,
    timestamp: date.toString(),
    amount: body.amount,
    type: body.type,
    remainingBalance
  }
  if (body.type === 'company') {
    transactionData = modifyRecipt(body, transactionData);
    transactionData['company_name'] = body.companyName;
  }
  try {
    const transaction = await transactionModel.addTransaction(transactionData);
    return ({success: true, data: {msg: 'Transation added successfully', receipt: transactionData, transaction_id: transaction._id}});
  } catch (error) {
    return ({success: false, error: 'Error adding transaction history'});
  }
}

function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key)) return false;
  }
  return true;
}

module.exports = {
  isEmpty,
  deposit,
  withdraw,
  deductFine,
  transactionReceipt
}