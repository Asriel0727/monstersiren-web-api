// 获取所有专辑列表
async function fetchAlbums() {
    try {
        const response = await fetch('http://localhost:3000/api/albums');
        const albumsData = await response.json();
        displayAlbums(albumsData.data);
    } catch (error) {
        console.error('Error fetching albums:', error);
    }
}

// 显示专辑列表
function displayAlbums(albums) {
    const albumsContainer = document.getElementById('albums');
    
    albums.forEach(album => {
        const albumElement = document.createElement('div');
        albumElement.classList.add('album');
        
        // 使用本地代理加载图片
        const proxiedCoverUrl = `http://localhost:3000/proxy-image?url=${encodeURIComponent(album.coverUrl)}`;

        albumElement.innerHTML = `
            <img src="${proxiedCoverUrl}" alt="${album.name}">
            <h2><div class="marquee-container">
                <div class="marquee-content">${album.name}</div>
            </div></h2>
            <p><div class="marquee-container">
                <div class="marquee-content">${album.artistes.join(', ')}</div>
            </div></p>
            <button onclick="fetchAlbumDetails('${album.cid}')">查看專輯</button>
        `;
        
        albumsContainer.appendChild(albumElement);

        // 动态检测文本是否超出容器宽度
        const albumTitle = albumElement.querySelector('.marquee-content');
        const container = albumElement.querySelector('.marquee-container');
        
        if (albumTitle.scrollWidth > container.offsetWidth) {
            // 如果文本内容超出容器宽度，则启用跑马灯效果
            albumTitle.style.animationPlayState = 'running';
        } else {
            albumTitle.style.transform = 'translateX(0)';
        }
    });
}

// 获取单个专辑的详细信息
async function fetchAlbumDetails(albumId) {
    try {
        const response = await fetch(`http://localhost:3000/api/album/${albumId}/detail`);
        const albumDetailsData = await response.json();
        displayAlbumDetails(albumDetailsData.data);
    } catch (error) {
        console.error('Error fetching album details:', error);
    }
}

// 显示专辑详细信息和歌曲列表
function displayAlbumDetails(album) {
    toggleSidebar(); // 打开侧边栏

    const albumContent = document.getElementById('albumContent');
    const songsList = document.getElementById('songsList');

    if (albumContent && songsList) {
        const proxiedCoverDeUrl = album.coverDeUrl ? 
            `http://localhost:3000/proxy-image?url=${encodeURIComponent(album.coverDeUrl)}` : '';

        albumContent.innerHTML = `
            <img src="${proxiedCoverDeUrl}" alt="${album.name}" />
            <h3>${album.name}</h3>
            <p>${album.intro}</p>
        `;

        songsList.innerHTML = ''; // 清空之前的歌曲列表

        if (album.songs && album.songs.length > 0) {
            album.songs.forEach(song => {
                const songElement = document.createElement('div');
                songElement.classList.add('song-item');
                songElement.innerHTML = `
                    <p>${song.name} - ${song.artistes.join(', ')}</p>
                    <button onclick="playSong('${song.cid}')">播放歌曲</button>
                `;
                songsList.appendChild(songElement);
            });
        } else {
            songsList.innerHTML = "<p>No songs available</p>";
        }
    }
}

// 显示/隐藏侧边栏，并动态调整专辑列表的右边距
function toggleSidebar() {
    const albumDetails = document.getElementById('albumDetails');
    albumDetails.classList.toggle('active');

    const albumsContainer = document.getElementById('albums');

    if (albumDetails.classList.contains('active')) {
        // 侧边栏显示，调整专辑列表的 margin-right
        albumsContainer.style.marginRight = '350px';
    } else {
        // 侧边栏隐藏，恢复专辑列表的原始布局
        albumsContainer.style.marginRight = '0';
    }
}

let isPlaying = false; // 用于跟踪播放器是否正在播放音乐

// 切换播放器的展开/收缩状态
function togglePlayer() {
    const playerContainer = document.getElementById('playerContainer');
    playerContainer.classList.toggle('active');
}

