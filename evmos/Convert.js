const {ethers, utils} = require('ethers')
// console.log(utils.arrayify("0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69"))
// b=utils.formatBytes32String("0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69")
// console.log(b)
// a = utils.arrayify("0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69")
// console.log(typeof(a))
// var string = new TextDecoder('utf-8').decode(uint8array);
// console.log(string)
// console.log(String.fromCharCode.apply(null, a));

var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider);


//evmosvaloper127567uge98th4kgkwgvf7xmz0q0gjunutecz4s
//0x0000000000000000000000000000000000000000000000000000000000000000
//0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69
const hex = '0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69';
const int = parseInt(hex, 16);
const str = int.toString();

console.log(str);  // Output: "18446744073709551615"

const temp = web3.utils.utf8ToHex('evmos');
console.log(temp);
//0x49206861766520313030e282ac
console.log(ethers.utils.base58.encode("0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69"))
console.log(utils.toUtf8Bytes("evmosvaloper127567uge98th4kgkwgvf7xmz0q0gjunutecz4s"));
console.log(utils.keccak256(utils.toUtf8Bytes("evmosvaloper127567uge98th4kgkwgvf7xmz0q0gjunutecz4s")))
console.log(utils.id("evmosvaloper127567uge98th4kgkwgvf7xmz0q0gjunutecz4s"))