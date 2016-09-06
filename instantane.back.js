var Imap = require('imap');
var MailParser = require("mailparser").MailParser;
var Magick = require('imagemagick');

var config = require('./config');

var imap = new Imap({
  user: config.imap.user,
  password: config.imap.password,
  host: config.imap.host,
  port: config.imap.port,
  tls: config.imap.tls,
  tlsOptions: { rejectUnauthorized: false }
});

var fs = require('fs'), fileStream;

function openInbox(cb) {
    imap.openBox('INBOX', false, cb);
}

/**
* Parse the mail in parameter & register it in mongodb
* Download the attached picture & resize it for display
*/
function parseMail(mail, cb) {
  var mailparser = new MailParser({
          streamAttachments: true
  });

  mailparser.on("end", function(mail){
    if (config.mail.recipents.includes(mail.from)) {
      console.log("From:", mail.from);
      console.log("Subject:", mail.subject);
      console.log("Text body:", mail.text);


      if(mail.attachments) {
        mail.attachments.forEach(function(attachment){
          console.log("Attachment:", attachment.generatedFileName);
        });
      }
      // @TODO register these informations in mongodb
    }
  });

  mailparser.on("attachment", function(attachment, mail) {
    var output = fs.createWriteStream('./tmp/' + attachment.generatedFileName);
    attachment.stream.pipe(output);
    attachment.stream.on('end', function() {
      // @TODO square picture if needed
      // @TODO delete tmp picture
      Magick.resize({
        srcPath: './tmp/' + attachment.generatedFileName,
        dstPath: './pics/' + attachment.generatedFileName,
        width: 500
      }, function(err, stdout, stderr) {
        // return the result (null if OK, err if an error occured)
        cb(err);
      });
    });
  });

  mail.pipe(mailparser);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    imap.search(['SEEN'], function(err, results) {
      if (err) console.log('you are already up to date');
      var f = imap.fetch(results, { bodies: '' }); // f -> imapFetch
      f.on('message', function(msg, seqno) {
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          // call parseMail function to parse & register the mail
          parseMail(stream, function(err) {
            if (err) {
              throw err;
            } else {
              imap.setFlags(seqno, ['Seen'], function(err) {
                if (err) throw err;
              });
            }
          });
        });
        //

      });
      f.once('error', function(err) {
          console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
          console.log('Done fetching all messages!');
          imap.end();
      });
    });
  });
});

imap.connect();
