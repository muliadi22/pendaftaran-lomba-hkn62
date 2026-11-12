// Ganti dengan URL Aplikasi Web Google Apps Script Anda yang berakhiran /exec
const scriptURL = 'https://script.google.com/macros/s/AKfycbz1CyX3sml6cMlzaIhvog4Ti_Pd2Yz1hoPciPsOd5u5tcveUU2Hn6jH1Df_ayPu3JPEjA/exec'; 
const form = document.forms['pendaftaranForm'];
const btnSubmit = document.getElementById('submitBtn');

const modalSukses = document.getElementById('successModal');
const modalLoading = document.getElementById('loadingModal');
const overlay = document.getElementById('overlay');

// Musik Auto-Play dengan interaksi pertama
function putarMusik() {
    const audio = document.getElementById('bg-music');
    if (audio.paused) {
        audio.play().catch(error => console.log("Audio diblokir browser"));
    }
}
['click', 'touchstart', 'keydown'].forEach(event => {
    document.body.addEventListener(event, putarMusik, { once: true });
});

function tutupNotif() {
    modalSukses.classList.remove('show');
    overlay.classList.remove('show');
}

form.addEventListener('submit', e => {
    e.preventDefault();
    
    // Validasi Timker
    const timkerTerpilih = document.querySelector('input[name="timker"]:checked');
    if (!timkerTerpilih) {
        alert("Silakan pilih Asal Timker terlebih dahulu!");
        return;
    }

    // Validasi Lomba
    const checkboxLomba = document.querySelectorAll('input[name="lomba"]:checked');
    let lombaTerpilih = [];
    checkboxLomba.forEach((cb) => {
        lombaTerpilih.push(cb.value);
    });

    if (lombaTerpilih.length === 0) {
        alert("Silakan pilih minimal 1 lomba yang ingin diikuti!");
        return;
    }

    // --- TAMPILKAN MODAL LOADING & BLUR DI TENGAH LAYAR ---
    overlay.classList.add('show');
    modalLoading.classList.add('show');
    btnSubmit.disabled = true;

    let requestData = new FormData();
    requestData.append('nama', document.getElementById('nama').value);
    requestData.append('timker', timkerTerpilih.value);
    requestData.append('lomba', lombaTerpilih.join(', '));

    // Kirim data ke Google Sheets
    fetch(scriptURL, { method: 'POST', body: requestData })
        .then(response => {
            // --- SEMBUNYIKAN LOADING, TAMPILKAN NOTIFIKASI BERHASIL ---
            modalLoading.classList.remove('show');
            modalSukses.classList.add('show');
            
            form.reset();
            btnSubmit.disabled = false;
        })
        .catch(error => {
            console.error('Error!', error.message);
            // Sembunyikan loading jika terjadi kendala/error
            modalLoading.classList.remove('show');
            overlay.classList.remove('show');
            
            alert("Terjadi kesalahan sistem saat mengirim pendaftaran.");
            btnSubmit.disabled = false;
        });
});