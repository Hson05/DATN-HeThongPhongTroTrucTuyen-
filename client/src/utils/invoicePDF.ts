import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Invoice } from '../services/hostService';

export const generateInvoicePDF = async (invoice: Invoice) => {
  // Tạo HTML content cho hóa đơn
  const invoiceHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px;">
        <h1 style="color: #1F2937; margin: 0; font-size: 28px;">HÓA ĐƠN THANH TOÁN</h1>
        <p style="color: #6B7280; margin: 5px 0;">Phòng trọ ${invoice.roomId}</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h3 style="color: #374151; margin-bottom: 10px;">Thông tin người thuê:</h3>
          <p style="margin: 5px 0;"><strong>Họ tên:</strong> ${invoice.tenantName}</p>
          <p style="margin: 5px 0;"><strong>Phòng:</strong> ${invoice.roomId}</p>
          <p style="margin: 5px 0;"><strong>Tháng:</strong> ${invoice.month}/${invoice.year}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 5px 0;"><strong>Ngày tạo:</strong> ${new Date(invoice.createdDate).toLocaleDateString('vi-VN')}</p>
          <p style="margin: 5px 0;"><strong>Hạn thanh toán:</strong> ${new Date(invoice.dueDate).toLocaleDateString('vi-VN')}</p>
          <p style="margin: 5px 0;"><strong>Mã HĐ:</strong> #${invoice.id}</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #F3F4F6;">
            <th style="border: 1px solid #D1D5DB; padding: 12px; text-align: left;">Khoản thu</th>
            <th style="border: 1px solid #D1D5DB; padding: 12px; text-align: center;">Số lượng</th>
            <th style="border: 1px solid #D1D5DB; padding: 12px; text-align: right;">Đơn giá</th>
            <th style="border: 1px solid #D1D5DB; padding: 12px; text-align: right;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #D1D5DB; padding: 12px;">Tiền phòng</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: center;">1</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: right;">${invoice.roomPrice.toLocaleString()}₫</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: right;">${invoice.roomPrice.toLocaleString()}₫</td>
          </tr>
          <tr>
            <td style="border: 1px solid #D1D5DB; padding: 12px;">Tiền điện</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: center;">${invoice.electricityAmount} kWh</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: right;">${invoice.electricityRate.toLocaleString()}₫</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: right;">${invoice.electricityTotal.toLocaleString()}₫</td>
          </tr>
          <tr>
            <td style="border: 1px solid #D1D5DB; padding: 12px;">Tiền nước</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: center;">${invoice.waterAmount} m³</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: right;">${invoice.waterRate.toLocaleString()}₫</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: right;">${invoice.waterTotal.toLocaleString()}₫</td>
          </tr>
          ${invoice.otherFees > 0 ? `
          <tr>
            <td style="border: 1px solid #D1D5DB; padding: 12px;">${invoice.otherFeesDescription || 'Phí khác'}</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: center;">1</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: right;">${invoice.otherFees.toLocaleString()}₫</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: right;">${invoice.otherFees.toLocaleString()}₫</td>
          </tr>
          ` : ''}
        </tbody>
        <tfoot>
          <tr style="background-color: #EFF6FF;">
            <td colspan="3" style="border: 1px solid #D1D5DB; padding: 12px; text-align: right; font-weight: bold;">TỔNG CỘNG:</td>
            <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: right; font-weight: bold; color: #1D4ED8; font-size: 18px;">${invoice.totalAmount.toLocaleString()}₫</td>
          </tr>
        </tfoot>
      </table>

      <div style="margin-top: 40px; text-align: center; color: #6B7280;">
        <p>Cảm ơn bạn đã thanh toán đúng hạn!</p>
        <p style="font-size: 12px;">Hóa đơn được tạo tự động bởi hệ thống quản lý phòng trọ</p>
      </div>
    </div>
  `;

  // Tạo element tạm thời để render HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = invoiceHTML;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  document.body.appendChild(tempDiv);

  try {
    // Chuyển HTML thành canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    // Tạo PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Lưu file PDF
    pdf.save(`hoa-don-${invoice.roomId}-${invoice.month}-${invoice.year}.pdf`);
  } finally {
    // Xóa element tạm thời
    document.body.removeChild(tempDiv);
  }
};