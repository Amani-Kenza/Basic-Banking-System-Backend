const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Customer = require('./model/customer');

const uri = 'mongodb+srv://kenza:kenza@cluster0.tvml1vn.mongodb.net/customers?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true, 
  ssl: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});


mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200 
}));

/*app.get('/', (req, res) => {
  res.send('Hello World');
});*/

app.post('/api/updateCustomerBalance', async (req, res) => {
  try {
  
      const { fromAccount, toAccount, amount } = req.body.customerBalance;
      

       const fromAccountFilter = { AccountNum: fromAccount };
       const toAccountFilter = { AccountNum: toAccount };
      
       
       const updatedFromAccount = await Customer.findOneAndUpdate(fromAccountFilter, { $inc: { Balance: -amount } }, { returnOriginal: false });
       console.log('updatedFromAccount:', updatedFromAccount);

       const updatedToAccount = await Customer.findOneAndUpdate(toAccountFilter, { $inc: { Balance: amount } }, { returnOriginal: false });
        console.log('updatedToAccount:', updatedToAccount);

       const updatedBalances = await Customer.find();

      res.status(200).json({ customerBalances: updatedBalances });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
  }
});


app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
