import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function bacaIjazah(file) {

    // =====================
    // Ubah File menjadi ArrayBuffer
    // =====================

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
    }).promise;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({
        scale: 2
    });

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: context,
        viewport
    }).promise;

    const worker = await createWorker("ind");

    const result = await worker.recognize(canvas);

    await worker.terminate();

    return result.data.text;

}