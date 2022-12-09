import { ethToEvmos, evmosToEth } from '@evmos/address-converter'

let destination = '0xd9145CCE52D386f254917e481eB44e9943F39138'
// The address must be bech32 encoded
if (destination.split('0x').length == 2) {
    destination = ethToEvmos(destination)
}
console.log(destination)
destination = evmosToEth(destination)
console.log(destination)
// let evmosDestination = 'evmosvaloper127567uge98th4kgkwgvf7xmz0q0gjunutecz4s'

// if(evmosDestination.split('evmosvaloper').length == 2) {
//     evmosDestination = evmosToEth(evmosDestination)
// }
// console.log("eth destination: ", evmosDestination);