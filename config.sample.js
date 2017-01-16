var config = {};

config.app = {};
config.db = {};
config.imap = {};
config.mail = {};
config.picture = {};

config.app.port = 1234;

// Database
config.db.user = 'instantane';
config.db.password = 'password'; // the password for mongodb mellon user
config.db.host = 'localhost';
config.db.port = 5678;
config.db.base = 'instantane';

// IMAP
config.imap.user = 'john@mclane.com';
config.imap.password = 'yippiekiyay';
config.imap.host = 'mclane.com';
config.imap.port = 123;
config.imap.tls = true;

// Recipients filtering
config.mail.recipients = ['john@mclane.com'];

// Pictures storage
config.picture.tmp = 'tmp/';
config.picture.web = 'pictures/';

// Reload interval
config.interval = 60000;

module.exports = config;
