const {getScore} = require('./stakeEventTest.js')
let score;
const test = async() => {
    a = await getScore();
    return a;
}
test().then((result) => {
    console.log(result)
})

