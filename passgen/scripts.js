let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~`!@#$%^&*()_-+={[}]:;<,>.?";
let iters = 15;

function clampLen() {
    let lenEl = document.querySelector("#pw-length");
    if(parseInt(lenEl.value) < 8) lenEl.value = 8;
    else if(parseInt(lenEl.value) > 15) lenEl.value = 15;
    iters = lenEl.value;
}

function renderPasswords() {
    let pwEls = [document.querySelector("#pw1-el"), document.querySelector("#pw2-el")];
    let passwords = generatePasswords();

    for(let i = 0; i < pwEls.length; i++) {
        pwEls[i].textContent = passwords[i];
    }
}

function generatePasswords() {
    pw1 = "";
    pw2 = "";
    for(let i = 0; i < iters; i++) {
        let index = Math.floor(Math.random() * chars.length);
        pw1 += chars.charAt(index);
        index = Math.floor(Math.random() * chars.length);
        pw2 += chars.charAt(index);
    }
    return [pw1, pw2];
}

function copyPassword(elImg,elID) {
    let copyText = document.querySelector(`#${elID}`).textContent;
    navigator.clipboard.writeText(copyText);

    let imgRect = elImg.getBoundingClientRect();
    let notifEl = document.querySelector("#copied-notif");
    let left = imgRect.right - imgRect.width / 2;
    let top = imgRect.top - imgRect.height / 2;

    showAndFade(notifEl, left, top);
    
}

function showAndFade(element, left, top) {
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.style.display = "block";
    let op = 1;
    let timer = setInterval(function () {
        if(op < 0.1) {
            clearInterval(timer);
            element.style.display = "none";
        }
        element.style.opacity = op;
        element.style.filter = `alpha(opacity=${op * 100}")"`;
        op -= op * 0.1;
    }, 25); 
}