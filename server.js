const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// 代理获取专辑数据的 API 请求
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

// 代理获取单个专辑详细信息的 API 请求
app.get('/api/album/:id/detail', async (req, res) => {
    const albumId = req.params.id;
    try {
        const response = await axios.get(`https://monster-siren.hypergryph.com/api/album/${albumId}/detail`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching album details' });
    }
});

// 代理获取单个歌曲详细信息的 API 请求
app.get('/api/song/:id', async (req, res) => {
    const songId = req.params.id;
    try {
        const response = await axios.get(`https://monster-siren.hypergryph.com/api/song/${songId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching song details' });
    }
});

// 代理图片请求
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
