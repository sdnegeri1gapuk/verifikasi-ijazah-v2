import { supabase } from "../config.js";
import { PDFDocument } from "pdf-lib";

// =====================
// TEMPEL QR KE PDF
// =====================

export async function tempelQRKePDF(file, qrBlob, jenisDokumen) {

    const pdfBytes = await file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfBytes);

    const qrBytes = await qrBlob.arrayBuffer();

    const qrImage = await pdfDoc.embedPng(qrBytes);

    const pages = pdfDoc.getPages();

    const page = pages[pages.length - 1];

    const { width } = page.getSize();

    page.drawImage(qrImage, {

        x: width - 290,
        y: 160,
        width:75,
        height:75

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
