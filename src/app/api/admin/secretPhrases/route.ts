import { NextResponse } from 'next/server';
import SecretPhrase from '../../../../models/SecretPhrase';  // Adjust the import path if necessary
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect( 'mongodb+srv://fiverr_secret:fiverr_secret@cluster0.z6bfj7c.mongodb.net/fiverr_project');
    }

    // Fetch secret phrases from the database
    const secretPhrases = await SecretPhrase.find();

    return NextResponse.json(secretPhrases);
  } catch (error) {
    console.error('Error fetching secret phrases:', error);
    return NextResponse.json({ error: 'Error fetching secret phrases' }, { status: 500 });
  }
}
