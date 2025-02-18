import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Set a strong secret key

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Validate the username and password
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 400 });
    }

    // If credentials are correct, generate a JWT token
    const token = jwt.sign(
      { username }, // Payload with user info (you can add more data here if needed)
      JWT_SECRET, // Secret key to sign the token
      { expiresIn: '1h' } // Token expiration time (1 hour in this case)
    );

    // Return the success response with the token
    return NextResponse.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}
