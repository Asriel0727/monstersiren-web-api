//Express 初始化建立Express程式
const express = require('express');

//允許資源共享，使其可從不同網域存取API
const cors = require('cors');
const axios = require('axios');

const app = express();

//限制只能載入來自'self'和 https://vercel.live 的資源
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://vercel.live");
    next();
});

// 啟動local server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// 獲取專輯列表
app.get('/api/albums', async (req, res) => {
  try {
    const response = await axios.get('https://monster-siren.hypergryph.com/api/albums', {
      headers: {
        'Accept': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ message: 'Error fetching albums' });
  }
});

// 獲取單個專輯訊息
app.get('/api/album/:id/detail', async (req, res) => {
  const albumId = req.params.id;
  try {
    const response = await axios.get(`https://monster-siren.hypergryph.com/api/album/${albumId}/detail`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching album details:', error);
    res.status(500).json({ message: 'Error fetching album details' });
  }
});

// 獲取單個歌曲詳情
app.get('/api/song/:id', async (req, res) => {
  const songId = req.params.id;
  try {
    const response = await axios.get(`https://monster-siren.hypergryph.com/api/song/${songId}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
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

// 匯出 Express 應用
module.exports = app;
