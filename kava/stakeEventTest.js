require("dotenv").config();
const fs = require('fs');
const { exec } = require("child_process");
const { ethers, utils } = require("ethers");
var Web3 = require('web3');

var web3 = new Web3(Web3.givenProvider);

const liquidStakingJSON  = require("./artifacts/LiquidStaking.json");
const stableCoinPoolJSON = require("./artifacts/StableCoinPool.json");

const pw = process.env.PASSPHRASE;
const addresses = require("./addresses/contractAddress.json");

// const web3 = new Web3(window.ethereum);
const kavaProvider = new ethers.providers.JsonRpcProvider(process.env.KAVA_TESTNET_RPC_URL);
const privateKey = process.env.KAVA_PRIVATE_KEY;
const kavaSigner = new ethers.Wallet(privateKey, kavaProvider);

const ethereumProvider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL);
const ethereumSigner = new ethers.Wallet(privateKey, ethereumProvider);
                 
const liquidStakingContractAddress = addresses.liquidStaking;
const liquidStakingContractABI = liquidStakingJSON.output.abi;

const liquidStakingContractWrite = new ethers.Contract(liquidStakingContractAddress, liquidStakingContractABI, kavaSigner);
const liquidStakingContractRead = new ethers.Contract(liquidStakingContractAddress, liquidStakingContractABI, kavaProvider);

const stableCoinPoolContractAddress = addresses.stableTokenPool;
const stableCoinPoolContractABI = stableCoinPoolJSON.output.abi;

const stableCoinPoolContractWrite = new ethers.Contract(stableCoinPoolContractAddress, stableCoinPoolContractABI, ethereumSigner);
const stableCoinPoolContractRead = new ethers.Contract(stableCoinPoolContractAddress, stableCoinPoolContractABI, ethereumProvider);


const getScore = async() => {
    const a = await stableCoinPoolContractRead.totalAddressNumber()
    var valiList = []
    console.log(parseInt(a._hex, 16))
    for(var i=0; i<a; i++){
        const addr = await stableCoinPoolContractRead.addressList(i)
        const valiAddr = await stableCoinPoolContractRead.validatorAddress(addr)
        const balance = await stableCoinPoolContractRead.balanceOf(addr)
        console.log(addr, valiAddr, balance)
        valiList.push([valiAddr, parseInt(balance._hex, 16)/(Math.pow(10,18))])
    }
    return valiList
    
}


module.exports = {getScore}

