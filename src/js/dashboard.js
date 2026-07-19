import { supabase } from "./config.js";
import { bacaPDF } from "./pdfReader.js";
import { buatQRCode } from "./qrcode.js";
import { PDFDocument } from "pdf-lib";
import { generateKode } from "./modules/kode.js";
import { uploadQRCode } from "./modules/qrcode.js";
import { tempelQRKePDF, uploadPDF } from "./modules/upload.js";
// =====================
// ELEMENT
// =====================

const logoutBtn = document.getElementById("logoutBtn");
const totalIjazah = document.getElementById("totalIjazah");
const tbody = document.getElementById("tbodyIjazah");

const modal = document.getElementById("modalTambah");
const btnTambah = document.getElementById("btnTambah");
const btnTutup = document.getElementById("tutupModal");
const btnSimpan = document.getElementById("simpanData");

const kode = document.getElementById("kode");
const nomor = document.getElementById("nomor");
const nama = document.getElementById("nama");
const nisn = document.getElementById("nisn");

const pdfFile = document.getElementById("pdfFile");
const previewPdf = document.getElementById("previewPdf");
const gantiPdfFile = document.getElementById("gantiPdfFile");
const btnUploadMassal = document.getElementById("btnUploadMassal");
const pdfMassal = document.getElementById("pdfMassal");
const jenisDokumen = document.getElementById("jenisDokumen");
let idGantiPdf = null;
// =====================
// LOGIN
// =====================

const { data: session } = await supabase.auth.getSession();

if (!session.session) {
    window.location.href = "login.html";
}

// =====================
// LOAD DATA
// =====================

async function loadData() {

    const { data, error } = await supabase
        .from("dokumen")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        alert(error.message);
        return;
    }

    totalIjazah.textContent = data.length;

    tbody.innerHTML = "";

    data.forEach((item, index) => {

        tbody.innerHTML += `
<tr>

<td>${index + 1}</td>

<td>${item.nama}</td>

<td>${item.nisn}</td>

<td>${item.nomor_dokumen ?? item.nomor_ijazah}</td>

<td>${item.status}</td>

<td>



${item.pdf_url
? `<a href="${item.pdf_url}" target="_blank">👁 Preview PDF</a><br>`
: ""}

${item.pdf_url
? `<a href="${item.pdf_url}" download>⬇ Download PDF</a><br>`
: ""}

<button
class="gantiPdfBtn"
data-id="${item.id}">
🔄 Ganti PDF
</button>

<br><br>

${item.qr_url
? `<a href="${item.qr_url}" target="_blank">🔳 Lihat QR</a><br>`
: ""}

<button
class="hapusBtn"
data-id="${item.id}">
🗑 Hapus
</button>

</td>

</tr>
`;

    });

}

await loadData();

// =====================
// MODAL
// =====================

btnTambah.onclick = () => {

    modal.style.display = "flex";

};

btnTutup.onclick = () => {

    modal.style.display = "none";

};

// =====================
// PREVIEW PDF + OCR
// =====================

pdfFile.onchange = async () => {

    const file = pdfFile.files[0];

    if (!file) {

        previewPdf.src = "";
        previewPdf.style.display = "none";

        return;

    }

    // Preview PDF
    previewPdf.src = URL.createObjectURL(file);
    previewPdf.style.display = "block";

    try {

        const hasil = await bacaPDF(file);

        console.log("Hasil OCR :", hasil);

        nama.value = hasil.nama ?? "";
        nomor.value = hasil.nomor ?? "";
        nisn.value = hasil.nisn ?? "";

        const tempat = document.getElementById("tempat");
        const tanggal = document.getElementById("tanggal");
        const sekolah = document.getElementById("sekolah");
        const npsn = document.getElementById("npsn");

        if (tempat) tempat.value = hasil.tempat ?? "";
        if (tanggal) tanggal.value = hasil.tanggal ?? "";
        if (sekolah) sekolah.value = hasil.sekolah ?? "";
        if (npsn) npsn.value = hasil.npsn ?? "";

    } catch (err) {

        console.error(err);

        alert("OCR gagal membaca PDF.");

    }

};


// =====================
// SIMPAN DATA
// =====================

