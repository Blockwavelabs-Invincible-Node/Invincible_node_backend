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

var valiInfo = new Array()
// function getScore(){
//     stableCoinPoolContractRead.totalAddressNumber().then((result) => {
//         validatorNumber = parseInt(result._hex, 16)
    
//         for(var i = 0; i<validatorNumber; i++){
//             stableCoinPoolContractRead.addressList(i).then((addr) => {
//                 console.log(addr, i)
//                 stableCoinPoolContractRead.validatorAddress(addr).then((valiAddr) => {
//                     console.log(valiAddr, addr)
//                     stableCoinPoolContractRead.balanceOf(addr).then((balance) => {
//                         console.log(parseInt(balance._hex, 16), addr)
//                     })
//                 })
//             })
//             console.log(i)
//         }
//         // stableCoinPoolContractRead.addressList()
        
//         // for (const i in result){
//         //     liquidStakingContractRead.addressList(i).then((result) => {
//         //         console.log(result)
//         //     })
//         // }
// })
// }
// getScore()

const getScore = async() => {
    const a = await stableCoinPoolContractRead.totalAddressNumber()
    var valiList = []
    console.log(parseInt(a._hex, 16))
    for(var i=0; i<a; i++){
        const addr = await stableCoinPoolContractRead.addressList(i)
        const valiAddr = await stableCoinPoolContractRead.validatorAddress(addr)
        const balance = await stableCoinPoolContractRead.balanceOf(addr)
        console.log(addr, valiAddr, balance)
        valiList.push([valiAddr, balance])
    }
    return valiList
    
}

// getScore().then((valiList) => {
//     console.log(valiList)
//     for (const i in valiList){
//         // console.log(valiList[i][0])
//         exec("bash ValidatorList.sh", (error, stdout, stderr) => {
//             if(error){
//                 console.log(error)
//             }
//             const addresss = stdout.split("\n")
//             // console.log(addresss)
//             var isValid = false
//             var commision = "00"
//             for (const add in addresss){
                
//                 const varConvertedAdd = addresss[add].slice(1, -6)
                
//                 commision = addresss[add].slice(-3, -1)
//                 // console.log(commision)
//                 // // console.log(varConvertedAdd)
//                 const con = utils.keccak256(utils.toUtf8Bytes(varConvertedAdd))
//                 // console.log(con)
//                 if(con == valiList[i][0]){
//                     valiList[i].push(commision)
//                     console.log(commision)
//                 }
//             }
//         })
//     }
// })
module.exports = {getScore}

// getScore()
//totalAddressNumber, addressList -> num, validatorAddress, balanceOf