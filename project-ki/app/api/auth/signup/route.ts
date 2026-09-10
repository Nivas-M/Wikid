import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, confirmPassword } = body;

    // Validate Username
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a username.' },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!usernameRegex.test(normalizedUsername)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores.' },
        { status: 400 }
      );
    }

    // Validate Email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate Password
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Validate Password Confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const existingUsername = await db.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'This username is already taken. Please choose another.' },
        { status: 409 }
      );
    }

    // Check if email is already registered
    const existingEmail = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash the password with bcrypt (10 salt rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user in Neon PostgreSQL
    const user = await db.user.create({
      data: {
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: 'Account created successfully.', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating your account. Please try again.' },
      { status: 500 }
    );
  }
}
