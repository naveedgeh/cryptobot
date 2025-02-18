import { NextRequest, NextResponse } from "next/server";
import Web3 from "web3";

const web3 = new Web3("https://sepolia.infura.io/v3/001e3715be7f40bbbbca7594663c7c15");

export async function POST(req: NextRequest) {
  try {
    const { privateKey } = await req.json();

    if (!privateKey) {
      return NextResponse.json({ error: "Private key is required" }, { status: 400 });
    }

    const cleanPrivateKey = privateKey.startsWith("0x") ? privateKey.slice(2) : privateKey;

    if (!/^[a-fA-F0-9]{64}$/.test(cleanPrivateKey)) {
      return NextResponse.json({ error: "Invalid private key format" }, { status: 400 });
    }

    const account = web3.eth.accounts.privateKeyToAccount("0x" + cleanPrivateKey);
    const balance = await web3.eth.getBalance(account.address);
    const etherBalance = web3.utils.fromWei(balance, "ether");
    return NextResponse.json({ balance: etherBalance, address: account.address });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error fetching balance" }, { status: 500 });
  }
}
