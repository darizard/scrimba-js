export default class ConverterContainer {
    constructor(unitType, elIndex) {
        this.elIndex = elIndex;
        // unit-left and unit-right 
        const unitLeft = new Unit(true, "Metric", this.elIndex);
        const unitRight = new Unit(false, "Imperial", this.elIndex);

        // converter-inputs, which has unit-left and unit-right as children
        const converterInputsEl = this.#generateElement('div', 'converter-inputs');
        converterInputsEl.appendChild(unitLeft);
        converterInputsEl.appendChild(unitRight);

        // unit-type
        const unitTypeEl = this.#generateElement('h3', 'unit-type', unitType);
        unitTypeEl.textContent = unitType;

        // swap-btn
        const swapBtnEl = this.#generateElement('div', 'swap-btn');

        // converter-inputs-container, which has converter-inputs as child
        const converterInputsContainer = this.#generateElement('div', 'converter-inputs-container');
        converterInputsContainer.appendChild(converterInputsEl);
        
        // converter, which has unit-type, swap-btn, and converter-inputs-container as children
        const converterEl = this.#generateElement('div', 'converter');
        converterEl.appendChild(unitTypeEl);
        converterEl.appendChild(swapBtnEl);
        converterEl.appendChild(converterInputsContainer);

        // delete button for converter
        const delConverterBtn = this.#generateElement('div', 'del-converter-btn');
        
        // our converter container, which has the converter as its child
        const rtnVal = this.#generateElement('div', 'converter-container');
        rtnVal.appendChild(converterEl);
        rtnVal.appendChild(delConverterBtn);
        return rtnVal;
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

    constructor(isLeft, unitSystem, elIndex) {
        this.elIndex = elIndex;

        // unit-left-system or unit-right-system
        const unitSystemEl = this.#generateElement('h4', 'unit-left-system', unitSystem);

        // measure-val-input
        const measureValEl = this.#generateElement('input', 'measure-val-input');

        // measure-unit-select
        const measureUnitEl = this.#generateElement('select', 'measure-unit-select');
        
        // unit-widgets, which has measure-val-input and measure-unit-select as children
        const widgetsEl = this.#generateElement('div', 'unit-widgets');
        widgetsEl.appendChild(measureValEl);
        widgetsEl.appendChild(measureUnitEl);
        
        // unit-left or unit-right, which have [unit-left-system || unit-right-system] and unit-widgets as children
        const rtnVal = document.createElement('div');
        if(isLeft){
            rtnVal.id = `unit-left-${this.elIndex}`;
            rtnVal.classList.add('unit');
            rtnVal.classList.add('unit-left');
        } else {
            rtnVal.id = `unit-right-${this.elIndex}`;
            rtnVal.className = `unit`;
        } 
        rtnVal.appendChild(unitSystemEl);
        rtnVal.appendChild(widgetsEl);

        // returns HTMLDivElement object representing the unit-left-{index} or unit-right-{index} div
        return rtnVal;
    }

    #generateElement(elType, elClass, unitSystem = "") {
        const el = document.createElement(elType);
        el.id = `${elClass}-${this.elIndex}`;
        el.className = elClass;
        if(unitSystem) el.textContent = unitSystem;
        return el;
    }
}