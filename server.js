const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

// 获取专辑列表
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

// 获取单个专辑详情
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

// 获取单个歌曲详情
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

// 代理图片请求
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

// 代理歌词请求
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

// 导出 Express 应用程序
module.exports = app;
