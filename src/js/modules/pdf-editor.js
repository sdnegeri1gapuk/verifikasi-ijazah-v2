import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

let canvas;
let container;
let qr;

let pdfScale = 1.3;

export let qrPosition = {
    x: 0.75,
    y: 0.20
};

let dragging = false;
let offsetX = 0;
let offsetY = 0;

export function initEditor(canvasEl, containerEl, qrEl){

    canvas = canvasEl;
    container = containerEl;
    qr = qrEl;

    qr.onmousedown = e=>{

        dragging = true;

        offsetX = e.offsetX;
        offsetY = e.offsetY;

    };

    document.onmouseup = ()=>{

        dragging = false;

    };

    document.onmousemove = e=>{

        if(!dragging) return;

        const rect = container.getBoundingClientRect();

        let x = e.clientX - rect.left - offsetX;
        let y = e.clientY - rect.top - offsetY;

        x = Math.max(0,Math.min(x,canvas.width-qr.offsetWidth));
        y = Math.max(0,Math.min(y,canvas.height-qr.offsetHeight));

        qr.style.left = x+"px";
        qr.style.top = y+"px";

        qrPosition.x = x / canvas.width;
        qrPosition.y = y / canvas.height;

    };

}

export async function renderPDF(file){

    const bytes = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: bytes
    }).promise;

    const page = await pdf.getPage(pdf.numPages);

    const viewport = page.getViewport({
        scale: pdfScale
    });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");

    await page.render({
        canvasContext: ctx,
        viewport
    }).promise;

    updateQR();

}

function updateQR(){

    qr.style.display="block";

    qr.style.left =
        (canvas.width * qrPosition.x) + "px";

    qr.style.top =
        (canvas.height * qrPosition.y) + "px";

}

export function zoomIn(){

    pdfScale += 0.1;

}

export function zoomOut(){

    pdfScale -= 0.1;

    if(pdfScale < 0.5){

        pdfScale = 0.5;

    }

}