// Anda perlu menginstal Supabase Client Library:
// npm install @supabase/supabase-js
// atau tambahkan script tag ini di HTML Anda:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inisialisasi Supabase Client
const SUPABASE_URL = 'https://bpzeveffsxawqdbojkfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemV2ZWZmc3hhd3FkYm9qa2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0ODkxOTMsImV4cCI6MjA3MzA2NTE5M30.LzL2-yLVxC3Gh6-a-nF5kAEi3vhc-ENMGctpBbuLdhA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const registrationForm = document.getElementById('registrationForm');
const formMessage = document.getElementById('form-message');

registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ambil yang checked (tahan-null)
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const sourceEl = document.querySelector('input[name="source"]:checked');
    const otherRadio = document.getElementById('sourceOtherRadio');   // radio "Lainnya"
    const otherInput = document.getElementById('sourceOtherInput');   // input teks "Lainnya"

    // nilai source: jika pilih "Lainnya", pakai teks; selain itu pakai value radio terpilih
    const sourceValue = (otherRadio && otherRadio.checked)
    ? (otherInput?.value || '').trim()
    : (sourceEl ? sourceEl.value : '');


    // bikin payload
    const formData = {
    full_name: document.getElementById('fullName').value,
    nickname: document.getElementById('nickname').value,
    age: document.getElementById('age').value,
    gender: genderEl ? genderEl.value : '',                  // aman saat belum dipilih
    domicile: document.getElementById('domicile').value,
    whatsapp: document.getElementById('whatsapp').value,
    email: document.getElementById('email').value,
    instagram: document.getElementById('instagram').value,
    japanese_skill: document.getElementById('japaneseSkill').value,
    motivation: document.getElementById('motivation').value,
    source: sourceValue,                                      // <- perbaikan di sini
    is_followed: document.getElementById('isFollowed').checked,
    is_willing_to_share: document.getElementById('isWillingToShare').checked
    };

    // Tampilkan pesan "Loading..."
    showFormMessage('Mengirim data...', 'info');
    const submitBtn = registrationForm.querySelector('.btn-submit');
    submitBtn.disabled = true;

    try {
        const { data, error } = await supabase
            .from('registrations') // Nama tabel di Supabase
            .insert([formData]);

        if (error) {
            throw error;
        }

        showFormMessage('Pendaftaran berhasil! Terima kasih telah mendaftar. 😊', 'success');
        registrationForm.reset(); // Reset form setelah berhasil

        document.getElementById('successModal').style.display = 'flex';

        setTimeout(() => {
            window.location.href = '/';
        }, 5000);
    } catch (error) {
        console.error('Error saat pendaftaran:', error.message);
        showFormMessage('Pendaftaran gagal. Silakan coba lagi. 😥', 'danger');
    } finally {
        submitBtn.disabled = false;
    }
});

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `alert alert-${type}`;
    formMessage.style.display = 'block';
}