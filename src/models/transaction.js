const mongoose = require('mongoose');
const validator = require('validator');
const transactionSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		ref: 'User'
	},
	type: {
		type: String,
		required: true,
		trim: true,
		validate(value) {
          if(value!=='CREDIT' && value!=='DEBIT') {
          	throw new Error('Type should be CREDIT or DEBIT!');
          }
       }
	},
	amount: {
		type: Number,
		required: true,
		validate(value) {
          if(value<0) {
          	throw new Error('Amount must be a positive number!');
          }
       }
	},
	currency: {
		type: String,
		required: true,
		trim: true,
		validate(value) {
          if(value!=='INR' && value!=='USD' && value!=='EURO') {
          	throw new Error('Wrong Currency!');
          }
       }
	},
	status: {
		type: String,
		required: true,
		trim: true,
		validate(value) {
          if(value!=='INPROGRESS' && value!=='COMPLETED') {
          	throw new Error('Wrong Status!');
          }
       }
	}
}, {
	timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;