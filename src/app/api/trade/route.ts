// app/api/trade/route.js
export async function GET() {
    const exchanges = ["Curve", "Uniswap"];  // Array of exchanges
  
    const getRandomAction = () => {
      return Math.random() > 0.5 ? "Buying" : "Selling";
    };
  
    const getRandomTime = () => {
      // Randomizing between 3 to 7 seconds (in milliseconds)
      return Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000;
    };
  
    const getRandomProfit = () => {
      // Randomizing profit between +0.5 and +2 USDT
      return (Math.random() * 1.5 + 0.5).toFixed(2) + " USDT";
    };
  
    const getRandomExchange = () => {
      // Randomly selects an exchange from the array
      return exchanges[Math.floor(Math.random() * exchanges.length)];
    };
  
    const getCurrentTime = () => {
      const currentDate = new Date();
      return `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()} PM`;
    };
  
    const generateTradeLog = () => {
      const action = getRandomAction();
      const profit = getRandomProfit();
      const exchange1 = getRandomExchange();
      const exchange2 = getRandomExchange();
      const currentTime = getCurrentTime();
  
      // Format the log message as specified
      return `[${currentTime}] ✅ ${action} on ${exchange1}, ${action === "Buying" ? "Sell" : "Buy"} on ${exchange2} Profit: ${profit}`;
    };
  
    // Generate trade log
    const tradeLog = generateTradeLog();
  
    // Simulate delay (could use the setTimeout equivalent here if needed for asynchronous behavior)
    await new Promise(resolve => setTimeout(resolve, getRandomTime()));
  
    return new Response(JSON.stringify({ log: tradeLog }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  