import express from 'express';

const router = express.Router();

const Web3 = require('web3');
const fetch = require('node-fetch');
const yesno = require('yesno');

// const chainId = 56; // Chain ID for Binance Smart Chain (BSC)
const chainId = 1;
// const web3RpcUrl = 'https://bsc-dataseed.binance.org'; // URL for BSC node
const web3RpcUrl = 'https://ethereum.publicnode.com'; // URL for ETH node
// https://ethereum.publicnode.com
const walletAddress = '0x...xxx'; // Your wallet address
const privateKey = '0x...xxx'; // Your wallet's private key. NEVER SHARE THIS WITH ANYONE!

const broadcastApiUrl =
  'https://api.1inch.dev/tx-gateway/v1.1/' + chainId + '/broadcast';
const apiBaseUrl = 'https://api.1inch.dev/swap/v5.2/' + chainId;
const web3 = new Web3(web3RpcUrl);
const headers = {
  headers: { Authorization: `Bearer YOUR_API_KEY`, accept: 'application/json' },
};

// Construct full API request URL
function apiRequestUrl(methodName, queryParams) {
  return (
    apiBaseUrl + methodName + '?' + new URLSearchParams(queryParams).toString()
  );
}

// Post raw transaction to the API and return transaction hash
async function broadCastRawTransaction(rawTransaction) {
  return fetch(broadcastApiUrl, {
    method: 'post',
    body: JSON.stringify({ rawTransaction }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer YOUR-API-KEY`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return res.transactionHash;
    });
}

// Sign and post a transaction, return its hash
async function signAndSendTransaction(transaction) {
  const { rawTransaction } = await web3.eth.accounts.signTransaction(
    transaction,
    privateKey
  );

  return await broadCastRawTransaction(rawTransaction);
}

const allowance = await checkAllowance(swapParams.src, walletAddress);
console.log('Allowance: ', allowance);

async function buildTxForApproveTradeWithRouter(tokenAddress, amount) {
  const url = apiRequestUrl(
    '/approve/transaction',
    amount ? { tokenAddress, amount } : { tokenAddress }
  );

  const transaction = await fetch(url, headers).then((res) => res.json());

  const gasLimit = await web3.eth.estimateGas({
    ...transaction,
    from: walletAddress,
  });

  return {
    ...transaction,
    gas: gasLimit,
  };
}

const transactionForSign = await buildTxForApproveTradeWithRouter(
  swapParams.src
);
console.log('Transaction for approve: ', transactionForSign);

const ok = await yesno({
  question:
    'Do you want to send a transaction to approve trade with 1inch router?',
});

if (!ok) {
  return false;
}

const approveTxHash = await signAndSendTransaction(transactionForSign);
console.log('Approve tx hash: ', approveTxHash);

async function buildTxForSwap(swapParams) {
  const url = apiRequestUrl('/swap', swapParams);

  // Fetch the swap transaction details from the API
  return fetch(url, headers)
    .then((res) => res.json())
    .then((res) => res.tx);
}

const swapTransaction = await buildTxForSwap(swapParams);
console.log('Transaction for swap: ', swapTransaction);

const oK = await yesno({
  question: 'Do you want to send a transaction to exchange with 1inch router?',
});

if (!oK) {
  return false;
}

const swapTxHash = await signAndSendTransaction(swapTransaction);
console.log('Swap tx hash: ', swapTxHash);

router.get('/:tokenAddress/:walletAddress', async (req, res) => {
  const { tokenAddress, walletAddress } = req.params;
  console.log('got');

  const swapParams = {
    src: '0x111111111117dc0aa78b770fa6a738034120c302', // Token address of 1INCH
    dst: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // Token address of DAI
    amount: '100000000000000000', // Amount of 1INCH to swap (in wei)
    from: walletAddress,
    slippage: 1, // Maximum acceptable slippage percentage for the swap (e.g., 1 for 1%)
    disableEstimate: false, // Set to true to disable estimation of swap details
    allowPartialFill: false, // Set to true to allow partial filling of the swap order
  };
});
