const {ethers, utils} = require('ethers')
const evmos = require('evmosjs')
// console.log(utils.arrayify("0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69"))
// const a = new TextEncoder().encode("evmosvaloper127567uge98th4kgkwgvf7xmz0q0gjunutecz4s")
// const b = new TextDecoder().decode(a)
// console.log(b)
const address = "evmosvaloper127567uge98th4kgkwgvf7xmz0q0gjunutecz4s"
const address1 = "0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69"
console.log(utils.isAddress(address1))
// console.log(evmos.addressConverter.eth(address))
console.log(utils.id(address))
// b=utils.formatBytes32String("0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69")
// console.log(b)
// a = utils.arrayify("0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69")
// console.log(typeof(a))
// var string = new TextDecoder('utf-8').decode(uint8array);
// console.log(string)
// console.log(String.fromCharCode.apply(null, a))