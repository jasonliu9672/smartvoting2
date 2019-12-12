const mongoose = require('mongoose');
const server = "localhost:27017"
const database ="testdb"
const url = "mongodb+srv://jason_y_liu:88888888@cluster0-ah9xh.mongodb.net/test?retryWrites=true&w=majority"

//mongoose.connect(`mongodb://${server}/${database}`, {
mongoose.connect(url, {
useUnifiedTopology: true,
useNewUrlParser: true,
useCreateIndex: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(`DB Connection Error: ${err.message}`);
});
mongoose.Promise = global.Promise;
module.exports= mongoose;

