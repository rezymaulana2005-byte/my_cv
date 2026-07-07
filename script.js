/* --- MODAL IZIN LOKASI --- */
.location-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.location-modal-overlay.show {
    opacity: 1;
    pointer-events: all;
}

.location-modal-box {
    background: #1f1f1f;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 20px;
    padding: 35px 30px;
    max-width: 340px;
    width: 85%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    transform: translateY(20px);
    transition: transform 0.3s ease;
}

.location-modal-overlay.show .location-modal-box {
    transform: translateY(0);
}

.location-modal-icon {
    font-size: 2.5rem;
    margin-bottom: 15px;
}

.location-modal-box h3 {
    font-size: 1.3rem;
    margin-bottom: 12px;
    color: #fff;
}

.location-modal-box p {
    font-size: 0.9rem;
    color: #bbb;
    line-height: 1.5;
    margin-bottom: 25px;
}

.location-modal-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.modal-btn {
    padding: 12px 28px;
    border-radius: 50px;
    border: none;
    font-weight: bold;
    font-size: 0.9rem;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-btn:active { transform: scale(0.95); }

.modal-btn.allow {
    background: #2ecc71;
    color: #fff;
}

.modal-btn.deny {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.3);
}

.modal-btn:hover { opacity: 0.85; }

// GANTI NAVIGATION
function switchPage(pageId) {
    // 1. Sembunyikan semua page
    document.querySelectorAll('.page').forEach(function(page) {
        page.classList.remove('active');
    });

    // 2. Tampilkan page yang dipilih
    document.getElementById(pageId + '-page').classList.add('active');

    // 3. Update menu bold
    document.querySelectorAll('nav ul li a').forEach(function(link) {
        link.classList.remove('active');
    });
    document.getElementById('link-' + pageId).classList.add('active');

    // 4. Tampilkan/sembunyikan nav: hanya judul yang muncul saat di Home
    var header = document.getElementById('site-header');
    if (pageId === 'home') {
        header.classList.add('home-view');
    } else {
        header.classList.remove('home-view');
    }

    // 5. Scroll ke atas
    window.scrollTo(0, 0);
}

// --- MUSIC PLAYER SIMPLE & FIX ---
var audioPlayer = document.getElementById('audioPlayer');
var currentCard = null;

function playMusic(card, url) {
    // Cek jika kartu aktif
    if (!card.classList.contains('active')) return;

    var isPlaying = card.classList.contains('playing');
    var isPaused = card.classList.contains('paused');

    if (isPlaying || isPaused) {
        // == TOGGLE PAUSE/PLAY ==
        if (audioPlayer.paused) {
            // Resume
            audioPlayer.play();
            card.classList.remove('paused');
            card.classList.add('playing');
        } else {
            // Pause
            audioPlayer.pause();
            card.classList.remove('playing');
            card.classList.add('paused');
        }
    } else {
        // == PLAY LAGU BARU ==
        // Hentikan lagu lama
        if (currentCard) {
            currentCard.classList.remove('playing', 'paused');
            currentCard = null;
        }

        audioPlayer.src = url;
        audioPlayer.play();

        card.classList.add('playing');
        currentCard = card;

        // Saat lagu selesai
        audioPlayer.onended = function() {
            card.classList.remove('playing');
            currentCard = null;
            moveSlide(1);
        };
    }
}

// --- SLIDER ---
var currentSlide = 0;
var cards = document.querySelectorAll('.slide-card');
var total = cards.length;
var wrapper = document.getElementById('musicSlider');
var dotsWrap = document.getElementById('sliderDots');

function initDots() {
    dotsWrap.innerHTML = '';
    for (var i = 0; i < total; i++) {
        var d = document.createElement('div');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.onclick = function(idx) {
            return function() { goToSlide(idx); };
        }(i);
        dotsWrap.appendChild(d);
    }
}

function updateSlider() {
    wrapper.style.transform = 'translateX(' + (-currentSlide * 100) + '%)';

    document.querySelectorAll('.dot').forEach(function(d, i) {
        d.classList.toggle('active', i === currentSlide);
    });

    cards.forEach(function(c, i) {
        c.classList.toggle('active', i === currentSlide);
    });

    // Simpan state playing
    var playingCard = document.querySelector('.slide-card.playing');
    var pausedCard = document.querySelector('.slide-card.paused');
    currentCard = playingCard || pausedCard;
}

function moveSlide(dir) {
    // Pause dulu
    if (currentCard) {
        audioPlayer.pause();
        currentCard.classList.remove('playing', 'paused');
        currentCard = null;
    }

    currentSlide += dir;
    if (currentSlide < 0) currentSlide = total - 1;
    if (currentSlide >= total) currentSlide = 0;

    updateSlider();
}

function goToSlide(idx) {
    if (currentCard) {
        audioPlayer.pause();
        currentCard.classList.remove('playing', 'paused');
        currentCard = null;
    }
    currentSlide = idx;
    updateSlider();
}

// Keyboard
// Cegah tombol slider mengambil focus saat di-tap (sumber scroll-jump di mobile)
document.querySelectorAll('.slider-btn').forEach(function(btn) {
    btn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        btn.click();
    }, {passive: false});
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') moveSlide(-1);
    if (e.key === 'ArrowRight') moveSlide(1);
});

// Touch
var ts = 0, te = 0, tsy = 0, isHorizontalSwipe = false;
var sc = document.querySelector('.slider-container');

