/* eslint-disable no-continue */

function fuzzyMatch(input, match) {
    const [iLen, mLen] = [input.length, match.length];
    const matrix = [];

    for (let i = 0; i <= iLen; i++) {
        if (i === 0) {
            matrix[i] = [...Array(mLen + 1).keys()];
            continue;
        }

        matrix[i] = [0];
    }

    for (let i = 1; i <= iLen; i++) {
        const iChar = input[i - 1];

        for (let j = 1; j <= mLen; j++) {
            const jChar = match[j - 1];
            const cost = iChar === jChar ? 0 : 1;
            matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
        }
    }

    const dist = matrix[iLen][mLen];
    const maxLen = Math.max(iLen, mLen);
    const scaledDist = (maxLen - dist) / maxLen;

    return scaledDist;
}

module.exports = {
    fuzzyMatch,
};
