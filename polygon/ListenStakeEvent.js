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
const polygonProvider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL);
const privateKey = process.env.POLYGON_PRIVATE_KEY;
const polygonSigner = new ethers.Wallet(privateKey, polygonProvider);

const ethereumProvider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL);
const ethereumSigner = new ethers.Wallet(privateKey, ethereumProvider);
                 
const liquidStakingContractAddress = addresses.liquidStaking;
const liquidStakingContractABI = liquidStakingJSON.output.abi;

const liquidStakingContractWrite = new ethers.Contract(liquidStakingContractAddress, liquidStakingContractABI, polygonSigner);
const liquidStakingContractRead = new ethers.Contract(liquidStakingContractAddress, liquidStakingContractABI, polygonProvider);

const stableCoinPoolContractAddress = addresses.stableTokenPool;
const stableCoinPoolContractABI = stableCoinPoolJSON.output.abi;

const stableCoinPoolContractWrite = new ethers.Contract(stableCoinPoolContractAddress, stableCoinPoolContractABI, ethereumSigner);
const stableCoinPoolContractRead = new ethers.Contract(stableCoinPoolContractAddress, stableCoinPoolContractABI, ethereumProvider);

// contractRead.owner().then((result) => {
//     console.log(result);
// })
// contractRead.reToken().then( (result) => {
//     console.log(result);
// } )

console.log("-------------Listening to Contract Event--------------");

// listen to transfer event
liquidStakingContractRead.on("Transfer", (src, dst, val, stableAmount, event) => {
    let info = {
        from: src,
        to: dst,
        value: ethers.utils.formatUnits(val, 0),
        stable: stableAmount,
        data: event,
    }

    console.log("Sender: ", info.from);
    console.log("Receiver: ", info.to),
    console.log("Value: ", info.value);
    console.log("Stable Amount: ", info.stable);
    try{
    const stableAmountNumber = web3.utils.hexToNumber(info.stable);
    console.log("Stable Amount Number: ", stableAmountNumber);
    try{
        stableCoinPoolContractWrite.sendStableToken(info.from, stableAmountNumber).then((result) => {
            console.log(`send complete: ${result}`);
        });
        }catch(error){
            console.log(error+'sendStableToken');
        }
    } catch(error){
        console.log(error + 'hex To number error');
    }
    try{
    stableCoinPoolContractWrite.owner().then((result) => {
        console.log("writer: ", result);
    })
    } catch(error){
        console.log(error+'owner');
    }

})
