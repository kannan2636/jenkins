const server = require('./config/app.js')();
const config = require('./config/databaseConfig.js');

//create the basic server setup 
server.create(config);

//start the server
server.start();