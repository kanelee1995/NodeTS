const async = require("async");

let result = '';

const funcOne = (callback) => {
    setTimeout(() => {
        result += 'First ';
        callback(null);
    }, 200);
}

const funcTwo = (callback) => {
    setTimeout(() => {
        result += 'Second ';
        callback(null);
    }, 100);
}

const funcThree = (callback) => {
    setTimeout(() => {
        result += 'Third ';
        callback(null);
    }, 150);
}

async.parallel([funcOne, funcTwo, funcThree], (err, results) => {
    console.log(result);
});

async.series([funcOne, funcTwo, funcThree], (err, results) => {
    console.log(result);
});