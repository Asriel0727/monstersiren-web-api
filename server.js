// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/albums', async (req, res) => {
    try {
        const response = await axios.get('https://monster-siren.hypergryph.com/api/albums', {
            headers: {
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
