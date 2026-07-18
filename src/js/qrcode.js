import QRCode from "qrcode";

const BASE_URL = window.location.origin;

export async function buatQRCode(kode) {

    const url = `${BASE_URL}/verifikasi.html?kode=${encodeURIComponent(kode)}`;

    return await QRCode.toDataURL(url, {
        width: 350,
        margin: 2,
        errorCorrectionLevel: "H"
    });

}