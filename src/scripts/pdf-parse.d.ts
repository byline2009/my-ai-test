declare module "pdf-parse" {
  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: Record<string, any>;
    metadata: any;
    version: string;
    text: string;
  }

  const pdfParse: (dataBuffer: Buffer) => Promise<PDFParseResult>;
  export default pdfParse;
}