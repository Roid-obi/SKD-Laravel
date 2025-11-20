import React from 'react';

// Pastikan skrip reCAPTCHA telah dimuat di file utama HTML/Blade Anda
// Contoh: <script src="https://www.google.com/recaptcha/api.js" async defer></script>

function RecaptchaField({ error, sitekey }) {
    // Kunci situs reCAPTCHA harus diteruskan sebagai prop.
    // Di Laravel, ini biasanya diambil dari env('CAPTCHA_KEY').

    // useEffect hook bisa digunakan untuk inisialisasi reCAPTCHA secara programatis
    // jika Anda tidak ingin menggunakan atribut 'data-sitekey' dan 'g-recaptcha' class.
    // Namun, cara paling sederhana untuk Inertia/Laravel adalah dengan div biasa.

    return (
        <div className="form-group row">
            <div className="col-md-6 offset-md-4">
                <div
                    className="g-recaptcha"
                    data-sitekey={sitekey} // Menggunakan sitekey dari props
                ></div>

                {/* Menampilkan pesan kesalahan jika ada */}
                {error && (
                    <span className="invalid-feedback" style={{ display: 'block' }}>
                        <strong>{error}</strong>
                    </span>
                )}
            </div>
        </div>
    );
}

export default RecaptchaField;
