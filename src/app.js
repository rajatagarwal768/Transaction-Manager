const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const transactionRouter = require('./routers/transaction');

const app = express()

app.use(express.json());
app.use(userRouter);
app.use(transactionRouter);

module.exports = app