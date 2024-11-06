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
    console.log("Albums data:", albums); // 调试输出，查看专辑数据
    const albumsContainer = document.getElementById('albums');
    
    albums.forEach(album => {
        const albumElement = document.createElement('div');
        albumElement.classList.add('album');
        
        // 使用本地代理加载图片
        const proxiedCoverUrl = `http://localhost:3000/proxy-image?url=${encodeURIComponent(album.coverUrl)}`;

        albumElement.innerHTML = `
            <img src="${proxiedCoverUrl}" alt="${album.name}">
            <h2>${album.name}</h2>
            <p>${album.artistes.join(', ')}</p>
            <button onclick="fetchAlbumDetails('${album.cid}')">查看專輯</button>
        `;
        
        
        albumsContainer.appendChild(albumElement);
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
    console.log("Album details:", album);
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

// 显示/隐藏侧边栏
function toggleSidebar() {
    const albumDetails = document.getElementById('albumDetails');
    albumDetails.classList.toggle('active');

    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.toggle('sidebar-collapsed');
    }
}

// 获取单个歌曲并播放
async function playSong(songId) {
    try {
        const response = await fetch(`http://localhost:3000/api/song/${songId}`);
        const songData = await response.json();

        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = songData.data.sourceUrl;
        audioPlayer.play();

        console.log('Lyric URL:', songData.data.lyricUrl); // 调试输出歌词链接
    } catch (error) {
        console.error('Error fetching song details:', error);
    }
}

// 初始化时获取并显示专辑列表
fetchAlbums();
