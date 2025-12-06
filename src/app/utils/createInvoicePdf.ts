import PDFDocument from "pdfkit";

interface InvoiceData {
    bookingDate: Date;
    guestCount: number;
    totalAmount: number;
    eventName: string;
    transactionId: string;
    userName: string;
}

export const createInvoicePdf = async (data: InvoiceData): Promise<Buffer> => {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));

        // Title
        doc.fontSize(22).text("Event Booking Invoice", { align: "center" });
        doc.moveDown();

        // User Info
        doc.fontSize(14).text(`Customer Name: ${data.userName}`);
        doc.text(`Event Name: ${data.eventName}`);
        doc.text(`Booking Date: ${data.bookingDate.toDateString()}`);
        doc.text(`Guest Count: ${data.guestCount}`);
        doc.text(`Transaction ID: ${data.transactionId}`);
        doc.moveDown();

        // Amount
        doc.fontSize(16).text(`Total Amount: ${data.totalAmount} Taka`, {
            underline: true,
        });

        doc.moveDown();
        doc.text("Thank you for booking with us!", { align: "center" });

        doc.end();
    });
};
