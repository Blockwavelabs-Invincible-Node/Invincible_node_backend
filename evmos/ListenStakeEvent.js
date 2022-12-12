require("dotenv").config();
const fs = require('fs');
const { exec } = require("child_process");
const { ethers, utils } = require("ethers");
const liquidStakingJSON  = require("./artifacts/LiquidStaking_metadata.json");
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

console.log("-------------Listening to Contract Event--------------");

// listen to transfer event
liquidStakingContractRead.on("Transfer", (src, dst, val, event) => {
    let info = {
        from: src,
        to: dst,
        value: ethers.utils.formatUnits(val, 0),
        data: event,
    }

    console.log("Sender: ", info.from);
    console.log("Receiver: ", info.to),
    console.log("Value: ", info.value);

    stableCoinPoolContractWrite.owner().then((result) => {
        console.log("writer: ", result);
    })

    stableCoinPoolContractWrite.owner().then((result) => {
        console.log("writer: ", result);
    })

    stableCoinPoolContractWrite.sendStableToken(info.from, 1000).then((result) => {
        console.log(result);
    });

    // exec("bash ListenStakeEvent.sh " + pw + " " + info.value, (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     obj1 = Object.assign({Sender:info.from, Receiver:info.to, Value:info.value}, JSON.parse(stdout));
    //     console.log(typeof obj1, obj1);
    //     const file = fs.readFileSync('stake-log.json')
    //     const currentTime = new Date()
    //     const inputData = {};
    //     inputData[currentTime] = obj1
    //     const exsistData = JSON.parse(file.toString())
    //     console.log(exsistData, typeof exsistData)
    //     obj2 = Object.assign(exsistData, inputData)
    //     fs.writeFileSync('stake-log.json', JSON.stringify(obj2))

    //     // send stable coin to receiver
    //     stableCoinPoolContractWrite.sendStableToken(info.from, 1000).then((result) => {
    //         console.log(result);
    //     });
    // })
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

