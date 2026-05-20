const fs = require('fs');
const path = require('path');

const files = [
  'frontend/src/pages/OrderSuccess.jsx',
  'frontend/src/pages/Login.jsx',
  'frontend/src/pages/Checkout.jsx',
  'frontend/src/components/Navbar.jsx',
  'frontend/src/components/Footer.jsx',
  'frontend/src/components/ChatBot.jsx',
  'backend/utils/sendEmail.js',
  'backend/utils/generateOrderId.js',
  'backend/utils/generateInvoice.js',
  'backend/utils/emailTemplates.js',
  'backend/controllers/orderController.js',
  'backend/controllers/chatController.js',
  'backend/controllers/aiController.js'
];

files.forEach(file => {
  const filePath = path.join('d:/Projects/E_Commerce', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/AURAWEAR/g, 'LUXORA');
    content = content.replace(/Aurawear/g, 'Luxora');
    content = content.replace(/Wear Your Aura/gi, 'Wear the Extraordinary');
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Replacement done.');
