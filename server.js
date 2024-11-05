const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Serve static files (your HTML and assets)
app.use(express.static(path.join(__dirname, 'public')));

// Proxy image requests
app.get('/proxy-image', async (req, res) => {
    const imageUrl = req.query.url;

    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const contentType = response.headers['content-type'];
        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching image' });
    }
});

// Proxy API requests (fetch albums)
app.get('/albums', async (req, res) => {
    try {
        const response = await axios.get('https://monster-siren.hypergryph.com/api/albums');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching albums' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
