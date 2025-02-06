const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

// 中間件設置 CSP (Content Security Policy) 
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy", 
        "default-src 'self'; script-src 'self' https://vercel.live; object-src 'none'; style-src 'self' 'unsafe-inline';"
    );
    next();
});

// 啟動監聽埠，注意這段在 Vercel 無效，但可在本地開發時使用
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}

// 取得專輯列表
app.get('/api/albums', async (req, res) => {
    try {
        const response = await axios.get('https://monster-siren.hypergryph.com/api/albums');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).json({ message: 'Error fetching albums' });
    }
});

// 取得單一專輯詳細內容
app.get('/api/album/:id/detail', async (req, res) => {
    const albumId = req.params.id;
    try {
        const response = await axios.get(`https://monster-siren.hypergryph.com/api/album/${albumId}/detail`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching album details:', error);
        res.status(500).json({ message: 'Error fetching album details' });
    }
});

// 取得單首歌曲資料
app.get('/api/song/:id', async (req, res) => {
    const songId = req.params.id;
    try {
        const response = await axios.get(`https://monster-siren.hypergryph.com/api/song/${songId}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching song details:', error);
        res.status(500).json({ message: 'Error fetching song details' });
    }
});

// 代理圖片請求
app.get('/proxy-image', async (req, res) => {
    const imageUrl = req.query.url;
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const contentType = response.headers['content-type'];
        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ message: 'Error fetching image' });
    }
});

// 代理歌詞請求
app.get('/proxy-lyrics', async (req, res) => {
    const lyricsUrl = req.query.url;
    try {
        const response = await axios.get(lyricsUrl, { responseType: 'text' });
        const contentType = response.headers['content-type'];
        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        res.status(500).json({ message: 'Error fetching lyrics' });
    }
});

module.exports = app;
