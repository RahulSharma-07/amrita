import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Shree Amrita Academy" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export function generateAdmissionConfirmationEmail(
  studentName: string,
  applicationId: string,
  classApplied: string
): { subject: string; html: string } {
  const subject = `Admission Application Received - ${applicationId}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #dc2626 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">Shree Amrita Academy</h1>
        <p style="margin: 10px 0 0 0;">Managed by Shri Bindheshwari Educational Trust</p>
      </div>
      
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #1e40af;">Admission Application Received</h2>
        
        <p>Dear Parent/Guardian,</p>
        
        <p>We have received the admission application for <strong>${studentName}</strong> for class <strong>${classApplied}</strong>.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Application ID:</strong> ${applicationId}</p>
          <p style="margin: 10px 0 0 0;"><strong>Status:</strong> Under Review</p>
        </div>
        
        <p>Our admissions team will review your application. You will be notified via email about the next steps.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admission/status? id=${applicationId}" 
             style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Check Application Status
          </a>
        </div>
        
        <p>If you have any questions, please contact us at:</p>
        <p>
          <strong>Phone:</strong> +91 92277 80530<br>
          <strong>Email:</strong> amritaacademy@yahoo.co.in<br>
          <strong>Address:</strong> Plot No. 36 to 40, Pushpvatika Society, Nr. Gadkhol Patia, Ankleshwar
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          This is an automated email from Shree Amrita Academy. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
  
  return { subject, html };
}


export function generateAdmissionStatusEmail(
  studentName: string,
  applicationId: string,
  status: 'Approved' | 'Rejected',
  remarks?: string
): { subject: string; html: string } {
  const isApproved = status === 'Approved';
  const subject = `Admission ${status} - ${applicationId}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #dc2626 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">Shree Amrita Academy</h1>
        <p style="margin: 10px 0 0 0;">Managed by Shri Bindheshwari Educational Trust</p>
      </div>
      
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: ${isApproved ? '#16a34a' : '#dc2626'};">
          Admission ${status}
        </h2>
        
        <p>Dear Parent/Guardian,</p>
        
        <p>We are ${isApproved ? 'pleased to inform' : 'sorry to inform'} you that the admission application for <strong>${studentName}</strong> has been <strong>${status.toLowerCase()}</strong>.</p>
        
        <div style="background: ${isApproved ? '#f0fdf4' : '#fef2f2'}; border: 1px solid ${isApproved ? '#86efac' : '#fecaca'}; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Application ID:</strong> ${applicationId}</p>
          <p style="margin: 10px 0 0 0;"><strong>Status:</strong> ${status}</p>
          ${remarks ? `<p style="margin: 10px 0 0 0;"><strong>Remarks:</strong> ${remarks}</p>` : ''}
        </div>
        
        ${isApproved ? `
        <p>Congratulations! Please visit the school office with the original documents for verification and complete the admission formalities.</p>
        <p><strong>Office Hours:</strong> Monday to Saturday, 8:00 AM to 4:00 PM</p>
        ` : `
        <p>We appreciate your interest in Shree Amrita Academy. Unfortunately, we are unable to offer admission at this time.</p>
        <p>If you have any questions regarding this decision, please contact our admissions office.</p>
        `}
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Shree Amrita Academy<br>
          Plot No. 36 to 40, Pushpvatika Society, Nr. Gadkhol Patia, Ankleshwar<br>
          Phone: +91 92277 80530 | Email: amritaacademy@yahoo.co.in
        </p>
      </div>
    </div>
  `;
  
  return { subject, html };
}

export function generateNoticeEmail(
  title: string,
  content: string,
  category: string
): { subject: string; html: string } {
  const subject = `[${category}] ${title}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #dc2626 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">Shree Amrita Academy</h1>
        <p style="margin: 10px 0 0 0;">Important Notice</p>
      </div>
      
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #1e40af;">${title}</h2>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; white-space: pre-line;">${content}</p>
        </div>
        
        <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
          Category: ${category}<br>
          Date: ${new Date().toLocaleDateString('en-IN')}
        </p>
      </div>
    </div>
  `;
  
  return { subject, html };
}
