import type { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';

const web3 = new Web3('https://sepolia.infura.io/v3/001e3715be7f40bbbbca7594663c7c15');

interface BalanceResponse {
  balance?: string;
  address?: string;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<BalanceResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { privateKey } = req.body;

  if (!privateKey) {
    return res.status(400).json({ error: 'Private key is required' });
  }

  const cleanPrivateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;

  if (!/^[a-fA-F0-9]{64}$/.test(cleanPrivateKey)) {
    return res.status(400).json({ error: 'Invalid private key format' });
  }

  try {
    const account = web3.eth.accounts.privateKeyToAccount('0x' + cleanPrivateKey);
    const balance = await web3.eth.getBalance(account.address);
    const etherBalance = web3.utils.fromWei(balance, 'ether');

    return res.status(200).json({ balance: etherBalance, address: account.address });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error fetching balance' });
  }
}
