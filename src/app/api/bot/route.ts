import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

const INFURA_URL = "https://sepolia.infura.io/v3/001e3715be7f40bbbbca7594663c7c15";

export async function POST(req: NextRequest) {
  try {
    const { secretPhrase } = await req.json();
    
    if (!secretPhrase) {
      return NextResponse.json({ error: "Secret phrase is required" }, { status: 400 });
    }

    // Validate the mnemonic in ethers v6
    if (!ethers.Mnemonic.isValidMnemonic(secretPhrase)) {
      return NextResponse.json({ error: "Invalid secret phrase" }, { status: 400 });
    }

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