const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quotes', { useNewUrlParser: true, useUnifiedTopology: true });

// Quote schema and model
const quoteSchema = new mongoose.Schema({
    text: String,
    author: String
});

const Quote = mongoose.model('Quote', quoteSchema);

// API endpoint to get a random quote
app.get('/api/quote', async (req, res) => {
    const quotes = await Quote.find();
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
});

// API endpoint to search quotes by author
app.get('/api/quotes', async (req, res) => {
    const author = req.query.author;
    const quotes = await Quote.find({ author: new RegExp(author, 'i') });
    res.json(quotes);
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
