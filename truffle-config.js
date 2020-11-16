const fs = require('fs');
require('dotenv').config();
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const infuraKey = process.env.infuraKey;
const privateKey = process.env.privateKey;

const BSC_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/"
// https://testnet.binance.org/faucet-smart bsc水龙头
// https://rinkeby.faucet.epirus.io/ eth

const INFURA_URL = "https://rinkeby.infura.io/v3/" + infuraKey

const web3Provider = Web3.providers.HttpProvider(INFURA_URL)
const web3 = new Web3(web3Provider)

const provider = new HDWalletProvider(privateKey, INFURA_URL)

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      gas: 6000000,
      gasPrice: web3.utils.toWei("5", "gwei"),
      network_id: "*"
    },
    test: {
      host: "127.0.0.1",
      port: 8545,
      gas: 6000000,
      network_id: "*"
    },
    bsc: {
      provider: () => new HDWalletProvider(privateKey, BSC_RPC),
      network_id: 97,
      gas: 6000000,
      confirmations: 1, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true
    },
    rinkeby: {
      provider: provider,
      network_id: 4,
      gas: 6000000,
      gasPrice: web3.utils.toWei("5", "gwei"),
      confirmations: 1,
      timeoutBlocks: 50,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "0.6.12",
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },

};