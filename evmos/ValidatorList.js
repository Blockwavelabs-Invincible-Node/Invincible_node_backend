const {exec} = require('child_process')
const checkAddress = "evmosvaloper127567uge98th4kgkwgvf7xmz0q0gjunutecz4s"
const checkConAdd = "0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69"
const {ethers, utils} = require("ethers")
exec("bash ValidatorList.sh", (error, stdout, stderr) => {
    if(error){
        console.log(error)
    }
    // console.log(stdout)
    console.log(stdout[1])
    console.log(stdout[23])
    const addresss = stdout.split("\n")
    // console.log(addresss)
    for (const add in addresss){
        
        const varConvertedAdd = addresss[add].slice(3, -3)
        // console.log(varConvertedAdd)
        const con = utils.keccak256(utils.toUtf8Bytes(varConvertedAdd))
        // console.log(con)
        if(con == checkConAdd){
            console.log(con)
        }
    }
    
})