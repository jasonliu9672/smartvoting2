var express     = require('express');
//var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('./src/db');
var cors = require('cors');
var blindSignature = require('blind-signatures');
require('dotenv').config();

var adminRouter = require('./src/routes/admin');
var ballotRouter = require('./src/routes/ballot');

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
app.use('/ballots',ballotRouter);
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
	new_key = blindSignature.keyGeneration({b:2048});
	console.log(typeof(new_key),new_key);
	console.log('server is up on ' + port);
})