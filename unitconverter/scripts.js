import ConverterContainer from './classes/converter.js';

const types = ["Length","Volume","Mass","Temperature"];
const typesEl = document.querySelector("#unit-type-select");
const addBtn = document.querySelector("#add-converter-btn");
const convAreaEl = document.querySelector("#converters-area");

addBtn.addEventListener("click", createConverter);

populateTypes();
createConverter();

function populateTypes() {
    let typesHTML = "";
    for(let i = 0; i < types.length; i++) {
        typesHTML += `<option value=${types[i]}>${types[i]}</option>`;
    }
    typesEl.innerHTML = typesHTML;
}

function createConverter() {
    const container = new ConverterContainer(typesEl.value, convAreaEl.children.length);
    convAreaEl.appendChild(container);
}

function getAvailableIndex() {
    for(let i = 0; i < convAreaEl.children.length; i++) {
        
    }
    return convAreaEl.children.length;
}