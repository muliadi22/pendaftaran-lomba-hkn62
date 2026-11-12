
// URL Google Apps Script ASLI
const scriptURL = 'https://script.google.com/macros/s/AKfycbz1CyX3sml6cMlzaIhvog4Ti_Pd2Yz1hoPciPsOd5u5tcveUU2Hn6jH1Df_ayPu3JPEjA/exec';

const form = document.forms['pendaftaranForm'];
const btnSubmit = document.getElementById('submitBtn');

const modalSukses = document.getElementById('successModal');
const modalLoading = document.getElementById('loadingModal');
const overlay = document.getElementById('overlay');

// MUSIK LATAR
function putarMusik() {
    const audio = document.getElementById('bg-music');

    if (audio.paused) {
        audio.play().catch(error => {
            console.log("Audio diblokir browser");
        });
    }
}

['click', 'touchstart', 'keydown'].forEach(event => {
    document.body.addEventListener(event, putarMusik, {
        once: true
    });
});

// TUTUP NOTIFIKASI
function tutupNotif() {
    modalSukses.classList.remove('show');
    overlay.classList.remove('show');
}

// PROSES PENDAFTARAN
form.addEventListener('submit', e => {

    e.preventDefault();

    // VALIDASI ASAL ANGGOTA
    const timkerTerpilih = document.querySelector(
        'input[name="timker"]:checked'
    );

    if (!timkerTerpilih) {
        alert("Silakan pilih Asal Anggota terlebih dahulu!");
        return;
    }

    // VALIDASI PILIHAN LOMBA
    const checkboxLomba = document.querySelectorAll(
        'input[name="lomba"]:checked'
    );

    let lombaTerpilih = [];

    checkboxLomba.forEach(cb => {
        lombaTerpilih.push(cb.value);
    });

    if (lombaTerpilih.length === 0) {
        alert("Silakan pilih minimal 1 lomba yang ingin diikuti!");
        return;
    }

    // TAMPILKAN LOADING
    overlay.classList.add('show');
    modalLoading.classList.add('show');

    btnSubmit.disabled = true;

    // SIAPKAN DATA
    let requestData = new FormData();

    requestData.append(
        'nama',
        document.getElementById('nama').value
    );

    // Nama field tetap timker agar kompatibel
    // dengan integrasi Google Sheets yang lama.
    requestData.append(
        'timker',
        timkerTerpilih.value
    );

    requestData.append(
        'lomba',
        lombaTerpilih.join(', ')
    );

    // KIRIM KE GOOGLE SHEETS
    fetch(scriptURL, {
        method: 'POST',
        body: requestData
    })

    .then(response => {

        // SEMBUNYIKAN LOADING
        modalLoading.classList.remove('show');

        // TAMPILKAN NOTIFIKASI BERHASIL
        modalSukses.classList.add('show');

        // RESET FORM
        form.reset();

        // AKTIFKAN KEMBALI TOMBOL
        btnSubmit.disabled = false;

    })

    .catch(error => {

        console.error('Error!', error.message);

        // SEMBUNYIKAN LOADING
        modalLoading.classList.remove('show');

        overlay.classList.remove('show');

        alert(
            "Terjadi kesalahan sistem saat mengirim pendaftaran."
        );

        btnSubmit.disabled = false;

    });

});
