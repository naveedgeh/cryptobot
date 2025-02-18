'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home: React.FC = () => {
  type CryptoPrice = {
    name: string;
    symbol: string;
    price: number;
    market_cap: number;
  };
  const [account, setAccount] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tradingStarted, setTradingStarted] = useState<boolean>(false);
  const [tradeLog, setTradeLog] = useState<string[]>([]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCryptoPrices();
  }, []);

  const fetchCryptoPrices = async () => {
    try {
      const response = await axios.get('https://cryptotradingbot.onrender.com/crypto-prices');
      setCryptoPrices(response.data);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
    }
  };

  const handlePrivateKeyConnection = async () => {
    if (!privateKey) {
      alert('Please enter a valid private key');
      return;
    }

    try {
      const response = await axios.post('https://cryptotradingbot.onrender.com/get-balance', { privateKey });
      setBalance(parseFloat(response.data.balance));
      setAccount(response.data.address);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      alert('Error fetching balance');
    }
  };

  const startTrading = () => {
    setTradingStarted(true);
    const id = setInterval(() => {
      setTradeLog((prevLog) => [...prevLog, 'Buying...']);
      setTimeout(() => {
        setTradeLog((prevLog) => [...prevLog, 'Selling...']);
      }, 2000);
    }, 4000);

    setIntervalId(id);
  };

  const stopTrading = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setTradingStarted(false);
    setTradeLog([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
      <div className="w-full max-w-lg p-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-indigo-500 mb-6">Crypto Trading Bot</h1>
          <p className="text-lg text-gray-400 mb-8">Automate your crypto trades securely with MetaMask</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          {!account ? (
            <div className="text-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300"
              >
                Enter Private Key to Start Trading
              </button>
            </div>
          ) : (
            <div>
              <p className="text-center text-lg text-gray-300 mb-4">Connected Account: <span className="font-semibold">{account}</span></p>
              <p className="text-center text-lg text-gray-300 mb-4">Balance: <span className="font-semibold">{balance} ETH</span></p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-2xl text-center text-white mb-4">Enter Your Private Key</h2>
            <input
              type="text"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg mb-4"
              placeholder="Private Key"
            />
            <div className="flex justify-between">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700">Cancel</button>
              <button onClick={handlePrivateKeyConnection} className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700">Connect</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg mt-6 bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto">
        <h3 className="text-xl font-semibold text-indigo-400 mb-4">Crypto Prices</h3>
        <div className="space-y-2">
          {cryptoPrices.map((crypto, index) => (
            <div key={index} className="text-lg text-gray-300">
              <div className="font-bold">{crypto.name} ({crypto.symbol.toUpperCase()})</div>
              <div>Price: ${crypto.price}</div>
              <div>Market Cap: ${crypto.market_cap}</div>
            </div>
          ))}
        </div>
      </div>

      {tradingStarted && (
        <div className="w-full max-w-lg mt-6 bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto max-h-64">
          <h3 className="text-xl font-semibold text-indigo-400 mb-4">Trade Log</h3>
          <div className="space-y-2">
            {tradeLog.map((log, index) => (
              <div key={index} className={`text-lg ${log.includes('Buying') ? 'text-green-400' : 'text-red-400'}`}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {tradingStarted && (
        <div className="text-center mt-4">
          <button onClick={stopTrading} className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300">Stop Trading</button>
        </div>
      )}

      {privateKey && !tradingStarted && (
        <div className="text-center mt-4">
          <button onClick={startTrading} className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300">Start Trading</button>
        </div>
      )}

      <footer className="w-full py-4 text-center text-gray-500 mt-8">
        <p>&copy; 2025 CryptoBot. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
