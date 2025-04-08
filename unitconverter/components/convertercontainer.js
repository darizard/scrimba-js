import ConversionData from "../data/conversiondata.js";
const conversionData = new ConversionData();

export default class ConverterContainer {
    el;
    elIndex;
    delBtn;
    unitTypeEl;
    measure1InputEl;
    unit1SelectEl;
    system1BtnEl;
    measure2InputEl;
    unit2SelectEl;
    system2BtnEl;

    constructor(unitType, elIndex) {
        this.elIndex = elIndex;
        this.el = this.#generateElement('div', 'converter-container');

        // unit-left and unit-right
        const unitLeft = new Unit(true, "Metric", unitType, this.elIndex);
        this.measure1InputEl = unitLeft.measureInputEl;
        this.unit1SelectEl = unitLeft.unitSelectEl;
        this.system1BtnEl = unitLeft.systemBtnEl;

        const rightArrowIconEl = this.#generateElement('div', 'right-arrow');

        const unitRight = new Unit(false, "Imperial", unitType, this.elIndex);
        this.measure2InputEl = unitRight.measureInputEl;
        this.unit2SelectEl = unitRight.unitSelectEl;
        this.system2BtnEl = unitRight.systemBtnEl;

        // converter-inputs, which has unit-left and unit-right as children
        const converterInputsEl = this.#generateElement('div', 'converter-inputs');
        converterInputsEl.appendChild(unitLeft.el);
        converterInputsEl.appendChild(rightArrowIconEl);
        converterInputsEl.appendChild(unitRight.el);

        // unit-type
        this.unitTypeEl = this.#generateElement('h3', 'unit-type', unitType);
        this.unitTypeEl.textContent = unitType;

        // converter-inputs-container, which has converter-inputs as child
        const converterInputsContainer = this.#generateElement('div', 'converter-inputs-container');
        converterInputsContainer.appendChild(converterInputsEl);
        
        // converter, which has unit-type, swap-btn, and converter-inputs-container as children
        const converterEl = this.#generateElement('div', 'converter');
        converterEl.appendChild(this.unitTypeEl);
        converterEl.appendChild(converterInputsContainer);

        // delete button for converter
        const delConverterBtn = this.#generateElement('div', 'del-converter-btn');
        this.delBtn = delConverterBtn;
        
        // our converter container, which has the converter as its child
        const rtnVal = this.#generateElement('div', 'converter-container');
        this.el.appendChild(converterEl);
        this.el.appendChild(delConverterBtn);
    }

    repopUnits(system, type, isLeft) {
        system = system.toLowerCase();
        type = type.toLowerCase();

        const selectEl = isLeft ? this.unit1SelectEl : this.unit2SelectEl;
        while(selectEl.children.length > 0) selectEl.removeChild(selectEl.lastChild);
        for(let unit of conversionData.getUnitsArray(system,type)) {
            let unitOptionEl = document.createElement('option');
            unitOptionEl.value = unit;
            unitOptionEl.innerHTML = unit;
            selectEl.appendChild(unitOptionEl);
        }
    }
    
    #generateElement(elType, elClass, unitType = "") {
        const el = document.createElement(elType);
        el.id = `${elClass}-${this.elIndex}`;
        el.className = elClass;
        if(unitType) el.textContent = unitType;
        return el;
    }
}

class Unit {
    el;
    measureInputEl;
    unitSelectEl;
    systemBtnEl;

    constructor(isLeft, unitSystem, unitType, elIndex) {
        let lr = isLeft ? 'left' : 'right';

        this.elIndex = elIndex;

        // unit-left-system or unit-right-system
        const unitSystemEl = this.#generateElement('button', `unit-system-btn-${lr}`, 'unit-system-btn', unitSystem);
        this.systemBtnEl = unitSystemEl;

        // measure-val-input
        const measureValEl = this.#generateElement('input', `measure-val-input-${lr}`, 'measure-val-input');
        measureValEl.value = 0;
        if(!isLeft) {
            measureValEl.readOnly = true;
            measureValEl.disabled = true;
        } 
        this.measureInputEl = measureValEl;

        // measure-unit-select
        const measureUnitEl = this.#generateElement('select', `measure-unit-select-${lr}`);
        for(let unit of conversionData.getUnitsArray(unitSystem.toLowerCase(), unitType.toLowerCase())) {
            let unitOptionEl = document.createElement('option');
            unitOptionEl.value = unit;
            unitOptionEl.innerHTML = unit;
            measureUnitEl.appendChild(unitOptionEl);
        }
        
        this.unitSelectEl = measureUnitEl;
        
        // unit-widgets, which has measure-val-input and measure-unit-select as children
        const widgetsEl = this.#generateElement('div', `unit-widgets-${lr}`, 'unit-widgets');
        widgetsEl.appendChild(measureValEl);
        widgetsEl.appendChild(measureUnitEl);
        
        // unit-left or unit-right, which have [unit-left-system || unit-right-system] and unit-widgets as children
        this.el = document.createElement('div');
        if(isLeft){
            this.el.id = `unit-left-${this.elIndex}`;
            this.el.classList.add('unit');
        } else {
            this.el.id = `unit-right-${this.elIndex}`;
            this.el.className = `unit`;
        }
        this.el.appendChild(unitSystemEl);
        this.el.appendChild(widgetsEl);
    }

    #generateElement(elType, elID, elClass, unitSystem = "") {
        const el = document.createElement(elType);
        el.id = `${elID}-${this.elIndex}`;
        el.className = elClass;
        if(unitSystem) el.textContent = unitSystem;
        return el;
    }
}