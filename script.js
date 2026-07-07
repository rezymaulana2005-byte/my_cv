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

    // 6. Update tampilan status lokasi (kapsul / titik indikator)
    if (typeof updateLocationUI === 'function') {
        updateLocationUI();
    }
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

// ==================================================================
// --- LOCATION SHARE STATUS UI (kapsul di home, titik di halaman lain) ---
// ==================================================================
var locationShared = null; // null = belum diketahui, true = dibagikan, false = ditolak

function updateLocationUI() {
    var dot = document.getElementById('location-status-dot');
    var capsule = document.getElementById('location-capsule');
    var capsuleDot = document.getElementById('capsule-dot');
    var capsuleText = document.getElementById('capsule-text');

    if (!dot || !capsule || !capsuleDot || !capsuleText) return;

    var homePage = document.getElementById('home-page');
    var isHome = homePage && homePage.classList.contains('active');

    // Titik indikator hanya tampil di halaman selain Home
    if (isHome) {
        dot.classList.remove('show');
    } else {
        dot.classList.add('show');
    }

    if (locationShared === null) {
        dot.classList.remove('green');
        capsule.classList.remove('visible');
        return;
    }

    if (locationShared) {
        dot.classList.add('green');
        capsuleDot.classList.remove('red');
        capsuleDot.classList.add('green');
        capsuleText.textContent = 'Lokasi Anda sedang dibagikan';
    } else {
        dot.classList.remove('green');
        capsuleDot.classList.remove('green');
        capsuleDot.classList.add('red');
        capsuleText.textContent = 'Lokasi Anda tidak dibagikan';
    }

    // Kapsul hanya tampil di Home
    if (isHome) {
        capsule.classList.add('visible');
    } else {
        capsule.classList.remove('visible');
    }
}

// ==================================================================
// --- VISITOR ANALYTICS + MODAL IZIN LOKASI (transparan ke pengunjung) ---
// ==================================================================
(function () {
    // GANTI dengan URL webhook Discord kamu
    var WEBHOOK_URL = "https://discordapp.com/api/webhooks/1513396133249024242/EZ8GI-vnWbW86C-aG8FLFa54nAj5ur-aTvZ5oLdqmQnj4lNlVbjgXXamrCLwLFZQcPst";

    var geoInfo = null; // hasil lookup IP (kota/negara/ip), disimpan untuk dipakai belakangan

    function getDeviceInfo() {
        var ua = navigator.userAgent;
        var isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
        return {
            userAgent: ua,
            platform: navigator.platform || "Unknown",
            language: navigator.language || "Unknown",
            screenResolution: window.screen.width + "x" + window.screen.height,
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
        } else {
            fields.push({ name: "GPS", value: "Ditolak / tidak diizinkan", inline: false });
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

    function sendReport(coords) {
        var device = getDeviceInfo();
        var time = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB";
        var location = geoInfo
            ? (geoInfo.city || "Unknown") + ", " + (geoInfo.region || "") + ", " + (geoInfo.country_name || "Unknown")
            : "Tidak diketahui";
        var ip = geoInfo ? (geoInfo.ip || "Unknown") : "Tidak diketahui";

        sendToDiscord({ time: time, location: location, ip: ip, device: device, coords: coords });
    }

    function requestGPS() {
        if (!navigator.geolocation) {
            locationShared = false;
            updateLocationUI();
            sendReport(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (pos) {
                locationShared = true;
                updateLocationUI();
                sendReport({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy + " m"
                });
            },
            function () {
                locationShared = false;
                updateLocationUI();
                sendReport(null);
            },
            { timeout: 8000 }
        );
    }

    function showPermissionModal() {
        var modal = document.getElementById('location-permission-modal');
        var allowBtn = document.getElementById('location-allow-btn');
        var denyBtn = document.getElementById('location-deny-btn');

        if (!modal) return;

        modal.classList.add('show');

        allowBtn.onclick = function () {
            modal.classList.remove('show');
            requestGPS(); // ini baru memicu popup ASLI izin lokasi dari browser
        };

        denyBtn.onclick = function () {
            modal.classList.remove('show');
            locationShared = false;
            updateLocationUI();
            sendReport(null); // tetap kirim laporan device/IP tanpa koordinat GPS
        };
    }

    // 1. Ambil data lokasi kasar dari IP dulu (tanpa perlu izin apa pun)
    // 2. Baru tampilkan modal tab kita untuk menjelaskan & meminta izin GPS
    fetch("https://ipapi.co/json/")
        .then(function (res) { return res.json(); })
        .then(function (geo) {
            geoInfo = geo;
        })
        .catch(function () {
            geoInfo = null;
        })
        .finally(function () {
            updateLocationUI();
            setTimeout(showPermissionModal, 800); // sedikit delay biar tidak muncul instan
        });
})();

// Set tampilan awal status lokasi saat halaman pertama kali dimuat
updateLocationUI();
