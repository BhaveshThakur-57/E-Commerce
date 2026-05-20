const PDFDocument = require("pdfkit");

const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Stream to response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order.orderId}.pdf`
  );
  doc.pipe(res);

  // ── Header ──────────────────────────────────────────────
  doc
  .fillColor("#ff0076")
  .fontSize(28)
  .font("Helvetica-Bold")
  .text("LUXORA", 50, 50);

doc
  .fillColor("#444")
  .fontSize(10)
  .font("Helvetica")
  .text("Wear the Extraordinary", 50, 82)
  .text("India", 50, 95);

  doc
  .fillColor("#000")
  .fontSize(20)
  .font("Helvetica-Bold")
  .text("INVOICE", 350, 50, { width: 200, align: "right" });

doc
  .fillColor("#444")
  .fontSize(10)
  .font("Helvetica")
  .text(`Invoice No: ${order.orderId}`, 350, 80, { width: 200, align: "right" });

doc
  .fillColor("#444")
  .fontSize(10)
  .font("Helvetica")
  .text(
    `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`,
    350,
    95,
    { width: 200, align: "right" }
  );

  // ── Divider ─────────────────────────────────────────────
  doc
    .moveTo(50, 120)
    .lineTo(550, 120)
    .strokeColor("#ff0076")
    .lineWidth(2)
    .stroke();

  // ── Bill To ─────────────────────────────────────────────
  doc
    .fillColor("#000")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Bill To:", 50, 140);

  doc
    .fillColor("#444")
    .fontSize(10)
    .font("Helvetica")
    .text(order.shippingAddress.fullName, 50, 158)
    .text(order.shippingAddress.phone, 50, 172)
    .text(order.shippingAddress.address, 50, 186)
    .text(
      `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`,
      50,
      200
    );

  // ── Payment Status ───────────────────────────────────────
  doc
    .fillColor("#000")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Payment Status:", 350, 140);

  const statusColor =
    order.paymentStatus === "paid" ? "#22c55e" : "#f97316";

  doc
    .fillColor(statusColor)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(order.paymentStatus.toUpperCase(), 350, 158);

  doc
    .fillColor("#444")
    .fontSize(10)
    .font("Helvetica")
    .text(`Order Status: ${order.orderStatus}`, 350, 175);

  // ── Table Header ─────────────────────────────────────────
  const tableTop = 240;

  doc
    .fillColor("#ff0076")
    .rect(50, tableTop, 500, 25)
    .fill();

  doc
    .fillColor("#fff")
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Product", 60, tableTop + 7)
    .text("Qty", 340, tableTop + 7)
    .text("Unit Price", 390, tableTop + 7)
    .text("Total", 480, tableTop + 7);

  // ── Table Rows ───────────────────────────────────────────
  let y = tableTop + 30;

  order.items.forEach((item, i) => {
    const bg = i % 2 === 0 ? "#f9f9f9" : "#ffffff";
    doc.fillColor(bg).rect(50, y - 5, 500, 22).fill();

    doc
      .fillColor("#333")
      .fontSize(9)
      .font("Helvetica")
      .text(item.name, 60, y)
      .text(item.qty.toString(), 345, y)
      .text(`Rs.${item.price.toLocaleString("en-IN")}`, 390, y)
      .text(
        `Rs.${(item.price * item.qty).toLocaleString("en-IN")}`,
        480,
        y
      );

    y += 22;
  });

  // ── Divider ──────────────────────────────────────────────
  doc
    .moveTo(50, y + 5)
    .lineTo(550, y + 5)
    .strokeColor("#ddd")
    .lineWidth(1)
    .stroke();

  // ── Price Breakdown ──────────────────────────────────────
  y += 20;

  doc
    .fillColor("#444")
    .fontSize(10)
    .font("Helvetica")
    .text("Subtotal:", 380, y)
    .text(`Rs.${order.subtotal.toLocaleString("en-IN")}`, 480, y);

  y += 18;
  doc
    .text("GST (18%):", 380, y)
    .text(`Rs.${order.tax.toLocaleString("en-IN")}`, 480, y);

  y += 18;
  doc
    .text("Shipping:", 380, y)
    .text(
      order.shippingCharge === 0
        ? "Free"
        : `Rs.${order.shippingCharge}`,
      480,
      y
    );

  // ── Total ────────────────────────────────────────────────
  y += 25;
  doc
    .fillColor("#ff0076")
    .rect(370, y - 5, 180, 28)
    .fill();

  doc
    .fillColor("#fff")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("TOTAL:", 380, y + 3)
    .text(`Rs.${order.totalPrice.toLocaleString("en-IN")}`, 460, y + 3);

  // ── Footer ───────────────────────────────────────────────
  doc
    .moveTo(50, 700)
    .lineTo(550, 700)
    .strokeColor("#ff0076")
    .lineWidth(1)
    .stroke();

  doc
    .fillColor("#888")
    .fontSize(9)
    .font("Helvetica")
    .text("Thank you for shopping with LUXORA!", 50, 715, {
      align: "center",
      width: 500,
    })
    .text(
      "For any queries, contact us at support@LUXORA.com",
      50,
      730,
      { align: "center", width: 500 }
    );

  doc.end();
};

module.exports = generateInvoice;