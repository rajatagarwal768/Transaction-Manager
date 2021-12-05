const express = require('express');
const Transaction = require('../models/transaction');
const router = new express.Router();
const User = require('./user');
const auth = require('../middleware/auth');

router.post('/transaction', auth, async (req, res) => {
    const transaction = new Transaction({
    	username: req.user.username,
    	...req.body
    });

    try{
    	if(transaction.type==='CREDIT') {
    		req.user.net_balance+=transaction.amount;
    		req.user.amount_credited+=transaction.amount;
    	}
    	else {
    		if(user.net_balance>=amount) {
    			req.user.net_balance+=transaction.amount;
    			req.user.amount_debited-=transaction.amount;
    		}
    		else {
    			res.status(400).send("Net Balance is Low!!");
    		}
    	}
    	await req.user.save();
    	await transaction.save();
		res.status(201).send(transaction);
	} catch(e){
		res.status(400).send(e);
	}
});

router.patch('/transactions/:id', auth,  async (req,res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['status'];
	const isValidOperation = updates.every((update) => {
		return allowedUpdates.includes(update);
	});

	if(!isValidOperation)
	{
		return res.status(400).send({error: 'Invalid updates!'});
	}

	try{
		const transaction = await Transaction.findOne({_id: req.params.id, username: req.user.username});

		if(!transaction){
			return res.status(404).send();
		}
		updates.forEach((update) => transaction[update] = req.body[update]);
		await transaction.save();

		res.send(transaction);
	} catch(e){
		res.status(400).send(e);
	}
});

module.exports = router