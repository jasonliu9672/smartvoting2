var express     = require('express');
//var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('./src/db');
var cors = require('cors');
require('dotenv').config();

var adminRouter = require('./src/routes/admin');
const corsOptions={
	origin: [
		'http://localhost:8080',
	],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
}
const port        = process.env.PORT || 3000

var app         = express();
app.use(cors(corsOptions));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
//use qs 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/admin',adminRouter);
//mongodb  setup
// mongoose.connect(uri, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true,
// })
// .then(() => console.log('DB Connected!'))
// .catch(err => {
// console.log(`DB Connection Error: ${err.message}`);
// });
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;







app.listen(port,() =>{
	console.log('server is up on ' + port);
})