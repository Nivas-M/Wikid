import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { db } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Generic response message to prevent email enumeration
    const genericSuccess = {
      message:
        'If an account with that email exists, a password reset link has been sent to your inbox (valid for 10 minutes).',
    };

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(genericSuccess, { status: 200 });
    }

    // Generate 32-byte cryptographically secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Set expiration strictly to 10 minutes max
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // In server logs, log the reset URL for verification
    console.log(`[AUTH] Password reset requested for ${user.email}. Link: /reset-password?token=${resetToken}`);
    // Determine application origin URL
    const origin =
      req.headers.get('origin') ||
      process.env.NEXTAUTH_URL ||
      'http://localhost:3000';
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    // Dispatch real email via Resend
    try {
      await resend.emails.send({
        from: 'Wikid <onboarding@resend.dev>',
        to: user.email,
        subject: 'Reset your Wikid password',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a; background-color: #ffffff; border-radius: 12px; border: 1px solid #eaeaea;">
            <div style="margin-bottom: 24px;">
              <span style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #f97316;">Wikid</span>
            </div>
            <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #111827;">Reset your password</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
              We received a request to reset the password for your Wikid account. Click the button below to choose a new password:
            </p>
            <div style="margin: 28px 0;">
              <a href="${resetUrl}" style="background-color: #f97316; color: #ffffff; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 12px; color: #6b7280; line-height: 1.5; margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
              This link is strictly valid for <strong>10 minutes</strong>.<br />
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        `,
      });
      console.log(`[AUTH] Resend email dispatched to ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send email via Resend:', emailError);
    }

    return NextResponse.json(genericSuccess, { status: 200 });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

