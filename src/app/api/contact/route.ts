import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const rateLimitMap = new Map<string, number>()

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'local'
  const now = Date.now()
  const lastSent = rateLimitMap.get(ip) || 0

  const RATE_LIMIT_MS = 60 * 1000
  if (now - lastSent < RATE_LIMIT_MS) {
    return NextResponse.json(
      { message: 'You are sending messages too quickly. Please wait.' },
      { status: 429 }
    )
  }

  rateLimitMap.set(ip, now)

  const body = await req.json().catch(() => null)
  if (!body || !body.name || !body.email || !body.message) {
    return NextResponse.json(
      { message: 'Invalid request body' },
      { status: 400 }
    )
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

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
