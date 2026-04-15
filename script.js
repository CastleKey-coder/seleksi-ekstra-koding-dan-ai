const API_URL = "https://script.google.com/macros/s/AKfycbwzZnNwWOJIL8mU9d8RujX8Rk9DgsXE3HcNiYckD9VMsikaOqINApDMTOEjR6uoBTUh/exec";

const soal = [
    {
        nama: 'Logika', waktu: 600, data: [
            { q: '2,4,8,...', k: ['16'] },
            { q: '1,3,6,...', k: ['9'] },
            { q: 'A,C,E,...', k: ['G'] },
            { q: '3,9,27,...', k: ['81'] },
            { q: '5,10,20,...', k: ['40'] },
            { q: '7,14,28,...', k: ['56'] },
            { q: 'Huruf setelah Z?', k: ['a'] },
            { q: '10 hari setelah Senin?', k: ['kamis'] },
            { q: '2+2x2?', k: ['6'] },
            { q: '100/10?', k: ['10'] }
        ]
    },
    {
        nama: 'Algoritma', waktu: 600, data: [
            { q: 'Langkah mencuci tangan', k: ['air','sabun','gosok','bilas','kering'] },
            { q: 'Langkah membuat teh', k: ['air','panas','teh','gula','aduk'] },
            { q: 'Cara menentukan genap ganjil', k: ['mod','2','bagi','sisa','angka'] },
            { q: 'Langkah menghitung luas persegi', k: ['sisi','kali','rumus','luas','hitung'] },
            { q: 'Cara mengurutkan angka', k: ['banding','swap','urut','loop','data'] },
            { q: 'Langkah bangun pagi', k: ['alarm','bangun','mandi','sarapan','berangkat'] },
            { q: 'Cara login ke aplikasi', k: ['username','password','input','login','validasi'] },
            { q: 'Langkah kirim pesan', k: ['tulis','pilih','kirim','pesan','tujuan'] },
            { q: 'Cara mencari nilai terbesar', k: ['banding','max','loop','nilai','data'] },
            { q: 'Langkah menyalakan komputer', k: ['power','tunggu','boot','login','desktop'] }
        ]
    },
    {
        nama: 'AI', waktu: 600, data: [
            { q: 'Ide AI untuk sekolah', k: ['ai','belajar','siswa','otomatis','data'] },
            { q: 'Solusi siswa malas', k: ['motivasi','reward','ai','belajar','target'] },
            { q: 'AI membantu belajar bagaimana?', k: ['materi','otomatis','latihan','jawaban','ai'] },
            { q: 'Apakah AI berbahaya?', k: ['data','etika','kontrol','aman','risiko'] },
            { q: 'Teknologi untuk absensi', k: ['face','scan','qr','ai','data'] },
            { q: 'Aplikasi untuk guru', k: ['nilai','absen','materi','ai','otomatis'] },
            { q: 'Solusi siswa terlambat', k: ['alarm','monitor','ai','jadwal','notifikasi'] },
            { q: 'AI sebagai teman belajar', k: ['chat','ai','tanya','jawab','materi'] },
            { q: 'Manfaat teknologi di sekolah', k: ['efisien','cepat','data','ai','digital'] },
            { q: 'Ide inovasi digital', k: ['aplikasi','ai','inovasi','data','teknologi'] }
        ]
    }
];

let index = 0, score = 0, timer, timeLeft, locked = false;

function login() {
    const nama = document.getElementById('nama').value.trim();
    const kelas = document.getElementById('kelas').value;
    if (!nama || !kelas) return alert('Isi semua data');

    document.getElementById('login').classList.add('hidden');
    document.getElementById('tes').classList.remove('hidden');
    load();
}

function load() {
    locked = false;
    const s = soal[index];
    document.getElementById('judul').innerText = s.nama;

    const form = document.getElementById('form');
    form.innerHTML = '';

    s.data.forEach((item, i) => {
        form.innerHTML += `<p>${i + 1}. ${item.q}</p>` +
            (s.nama === 'Logika'
                ? `<input name=q${i}>`
                : `<textarea name=q${i}></textarea>`);
    });

    startTimer(s.waktu);
}

function startTimer(w) {
    clearInterval(timer);
    timeLeft = w;

    timer = setInterval(() => {
        document.getElementById('timer').innerText =
            'Sisa waktu: ' +
            Math.floor(timeLeft / 60) + ':' +
            (timeLeft % 60).toString().padStart(2, '0');

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            next();
        }
    }, 1000);
}

function next() {
    if (locked) return;
    locked = true;

    clearInterval(timer);

    const data = Object.fromEntries(new FormData(document.getElementById('form')));

    soal[index].data.forEach((s, i) => {
        const jawab = (data['q' + i] || '').toLowerCase();

        if (soal[index].nama === 'Logika') {
            if (jawab.trim() === s.k[0]) score += 10;
        } else {
            let count = 0;
            s.k.forEach(k => {
                if (jawab.includes(k)) count++;
            });
            score += count * 2;
        }
    });

    index++;

    if (index < soal.length) {
        load();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        finish();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        loadLeaderboard();
    }
}

function finish() {
    document.getElementById('tes').classList.add('hidden');
    document.getElementById('selesai').classList.remove('hidden');

    let finalScore = Math.round((score / (soal.length * 10 * 10)) * 100);
    let pesan = '';

    if (finalScore > 85) {
        pesan = '\nSelamat, anda lolos seleksi Ekstrakurikuler Koding & AI';
        document.getElementById('btnLanjut').classList.remove('hidden');
    }

    document.getElementById('hasil').innerText =
        'Skor akhir kamu: ' + finalScore + ' / 100' + pesan;

    kirimData(finalScore);
}

function kirimData(skor) {
    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ nama, kelas, skor })
    });
}

function loadLeaderboard() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#rankTable tbody');
            tbody.innerHTML = '';

            data.slice(0, 10).forEach((item, i) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${item.nama}</td>
                        <td>${item.kelas}</td>
                        <td>${item.skor}</td>
                    </tr>
                `;
            });

            document.getElementById('leaderboard').classList.remove('hidden');
        });
}

function showForm() {
    document.getElementById('formLanjutan').classList.remove('hidden');
}