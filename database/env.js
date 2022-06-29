const dummyEnv = process.env.DEBUG === 'true' ? require('./dummyEnv') : require('./dummyEnv.example');
module.exports = {
    MYSQL_HOST: process.env.DB_HOST || dummyEnv.MYSQL_HOST,
    MYSQL_USER: process.env.DB_USER || dummyEnv.MYSQL_USER,
    MYSQL_PASS: process.env.DB_PASS || dummyEnv.MYSQL_PASS,
    MYSQL_NAME: process.env.DB_NAME || dummyEnv.MYSQL_NAME,
    MYSQL_PORT: process.env.DB_PORT || dummyEnv.MYSQL_PORT,
    ROOT_USERNAME: process.env.ROOT_USERNAME || dummyEnv.ROOT_USERNAME,
    ROOT_PASSWORD: process.env.ROOT_PASSWORD || dummyEnv.ROOT_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET || dummyEnv.JWT_SECRET,
    DEBUG: process.env.DEBUG || dummyEnv.DEBUG,
};