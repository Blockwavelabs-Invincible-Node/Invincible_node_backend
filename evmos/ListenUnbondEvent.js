require("dotenv").config();
const { exec } = require("child_process");
const { ethers, utils } = require("ethers");
const { web3 } = require("web3");



const  liquidStakingJSON  = require("./artifacts/LiquidStaking.json");
const addresses = require("./addresses/contractAddress.json");
const pw = process.env.PASSPHRASE;

// const web3 = new Web3(window.ethereum);
const provider = new ethers.providers.JsonRpcProvider(process.env.EVMOS_TESTNET_RPC_URL);
const privateKey = process.env.EVMOS_PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);
const validator = process.env.VALIDATOR;

const contractAddress = addresses.liquidStaking;
const contractABI = liquidStakingJSON.output.abi;

const contractWrite = new ethers.Contract(contractAddress, contractABI, signer);
const contractRead = new ethers.Contract(contractAddress, contractABI, provider);

// contractRead.owner().then((result) => {
//     console.log(result);
// })
// contractRead.reToken().then( (result) => {
//     console.log(result);
// } )

console.log("-------------Listening to Unbond Event--------------");

// // listen to transfer event
contractRead.on("Unbond", (src, val, event) => {
    let info = {
        from: src,
        value: ethers.utils.formatUnits(val, 0),
        data: event,
    }

    console.log("Sender: ", info.from);
    console.log("Value: ", info.value);

    
    exec("bash ListenUnbondEvent.sh " + pw + " " + info.value + " " + validator, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        console.log(stdout);
        const unbondResult = JSON.parse(stdout);
        const txhash = unbondResult.txhash;
        console.log(txhash);
        setTimeout(() => {
            exec("bash BankSend.sh " + pw, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(stdout);
            });
            //일주일 후 실행
        }, 604800000);
    });
});


