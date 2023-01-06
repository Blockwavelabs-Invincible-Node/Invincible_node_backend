require("dotenv").config();
const fs = require('fs');
const { exec } = require("child_process");
const { ethers, utils } = require("ethers");
const crypto = require('crypto')

var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider);



const liquidStakingJSON  = require("./artifacts/LiquidStaking.json");
const stableCoinPoolJSON = require("./artifacts/StableCoinPool.json");

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

console.log("-------------Listening to Validator Check Event--------------");

//컨트랙트에 listen 하면서 vaidator address get
liquidStakingContractRead.on("UpdateRequest", (validatorAddress, event) => {
    
    // let info = {
    //     address: utils.getIcapAddress(validatorAddress.hash),
    //     data: event,
    // }
    var isValidAddress = false
    var originAddress = ""
    exec("bash ValidatorCheck.sh", (error, stdout, stderr) => {
        if(error){
            console.log(error)
        }
        //전체 밸리데이터 주소 문자열을 하나하나씩 나눔
        const addressList = stdout.split("\n")
        // console.log(validatorAddress)
        // console.log()
        for (const addr in addressList){
            //앞뒤에 붙어있는 불필요한 문자열 제거
            const parsedAddress = addressList[addr].slice(3, -3)
            //파싱된 문자열을 hex값으로 변환
            const convertedAddress = utils.keccak256(utils.toUtf8Bytes(parsedAddress))
            // console.log(convertedAddress)
            //컨트랙트를 통해 들어온 hex값과 변환된 밸리 주소의 hex값 비교
            if(convertedAddress == validatorAddress.hash){
                originAddress = parsedAddress
                console.log()
                console.log(convertedAddress)
                console.log()
                isValidAddress = true
            }
        }
        console.log()
        console.log(isValidAddress)
        if(isValidAddress){
            liquidStakingContractWrite.setValidatorAddress(originAddress, 1).then((result) => {
                console.log(result)
            })
        }
        
    })
    
    
    
    
    // console.log("Validator Address: ", info.address);
    // exec("bash ValidatorCheck.sh " + info.address, (error, stdout, stderr) => {
    //     if(error){
    //         //invalid 한 validator address면 error 발생되므로 여기에 걸림
    //         //이때는 숫자 2를 liquid-staking contract에 보내줌
    //         console.log(error.message)
    //         console.log(2);
    //         return;
    //     }
    //     //valid한 address일떄 여기에 걸림
    //     //숫자 1을 liquid-staking contract에 보내줌
    //     console.log(stdout)
    //     console.log(typeof(stdout))
    // })
   
    
});



// const { ethers, utils } = require("ethers");
// // const value = utils.hexValue("0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69");
// // console.log(value);
// // console.log(parseInt(("0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69")))
// // // console.log(hash.digest("0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69"))

// // console.log(web3.utils.hexToBytes(value));

// var uint8array = new TextEncoder().encode("¢");
// console.log(uint8array)
// a = utils.arrayify("0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69")
// var string = new TextDecoder().decode(a);
// console.log(string)
