const mysql = require('promise-mysql');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'orcamento',
    connectionLimit: 10, // Default value is 10.
    waitForConnections: true, // Default value.
    queueLimit: 0 // Unlimited - default value.
};

module.exports = async () => {
    try {
        let pool;
        let con;
        if (pool) con = pool.getConnection();
        else {
            pool = await mysql.createPool(dbConfig);
            con = pool.getConnection();
        }
        return con;
    } catch (ex) {
        throw ex;
    }
}