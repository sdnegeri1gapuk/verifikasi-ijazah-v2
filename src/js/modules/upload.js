import { supabase } from "../config.js";
import { PDFDocument } from "pdf-lib";

// =====================
// TEMPEL QR KE PDF
// =====================

export async function tempelQRKePDF(file, qrBlob, jenisDokumen) {
 console.log("Jenis dokumen:", jenisDokumen);

let posisiY = 137;

    // Transkrip lebih rendah 40 px
    if (jenisDokumen === "Transkrip Nilai") {
        posisiY = 128;
    }

    page.drawImage(qrImage, {
        x: width - 250,
        y: posisiY,
        width: 80,
        height: 80
    });

    return await pdfDoc.save();

}

// =====================
// UPLOAD PDF
// =====================

export async function uploadPDF(file, pdfBytes, kodeBaru) {

    const tahun = new Date().getFullYear();

    const namaFile = `pdf/${tahun}/${kodeBaru}.pdf`;

    const pdfBlob = new Blob([pdfBytes], {
        type: "application/pdf"
    });

    const { error } = await supabase
        .storage
        .from("ijazah")
        .upload(namaFile, pdfBlob, {
            contentType: "application/pdf",
            upsert: true
        });

    if (error) throw error;

    const { data } = supabase
        .storage
        .from("ijazah")
        .getPublicUrl(namaFile);

    return data.publicUrl;

}
