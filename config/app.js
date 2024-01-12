const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()


module.exports = function () {

    let app = express(),
        create, start;

    create = (config) => {

        const router = require('../routes')
        // Set up view engine
        app.set('view engine', 'ejs'); // Specify the view engine (EJS in this case)
        app.set('views', 'views'); // Set the path to your views directory
        app.set('env', config.RUN_env);
        app.set('port', config.RUN_port);
        app.set('hostname', config.RUN_hostname);        
        app.use(express.json({ limit: "10mb", extended: true }))
        app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }))
        app.use(bodyParser.json({ limit: "500mb" }))
        app.use(cors());
        
        // Public Static Images
        const path = require('path');
        app.use(express.static(path.join(__dirname, '../public')));
        // Profile Static Images
        app.use(express.static(path.join(__dirname, '../uploads')));
        
        app.get('/', (req, res) => {
            res.send("I'm Healthy")
        });

        // Set up routes
        router.init(app);        
    }

    start = () => {
        let hostname = app.get('hostname'),
            port = app.get('port');
        app.listen(port, function () {
            console.log(`http://${hostname}:${port}`)
        });
    }

    return {
        create: create,
        start: start
    };

};