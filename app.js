// Import required modules
const express = require('express');
const axios = require('axios');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;
const OPEN_CAGE_API_KEY = '656056a3e4c8491bbc4e13a643ae5f21'; // Replace with your actual OpenCage API key

// Serve the HTML content directly from a route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Chef-hire - Where?</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #F5F5F5; }
        input[type="text"] { width: 100%; padding: 10px; border: 1px solid #E0E0E0; border-radius: 5px; }
        .suggestions { border: 1px solid #E0E0E0; background-color: #FFFFFF; border-radius: 5px; padding: 10px; margin-top: 10px; }
        .buttons { display: flex; justify-content: space-between; margin-top: 20px; }
        .back-button { background-color: #E0E0E0; color: #666666; }
        .next-button { background-color: #007BFF; color: #FFFFFF; }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">
          <img src="img/Chef-Hire-Logo-Final-2.png" alt="Chef-Hire Logo">
          <button class="close-button">X</button>
        </div>
        <div class="progress-bar"></div>
      </header>

      <main>
        <h2>Where?</h2>
        <p>Enter your postcode or city.</p>
        <input type="text" id="location-input" placeholder="Search postcode or city...">
        <div id="suggestions" class="suggestions"></div>
        <div class="buttons">
          <button class="back-button">Back</button>
          <button class="next-button">Next</button>
        </div>
      </main>

      <script>
        const input = document.getElementById('location-input');
        const suggestionsContainer = document.getElementById('suggestions');

        input.addEventListener('input', () => {
          const query = input.value;
          if (query.length > 2) {
            fetch(\`/api/location/search?query=\${query}\`)
              .then(response => response.json())
              .then(suggestions => {
                suggestionsContainer.innerHTML = '';
                suggestions.forEach(location => {
                  const div = document.createElement('div');
                  div.textContent = location;
                  suggestionsContainer.appendChild(div);
                });
              });
          } else {
            suggestionsContainer.innerHTML = '';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Location search endpoint using OpenCage API
app.get('/api/location/search', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).send('Query parameter is required');

  try {
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
      params: {
        q: query,
        key: OPEN_CAGE_API_KEY,
        limit: 5,
      },
    });

    const locations = response.data.results.map(result => result.formatted);
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching location data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
