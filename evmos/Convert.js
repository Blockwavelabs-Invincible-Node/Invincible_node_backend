// const {ethers, utils} = require('ethers')
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

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
console.log(hex2a('0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69')); // returns '2460'


function a2hex(str) {
    var arr = [];
    for (var i = 0, l = str.length; i < l; i ++) {
      var hex = Number(str.charCodeAt(i)).toString(16);
      arr.push(hex);
    }
    return arr.join('');
  }
  console.log(a2hex('0x3788093420be13d0e3542277de879e760613dbf0c3061679449a7aab8d70eb69')); //returns 32343630