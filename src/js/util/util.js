function rgbToHex(r, g, b) {
    function constrain(x) {
        return Math.min(255, Math.max(0, Math.round(x)));
    }
    return "#" + ((1 << 24) + (constrain(r) << 16) + (constrain(g) << 8) + constrain(b)).toString(16).slice(1);
}

export default rgbToHex;
