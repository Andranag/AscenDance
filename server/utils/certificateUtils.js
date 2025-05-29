import { nanoid } from 'nanoid';
import PDFDocument from 'pdfkit';

export const generateCertificateId = () => {
  return `CERT-${nanoid(10)}`;
};

export const createCertificatePDF = async (userId, courseId, certificateId) => {
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4'
  });

  // Get user and course details
  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  // Add certificate content
  doc.font('Helvetica-Bold')
     .fontSize(50)
     .text('Certificate of Completion', 100, 80);

  doc.fontSize(25)
     .text(`This certifies that`, 100, 190);

  doc.fontSize(40)
     .text(user.name, 100, 240);

  doc.fontSize(25)
     .text(`has successfully completed the course`, 100, 300);

  doc.fontSize(40)
     .text(course.title, 100, 350);

  doc.fontSize(15)
     .text(`Certificate ID: ${certificateId}`, 100, 450);

  doc.fontSize(15)
     .text(`Issued on: ${new Date().toLocaleDateString()}`, 100, 480);

  return doc;
};