import QRCode from "qrcode";

// URL website online
const BASE_URL = "https://sdnegeri1gapuk.github.io/verifikasi-ijazah-v2";

export async function buatQRCode(kode) {

    const url = `${BASE_URL}/verifikasi.html?kode=${encodeURIComponent(kode)}`;

    return await QRCode.toDataURL(url, {
        width: 350,
        margin: 2,
        errorCorrectionLevel: "H"
    });

}