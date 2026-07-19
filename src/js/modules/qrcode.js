import { supabase } from "../config.js";
import { buatQRCode } from "../qrcode.js";

export async function uploadQRCode(kodeBaru) {

    const qrBase64 = await buatQRCode(kodeBaru);

    const response = await fetch(qrBase64);

    const qrBlob = await response.blob();

    const qrFileName = `qr/${kodeBaru}.png`;

    const { error } = await supabase
        .storage
        .from("ijazah")
        .upload(qrFileName, qrBlob, {
            contentType: "image/png",
            upsert: true
        });

    if (error) throw error;

    const { data } = supabase
        .storage
        .from("ijazah")
        .getPublicUrl(qrFileName);

    return {
        qrUrl: data.publicUrl,
        qrBlob
    };

}