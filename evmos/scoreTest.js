const {getScore} = require('./stakeEventTest.js')
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
const evmosProvider = new ethers.providers.JsonRpcProvider(process.env.EVMOS_TESTNET_RPC_URL);
const privateKey = process.env.EVMOS_PRIVATE_KEY;
const evmosSigner = new ethers.Wallet(privateKey, evmosProvider);

const ethereumProvider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC_URL);
const ethereumSigner = new ethers.Wallet(privateKey, ethereumProvider);
                 
const liquidStakingContractAddress = addresses.liquidStaking;
const liquidStakingContractABI = liquidStakingJSON.output.abi;

const liquidStakingContractWrite = new ethers.Contract(liquidStakingContractAddress, liquidStakingContractABI, evmosSigner);
const liquidStakingContractRead = new ethers.Contract(liquidStakingContractAddress, liquidStakingContractABI, evmosProvider);

const stableCoinPoolContractAddress = addresses.stableTokenPool;
const stableCoinPoolContractABI = stableCoinPoolJSON.output.abi;

const stableCoinPoolContractWrite = new ethers.Contract(stableCoinPoolContractAddress, stableCoinPoolContractABI, ethereumSigner);
const stableCoinPoolContractRead = new ethers.Contract(stableCoinPoolContractAddress, stableCoinPoolContractABI, ethereumProvider);

let score;
const test = async() => {
    a = await getScore();
    return a;
}
test().then((valiList) => {
    
    for (const i in valiList){
        // console.log(valiList[i][0])
        
        exec("bash ValidatorList.sh", (error, stdout, stderr) => {
            if(error){
                console.log(error)
            }

            const addresss = stdout.split("\n")
            
            var isValid = false
            var commision = "00"
            for (const add in addresss){
                
                const varConvertedAdd = addresss[add].slice(1, -6)
                
                commision = addresss[add].slice(-3, -1)
                // console.log(commision)
                // // console.log(varConvertedAdd)
                const con = utils.keccak256(utils.toUtf8Bytes(varConvertedAdd))
                
                if(varConvertedAdd == valiList[i][0]){
                    valiList[i].push(commision)
                    console.log(valiList[i])
                }
            }
        })
        
    }
    console.log(valiList)
})

