import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailContent = generateEmailContent(formData);

    // For demo purposes, we'll log the content
    // In production, you would send this via your email service
    console.log('Volunteer Application Received:');
    console.log('=====================================');
    console.log(emailContent);

    // Simulate sending email to NGO
    const ngoEmailResult = await sendToNGO(emailContent, formData);
    
    // Simulate sending confirmation email to volunteer
    const volunteerEmailResult = await sendConfirmationToVolunteer(formData);

    return NextResponse.json({
      success: true,
      message: 'Volunteer application submitted successfully',
      applicationId: `VOL${Date.now()}`,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error processing volunteer application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

function generateEmailContent(formData: any): string {
  return `
VOLUNTEER APPLICATION - CONNECT I NETWORK
=========================================

PERSONAL INFORMATION:
--------------------
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Residency: ${formData.residency || 'Not provided'}

Application submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
=========================================
  `;
}

// Send email to NGO
async function sendToNGO(emailContent: string, formData: any) {
  try {
    // Check if we're in development mode
    if (process.env.EMAIL_MODE === 'development') {
      console.log('📧 EMAIL TO NGO (Development Mode):');
      console.log('To:', process.env.NGO_EMAIL);
      console.log('Subject: New Volunteer Application - ' + formData.fullName);
      console.log('Content:', emailContent);
      return { success: true, messageId: 'ngo_dev_' + Date.now() };
    }

    // Production email sending
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NGO_EMAIL,
      subject: `New Volunteer Application - ${formData.fullName}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to NGO:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending email to NGO:', error);
    return { success: false, error: error };
  }
}

// Send confirmation email to volunteer
async function sendConfirmationToVolunteer(formData: any) {
  try {
    const confirmationContent = `
Dear ${formData.fullName},

Thank you for your interest in volunteering with Connect I Network!

We have received your volunteer application and our team will review it within 2-3 business days. We will contact you at ${formData.phone} or ${formData.email} with next steps.

Your Application Summary:
- Name: ${formData.fullName}
- Phone: ${formData.phone}
- Email: ${formData.email}
- Residency: ${formData.residency || 'Not provided'}
- Application Date: ${new Date().toLocaleDateString('en-IN')}

Thank you for wanting to make a difference in our community!

Best regards,
Connect I Network Team
Dwarka Mor, Delhi

---
This is an automated confirmation email. Please do not reply to this email.
For questions, contact us at volunteer@connectinetwork.org
  `;

    // Check if we're in development mode
    if (process.env.EMAIL_MODE === 'development') {
      console.log('📧 CONFIRMATION EMAIL TO VOLUNTEER (Development Mode):');
      console.log('To:', formData.email);
      console.log('Subject: Volunteer Application Received - Connect I Network');
      console.log('Content:', confirmationContent);
      return { success: true, messageId: 'volunteer_dev_' + Date.now() };
    }

    // Production email sending
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: 'Volunteer Application Received - Connect I Network',
      text: confirmationContent,
      html: confirmationContent.replace(/\n/g, '<br>'),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent to volunteer:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    return { success: false, error: error };
  }
}

