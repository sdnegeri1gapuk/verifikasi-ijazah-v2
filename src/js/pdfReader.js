import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function bacaPDF(file) {

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: buffer
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {

        const page = await pdf.getPage(i);

        const content = await page.getTextContent();

        text += content.items
            .map(item => item.str)
            .join(" ");

        text += "\n";
    }

    const hasil = {

        nama: "",
        nomor: "",
        nisn: "",
        tempat: "",
        tanggal: "",
        sekolah: "",
        npsn: ""

    };

    // Nomor Ijazah
    let m = text.match(/No\.\s*Ijazah\s*:?\s*([0-9]+)/i);
    if (m) hasil.nomor = m[1];

    // Nama
    m = text.match(/Dengan ini menyatakan bahwa:\s*(.*?)\s*tempat,\s*tanggal lahir/i);
    if (m) hasil.nama = m[1].trim();

    // Tempat
    m = text.match(/tempat,\s*tanggal lahir:\s*(.*?),\s*\d{1,2}/i);
    if (m) hasil.tempat = m[1].trim();

    // Tanggal
    m = text.match(/tempat,\s*tanggal lahir:\s*.*?,\s*([0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4})/i);
    if (m) hasil.tanggal = m[1];

    // NISN
    m = text.match(/Nomor Induk Siswa Nasional\s*:?\s*([0-9]{10})/i);
    if (m) hasil.nisn = m[1];

    // Sekolah
    m = text.match(/dari,\s*satuan pendidikan:\s*(.*?)\s*Nomor Pokok/i);
    if (m) hasil.sekolah = m[1].trim();

    // NPSN
    m = text.match(/Nomor Pokok Sekolah Nasional:\s*([0-9]+)/i);
    if (m) hasil.npsn = m[1];

    return hasil;

}