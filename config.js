// config.js
const CONFIG = {

    // ── Owner Contact ─────────────────────────────────────────
    TELEGRAM_USERNAME : 'kaaoffc_',   // tanpa @ — isi username Telegram owner

    // ── Proxy (kosongkan jika pakai server.js di port sama) ──
    // Isi jika deploy ke VPS dengan URL berbeda:
    // PROXY_URL : 'https://namaserver.vercel.app',
    PROXY_URL : 'https://am-premium-kaaoffc-new.vercel.app',

    // ── Music Player ─────────────────────────────────────────
    MUSIC_VIDEO  : 'https://x.xcute.workers.dev/f/videos/3aa89601fcc3.mp4',           // Link mp4 (video background player)
    MUSIC_AUDIO  : 'https://x.xcute.workers.dev/f/audios/9707606aad82.mp3',           // Link mp3 (audio yang diputar)
    MUSIC_TITLE  : 'Dj - Baila Lento',
    MUSIC_ARTIST : 'KaaOffc Song',
    MUSIC_TAG    : 'KaaOffc · All Downloader',

};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
