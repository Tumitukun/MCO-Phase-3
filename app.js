const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = 3000; // Change this to your desired port number

// Connect to MongoDB
mongoose.connect('mongodb+srv://TestName:1YO8or0x5d70xwgv@notes.1crjdpg.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create a schema for your notes
const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  deleted: { type: Boolean, default: false }, // New field for deleted notes
});

// Create a model based on the schema
const Note = mongoose.model('Note', noteSchema);

app.use(express.static(path.join(__dirname, 'public'))); // Serve your frontend files
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
