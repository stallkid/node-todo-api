const _ = require('lodash');
var text = 'text';
var test = () => {
    console.log('teste');
}

_.delay(function (text) {
    console.log(text);
}, 2000, 'later');

var arrayTest = {'1': '1', '2': 2, '3': 3, '4': '4'};

var testPick = _.pick(arrayTest, ['1', '4'])

var testIsNumber = _.pickBy(arrayTest, _.isNumber);

console.log(testPick);
console.log(testIsNumber);
