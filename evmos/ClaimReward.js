require("dotenv").config();
const { exec } = require("child_process");
const { ethers, utils } = require("ethers");
const { web3 } = require("web3");
const  liquidStakingJSON  = require("./artifacts/LiquidStaking_metadata.json");
const pw = process.env.PASSPHRASE;
const cron = require('node-cron');
const addresses = require("./addresses/contractAddress.json");

const provider = new ethers.providers.JsonRpcProvider(process.env.EVMOS_TESTNET_RPC_URL);
const privateKey = process.env.EVMOS_PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);

const contractAddress = addresses.liquidStaking;
const contractABI = liquidStakingJSON.output.abi;

const contractWrite = new ethers.Contract(contractAddress, contractABI, signer);
const contractRead = new ethers.Contract(contractAddress, contractABI, provider);

// contractWrite.updateReward(earned).then((result) => {
//     console.log(result);
// })


console.log("-------------Claim Reward Once per day--------------");

cron.schedule('0 * * * *', function () {
    console.log('update once per hour');
    exec("bash ClaimReward.sh " + pw, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(stdout);
        const txhash = fetchTxhash(stdout);
        setTimeout(() => {
            exec("evmosd query tx --type=hash " + txhash + " --output json", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                const obj = JSON.parse(stdout);
                const earned = parseInt(obj.logs[0].events[0].attributes[1].value);
                console.log(earned);
                if (earned > 0) {
                    contractWrite.updateReward(earned).then((result) => {
                        console.log(result);
                    })
                }
            });
        }, 10000);
    }
);

});

function fetchTxhash(input) {
    let lines = input.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("txhash")) {
            const result = lines[i].split(" ");
            return result[1];
        }
    }
}

// console.log('update once per hour');
//     exec("bash ClaimReward.sh " + pw, (error, stdout, stderr) => {
//         if (error) {
//             console.log(`error: ${error.message}`);
//             return;
//         }
//         if (stderr) {
//             console.log(`stderr: ${stderr}`);
//             return;
//         }
//         console.log(stdout);
//         const txhash = fetchTxhash(stdout);
//         setTimeout(() => {
//             exec("evmosd query tx --type=hash " + txhash + " --output json", (error, stdout, stderr) => {
//                 if (error) {
//                     console.log(`error: ${error.message}`);
//                     return;
//                 }
//                 if (stderr) {
//                     console.log(`stderr: ${stderr}`);
//                     return;
//                 }
//                 const obj = JSON.parse(stdout);
//                 const earned = parseInt(obj.logs[0].events[0].attributes[1].value);
//                 console.log(earned);
//                 if (earned > 0) {
//                     contractWrite.updateReward(earned).then((result) => {
//                         console.log(result);
//                     })
//                 }
//             });
//         }, 10000);
//     }
// );




// exec("bash ClaimReward.sh " + pw, (error, stdout, stderr) => {
//             if (error) {
//                 console.log(`error: ${error.message}`);
//                 return;
//             }
//             if (stderr) {
//                 console.log(`stderr: ${stderr}`);
//                 return;
//             }
//             console.log(stdout);
//             const txhash = fetchTxhash(stdout);
//             setTimeout(() => {
//                 exec("evmosd query tx --type=hash " + txhash + " --output json", (error, stdout, stderr) => {
//                     if (error) {
//                         console.log(`error: ${error.message}`);
//                         return;
//                     }
//                     if (stderr) {
//                         console.log(`stderr: ${stderr}`);
//                         return;
//                     }
//                     const obj = JSON.parse(stdout);
//                     const earned = parseInt(obj.logs[0].events[0].attributes[1].value);
//                     console.log(earned);
//                     if (earned > 0) {
//                         contractWrite.updateReward(earned).then((result) => {
//                             console.log(result);
//                         })
//                     }
//                 });
//             }, 10000);
//         }
// );

// stdout = "sdfabc\nsdf\ntxhash: abcdefs"
// fetchTxhash(stdout);
// console.log(obj.logs[0].events[0].attributes[1].value);