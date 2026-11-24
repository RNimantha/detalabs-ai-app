import nodemailer from "nodemailer"
import twilio from "twilio"

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  connectionTimeout: 10000,
  socketTimeout: 10000,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Twilio configuration for WhatsApp (lazy initialization)
function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  
  if (!accountSid || !authToken) {
    return null
  }
  
  return twilio(accountSid, authToken)
}

interface ContactNotificationData {
  name: string
  email: string
  subject: string
  message: string
  submittedAt: string
}

export async function sendEmailNotification(data: ContactNotificationData): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "info@detalabsai.com",
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Submitted:</strong> ${data.submittedAt}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #334155; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #475569;">${data.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>Action Required:</strong> Please respond to this inquiry within 2 hours.
              You can reply directly to <a href="mailto:${data.email}">${data.email}</a>
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; color: #64748b; font-size: 12px;">
            <p>This notification was sent from detaLabsAI Contact Form</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
Submitted: ${data.submittedAt}

Message:
${data.message}

Please respond to this inquiry within 2 hours.
      `,
    }

    await emailTransporter.sendMail(mailOptions)
    console.log("Email notification sent successfully")
    return true
  } catch (error) {
    console.error("Error sending email notification:", error)
    return false
  }
}

export async function sendWhatsAppNotification(data: ContactNotificationData): Promise<boolean> {
  try {
    const twilioClient = getTwilioClient()
    
    if (!twilioClient) {
      console.log("WhatsApp notification skipped: Twilio credentials not configured")
      return false
    }

    const message = `🔔 *New Contact Form Submission*

👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
📋 *Subject:* ${data.subject}
🕒 *Time:* ${data.submittedAt}

💬 *Message:*
${data.message}

---
Please respond within 2 hours.
detaLabsAI Contact System`

    await twilioClient.messages.create({
      from: "whatsapp:" + process.env.TWILIO_WHATSAPP_FROM,
      to: "whatsapp:+94765849222",
      body: message,
    })

    console.log("WhatsApp notification sent successfully")
    return true
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error)
    return false
  }
}

export async function sendNotifications(data: ContactNotificationData): Promise<{
  email: boolean
  whatsapp: boolean
}> {
  const results = await Promise.allSettled([sendEmailNotification(data), sendWhatsAppNotification(data)])

  return {
    email: results[0].status === "fulfilled" ? results[0].value : false,
    whatsapp: results[1].status === "fulfilled" ? results[1].value : false,
  }
}
