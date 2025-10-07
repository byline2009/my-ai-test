import { env } from "./config";
import fs from 'fs'
import pdfParse from "pdf-parse";



export async function getChunkedDocsFromPDF() {
  try {
    const dataBuffer =  fs.readFileSync(env.PDF_PATH)
    const pdfData = await  pdfParse(dataBuffer);
    const docs = pdfData.text;
    console.log("check docs", docs.length)
    const chunkSize = 1000;
    const overlapSize = 200;
    const chunks = [];
    let start = 0;

    while (start < docs.length) {
      const end = start + chunkSize;
      const chunk = docs.slice(start, end);
      // console.log('Chunk---------------->', chunk);
      chunks.push(chunk);
      start += chunkSize - overlapSize; // Move forward by chunkSize minus overlap
    }

    return chunks;

  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed !");
  }
}