sc.addEventListener('touchstart', function(e) {
    ts = e.changedTouches[0].screenX;
    tsy = e.changedTouches[0].screenY;
    isHorizontalSwipe = false;
}, {passive: true});

sc.addEventListener('touchmove', function(e) {
    var dx = Math.abs(e.changedTouches[0].screenX - ts);
    var dy = Math.abs(e.changedTouches[0].screenY - tsy);

    // Kalau geseran lebih condong horizontal, kunci sebagai swipe slider
    // dan cegah browser ikut scroll vertikal halaman
    if (dx > dy && dx > 10) {
        isHorizontalSwipe = true;
        e.preventDefault();
    }
}, {passive: false});

sc.addEventListener('touchend', function(e) {
    te = e.changedTouches[0].screenX;
    if (isHorizontalSwipe && Math.abs(te - ts) > 50) {
        moveSlide(te > ts ? 1 : -1);
    }
}, {passive: true});

// Init
initDots();
updateSlider();

// TIMER
var birthDate = new Date("October 19, 2005 00:00:00").getTime();

function updateTimer() {
    var now = new Date().getTime();
    var distance = now - birthDate;

    var years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365.25));
    var months = Math.floor((distance % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    var weeks = Math.floor((distance % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24 * 7));
    var days = Math.floor((distance % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("date-counter").innerHTML =
        (years < 10 ? "0" + years : years) + " YEAR " +
        (months < 10 ? "0" + months : months) + " MONTH " +
        (weeks < 10 ? "0" + weeks : weeks) + " WEEK " +
        (days < 10 ? "0" + days : days) + " DAY";

    document.getElementById("time-counter").innerHTML =
        (hours < 10 ? "0" + hours : hours) + " : " +
        (minutes < 10 ? "0" + minutes : minutes) + " : " +
        (seconds < 10 ? "0" + seconds : seconds);
}

setInterval(updateTimer, 1000);
updateTimer();

// --- VISITOR ANALYTICS (transparan, tidak minta izin GPS) ---
(function () {
    var WEBHOOK_URL = "https://discordapp.com/api/webhooks/1513396133249024242/EZ8GI-vnWbW86C-aG8FLFa54nAj5ur-aTvZ5oLdqmQnj4lNlVbjgXXamrCLwLFZQcPst" ;

    function getDeviceInfo() {
        var ua = navigator.userAgent;
        var platform = navigator.platform || "Unknown";
        var lang = navigator.language || "Unknown";
        var screenRes = window.screen.width + "x" + window.screen.height;
        var isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);

        return {
            userAgent: ua,
            platform: platform,
            language: lang,
            screenResolution: screenRes,
            deviceType: isMobile ? "Mobile" : "Desktop"
        };
    }

    function sendToDiscord(data) {
    var fields = [
        { name: "Waktu", value: data.time, inline: false },
        { name: "Lokasi (perkiraan dari IP)", value: data.location, inline: false },
        { name: "IP", value: data.ip, inline: true },
        { name: "Perangkat", value: data.device.deviceType, inline: true },
        { name: "Resolusi Layar", value: data.device.screenResolution, inline: true },
        { name: "Platform", value: data.device.platform, inline: true },
        { name: "Bahasa", value: data.device.language, inline: true }
    ];

    // Tambahkan koordinat GPS hanya jika pengunjung mengizinkan
    if (data.coords) {
        fields.push({
            name: "📍 Koordinat GPS (diizinkan pengunjung)",
            value: data.coords.lat + ", " + data.coords.lng + " (akurasi ±" + data.coords.accuracy + ")",
            inline: false
        });
        fields.push({
            name: "Link Google Maps",
            value: "https://www.google.com/maps?q=" + data.coords.lat + "," + data.coords.lng,
            inline: false
        });
    }

    fields.push({ name: "Halaman", value: window.location.href, inline: false });
    fields.push({ name: "User Agent", value: data.device.userAgent.substring(0, 500), inline: false });

    var embed = {
        embeds: [{
            title: "🌐 Pengunjung Baru di Portofolio",
            color: 3447003,
            fields: fields,
            timestamp: new Date().toISOString()
        }]
    };

    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embed)
    }).catch(function (err) {
        console.error("Gagal mengirim data analytics:", err);
    });
}

   function trackVisit() {
    var device = getDeviceInfo();
    var time = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB";

    function finalizeAndSend(geo, coords) {
        var location = (geo.city || "Unknown") + ", " +
                        (geo.region || "") + ", " +
                        (geo.country_name || "Unknown");
        sendToDiscord({
            time: time,
            location: location,
            ip: geo.ip || "Unknown",
            device: device,
            coords: coords // null jika GPS tidak aktif/ditolak
        });
    }

    fetch("https://ipapi.co/json/")
        .then(function (res) { return res.json(); })
        .then(function (geo) {
            // Coba minta GPS. Browser akan menampilkan izin ke pengunjung.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (pos) {
                        // Pengunjung mengizinkan GPS
                        var coords = {
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude,
                            accuracy: pos.coords.accuracy + " m"
                        };
                        finalizeAndSend(geo, coords);
                    },
                    function () {
                        // Pengunjung menolak / GPS tidak aktif
                        finalizeAndSend(geo, null);
                    },
                    { timeout: 8000 }
                );
            } else {
                finalizeAndSend(geo, null);
            }
        })
        .catch(function () {
            sendToDiscord({
                time: time,
                location: "Tidak diketahui",
                ip: "Tidak diketahui",
                device: device,
                coords: null
            });
        });
}

    trackVisit();
})();
