# MonsterSiren API Proxy Server

<div align="center">

 | [繁體中文](README.md) | [English](README_en-us.md) | 

</div>


This is a Node.js proxy server built with [Express](https://expressjs.com/), mainly designed to interface with the [Monster Siren](https://monster-siren.hypergryph.com) API.

This project is deployed on [Vercel](https://vercel.com/new) for API information retrieval.  
If you wish to deploy it yourself, refer to [⚙️ Installation and Execution](#installation-and-execution).  

**⚠️ Note: This project is for personal practice only and is not affiliated with the official content in any way.**  

## Features

- 🎵 Fetch album list
- 📀 Retrieve detailed information about a specific album
- 🎶 Retrieve detailed information about a specific song
- 🖼️ Proxy image and lyrics requests to resolve Cross-Origin Resource Sharing (CORS) issues  

Additionally, the project enhances resource access and security through [CORS](https://github.com/expressjs/cors) and [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).  

---

## Table of Contents

- [✨ Features](#features)  
- [📋 Prerequisites](#prerequisites)  
- [⚙️ Installation and Execution](#installation-and-execution)  
- [🚀 Deployment to Vercel](#deployment-to-vercel)  
- [🔗 API Endpoints](#api-endpoints)  
  - [🎵 Fetch Album List](#1-fetch-album-list)  
  - [📀 Fetch Album Details](#2-fetch-album-details)  
  - [🎶 Fetch Song Details](#3-fetch-song-details)  
  - [🖼️ Proxy Image Request](#4-proxy-image-request)  
  - [📜 Proxy Lyrics Request](#5-proxy-lyrics-request)  

---

## Features  

This project sets up a lightweight API proxy server using Express, with the following functionalities:  

- **🌍 CORS Support:**  
  Utilizes the `cors` middleware to allow front-end applications to access API resources from different domains.  

- **🛡️ Content Security Policy (CSP):**  
  Restricts resource sources, only allowing JavaScript from `self` and `https://vercel.live` to enhance security.  

- **📡 API Data Forwarding:**  
  Forwards requests to the Monster Siren API using [Axios](https://axios-http.com/), including album lists, album details, and song details, and returns the data in JSON format.  

- **🖥️ Proxy Requests:**  
  Provides two proxy endpoints, `/proxy-image` and `/proxy-lyrics`, to forward image and lyrics requests and bypass CORS restrictions.  

---

## Prerequisites  

- **Node.js** (Recommended v12 or later)  
- **npm** (Node Package Manager)  

---

## Installation and Execution  

1. **📂 Clone the Repository:**  

   ```bash
   git clone https://github.com/Asriel0727/monstersiren-web-api.git
   cd yourrepository
   ```

2. **📦 Install Dependencies:**  

   ```bash
   npm install
   ```

3. **🚀 Start the Server:**  

   ```bash
   node app.js
   ```

   Or, if you have defined a `start` script in `package.json`:  

   ```bash
   npm start
   ```

4. **🔍 Verify the Server:**  

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000). You should see a message like this in the terminal:  

   ```bash
   Server is running on http://localhost:3000
   ```

---

### 🚀 Deployment to Vercel  

---

- 🔧 Create a Vercel Account and Project: Register on the Vercel website and create a new project.  

- 📂 Connect GitHub Repository: Select the GitHub project you want to deploy on the Vercel platform.  

- ⚙️ Configure Deployment Parameters: Confirm deployment settings, such as environment variables and build commands (usually no special configuration is required).  

- 🚀 Deploy: Click the "Deploy" button and wait for Vercel to automatically build and deploy the project.  

- 🌐 Access the API: Once deployed, you can access the API using the provided Vercel URL,  
  e.g., https://your-project.vercel.app/api/albums.  

---

## API Endpoints  

### 1. 🎵 Fetch Album List  

- **URL:** `/api/albums`  
- **Method:** `GET`  
- **Description:** Fetches album list data from the Monster Siren API.  
- **Example Usage:**  

  ```bash
  curl http://localhost:3000/api/albums
  ```

- **Response Structure:**  
  ```bash
  {
      "cid": Album ID,
      "name": Album Name,
      "coverUrl": Album Cover,
      "artistes": [Artists (Mostly Monster Siren Records - MSR)]
  }
  ```  

- **View Example:** [Album List](https://monstersiren-web-api.vercel.app/api/albums)  

### 2. 📀 Fetch Album Details  

- **URL:** `/api/album/:id/detail`  
- **Method:** `GET`  
- **Description:** Fetches detailed information about a specific album using its ID.  
- **Parameters:**  
  - `:id` - The unique identifier for the album.  
- **Example Usage:**  

  ```bash
  curl http://localhost:3000/api/album/{albumID}/detail
  ```

- **Response Structure:**  
  ```bash
  {
    "cid": Album ID,
    "name": Album Name,
    "intro": Album Description,
    "belong": Associated Work (mostly Arknights),
    "coverUrl": Album Cover,
    "coverDeUrl": Secondary Album Cover,
    "songs": [ Song List
      {
        "cid": Song ID,
        "name": Song Name,
        "artistes": [Artists (Mostly Monster Siren Records - MSR)]
      }
    ]
  }
  ```

- **View Example:** [Album Details](https://monstersiren-web-api.vercel.app/api/album/0231/detail)  

### 3. 🎶 Fetch Song Details  

- **URL:** `/api/song/:id`  
- **Method:** `GET`  
- **Description:** Fetches detailed information about a specific song using its ID.  
- **Parameters:**  
  - `:id` - The unique identifier for the song.  
- **Example Usage:**  

  ```bash
  curl http://localhost:3000/api/song/{songID}
  ```

- **Response Structure:**  
  ```bash
  {
    "cid": Song ID,
    "name": Song Name,
    "albumCid": Album ID,
    "sourceUrl": Music File Link (WAV format),
    "lyricUrl": Lyrics File (.lrc),
    "mvUrl": null,
    "mvCoverUrl": null,
    "artists": [Artists (Mostly Monster Siren Records - MSR)]
  }
  ```

- **View Example:** [Song Details](https://monstersiren-web-api.vercel.app/api/song/232242)  

### 4. 🖼️ Proxy Image Request  

- **URL:** `/proxy-image`  
- **Method:** `GET`  
- **Description:** Accepts a query parameter for the image URL and proxies the request to resolve CORS issues.  
- **Query Parameter:**  
  - `url` - The full URL of the image.  
- **Example Usage:**  

  ```bash
  curl "http://localhost:3000/proxy-image?url=https://example.com/image.jpg"
  ```

### 5. 📜 Proxy Lyrics Request  

- **URL:** `/proxy-lyrics`  
- **Method:** `GET`  
- **Description:** Accepts a query parameter for the lyrics URL and proxies the request to resolve CORS issues.  
- **Query Parameter:**  
  - `url` - The full URL of the lyrics file.  
- **Example Usage:**  

  ```bash
  curl "http://localhost:3000/proxy-lyrics?url=https://example.com/lyrics.lrc"
    ```
