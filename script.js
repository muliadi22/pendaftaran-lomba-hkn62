// Ganti dengan URL Aplikasi Web Google Apps Script Anda
const scriptURL = 'https://script.google.com/macros/s/AKfycbz1CyX3sml6cMlzaIhvog4Ti_Pd2Yz1hoPciPsOd5u5tcveUU2Hn6jH1Df_ayPu3JPEjA/exec'; 
const form = document.forms['pendaftaranForm'];
const btnSubmit = document.getElementById('submitBtn');

// Elemen Modal Notifikasi
const modal = document.getElementById('successModal');
const overlay = document.getElementById('overlay');

// Pemutar Musik Otomatis
function putarMusik() {
    const audio = document.getElementById('bg-music');
    if (audio.paused) {
        audio.play().then(() => {
            console.log("Musik berhasil diputar");
        }).catch(error => console.log("Audio diblokir browser"));
    }
}
['click', 'touchstart', 'keydown'].forEach(event => {
    document.body.addEventListener(event, putarMusik, { once: true });
});

// Fungsi Tutup Notifikasi Pop-up
function tutupNotif() {
    modal.classList.remove('show');
    overlay.classList.remove('show');
}

// Proses Submit Data
form.addEventListener('submit', e => {
    e.preventDefault();
    
    const timkerTerpilih = document.querySelector('input[name="timker"]:checked');
    if (!timkerTerpilih) {
        alert("Silakan pilih Asal Timker terlebih dahulu!");
        return;
    }

    const checkboxLomba = document.querySelectorAll('input[name="lomba"]:checked');
    let lombaTerpilih = [];
    checkboxLomba.forEach((cb) => {
        lombaTerpilih.push(cb.value);
    });

    if (lombaTerpilih.length === 0) {
        alert("Silakan pilih minimal 1 lomba yang ingin diikuti!");
        return;
    }

    // Ubah tombol saat memproses
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = 'Meneruskan Data... ⏳';

    let requestData = new FormData();
    requestData.append('nama', document.getElementById('nama').value);
    requestData.append('timker', timkerTerpilih.value);
    requestData.append('lomba', lombaTerpilih.join(', '));

    fetch(scriptURL, { method: 'POST', body: requestData })
        .then(response => {
            // Tampilkan Notifikasi Modal Pop-up Keren
            modal.classList.add('show');
            overlay.classList.add('show');
            
            form.reset();
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Kirim Pendaftaran 🚀';
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert("Terjadi kesalahan sistem saat mengirim pendaftaran.");
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Kirim Pendaftaran 🚀';
        });
});