btnSimpan.onclick = async () => {

    try {

        if (pdfFile.files.length === 0) {

            alert("Silakan pilih file PDF.");

            return;

        }

        const file = pdfFile.files[0];

        // Generate kode
        const kodeBaru = await generateKode(
            jenisDokumen.value
        );

        // Upload QR
        const { qrUrl, qrBlob } = await uploadQRCode(kodeBaru);

        // Tempel QR ke PDF
        const pdfBytes = await tempelQRKePDF(file, qrBlob);

        // Upload PDF hasil tempelan
        const pdfUrl = await uploadPDF(
            file,
            pdfBytes,
            kodeBaru
        );

        // Simpan database
        const { error } = await supabase
            .from("dokumen")
            .insert([{

                kode: kodeBaru,
                jenis_dokumen: jenisDokumen.value,

                nomor_dokumen: nomor.value,
                nomor_ijazah: nomor.value,

                nama: nama.value,
                nisn: nisn.value,

                status: "VALID",

                pdf_url: pdfUrl,
                qr_url: qrUrl

            }]);

        if (error) throw error;

        modal.style.display = "none";

        kode.value = "";
        nomor.value = "";
        nama.value = "";
        nisn.value = "";

        pdfFile.value = "";

        previewPdf.src = "";
        previewPdf.style.display = "none";

        await loadData();

        alert(`Data berhasil disimpan.\n\nKode: ${kodeBaru}`);

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

};

// =====================
// HAPUS DATA
// =====================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("hapusBtn")) return;

    if (!confirm("Hapus data ini?")) return;

    const id = e.target.dataset.id;

    const { error } = await supabase
        .from("dokumen")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    await loadData();

});

// =====================
// GANTI PDF
// =====================

document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("gantiPdfBtn")) return;

    idGantiPdf = e.target.dataset.id;

    gantiPdfFile.click();

});

gantiPdfFile.onchange = async () => {

    if (!gantiPdfFile.files.length) return;

    const file = gantiPdfFile.files[0];
    const { data: lama } = await supabase
    .from("dokumen")
    .select("pdf_url")
    .eq("id", idGantiPdf)
    .single();

    const pdfLama = lama?.pdf_url;
    const { data: dataIjazah } = await supabase
        .from("dokumen")
        .select("kode")
        .eq("id", idGantiPdf)
        .single();

    const tahun = new Date().getFullYear();

    const namaFile = `pdf/${tahun}/${dataIjazah.kode}.pdf`;

    const { error: uploadError } = await supabase
        .storage
        .from("dokumen")
        .upload(namaFile, file, {
           
            contentType: "application/pdf", 
            upsert: true
        });

    if (uploadError) {

        alert(uploadError.message);

        return;

    }

    const { data } = supabase
        .storage
        .from("dokumen")
        .getPublicUrl(namaFile);

    const { error } = await supabase
        .from("dokumen")
        .update({
            pdf_url: data.publicUrl
        })
        .eq("id", idGantiPdf);

    if (error) {

        alert(error.message);

        return;

    }

    alert("PDF berhasil diperbarui.");

    gantiPdfFile.value = "";

    idGantiPdf = null;
// =====================
// Hapus PDF Lama
// =====================


    await loadData();

};

// =====================
// LOGOUT
// =====================

logoutBtn.onclick = async () => {

    await supabase.auth.signOut();

    window.location.href = "login.html";

};

// ==========================================
// UPLOAD PDF MASSAL
// Nama file harus:
// IJZ-50202149-000001.pdf
// ==========================================

btnUploadMassal.onclick = () => {
    pdfMassal.click();
};
// ==========================================
// UPLOAD PDF MASSAL BERDASARKAN NOMOR IJAZAH
// Nama file contoh:
// 111202663419101.pdf
// ==========================================

pdfMassal.onchange = async () => {

    const files = [...pdfMassal.files];

    if (files.length === 0) return;

    if (!confirm(`Upload ${files.length} file PDF?`)) return;

    let berhasil = 0;
    let gagal = 0;

    const tahun = new Date().getFullYear();

    for (let i = 0; i < files.length; i++) {

        const file = files[i];
      
        try {
        // ambil kode dari nama file
        const kode = file.name
            .replace(/\.pdf$/i, "")
            .replace(/_.*$/, "")
            .trim();

        // pastikan kode ada di database
        const { data: ijazah, error: cariError } = await supabase
            .from("dokumen")
            .select("kode")
            .eq("kode", kode)
            .single();

        if (cariError || !ijazah) {
            throw new Error(`Kode tidak ditemukan: ${kode}`);
        }

        const storagePath = `pdf/${tahun}/${kode}.pdf`;

            // upload file
            const { error: uploadError } = await supabase
                .storage
                .from("dokumen")
                .upload(storagePath, file, {
                    contentType: "application/pdf",
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // ambil URL public
            const { data: publicData } = supabase
                .storage
                .from("dokumen")
                .getPublicUrl(storagePath);

            // update database
            const { error: updateError } = await supabase
                .from("dokumen")
                .update({
                    pdf_url: publicData.publicUrl
                })
                .eq("kode", kode);

            if (updateError) throw updateError;

            berhasil++;

            console.log(
                `${i + 1}/${files.length} ✔ ${kode}`
            );

        } catch (err) {

            gagal++;

            alert(
        `${nomorIjazah}

        ${err.message}`
            );

            console.error(err);

        }

    }

    alert(
`Upload selesai.

Berhasil : ${berhasil}
Gagal     : ${gagal}`
    );

    pdfMassal.value = "";

    await loadData();

};