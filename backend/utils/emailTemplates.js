const orderConfirmationEmail = (order, userName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #ff0076, #6d28d9); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; letter-spacing: 2px; }
    .header p { color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 13px; }
    .body { padding: 30px; }
    .greeting { font-size: 18px; color: #333; margin-bottom: 10px; }
    .order-id { background: #f9f9f9; border-left: 4px solid #ff0076; padding: 12px 16px; border-radius: 4px; margin: 20px 0; font-weight: bold; color: #ff0076; }
    .section-title { font-size: 15px; font-weight: bold; color: #333; margin: 20px 0 10px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #555; }
    .item-name { font-weight: 600; color: #333; }
    .item-meta { color: #888; font-size: 12px; margin-top: 2px; }
    .totals { margin-top: 15px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #555; }
    .total-final { display: flex; justify-content: space-between; padding: 12px 0; font-size: 16px; font-weight: bold; color: #333; border-top: 2px solid #eee; margin-top: 8px; }
    .address-box { background: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 14px; color: #555; line-height: 1.6; }
    .footer { background: #1a1a1a; padding: 20px; text-align: center; color: #888; font-size: 12px; }
    .footer a { color: #ff0076; text-decoration: none; }
    .badge { display: inline-block; background: #ff0076; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AURAWEAR</h1>
      <p>Wear Your Aura</p>
    </div>
    <div class="body">
      <p class="greeting">Hi ${userName}! 👋</p>
      <p style="color:#555;font-size:14px;">Thank you for your order! We've received it and will process it soon.</p>

      <div class="order-id">Order ID: ${order.orderId}</div>

      <div class="section-title">Order Items</div>
      ${order.items
        .map(
          (item) => `
        <div class="item">
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-meta">
              ${item.size ? `Size: ${item.size}` : ""}
              ${item.color ? ` | Color: ${item.color}` : ""}
              | Qty: ${item.qty}
            </div>
          </div>
          <div style="font-weight:600;">₹${(item.price * item.qty).toLocaleString("en-IN")}</div>
        </div>`
        )
        .join("")}

      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span>₹${order.subtotal.toLocaleString("en-IN")}</span></div>
        <div class="total-row"><span>GST (18%)</span><span>₹${order.tax.toLocaleString("en-IN")}</span></div>
        <div class="total-row"><span>Shipping</span><span>${order.shippingCharge === 0 ? "Free" : `₹${order.shippingCharge}`}</span></div>
        <div class="total-final"><span>Total</span><span>₹${order.totalPrice.toLocaleString("en-IN")}</span></div>
      </div>

      <div class="section-title">Shipping Address</div>
      <div class="address-box">
        <strong>${order.shippingAddress.fullName}</strong><br>
        ${order.shippingAddress.phone}<br>
        ${order.shippingAddress.address}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.pincode}
      </div>

      <div class="section-title">Payment Status</div>
      <span class="badge">${order.paymentStatus.toUpperCase()}</span>

      <p style="margin-top:25px;color:#888;font-size:13px;">
        If you have any questions, reply to this email or contact us at support@aurawear.com
      </p>
    </div>
    <div class="footer">
      <p>© 2025 AURAWEAR. All rights reserved.</p>
      <p>Made with ❤️ in India</p>
    </div>
  </div>
</body>
</html>
`;

const orderCancelledEmail = (order, userName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 12px; overflow: hidden; }
    .header { background: #1a1a1a; padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; letter-spacing: 2px; }
    .header p { color: rgba(255,255,255,0.5); margin: 5px 0 0; font-size: 13px; }
    .body { padding: 30px; }
    .order-id { background: #fff5f5; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 4px; margin: 20px 0; font-weight: bold; color: #ef4444; }
    .footer { background: #1a1a1a; padding: 20px; text-align: center; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AURAWEAR</h1>
      <p>Wear Your Aura</p>
    </div>
    <div class="body">
      <p style="font-size:18px;color:#333;">Hi ${userName},</p>
      <p style="color:#555;font-size:14px;">Your order has been cancelled as requested.</p>
      <div class="order-id">Cancelled Order: ${order.orderId}</div>
      <p style="color:#555;font-size:14px;">Total: ₹${order.totalPrice.toLocaleString("en-IN")}</p>
      ${
        order.paymentStatus === "paid"
          ? `<p style="color:#22c55e;font-size:14px;font-weight:bold;">✅ Refund will be processed within 5-7 business days.</p>`
          : ""
      }
      <p style="color:#888;font-size:13px;margin-top:20px;">Questions? Contact us at support@aurawear.com</p>
    </div>
    <div class="footer">
      <p>© 2025 AURAWEAR. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = { orderConfirmationEmail, orderCancelledEmail };