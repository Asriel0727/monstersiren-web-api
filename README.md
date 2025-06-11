# MonsterSiren API 介紹

<div align="center">

 | [繁體中文](README.md) | [English](README_en-us.md) | 

</div>

這是一個使用 [Express](https://expressjs.com/) 建構的 Node.js 代理伺服器，主要用途在於對接 [Monster Siren](https://monster-siren.hypergryph.com) API。

此專案有部屬在[Vercel](https://vercel.com/new)上提供獲取API資訊
若有需要自行部屬可參考[⚙️ 安裝與執行](#安裝與執行)


**⚠️注：此項目為個人練習製作，不代表官方任何內容**

## 功能一覽

- 🎵 取得專輯列表
- 📀 取得單一專輯的詳細資訊
- 🎶 取得單一歌曲的詳細資訊
- 🖼️ 代理圖片與歌詞的請求（用以解決跨來源資源存取 (CORS) 的限制問題）

此外，本專案也通過 [CORS](https://github.com/expressjs/cors) 與 [Content-Security-Policy](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CSP) 提升資源存取與安全性。

---

## 目錄

- ✨ 功能介紹
- 📋 前置需求
- ⚙️ 安裝與執行
- 🚀 部屬至 Vercel
- 🔗 API 端點說明
  - 🎵 取得專輯列表
  - 📀 取得單個專輯詳細資訊
  - 🎶 取得單個歌曲詳細資訊
  - 🖼️ 代理圖片請求
  - 📜 代理歌詞請求

---

## 功能介紹

本專案通過 Express 建立一個輕量程式的 API 代理伺服器，主要功能包括：

- **🌍 跨來源資源共用 (CORS)：**  
  使用 `cors` 中介軟體，讓前端可以從不同網域存取 API 資源。

- **🛡️ Content Security Policy (CSP)：**  
  限制資源來源，僅允許載入來自 `self` 以及 `https://vercel.live` 的 JavaScript，進一步增強安全性。

- **📡 API 資料轉發：**  
  通過 [Axios](https://axios-http.com/) 向 Monster Siren 的 API 轉發請求，包括專輯列表、專輯詳細資料、歌曲詳細資料等，並將取得的資料以 JSON 格式回傳。

- **🖥️ 代理請求：**  
  提供 `/proxy-image` 與 `/proxy-lyrics` 兩個代理端點，用來轉發圖片與歌詞請求，解決瀏覽器的 CORS 限制問題。

---

## 前置需求

- **Node.js** (建議 v12 以上)
- **npm** (Node Package Manager)

---

## 安裝與執行

1. **📂 複製專案至本地端：**

   ```bash
   git clone https://github.com/Asriel0727/monstersiren-web-api.git
   cd yourrepository
   ```

2. **📦 安裝相依套件：**

   ```bash
   npm install
   ```

3. **🚀 啟動伺服器：**

   ```bash
   node app.js
   ```

   或者如果在 `package.json` 中定義了 `start` 腳本：

   ```bash
   npm start
   ```

4. **🔍 驗證伺服器運行：**

   開啟瀏覽器並造訪 [http://localhost:3000](http://localhost:3000)，在終端機中會看到類似以下訊息：

   ```bash
   Server is running on http://localhost:3000
   ```

---

### 🚀 部屬至 Vercel

---

- 🔧 建立 Vercel 帳號與專案：到 Vercel 官網 註冊帳號並建立新的專案。

- 📂 連結 GitHub Repository：在 Vercel 平台上選擇你要部屬的 GitHub 專案。

- ⚙️ 設定部署參數：確認部署設定，例如環境變數與建置指令（通常不需要特別設定）。

- 🚀 開始部署：按下 "Deploy" 按鈕，等待 Vercel 自動建置與部屬完成。

- 🌐 存取 API：部屬完成後，你可以直接使用 Vercel 提供的 URL  
      (例如 https://your-project.vercel.app/api/albums。)

---

## API 端點說明

### 1. 🎵 取得專輯列表

- **URL:** `/api/albums`
- **方法:** `GET`
- **說明:** 向 Monster Siren API 取得專輯列表資料。
- **使用範例:**

  ```bash
  curl http://localhost:3000/api/albums
  ```
- **資料結構:**
  ```bash
  {
      "cid": 專輯ID,
      "name": 專輯名稱,
      "coverUrl": 專輯封面,
      "artistes": [藝人(基本上都是塞壬唱片-MSR)]
  }
  ```
- **查看範例:** [專輯列表一覽](https://monstersiren-web-api.vercel.app/api/albums)

### 2. 📀 取得單個專輯詳細資訊

- **URL:** `/api/album/:id/detail`
- **方法:** `GET`
- **說明:** 通過專輯 ID 向 Monster Siren API 取得該專輯的詳細資料。
- **參數:**
  - `:id` - 專輯的唯一識別碼。
- **使用範例:**

  ```bash
  curl http://localhost:3000/api/album/{albumID}/detail
  ```
- **資料結構:**
  ```bash
  {
    "cid": 專輯ID,
    "name": 專輯名稱,
    "intro": 專輯介紹,
    "belong": 所屬作品(基本都是arknights),
    "coverUrl": 專輯封面,
    "coverDeUrl": 專輯附屬封面,
    "songs": [ 歌曲列表
      {
        "cid": 歌曲ID,
        "name": 歌曲名稱,
        "artistes": [藝人(基本上都是塞壬唱片-MSR)]
      }
    ]
  }
  ```
- **查看範例:** [專輯內容](https://monstersiren-web-api.vercel.app/api/album/0231/detail)

### 3. 🎶 取得單個歌曲詳細資訊

- **URL:** `/api/song/:id`
- **方法:** `GET`
- **說明:** 根據歌曲 ID 向 Monster Siren API 取得該歌曲的詳細資料。
- **參數:**
  - `:id` - 歌曲的唯一識別碼。
- **使用範例:**

  ```bash
  curl http://localhost:3000/api/song/{songID}
  ```
- **資料結構**
  ```bash
  {
    "cid": 歌曲ID,
    "name": 歌曲名稱,
    "albumCid": 所屬專輯ID,
    "sourceUrl": 音樂檔案連結(wav檔案),
    "lyricUrl": 歌詞檔案(.lrc),
    "mvUrl": null,
    "mvCoverUrl": null,
    "artists": [藝人(基本上都是塞壬唱片-MSR)]
  }
  ```
- **查看範例:** [歌曲內容](https://monstersiren-web-api.vercel.app/api/song/232242)

### 4. 🖼️ 代理圖片請求

- **URL:** `/proxy-image`
- **方法:** `GET`
- **說明:** 接收圖片 URL 的查詢參數，並代理請求圖片，解決跨域限制問題。
- **查詢參數:**
  - `url` - 圖片的完整 URL。
- **使用範例:**

  ```bash
  curl "http://localhost:3000/proxy-image?url=https://example.com/image.jpg"
  ```

### 5. 📜 代理歌詞請求

- **URL:** `/proxy-lyrics`
- **方法:** `GET`
- **說明:** 接收歌詞 URL 的查詢參數，並代理請求歌詞內容，解決跨域限制問題。
- **查詢參數:**
  - `url` - 歌詞的完整 URL。
- **使用範例:**

  ```bash
  curl "http://localhost:3000/proxy-lyrics?url=https://example.com/lyrics.lrc"
  ```
