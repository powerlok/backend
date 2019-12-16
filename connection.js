var mysql = require("mysql");
var mysql2 = require("mysql2/promise");
var oracledb = require("oracledb");
const bluebird = require('bluebird');
var SimpleOracleDB = require('simple-oracledb');
 

const dbConfig = {
  host: process.env.NODE_APP_HOSTBD,
  user: process.env.NODE_APP_USERBD,
  password: process.env.NODE_APP_SENHABD,
  database: process.env.NODE_APP_DATABASE,
  connectionLimit: 10, // Default value is 10.
  waitForConnections: true, // Default value.
  queueLimit: 0 // Unlimited - default value.
};

/*{
  host: 'localhost',
  user: 'orcfacil_user',
  password: '6ttDpQSyYS@',
  database: 'orcfacil_db',
  connectionLimit: 10, // Default value is 10.
  waitForConnections: true, // Default value.
  queueLimit: 0 // Unlimited - default value.
}*/

module.exports = {
  connection_Mysql: () => {
    return mysql.createConnection(dbConfig);
  },
  connection_MysqlDb: (database) => {
    return mysql.createConnection({
      host: process.env.NODE_APP_HOSTBD,
      user: process.env.NODE_APP_USERBD,
      password: process.env.NODE_APP_SENHABD,
      database: database,
      connectionLimit: 10, // Default value is 10.
      waitForConnections: true, // Default value.
      queueLimit: 0 // Unlimited - default value.
    });
  },
  connection_MysqlSync: database => {
    return  mysql.createPool({
                      host: process.env.NODE_APP_HOSTBD,
                      user: process.env.NODE_APP_USERBD,
                      password: process.env.NODE_APP_SENHABD,
                      database: database,
                      connectionLimit: 10, // Default value is 10.
                      waitForConnections: true, // Default value.
                      queueLimit: 0 // Unlimited - default value.      
                    });
  },
  connection_Mysql_Async:  (database) => {
    
    return mysql2.createPool({
      host: process.env.NODE_APP_HOSTBD,
      user: process.env.NODE_APP_USERBD,
      password: process.env.NODE_APP_SENHABD,
      database: database,
      connectionLimit: 10, // Default value is 10.
      waitForConnections: true, // Default value.
      queueLimit: 0, // Unlimited - default value.
      Promise: bluebird
    });
    //return ;
  },
  connection_OrableDBAsync: async (user, password, port, host, service) => {
    //let connection;

      return await oracledb.getConnection({
        user: user,
        password: password,
        connectString:
          "(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = " +
          host +
          ")(PORT = " +
          port +
          ")) (CONNECT_DATA = (SERVER = DEDICATED) (SERVICE_NAME = " +
          service +
          ")))"
      });
  },
  connection_OrableDB: (user, password, port, host, service,callback) => {
    
  //modify the original oracledb library
  SimpleOracleDB.extend(oracledb);

      oracledb.getConnection({
        user: user, 
        password: password,
        connectString: "(DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = "+host+")(PORT = "+port+")))(CONNECT_DATA =(SERVICE_NAME = "+service+")))"
      }, (err, ok) => { 
        
        if(err){           
          var e = new Error();
          e.statusCode= 400;
          e.errno= err.errorNum;
          e.sqlMessage= err.message; 
          e.sqlState= '';
          e.sql= '';
          
          callback(e, null);
        }else {
          callback(null, ok);
        }
      });
  }
};
