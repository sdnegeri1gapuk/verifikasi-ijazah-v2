import { supabase } from "./config.js";

const params = new URLSearchParams(window.location.search);
const kode = params.get("kode");

console.log("Kode dari URL:", kode);

if (!kode) {
    document.body.innerHTML = `
        <div style="
            max-width:600px;
            margin:80px auto;
            padding:30px;
            text-align:center;
            font-family:Arial,sans-serif;
            background:#fff;
            border-radius:12px;
            box-shadow:0 5px 20px rgba(0,0,0,.15);
        ">
            <h2 style="color:red;">
                ❌ KODE VERIFIKASI TIDAK DITEMUKAN
            </h2>

            <p style="color:#666;">
                Kode verifikasi tidak tersedia pada alamat halaman ini.
            </p>
        </div>
    `;
} else {

    /*
    =====================================================
    REDIRECT KE SISTEM VERIFIKASI UTAMA
    =====================================================

    Contoh:

    URL sekarang:
    https://domain-anda.com/?kode=87PU6KXAB

    Akan menjadi:

    https://sdnegeri1gapuk.github.io/sign/#/verifikasi/87PU6KXAB
    */

    const token = encodeURIComponent(kode.trim());

    const redirectUrl =
        `https://sdnegeri1gapuk.github.io/sign/#/verifikasi/${token}`;

    console.log("Token:", token);
    console.log("Redirect ke:", redirectUrl);

    /*
    =====================================================
    REDIRECT OTOMATIS
    =====================================================
    */

    window.location.replace(redirectUrl);
}