// 获取单个歌曲并播放
async function playSong(songId) {
    try {
        // 先获取歌曲详情
        const song_response = await fetch(`http://localhost:3000/api/song/${songId}`);
        const songData = await song_response.json();

        // 使用歌曲的 albumCid 来获取专辑详情
        const albumCid = songData.data.albumCid;
        const album_response = await fetch(`http://localhost:3000/api/album/${albumCid}/detail`);
        const albumDetail = await album_response.json();

        // 播放歌曲
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = songData.data.sourceUrl;
        audioPlayer.play();

        // 使用本地代理加载专辑封面图片
        let proxiedCoverUrl = '';
        if (albumDetail.data.coverUrl) {
            proxiedCoverUrl = `http://localhost:3000/proxy-image?url=${encodeURIComponent(albumDetail.data.coverUrl)}`;
        } else {
            // 如果没有封面 URL，使用默认图片
            proxiedCoverUrl = '/path/to/default-image.jpg'; // 替换成默认图片路径
        }

        // 更新播放器中的歌曲名称和专辑封面
        document.getElementById('songTitle').textContent = songData.data.name;
        document.getElementById('currentSongTitle').textContent = songData.data.name;
        document.getElementById('albumCover').src = proxiedCoverUrl;

        // 处理歌词
        if (songData.data.lyricUrl) {            
            console.log('Fetching lyrics from:', songData.data.lyricUrl);
            const proxiedLyricUrl = `http://localhost:3000/proxy-lyrics?url=${encodeURIComponent(songData.data.lyricUrl)}`;
            const lyric_response = await fetch(proxiedLyricUrl);
            const lyrics = await lyric_response.text();
            console.log('Fetched lyrics text:', lyrics);
            
            // 解析并显示歌词，传递 audioPlayer 作为参数
            const parsedLyrics = parseLyrics(lyrics);
            console.log('Parsed lyrics:', parsedLyrics);
            displayLyrics(parsedLyrics, audioPlayer); // 确保将 audioPlayer 传递给 displayLyrics
        } else {
            // 如果没有歌词，隐藏歌词区域
            document.getElementById('lyricsContainer').innerHTML = "<p>No lyrics available</p>";
        }

        // 设置播放器为播放状态
        isPlaying = true;

    } catch (error) {
        console.error('Error fetching song or album details:', error);
    }
}

// 解析歌词，假设歌词是 LRC 格式
function parseLyrics(lyrics) {
    const lines = lyrics.split('\n');
    const parsedLyrics = [];
    const regex = /\[(\d{2}):(\d{2}\.\d{2,3})\](.*)/;

    lines.forEach(line => {
        const match = line.match(regex);
        if (match) {
            parsedLyrics.push({
                time: `${match[1]}:${match[2]}`,
                text: match[3]
            });
        }
    });

    return parsedLyrics;
}

// 显示歌词并同步播放
function displayLyrics(lyrics, audioElement) {
    const lyricsContainer = document.getElementById('lyricsContainer');
    lyricsContainer.innerHTML = ''; // 清空现有歌词

    lyrics.forEach((line) => {
        const p = document.createElement('p');
        p.textContent = line.text;
        p.dataset.time = line.time; // 将时间戳保存到 data 属性中
        lyricsContainer.appendChild(p);
    });

    // 确保 audioElement 存在，并且已经传递给函数
    if (!audioElement) {
        console.error('audioElement is undefined');
        return;
    }

    // 每秒检查一次歌词时间和音频的当前播放时间
    audioElement.addEventListener('timeupdate', () => {
        const currentTime = audioElement.currentTime;
        
        // 查找并高亮对应时间的歌词
        lyrics.forEach((line, index) => {
            const timeParts = line.time.split(':');
            const timeInSeconds = parseInt(timeParts[0]) * 60 + parseFloat(timeParts[1]);
            const nextLineTime = lyrics[index + 1] 
                ? parseInt(lyrics[index + 1].time.split(':')[0]) * 60 + parseFloat(lyrics[index + 1].time.split(':')[1])
                : Infinity;

            // 如果当前时间在这行歌词和下一行歌词之间
            if (currentTime >= timeInSeconds && currentTime < nextLineTime) {
                lyricsContainer.childNodes[index].classList.add('highlight');
                scrollLyrics(index);
            } else {
                lyricsContainer.childNodes[index].classList.remove('highlight');
            }
        });
    });
}

// 歌词自动滚动
function scrollLyrics(index) {
    const lyricsContainer = document.getElementById('lyricsContainer');
    const currentLyric = lyricsContainer.childNodes[index];
    lyricsContainer.scrollTop = currentLyric.offsetTop - lyricsContainer.offsetTop;
}

document.getElementById('audioPlayer').addEventListener('pause', () => {
    isPlaying = false;
    const playerContainer = document.getElementById('playerContainer');
    playerContainer.classList.remove('active');
});

// 初始化时获取并显示专辑列表
fetchAlbums();
