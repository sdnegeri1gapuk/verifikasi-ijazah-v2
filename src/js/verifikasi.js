import { supabase } from "./config.js";
import logoSekolah from "../assets/logo.png";
const hasil = document.getElementById("hasil");

const params = new URLSearchParams(window.location.search);

const kode = params.get("kode");
console.log("Kode dari URL:", kode);

if (!kode) {

    hasil.innerHTML = "<h2>Kode tidak ditemukan.</h2>";

} else {

    const { data, error } = await supabase
    .from("dokumen")
    .select("*")
    .eq("kode", kode)
    .single();

    console.log("Kode dari URL:", kode);
    console.log("Data:", data);
    console.log("Error:", error);

   if (error || !data) {

    console.log("ERROR :", error);
    console.log("DATA :", data);

    hasil.innerHTML = `
        <h2 style="color:red;">❌ IJAZAH TIDAK DITEMUKAN</h2>
        <pre>${JSON.stringify(error, null, 2)}</pre>
    `;

} else {
hasil.innerHTML = `
<div style="max-width:750px;margin:40px auto;background:#fff;padding:30px;border-radius:12px;box-shadow:0 5px 20px rgba(0,0,0,.15);font-family:Arial,sans-serif;">

    <div style="text-align:center;">

    <img
        src="${logoSekolah}"
        alt="Logo SD Negeri 1 Gapuk"
        style="width:90px;height:90px;margin-bottom:15px;"
    >


        <h1 style="color:#0d6efd;margin-bottom:10px;">
            VERIFIKASI DOKUMEN IJAZAH
        </h1>

        <h2 style="color:green;margin-bottom:5px;">
            ✅ DOKUMEN TELAH DISAHKAN
        </h2>

        <p style="font-size:15px;color:#555;">
            Dokumen ini telah diverifikasi dan dinyatakan <b>SAH</b> berdasarkan data yang tersimpan pada sistem verifikasi ijazah SD Negeri 1 Gapuk.
        </p>

    </div>

    <hr>

    <table style="width:100%;line-height:2;font-size:16px;">

        <tr>
            <td width="220"><b>Kode Verifikasi</b></td>
            <td>: ${data.kode}</td>
        </tr>

        <tr>
            <td><b>Nama</b></td>
            <td>: ${data.nama}</td>
        </tr>

        <tr>
            <td><b>NISN</b></td>
            <td>: ${data.nisn}</td>
        </tr>
        <tr>
            <td><b>Jenis Dokumen</b></td>
            <td>: ${data.jenis_dokumen}</td>
        </tr>
        <tr>
            <td><b>Nomor Dokumen</b></td>
            <td>: ${data.nomor_dokumen ?? data.nomor_ijazah}</td>
        </tr>

        <tr>
            <td><b>Status Dokumen</b></td>
            <td>: <span style="color:green;font-weight:bold;">${data.status}</span></td>
        </tr>

    </table>
        
    <div style="text-align:center;margin:25px 0;">

    <img
        src="${data.qr_url}"
        alt="QR Code Verifikasi"
        style="width:180px;height:180px;border:1px solid #ddd;padding:10px;border-radius:10px;background:#fff;"
    >

    <p style="margin-top:10px;color:#666;font-size:14px;">
        QR Code Verifikasi Dokumen
    </p>

</div>
    <hr>

    <div style="padding:15px;background:#f8f9fa;border-radius:8px;">

        <p style="margin:0;">
            Dokumen ini telah disahkan oleh:
        </p>

        <h3 style="margin:10px 0 5px 0;color:#0d6efd;">
            H. Masrun, S.Pd.
        </h3>

        <p style="margin:0;">
            Kepala SD Negeri 1 Gapuk
        </p>

    </div>

    <br>

    <div style="text-align:center;">

        <a href="${data.pdf_url}" target="_blank">
            📄 Lihat Dokumen Ijazah
        </a>

    </div>

</div>
`;
    }

}