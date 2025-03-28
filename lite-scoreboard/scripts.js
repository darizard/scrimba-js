let homescore = 0;
let guestscore = 0;

function addhome(numToAdd) {
    homescore += numToAdd;
    document.getElementById("homescore").textContent = homescore;
}

function addguest(numToAdd) {
    guestscore += numToAdd;
    document.getElementById("guestscore").textContent = guestscore;
}