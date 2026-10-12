# Am Premium Web — by KaaOffc

> Website bypass AES untuk Alight Motion Premium  
> Tanpa API Key eksternal — langsung hit target via proxy lokal

---

## 📁 Struktur File

```
├── index.html      # UI website
├── server.js       # Proxy Node.js (AES bypass)
├── config.js       # Konfigurasi (username, music, proxy)
├── package.json    # Info project
└── README.md
```

---

## ⚙️ Konfigurasi (`config.js`)

```js
const CONFIG = {
    TELEGRAM_USERNAME : 'username_kamu',   // username Telegram owner (tanpa @)
    PROXY_URL         : '',                // kosong = server.js di port sama
    MUSIC_VIDEO       : '',               // link .mp4 untuk video background player
    MUSIC_AUDIO       : '',               // link .mp3 untuk audio
    MUSIC_TITLE       : 'Judul Lagu',
    MUSIC_ARTIST      : 'Nama Artis',
    MUSIC_TAG         : 'KaaOffc · All Downloader',
};
```

---

## 🚀 Cara Jalankan (Lokal)

```bash
# 1. Clone repo
git clone https://github.com/username/nama-repo.git
cd nama-repo

# 2. Jalankan server
node server.js

# 3. Buka browser
# http://localhost:3000
```

> Tidak perlu `npm install` — hanya menggunakan modul bawaan Node.js

---

## 🌐 Deploy ke Railway / Render / VPS

1. Push ke GitHub (lihat panduan di bawah)
2. Connect repo ke [Railway](https://railway.app) atau [Render](https://render.com)
3. Set **Start Command**: `node server.js`
4. Set **Port**: `3000`
5. Setelah deploy, isi `PROXY_URL` di `config.js` dengan URL dari Railway/Render

---

## 📤 Upload ke GitHub (Pertama Kali)

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/username/nama-repo.git
git push -u origin main
```

## 🔄 Update / Push Perubahan

```bash
git add .
git commit -m "update"
git push
```

---

## 📞 Contact

- Telegram : [@kaaoffc_](https://t.me/kaaoffc_)
- Instagram : [@kaaoffc_](https://instagram.com/kaaoffc_)

> © KaaOffc — Jangan hapus credit, hargai creator
