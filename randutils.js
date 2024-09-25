////////  randomness courtesy of bryc https://stackoverflow.com/a/47593316 ///////// 
function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

function sfc32(a, b, c, d) {
    return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

export function randomStr(length, randomness) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Loop to generate characters for the specified length
    for (let i = 0; i < length; i++) {
        const randomInd = Math.floor(randomness() * characters.length);
        result += characters.charAt(randomInd);
    }
    return result;
}

////////////////////////////////////////////////////////////////////////////////


export function shuffledArray(len) {
    let array = [];

    for (let i = 0; i < len; i++) {
        array.push(i);
    }
    for (var i = array.length - 1; i >= 0; i--) {
        var j = randInt(i + 1);
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
let rand = null;
let shuffled = [];

export function initRandom(p) {
    if (!p) {
        const url = new URL(window.location.href);
        p = randomStr(8, Math.random);
        url.searchParams.set('p', p);
        window.history.pushState(p, document.title, url.toString());
    }

    var sfcSeed = cyrb128(p);
    rand = sfc32(sfcSeed[0], sfcSeed[1], sfcSeed[2], sfcSeed[3]);

    shuffled = [];
    for (let i = 0; i < 100; i++) {
        shuffled.push(shuffledArray(i));
    }
}
addEventListener("popstate", () => { window.location.reload(); });

export function pickRandomUnique(array, seed) {
    return array[shuffled[array.length][seed]];
}

export function pickRandom(array, seed) {
    return array[shuffled[99][seed] % array.length];
}

export function sign(seed = null) {
    return pickRandom(['+', '-'], seed ?? randInt(2));
}

export function operation(seed = null) {
    return pickRandom(['+', '-', '*', '/'], seed ?? randInt(4));
}

export function randVariable(seed = null) {
    return pickRandomUnique(['a', 'b', 'c', 'x', 'y', 'z'], seed ?? randInt(6));
}

export function randVariableTerm(maxSize, varRange = null) {
    if (varRange == null)
        varRange = maxSize;
    let size = randInclusive(0, maxSize);
    let group = '';
    for (let i = 0; i < size; i++) {
        group += randVariable(randInt(varRange));
    }
    return group;
}

export function randInclusive(min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return randInt(max - min + 1) + min;
}

export function nonZero(min, max) {
    while (true) {
        let result = randInclusive(min, max);
        if (randInt(3) == 0) // slightly prefer positives
            result = Math.abs(result);
        if (result != 0)
            return result;
    }
}

export function randInt(max) {
    return Math.floor(rand() * max);
}