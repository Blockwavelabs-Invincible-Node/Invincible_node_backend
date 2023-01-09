import { ethToEvmos, evmosToEth } from '@evmos/address-converter'

// let destination = '0xd9145CCE52D386f254917e481eB44e9943F39138'
// // The address must be bech32 encoded
// if (destination.split('0x').length == 2) {
//     destination = ethToEvmos(destination)
// }
// console.log(destination)
// destination = evmosToEth(destination)
// console.log(destination)
export default function hexToAddress(hexAddress){
    return ethToEvmos(hexAddress)
}
const a = "0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69"
console.log(ethToEvmos(a))
// let evmosDestination = 'evmosvaloper127567uge98th4kgkwgvf7xmz0q0gjunutecz4s'

// if(evmosDestination.split('evmosvaloper').length == 2) {
//     evmosDestination = evmosToEth(evmosDestination)
// }
// console.log("eth destination: ", evmosDestination);