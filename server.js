import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/password_manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected Successfully');
}).catch(err => {
  console.error('MongoDB Connection Error:', err);
});

// Mongoose Schema
const credentialSchema = new mongoose.Schema({
    url: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Credential = mongoose.model('Credential', credentialSchema);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Routes
app.get('/credentials', async (req, res) => {
  try {
    const credentials = await Credential.find();
    res.json(credentials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/credentials', async (req, res) => {
  try {
    const credential = new Credential(req.body);
    const savedCredential = await credential.save();
    res.status(201).json(savedCredential);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/credentials/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Attempting to delete credential with id:', id);
    
    const deletedCredential = await Credential.findByIdAndDelete(id);
    
    if (!deletedCredential) {
      console.log('Credential not found with id:', id);
      return res.status(404).json({ message: 'Credential not found' });
    }

    console.log('Successfully deleted credential:', deletedCredential);
    res.status(200).json({ message: 'Credential deleted successfully' });
  } catch (error) {
    console.error('Error deleting credential:', error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
