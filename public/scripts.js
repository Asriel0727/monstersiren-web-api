async function fetchAlbums() {
    try {
        const response = await fetch('http://localhost:3000/api/albums');
        const data = await response.json();
        const albumsDiv = document.getElementById('albums');

        console.log(data.data); // 检查专辑数据

        data.data.forEach(album => {
            const albumDiv = document.createElement('div');
            albumDiv.className = 'album';
            albumDiv.innerHTML = `
                <h2>${album.name}</h2>
                <img src="http://localhost:3000/proxy-image?url=${encodeURIComponent(album.coverUrl)}" alt="${album.name}">
                <p>Artistes: ${album.artistes.join(', ')}</p>
                <button onclick="playAlbum('${album.cid}')">播放专辑</button> <!-- 使用 album.cid -->
            `;
            albumsDiv.appendChild(albumDiv);
        });
    } catch (error) {
        console.error('Error fetching albums:', error);
    }
}

async function playAlbum(albumId) {
    try {
        // 获取专辑详细信息
        const response = await fetch(`http://localhost:3000/api/album/${albumId}/detail`);
        const albumData = await response.json();
        
        const songs = albumData.data.songs; // 获取专辑中的所有歌曲
        showSongSelection(songs); // 显示歌曲选择列表

    } catch (error) {
        console.error('Error fetching album details:', error);
    }
}

function showSongSelection(songs) {
    const songSelectionDiv = document.getElementById('songSelection');
    songSelectionDiv.innerHTML = ''; // 清空之前的内容

    songs.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.innerHTML = `
            <p>${song.name} - ${song.artistes.join(', ')}</p>
            <button onclick="playSong('${song.cid}')">播放</button> <!-- 使用 song.cid -->
        `;
        songSelectionDiv.appendChild(songDiv);
    });

    songSelectionDiv.style.display = 'block'; // 显示歌曲选择窗口
}

async function playSong(songId) {
    try {
        // 获取歌曲基本信息
        const response = await fetch(`http://localhost:3000/api/song/${songId}`);
        const songData = await response.json();
        
        const audioPlayer = document.getElementById('audioPlayer');
        
        // 播放音频
        if (songData.data && songData.data.sourceUrl) {
            audioPlayer.src = songData.data.sourceUrl; // 播放歌曲
            audioPlayer.play();
            closeSongSelection(); // 播放后关闭选择窗口
        } else {
            alert('该歌曲没有可播放的音频！');
        }
    } catch (error) {
        console.error('Error fetching song details:', error);
    }
}

function closeSongSelection() {
    const songSelectionDiv = document.getElementById('songSelection');
    songSelectionDiv.style.display = 'none'; // 隐藏歌曲选择窗口
}

// 初始化调用
fetchAlbums();
