import express from 'express';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
import { db } from '../database/init.js';

dotenv.config();

const router = express.Router();

// Initialize Twilio client
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC') && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Initialize Nodemailer transporter
let transporter;
if (
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_HOST &&
  process.env.EMAIL_PORT
) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// Validation function
const validateContactData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.phone || data.phone.trim().length < 10) {
    errors.push('Please enter a valid phone number');
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  
  return errors;
};

// POST endpoint to handle contact form submissions
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, preferredDate } = req.body;

    // Validate input data
    const validationErrors = validateContactData({ name, email, phone, message });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    // Format the message for email and SMS
    let emailBody = `
      New Contact Form Submission:

      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      ${preferredDate ? `Preferred Date: ${preferredDate}` : ''}

      Message:
      ${message}
    `;

    // Ensure message is a string before using string methods
    const messageStr = message || '';
    let smsMessage = `New Contact: ${name} (${email}, ${phone})

    Message: ${messageStr.substring(0, 100)}${messageStr.length > 100 ? '...' : ''}`;

    // Save the contact message to the database
    try {
      await new Promise((resolve, reject) => {
        // Ensure db is defined
        if (!db) {
          console.error('Database connection not available');
          return reject(new Error('Database connection not available'));
        }

        const insertSql = `
          INSERT INTO contact_messages (name, email, phone, message, preferred_date)
          VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
          name,
          email,
          phone,
          messageStr,
          preferredDate || null
        ];

        db.run(insertSql, params, function(err) {
          if (err) {
            console.error('Error saving contact message to database:', err);
            reject(err);
          } else {
            console.log(`Contact message saved to database with ID: ${this.lastID}`);
            resolve({ id: this.lastID });
          }
        });
      });
    } catch (dbError) {
      console.error('Database error during contact form submission:', dbError);
      return res.status(500).json({
        error: 'Failed to save contact message to database',
        details: dbError.message,
      });
    }

    // Send email if transporter is configured (optional - won't fail if not configured)
    let emailResult = null;
    if (transporter) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAIL || 'mainaltaf123@gmail.com', // Updated default email
        subject: `New Contact Form Submission from ${name}`,
        text: emailBody,
      };

      emailResult = await transporter.sendMail(mailOptions);
    } else {
      console.log('Email transporter not configured, skipping email delivery');
    }

    // Send SMS to the business phone numbers if Twilio is configured (optional - won't fail if not configured)
    let smsResults = [];
    if (twilioClient) {
      // Use phone numbers from your constants (CONTACT_INFO.phone1, CONTACT_INFO.phone2)
      // For now, using environment variables for business numbers
      const businessNumbers = [
        process.env.BUSINESS_PHONE_1 || '034505474430',
        process.env.BUSINESS_PHONE_2 || '00971501973357'
      ].filter(num => num); // Filter out undefined/null values

      for (const businessPhone of businessNumbers) {
        try {
          const smsResult = await twilioClient.messages.create({
            body: smsMessage,
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
            to: businessPhone,
          });
          smsResults.push({ phone: businessPhone, success: true, sid: smsResult.sid });
        } catch (smsError) {
          console.error(`Failed to send SMS to ${businessPhone}:`, smsError);
          smsResults.push({ phone: businessPhone, success: false, error: smsError.message });
        }
      }
    } else {
      console.log('Twilio not configured, skipping SMS delivery');
    }

    // Log successful submission
    console.log('Contact form submitted:', { name, email, phone, preferredDate });

    res.status(200).json({
      message: 'Contact form submitted successfully',
      emailSent: !!transporter,
      smsSent: twilioClient ? smsResults : null,
    });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    res.status(500).json({
      error: 'Failed to process contact form submission',
      details: error.message,
    });
  }
});

export default router;