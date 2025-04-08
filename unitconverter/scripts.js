import ConverterContainer from './components/convertercontainer.js';
import ConversionData from './data/conversiondata.js';

const conversionData = new ConversionData();
const converterContainers = [];
const types = ["Length","Volume","Mass","Temperature"];
const typesEl = document.querySelector("#unit-type-select");
const addBtn = document.querySelector("#add-converter-btn");
const clearBtn = document.querySelector("#clear-converters-btn");
const convAreaEl = document.querySelector("#converters-area");

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
    // Measurement to be converted is updated
    container.measure1InputEl.addEventListener("input", curry_convertMeasureChanged(container));
    // Source measurement unit is updated
    container.unit1SelectEl.addEventListener("change", curry_convertUnitChangedLeft(container));
    // Destination measurement unit is updated
    container.unit2SelectEl.addEventListener("change", curry_convertUnitChangedRight(container));
    // Source unit system is toggled
    container.system1BtnEl.addEventListener("click", curry_systemChanged(container, true));
    // Destination unit system is toggled
    container.system2BtnEl.addEventListener("click", curry_systemChanged(container, false));
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

// Value of the measurement is updated
function curry_convertMeasureChanged(container) {    
    return function convertMeasureChanged(evt) {
        const toMeasureEl = container.measure2InputEl;
        // Convert to the destination unit
        let result = conversionData.convert(
            container.unit1SelectEl.value,
            container.unit2SelectEl.value,
            evt.target.value
        );
        if(result >= 1000000 || result < 0.1) toMeasureEl.value = result.toPrecision(4);
        else toMeasureEl.value = result.toFixed(3);
    }
}

// Source unit is changed
function curry_convertUnitChangedLeft(container) {
    return function convertUnitChangedLeft(evt) {
        const toMeasureEl = container.measure2InputEl
        // Convert destination measurement based on new unit
        let result = conversionData.convert(
            evt.target.value, 
            container.unit2SelectEl.value, 
            container.measure1InputEl.value
        );
        if(result >= 1000000 || result < 0.1) toMeasureEl.value = result.toPrecision(4);
        else toMeasureEl.value = result.toFixed(3);
    }
}

// Destination unit is changed
function curry_convertUnitChangedRight(container) {
    return function convertUnitChangedRight(evt) {
        const toMeasureEl = container.measure2InputEl;
        // Convert destination measurement based on new unit
        let result = conversionData.convert(
            container.unit1SelectEl.value, 
            evt.target.value, 
            container.measure1InputEl.value
        );
        if(result >= 1000000 || result < 0.1) toMeasureEl.value = result.toPrecision(4);
        else toMeasureEl.value = result.toFixed(3);
    }
}

// Either unit system toggled (imp/met)
function curry_systemChanged(container, isLeft) {
    return function systemChangedLeft(evt) {
        // Update system and units
        const selectToUpdate = isLeft ? container.unit1SelectEl : container.unit2SelectEl;
        const fromSystem = evt.target.textContent;
        const toSystem = fromSystem === "Metric" ? "Imperial" : "Metric";
        evt.target.textContent = toSystem;
        container.repopUnits(toSystem, container.unitTypeEl.textContent, isLeft);
        const baseUnit = conversionData.getBaseUnit(toSystem,container.unitTypeEl.textContent);
        selectToUpdate.value = baseUnit;

        // Convert destination measurement based on new unit
        let result = conversionData.convert(
            container.unit1SelectEl.value,
            container.unit2SelectEl.value,
            container.measure1InputEl.value
        );
        if(result >= 1000000 || result < 0.1) container.measure2InputEl.value = result.toPrecision(4);
        else container.measure2InputEl.value = result.toFixed(3);
    }
}

// Destination unit system toggled (imp/met)
function curry_systemChangedRight() {
    return function systemChangedRight(evt) {
        // Update system and units of right side

    }
}

