var express = require('express');
var router = express.Router();
var models = require('../models/models');
var Contact = models.Contact;
var User = models.User;
var Message = models.Message;
var accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
var fromNumber = process.env.MY_TWILIO_NUMBER; // Your custom Twilio number
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

router.get('/contacts', function(req, res){
  Contact.find({owner: req.user._id}, function(err, contacts){
    if (err){
      res.send('error finding user');
      // return;
    };
    if (!contacts){
      res.send('no matching contact');
      // return;
    }
    res.render('contacts', {
      contacts: contacts
    })
  });
})

router.get('/contacts/new', function(req, res){
  res.render('newContact');
})

router.get('/contacts/:id', function(req,res){
  var id = req.params.id;
  Contact.findById(id, function(err, contact){
    if (err){
      res.send('error finding contact');
      return;
    }
    if (!contact){
      res.send('could not find contact');
      return;
    }
    res.render('editContact', {
      contact: contact
    })
  })
})

router.post('/contacts/new', function(req, res){
  var newContact = new Contact ({
    name: req.body.name,
    phone: req.body.phoneNumber,
    owner: req.user._id
  });
  newContact.save(function(err){
    if (err){
      res.send('error saving contact');
      return;
    }
    res.redirect('/contacts');
  });
})

router.post('/contacts/:id', function(req,res){
  var id = req.params.id;
  Contact.findById(id, function(err, contact){
    if (err){
      res.send("error finding contact");
      return;
    };
    if (!contact){
      res.send("invalid contact id");
      return;
    };
    contact.name = req.body.name;
    contact.number = req.body.phoneNumber;
    contact.save(function(err){
      if(err){
        res.send('error saving changes to contact');
        return;
      }
      res.redirect('/contacts');
    })
  })

})

router.get('/messages', function(req, res){
  console.log("logging req.user!!", req.user)
  Message.find({
    user: req.user._id
  }).populate('Contact').exec(function(err, messages){
    if (err){
      res.send('error finding user');
      return;
    }
    res.render('messages',{
      messages: messages
    })
  })
})

router.get('/messages/:contactId', function(req, res){
    Contact.findById(req.params.contactId, function(err, contact){
      if (err){
        res.send(err);
        return;
      }
      Message.find({
        user: req.user._id,
        contact: req.params.contactId
      }).populate('Contact').exec(function(err, messages){
      if (err){
        res.send('error finding user');
        return;
      }
      res.render('messages',{
        messages: messages,
        fromContact: contact
      })
    })
  })
})

router.get('/messages/send/:contactId', function(req, res){
  res.render('newMessage', {
    contactId: req.params.contactId
  })
})

router.post('/messages/send/:contactId', function(req, res){
  Contact.findById(req.params.contactId, function(err, contact){
    if (err){
      res.send(err);
      return;
    }

    var data = {
      body: req.body.message,
      to: '+1' + contact.phone, // a 10-digit number
      from: fromNumber
    }
    client.messages.create(data, function(err,msg){
      if (err){
        res.send(err);
        return;
      }
      var newMessage = new Message({
        created: new Date,
        content: req.body.message,
        user: req.user,
        contact: contact,
        channel: "SMS"
      });
      newMessage.save(function(err){
        if(err){
          res.send(err);
          return;
        }
        res.redirect('/messages');
      })
    })
  })
})

router.post('/contacts/delete/:contactId', function(req, res){
    Contact.findById(req.params.contactId).remove(function(err){
      if (err){
        res.send('error deleting contact');
        return;
      }
      res.redirect('/contacts')
    })

})
module.exports = router;
