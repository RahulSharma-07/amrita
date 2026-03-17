import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Email content for the school
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // Send email to the school
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'amritaacademy@yahoo.co.in',
      subject: `New Contact Submission: ${subject}`,
      html: html,
    });

    // Send auto-reply to the user
    const autoReplyHtml = `
      <h2>Thank you for contacting Shree Amrita Academy</h2>
      <p>Dear ${name},</p>
      <p>We have received your message regarding "${subject}". Our team will get back to you as soon as possible.</p>
      <br/>
      <p>Best Regards,</p>
      <p><strong>Administration</strong></p>
      <p>Shree Amrita Academy</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Thank you for contacting us - Shree Amrita Academy',
      html: autoReplyHtml,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
