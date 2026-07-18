import { supabase } from "../config.js";

export async function generateKode(jenisDokumen) {

    const prefixMap = {
        IJAZAH: "IJZ",
        TRANSKRIP: "TRN",
        SKL: "SKL",
        SURAT_AKTIF: "SAK",
        SURAT_PINDAH: "SPD",
        SERTIFIKAT: "SRT",
        LAINNYA: "DOC"
    };

    const prefix =
        prefixMap[jenisDokumen] || "DOC";

    const { count } = await supabase
        .from("dokumen")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("jenis_dokumen", jenisDokumen);

    return `${prefix}-50202149-${String((count ?? 0) + 1).padStart(6, "0")}`;

}