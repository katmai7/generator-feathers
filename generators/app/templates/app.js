'use strict';

const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
<% if (hasProvider('rest')) { %>const rest = require('feathers-rest');<% } %>
<% if (hasProvider('socket.io')) { %>const socketio = require('feathers-socketio');<% } %>
<% if (hasProvider('primus')) { %>const primus = require('feathers-primus');<% } %>
const authentication = require('./authentication');
const middleware = require('./middleware');
const services = require('./services');

const app = feathers();

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));
// Enable CORS, compression, favicon and body parsing
app.options('*', cors());
app.use(cors());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon( path.join(app.get('public'), 'favicon.ico') ));
// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
<% if (hasProvider('rest')) { %>app.configure(rest());<% } %>
<% if (hasProvider('socket.io')) { %>app.configure(socketio());<% } %>
<% if(hasProvider('primus')) { %>app.configure(primus({ transformer: 'websockets' }));<% } %>
// This configures our authentication setup (see `authentication.js`)
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);

module.exports = app;
