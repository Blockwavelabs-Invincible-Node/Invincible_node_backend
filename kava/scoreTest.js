const {getScore} = require('./stakeEventTest.js')
require("dotenv").config();
const fs = require('fs');
const { exec } = require("child_process");
const { ethers, utils } = require("ethers");
const async = require('async')
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

let score;
const test = async() => {
    a = await getScore();
    return a;
}


test().then(async(valiList) => {
    for (const vali of valiList){
        const {error, stdout, stderr} = await new Promise((resolve, reject) => {
            exec("bash ValidatorList.sh", (error, stdout, stderr) => {
                if(error){
                    reject(error)
                } else {
                    resolve({ stdout, stderr })
                }
            })
        })

        if(error){
            console.error(`exec error: {error}`)
        }
        const addresss = stdout.split("\n")
        var commission = "00"
        for (const add of addresss){
            const varConvertedAdd = add.slice(1,-6)
            commission = add.slice(-3, -1)
            if(varConvertedAdd == vali[0]){
                vali.push(commission)
            }

        }
    }
    console.log(valiList)
    var totalScore = 0
    for(const vali of valiList){
        var valiScore = vali[1] * (100 - parseInt(vali[2])) / 100
        console.log(valiScore)
        vali.push(valiScore)
        totalScore += valiScore
    }
    console.log(totalScore)
    for (const vali of valiList){
        var valiPercent = vali[3] / totalScore
        vali.push(valiPercent)
    }
    console.log(valiList)
})
