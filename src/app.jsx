import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState([]);

  useEffect(() => {
    // Load saved credentials from MongoDB when component mounts
    const fetchCredentials = async () => {
      try {
        const response = await fetch('http://localhost:3000/credentials');
        const data = await response.json();
        setSavedCredentials(data);
      } catch (error) {
        console.error('Error fetching credentials:', error);
      }
    };

    fetchCredentials();
  }, []);

  const handleSave = async () => {
    if (url && username && password) {
      try {
        const response = await fetch('http://localhost:3000/credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            username,
            password
          }),
        });

        const newCredential = await response.json();
        setSavedCredentials([...savedCredentials, newCredential]);
        
        // Clear input fields
        setUrl('');
        setUsername('');
        setPassword('');
      } catch (error) {
        console.error('Error saving credential:', error);
        alert('Error saving credential. Please try again.');
      }
    } else {
      alert('Please fill all fields');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/credentials/${id}`, {
        method: 'DELETE',
      });
      
      setSavedCredentials(savedCredentials.filter(cred => cred._id !== id));
    } catch (error) {
      console.error('Error deleting credential:', error);
      alert('Error deleting credential. Please try again.');
    }
  };
  const handleCopy = (password) => {
    navigator.clipboard.writeText(password)
      .then(() => {
        alert('Password copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy password:', err);
        alert('Failed to copy password');
      });
  };

  return (
    <div className="container">
      <h1 className="title">{"<PassOP/>"}</h1>
      <h3 className="subtitle">Your own Password Manager</h3>
      
      <div className="form-container">
        <input
          type="text"
          placeholder="Enter your website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <button
          onClick={handleSave}
          className="save-button"
        >
          Save
        </button>
      </div>

      <div className="credentials-container">
        <h3 className="credentials-title">Saved Passwords</h3>
        {savedCredentials.map(cred => (
          <div
            key={cred._id}
            className="credential-card"
          >
            <p className="credential-info"><strong>URL:</strong> {cred.url}</p>
            <p className="credential-info"><strong>Username:</strong> {cred.username}</p>
            <p className="credential-info"><strong>Password:</strong> ******</p>
            <button
              onClick={() => handleDelete(cred._id)}
              className="delete-button"
            >
              Delete
            </button>
            <button
              onClick={() => handleCopy(cred.password)}
              className="copy-button"
            >Copy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App