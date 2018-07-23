var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
// var models = require('../models/models');
// var User = models.User;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);
var Schema = mongoose.Schema;

// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!

// Step 2: Create all of your models here, as properties.V

var userSchema = new Schema ({
  username: String,
  password: String,
  phone: String
})

var contactSchema = new Schema ({
  name: String,
  phone: Number,
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
})

var messageSchema = new Schema ({
  created: Date,
  content: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  contact: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  channel: String
})

var Contact = mongoose.model('Contact', contactSchema);
var User = mongoose.model('User', userSchema);
var Message = mongoose.model('Message', messageSchema);
// Step 3: Export your models object
module.exports = {
  User: User,
  Contact: Contact,
  Message: Message
}
