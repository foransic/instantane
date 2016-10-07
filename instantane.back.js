var Imap = require('imap');
var MailParser = require("mailparser").MailParser;
var Magick = require('imagemagick');

var db = require('./model/db');
var picturesModel = require('./model/pictures.js');

var config = require('./config');

//var shortid = require('shortid');

var fs = require('fs'), fileStream;

/**
* Parse the mail in parameter & register it in mongodb
* Download the attached picture & resize it for display
*/
function parseMail(mail, cb) {
  var mailparser = new MailParser();

  mailparser.on("end", function(mail){
    var from = mail.from[0].address;

    if (config.mail.recipients.indexOf(from) > -1) {
      console.log(from + ' is approved, let\'s continue');

      var title = mail.subject;
      var description = mail.text;

      if (mail.attachments && mail.attachments.length > 0) {
        // I take only the first one, let's see how manage the next ones later ;-)
        var attachment = mail.attachments[0];
        var filename = attachment.generatedFileName;
        var base64header = 'data:image/' + filename.substring(filename.lastIndexOf('.') + 1) + ';base64,';
        Magick.resize({
          srcData: attachment.content,
          width: 1000
        }, function(err, stdout, stderr) {
          if (err) {
            cb(err);
          } else {
            picturesModel.create(from, title, description, base64header + new Buffer(stdout, 'binary').toString('base64'), function(err, pic) {
              cb(err);
            });
          }
        });
      }
    } else {
      console.log(from + ' is not approved, won\'t record this post');
    }
  });
  mail.pipe(mailparser);
}


setInterval(function() {
  var imap = new Imap({
    user: config.imap.user,
    password: config.imap.password,
    host: config.imap.host,
    port: config.imap.port,
    tls: config.imap.tls,
    tlsOptions: { rejectUnauthorized: false }
  });

  imap.once('ready', function() {
    imap.openBox('INBOX', false, function(err, box) {
      if (err) throw err;
      imap.search(['UNSEEN'], function(err, results) {
        if (err || !results || results.length == 0) {
          console.log('you are already up to date');
          imap.end();
        } else {
          console.log(results.length + ' mail(s) fetched');
          var f = imap.fetch(results, {markSeen : true, bodies: '' }); // f -> imapFetch
          f.on('message', function(msg, seqno) {
            msg.on('body', function(stream, info) {
              // call parseMail function to parse & register the mail
              parseMail(stream, function(err) {
                if (err) {
                  console.log('message #' + seqno + ' failed : ' + err);
                } else {
                  console.log('message #' + seqno +  ' recorded');
                }
              });
            });
          });
          f.once('error', function(err) {
              console.log('Fetch error: ' + err);
          });
          f.once('end', function() {
              console.log('Done fetching all messages!');
              imap.end();
          });
        }
      });
    });
  });

  imap.once('end', function() {
    console.log('Connection ended');
  });

  imap.connect();
}, config.interval);
