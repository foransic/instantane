var config = {};

config.app = {};
config.db = {};
config.imap = {};
config.mail = {};
config.picture = {};

config.app.port = 1234;
config.db.host = 'localhost';
config.db.port = 5678;
config.db.base = 'instantane';

config.imap.user = 'john@mclane.com';
config.imap.password = 'yippiekiyay';
config.imap.host = 'mclane.com';
config.imap.port = 123;
config.imap.tls = true;

config.mail.recipients = ['john@mclane.com'];
config.picture.tmp = 'tmp/';
config.picture.web = 'pictures/';

module.exports = config;
