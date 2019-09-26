var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var http = require('http');
var fs = require('fs');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var cors = require('./helper/cors.js');
var cor=require('cors');
var config = require('./config/config.js'); // Environment variable "NODEJSENV" should be set to 'prod' or 'qa' or 'dev' or 'localhost'
// const logger = require('./helper/logger');
var auth = require("./helper/auth");
// var register = require("./model/register");
require('dotenv').config()
require("./connection/connection")
var indexRouter = require('./routes/routes');
var app = express();
// process.env.HOST

var env = process.env.NODEJSENV || 'localhost';
// logger.info("STARTING FOR ENVIRONMENT: " + env);

//and we are wide open when it comes to CORS
app.use(cors.allowCrossDomain);

app.use(cor({origin:'http://localhost:4200'}));
var options = {
  swaggerUi: '/swagger.json',
  controllers: './controller',
  useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};


var spec = fs.readFileSync('./definitions/swagger.yaml', 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Update the doc location to match wherever we are deploying to.
swaggerDoc.host = config.swaggerDocHost;
swaggerDoc.schemes = [config.swaggerDocScheme];


// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());
    // Attach our own objects to the request, so the service call handlers have those available
    app.use(function (req, res, next) {
        req.ph = {};
        next();
    });
    app.use(middleware.swaggerSecurity({ Bearer: auth.verifyToken }));

    // If the auth function above failed, we don't want to display the swagger auth error message, we want to send our own.
    app.use(function (req, res, next) {
        if (req.ph.hasOwnProperty('response') && req.ph.response.code == -1) {
            res.writeHead(401, { 'Content-Type': 'application/x-www-form-urlencoded' });
            return res.end(JSON.stringify({ message: "Error: Access Denied" }));
        } else next();
    });

    // Use gzip compression on responses
    app.use(compression());

    // Attach our own objects to the request, so the service call handlers have those available
    app.use(function (req, res, next) {
        req.ph = {};
        req.ph.config = config;
        next();
    });

    // Validate Swagger requests, but not on production where hopefully everything has been well tested and we want to avoid spending
    // the time to reparse and validate every response.
    app.use(middleware.swaggerValidator({
        validateResponse: (env != "prod")
    }));

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    if (env != "prod") {
        // Serve the Swagger documents and Swagger UI
        app.use(middleware.swaggerUi());
    }

    // Start the server
    
});




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const repo = require('./repository/dbRepo')
// String!
// name: String!

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   res.status(404);
//   res.send("NO Such API")
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

app.listen(config.serverPort, function () {
  console.log('Server is listening on port %d (http://localhost:%d)', config.serverPort, config.serverPort);
  console.log('Swagger-ui is available on http://localhost:%d/docs', config.serverPort);
})
module.exports = app;
