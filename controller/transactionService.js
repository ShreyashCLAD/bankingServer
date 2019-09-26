const companyModel = require('../models/companyAccModel');
const accHandling = require('../helper/accHandling');
const userModel=require('../models/addressBook')

async function transaction(req, res) {
  const body = req.body;
  if (!accHandling.isEmpty(body)) {
    body.type = body.type.toLowerCase();
    const user = await userModel.findAl({accountNumber: body.accountNumber});
    if (user) {
      let toAccount;
      if (body.type === 'company') {
        toAccount = await companyModel.findAl({companyName: body.companyName});
      } else if (body.type === 'user') {
        toAccount = await userModel.findAl({accountNumber: body.toAccountNumber});
      }
      if(toAccount) {
        const withdrawData = await accHandling.withdraw(user, body.amount);
        if (withdrawData.success) {
          const remainingBalance = parseFloat(user.balance) - parseFloat(body.amount);
          const depositData = await accHandling.deposit(toAccount, body.amount, body.type);
          if(depositData.success) {
            const receipt = await accHandling.transactionReceipt(body.accountNumber, toAccount.accountNumber, remainingBalance, body);
            const responseData = {success: true, data: {msg: 'Transaction successful', balance: remainingBalance}}
            if (receipt.success) {
              responseData.data['receipt'] = receipt.data.receipt;
              responseData.data['transaction_id'] = receipt.data.transaction_id;
            }
            res.send(responseData);
          } else {
            res.send({success: false, error: depositData.error});
          }
        } else {
          res.send({success: false, error: withdrawData.error});
        }
      } else {
        res.send({success: false, error: 'To account does not exists'});
      }
    } else {
      res.send({success: false, error: 'User not found'});
    }
  } else {
    res.send({success: false, error: 'Please insert a body'});
  }
}

module.exports = {
  transaction
}




