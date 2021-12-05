const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Transaction = require('./transaction');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true,
      lowercase: true
	},
	password: {
		type: String,
		required: true,
		minlength: 7,
		trim: true,
		validate(value){
			if(value.toLowerCase().includes('password')){
                throw new Error('Password can not contain "password"!');
			}
		}
	},
	net_balance: {
       type: Number,
       default: 0,
       validate(value) {
          if(value<0) {
          	throw new Error('Balance must be a positive number!');
          }
       }
	},
	amount_credited: {
       type: Number,
       default: 0,
       validate(value) {
          if(value<0) {
          	throw new Error('Balance must be a positive number!');
          }
       }
	},
	amount_debited: {
       type: Number,
       default: 0,
       validate(value) {
          if(value<0) {
          	throw new Error('Balance must be a positive number!');
          }
       }
	},
	tokens: [{
		token:{
			type: String,
			required: true
		}
	}]
}, {
	timestamps: true
});

userSchema.virtual('transactions',{
	ref: 'Transaction',
	localField: '_id',
	foreignField: 'username'
})

userSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
}

userSchema.methods.generateAuthToken = async function (){
	const user = this;
	const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
}

userSchema.statics.findByCredentials = async(username,password) => {
	const user = await User.findOne({username});

	if(!user){
		throw new Error('Unable to login');
	}

	const isMatch = await bcrypt.compare(password,user.password);

	if(!isMatch){
		throw new Error('Unable to login');
	}

	return user;
}

//Hash the plain text password before saving
//pre means function runs before user.save(). Middleware
userSchema.pre('save', async function(next){
	const user = this;
	if(user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
})


//Delete user transactions when user is removed
userSchema.pre('remove', async function(next) {
	const user= this;
	await Transaction.deleteMany({username: user.username})
	next();
})


const User = mongoose.model('User', userSchema);

module.exports = User;