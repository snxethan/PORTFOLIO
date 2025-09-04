import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

/**
 * In-memory rate limiting map to prevent spam
 * Maps IP addresses to last message timestamp
 * Note: This will reset on server restart, consider using Redis for production
 */
const rateLimitMap = new Map<string, number>()

/**
 * POST endpoint for handling contact form submissions
 * Includes rate limiting, input validation, and email sending via Gmail SMTP
 * 
 * @param req - Next.js request object containing contact form data
 * @returns JSON response with success/error message
 */
export async function POST(req: Request) {
  // Extract client IP for rate limiting (handles proxy headers)
  const ip = req.headers.get('x-forwarded-for') || 'local'
  const now = Date.now()
  const lastSent = rateLimitMap.get(ip) || 0

  // Rate limiting: Allow only one message per minute per IP
  const RATE_LIMIT_MS = 60 * 1000 // 60 seconds
  if (now - lastSent < RATE_LIMIT_MS) {
    return NextResponse.json(
      { message: 'You are sending messages too quickly. Please wait.' },
      { status: 429 }
    )
  }

  // Update rate limit timestamp for this IP
  rateLimitMap.set(ip, now)

  // Parse and validate request body
  const body = await req.json().catch(() => null)
  if (!body || !body.name || !body.email || !body.message) {
    return NextResponse.json(
      { message: 'Invalid request body' },
      { status: 400 }
    )
  }

  try {
    // Configure Gmail SMTP transporter
    // Requires environment variables: GMAIL_USER, GMAIL_PASS, RECEIVER_EMAIL
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    // Send email with contact form data
    await transporter.sendMail({
      from: body.email,
      to: process.env.RECEIVER_EMAIL,
      subject: `Portfolio Contact: ${body.name}`,
      text: `Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`,
    })

    return NextResponse.json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      { message: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}