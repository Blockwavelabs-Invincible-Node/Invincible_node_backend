require("dotenv").config();
const fs = require('fs');
const { exec } = require("child_process");
const { ethers, utils } = require("ethers");
var Web3 = require('web3');
const {getScore} = require('./stakeEventTest.js')

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

// contractRead.owner().then((result) => {
//     console.log(result);
// })
// contractRead.reToken().then( (result) => {
//     console.log(result);
// } )
const test = async() => {
    a = await getScore();
    return a;
}
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
            console.log(result);
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
        // for (const vali of valiList){
        //     const stakeAmount = parseInt(vali[4] * info.value)
        //     console.log(vali[0], stakeAmount)
        //     const {error, stdout, stderr} = await new Promise((resolve, reject) => {
        //         console.log("-=-=-=-=-=-=-=-")
        //         exec("bash ListenStakeEvent.sh " + pw + " " + stakeAmount + " " + vali[0], (error, stdout, stderr) => {
        //             if(error){
        //                 reject(error)
        //             } else {
        //                 resolve({ stdout, stderr })
        //             }
        //         })
        //     })
        //     console.log(stdout)       
        // }
        
        for (const vali in valiList){
            const stakeAmount = parseInt(valiList[vali][4] * info.value)
            console.log(valiList[vali][0], stakeAmount)
            console.log(123)
            setTimeout(() => {
                exec("bash ListenStakeEvent.sh " + pw + " " + stakeAmount + " " + valiList[vali][0], (error, stdout, stderr) => {
                    console.log(stdout)
                    //밸리주소 마다 스테이킹 된 물량 json에 저장
                })
            }, 10000*vali)
            
        }
        
    })
});



// const txhash = fetchTxhash(stdout);
// console.log(txhash);
// setTimeout(() => {
//     exec("evmosd query tx --type=hash " + txhash + " --output json", (error, stdout, stderr) => {
//         if (error) {
//             console.log(`error: ${error.message}`);
//             return;
//         }
//         if (stderr) {
//             console.log(`stderr: ${stderr}`);
//             return;
//         }
//         const obj = JSON.parse(stdout);
//         console.log(obj);
//     });
// }, 10000);
// function fetchTxhash(input) {
//     let lines = input.split("\n");
//     for (let i = 0; i < lines.length; i++) {
//         if (lines[i].includes("txhash")) {
//             const result = lines[i].split(" ");
//             return result[1];
//         }
//     }
// }


// web3.eth.sendTransaction({
//     from: account,
//     to: liquidStakingContractAddress,
//     value: realAmount
// })

// filter = {
//     address: contractAddress,
//     topics: [
//         // the name of the event, parnetheses containing the data type of each event, no spaces
//         utils.id("Received(address)")
//     ]
// }

// provider.on("Transfer", (to, amount, from) => {
//     console.log(to, amount, from);
// });

// provider.on(filter, () => {
//     // do whatever you want here
//     // I'm pretty sure this returns a promise, so don't forget to resolve it
//     console.log(filter)
// })

