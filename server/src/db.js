const mongoose = require('mongoose');
const server = "localhost:27017"
const database ="testdb"

mongoose.connect(`mongodb://${server}/${database}`, {
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

