

// export function setDecimalsLength(lastRate) {
//     var int_part = Math.trunc(lastRate); // returns 3
//     var float_part = Number((lastRate - int_part).toFixed(8)); // return 0.2
//     return float_part.toString().length > 2 ? float_part.toString().length - 2 : 0;
// }


const decimalSetting = [
    { start: 0, end: 0, rateDecimals: 2, quantityDecimals: 6 },
    { start: 1, end: 2, rateDecimals: 6, quantityDecimals: 3 },
    { start: 3, end: 4, rateDecimals: 8, quantityDecimals: 2 },
    { start: 5, end: 8, rateDecimals: 8, quantityDecimals: 2 },
];

function getZeros(lastRate) {
    var int_part = Math.trunc(lastRate); // returns 3
    let float_part = (lastRate - int_part).toFixed(8); // return 0.2

    var float_part_str = float_part.toString();

    var countZero = 0;

    for (var i = 0; i < float_part_str.length; i++) {
        if (float_part_str[i] === "0" && float_part_str[i] !== '.') {

            countZero++

        }
        if (float_part_str[i] > "0") {
            break;

        }


    }
    return countZero - 1;
}

export function setDecimalsLength(lastRate) {
    const countZero = getZeros(lastRate);
    const obj = decimalSetting.find(o => o.start <= countZero && o.end >= countZero);
    return obj;
}