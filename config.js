exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://localhost/passport';

exports.TEST_DATABASE_URL = (
    process.env.TEST_DATABASE_URL ||
    'mongodb://localhost/test-passport');

exports.PORT = process.env.PORT || 8080;

exports.CODE = process.env.CODE;

exports.SECRET = process.env.SECRET || 'keyboard cat';
