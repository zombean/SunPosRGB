const {pClock} = require("PigeonClock");

let colors;

function hexUse(colors_to_use) {    
    colors = colors_to_use.sort((a,b)=>a.start-b.start);
}

function hexNow(time = new Date()) {
    const pclk = pClock(time);


    let start, next;
    let startPos, nextPos;
    let assignNext = false;
    for(const color of colors) {
        if(globalThis?.debug) console.log(color);

        if(assignNext) {
            if(globalThis?.debug) console.log("assignNext", color.color);
            assignNext = false;
            next = color.color;
            nextPos = color.start;
        }

        if(pclk >= color.start || pclk >= color?.end) {
            if(globalThis?.debug) console.log("assign", color.color);
            assignNext = true;
            start = color.color;
            startPos = color.start;
            if(color.end) {
                assignNext = false;
                if(globalThis?.debug) console.log("end", color.color);
                next = color.color;
                nextPos = color.end;
            }
        }
    }

    if(assignNext) {
        next = colors[0].color;
        nextPos = colors[0].start;
    }

    if(globalThis?.debug) {
        console.log("start", start);
        console.log("next", next);
        console.log("startPos", startPos);
        console.log("nextPos", nextPos);
        console.log("pclk", pclk);
    }

    return hex_gradient(start, next, startPos, nextPos, pclk);
}

function hex_gradient(startHex, endHex, startPos, endPos, currentPos) {

    if(startHex==undefined || endHex==undefined || startPos==undefined || endPos==undefined || currentPos==undefined) return '#0000E1'

    if(startPos === endPos) return startHex;
    // Convert hexadecimal color strings to integers
    startHex = startHex.replace('#', '');
    endHex = endHex.replace('#', '');

    if(endPos <= startPos) {
        if(globalThis?.debug) console.log("Adjusting positions...");
        endPos += 2;
        if(globalThis?.debug) console.log("endPos:", endPos);
        if(currentPos <= startPos) {
            currentPos += 2;
            if(globalThis?.debug) console.log("currentPos:", currentPos);
        }
    }

    const startColor = {
        R:parseInt(startHex.slice(0, 2), 16),
        G:parseInt(startHex.slice(2, 4), 16),
        B:parseInt(startHex.slice(4, 6), 16),
    };
    const endColor = {
        R:parseInt(endHex.slice(0, 2), 16),
        G:parseInt(endHex.slice(2, 4), 16),
        B:parseInt(endHex.slice(4, 6), 16),
    };
    const phase = (currentPos - startPos) / (endPos - startPos);
    // Calculate the interpolated color
    let hexCode = "#";
    for(const C in startColor) {
        const sc = startColor[C], ec = endColor[C];
        const fc = sc - ((sc-ec) * phase);
        hexCode += Math.round(fc).toString(16).toUpperCase().padStart(2, '0');
    }
    return hexCode;
}

module.exports = { hexNow, hexUse, pClock }