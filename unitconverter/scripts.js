import ConverterContainer from './classes/convertercontainer.js';
import ConversionData from './classes/conversiondata.js';

const conversionData = new ConversionData();
const converterContainers = [];
const types = ["Length","Volume","Mass","Temperature"];
const typesEl = document.querySelector("#unit-type-select");
const addBtn = document.querySelector("#add-converter-btn");
const clearBtn = document.querySelector("#clear-converters-btn");
const convAreaEl = document.querySelector("#converters-area");

// let lastUnit;

addBtn.addEventListener("click", createConverter);
clearBtn.addEventListener("dblclick", clearConverters);

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
    const index = getAvailableConvIndex();
    const container = new ConverterContainer(typesEl.value, index);
    container.delBtn.addEventListener("click", deleteConverter);
    container.measure1InputEl.addEventListener("input", curry_convertMeasureChanged(
        container.unit1SelectEl,
        container.unit2SelectEl,
        container.measure2InputEl
    ));
    // container.measure2InputEl.addEventListener("input", curry_convertMeasureChanged(
    //     container.unit2SelectEl,
    //     container.unit1SelectEl,
    //     container.measure1InputEl
    // ));
    // container.unit1SelectEl.addEventListener("focus", function(evt) {
    //     lastUnit = evt.target.value;
    // });
    // container.unit2SelectEl.addEventListener("focus", function(evt) {
    //     lastUnit = evt.target.value;
    // });
    container.unit1SelectEl.addEventListener("change", curry_convertUnitChangedLeft(
        container.measure1InputEl,
        container.unit2SelectEl,
        container.measure2InputEl
    ));
    container.unit2SelectEl.addEventListener("change", curry_convertUnitChangedRight(
        container.measure1InputEl,
        container.unit1SelectEl,
        container.measure2InputEl
    ));
    // push a new value onto the containers array if necessary
    if(index === converterContainers.length) converterContainers.push(container);
    // otherwise use an empty slot
    else converterContainers[index] = container;

    convAreaEl.appendChild(container.el);
}

function getAvailableConvIndex() {
    // check for a null value in the containers array to use
    for(let i = 0; i < converterContainers.length; i++) {
        if(!converterContainers[i]) return i;
    }
    // if not found, use the length of the containers array
    return converterContainers.length;
}

function deleteConverter(evt) {
    // get index of the ConverterContainer to be removed
    // based on the index of the clicked image
    const idTokens = evt.target.id.split('-');
    const idIndex = idTokens[idTokens.length-1];

    // remove element both from DOM and from converterContainers array
    // but only set array entry to null for now
    convAreaEl.removeChild(converterContainers[idIndex].el);
    converterContainers[idIndex] = null;

    // remove trailing nulls from array
    let i = converterContainers.length - 1;
    // important to test null specifically. infinite loop if undefined
    // (i.e. array is empty and i === -1, -2, -3, etc.)
    while(converterContainers[i--] === null) converterContainers.pop();
}

function clearConverters() {
    while(converterContainers.length > 0) converterContainers.pop();
    while(convAreaEl.children.length > 0) convAreaEl.removeChild(convAreaEl.lastChild);
}

function curry_convertMeasureChanged(fromUnitEl, toUnitEl, toMeasureEl) {
    return function convertMeasureChanged(evt) {
        let result = conversionData.convert(fromUnitEl.value, toUnitEl.value, evt.target.value);
        if(result >= 1000000 || result < 0.1) toMeasureEl.value = result.toPrecision(4);
        else toMeasureEl.value = result.toFixed(3);
    }
}

function curry_convertUnitChangedLeft(fromMeasureEl, toUnitEl, toMeasureEl) {
    return function convertUnitChanged(evt) {
        let result = conversionData.convert(evt.target.value, toUnitEl.value, fromMeasureEl.value);
        if(result >= 1000000 || result < 0.1) toMeasureEl.value = result.toPrecision(4);
        else toMeasureEl.value = result.toFixed(3);
    }
}

function curry_convertUnitChangedRight(fromMeasureEl, fromUnitEl, toMeasureEl) {
    return function convertUnitChanged(evt) {
        let result = conversionData.convert(fromUnitEl.value, evt.target.value, fromMeasureEl.value);
        if(result >= 1000000 || result < 0.1) toMeasureEl.value = result.toPrecision(4);
        else toMeasureEl.value = result.toFixed(3);
    }
}