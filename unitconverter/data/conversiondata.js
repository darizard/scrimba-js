export default class ConversionData {
    /* each of fromUnit and toUnit is the abbreviation of the unit of measurement
    measure is the source value being converted */
    convert(fromUnit, toUnit, measure) {
        // unit into vars: [system,type]
        let fromUnitInfo = this.#getUnitInfo(fromUnit);
        let toUnitInfo = this.#getUnitInfo(toUnit);
        
        // convert into base unit type
        let result = measure * this.#baseFactors[fromUnitInfo[1]][fromUnitInfo[0]][fromUnit];
        
        // if changing systems, convert between base units.
        // temperatures need +/- operations as well
        if(fromUnitInfo[0] != toUnitInfo[0]) {
            if(fromUnitInfo[0] === "imperial"){
                if(fromUnitInfo[1] === "temperature") result -= 32;
                result *= this.#systemFactors[fromUnitInfo[1]];
                if(fromUnitInfo[1] === "temperature" && toUnit == "K") result += 273.15;
            } 
            else {
                if(fromUnitInfo[1] === "temperature" && fromUnit == "K") result -= 273.15;
                result /= this.#systemFactors[fromUnitInfo[1]];
                if(toUnitInfo[1] ==="temperature") result += 32;
            }
        }
        
        // convert to destination unit and return
        result /= this.#baseFactors[toUnitInfo[1]][toUnitInfo[0]][toUnit];
        return result;
    }

    convertSystem(fromSystem, unitType, fromUnit, measure) {
        fromSystem = fromSystem.toLowerCase();
        const toSystem = fromSystem === "metric" ? "imperial" : "metric";
        unitType = unitType.toLowerCase();
        return this.convert(
            fromUnit,
            this.getBaseUnit(toSystem, unitType),
            measure
        );
    }

    getUnitsArray(unitSystem, unitType) {
        unitSystem = unitSystem.toLowerCase();
        unitType = unitType.toLowerCase();
        return Object.keys(this.#baseFactors[unitType][unitSystem]);
    }

    getBaseUnit(unitSystem, unitType) {
        unitSystem = unitSystem.toLowerCase();
        unitType = unitType.toLowerCase();
        return this.#baseUnits[unitType][unitSystem];
    }

    #baseUnits = {
        length: {
            imperial: "in",
            metric: "m"
        },
        mass: {
            imperial: "lb",
            metric: "g"
        },
        temperature: {
            imperial: "F",
            metric: "C"
        },
        volume: {
            imperial: "tsp",
            metric: "L"
        }
    }

    #baseFactors = {
        length: {
            imperial: {
                "in": 1, // base
                "ft": 12,
                "yd": 36,
                "mi": 63360
            },
            metric: {
                "mm": 0.001,
                "cm": 0.01,
                "m": 1, // base
                "km": 1000
            }
        },
        mass: {
            imperial: {
                "oz": 0.0625,
                "lb": 1, // base
                "ton": 2000
            },
            metric: {
                "mg": 0.001,
                "g": 1, // base
                "kg": 1000
            }
        },
        temperature: {
            imperial: {
                "F": 1 // base
            },
            metric: {
                "C": 1, // base
                "K": 1
            }
        },
        volume: {
            imperial: {
                "tsp": 1, // base
                "tbsp": 3,
                "fl oz": 6,
                "cup": 48,
                "pt": 96,
                "qt": 192,
                "gal": 768
            },
            metric: {
                "mL": 0.001,
                "L": 1, // base
                "m3": 1000
            }
        }
    };

    // imperial-to-metric factors
    // imperial to metric: multiply
    // metric to imperial: divide
    #systemFactors = {
        // in to m
        length: 0.0254,
        // lb to g
        mass: 453.592368,
        // f to c
        temperature: 0.555556,
        // tsp to l
        volume: 0.00492892
    };

    #getUnitInfo(unit) {
        // returns [system, type]
        if(unit in this.#baseFactors.length.imperial) return ["imperial","length"];
        else if (unit in this.#baseFactors.length.metric) return ["metric","length"];
        else if (unit in this.#baseFactors.mass.imperial) return ["imperial","mass"];
        else if (unit in this.#baseFactors.mass.metric) return ["metric","mass"];
        else if (unit in this.#baseFactors.temperature.imperial) return ["imperial","temperature"]
        else if (unit in this.#baseFactors.temperature.metric) return ["metric","temperature"];
        else if (unit in this.#baseFactors.volume.imperial) return ["imperial","volume"];
        else if (unit in this.#baseFactors.volume.metric) return ["metric","volume"];        
        else return ["invalid","invalid"];
    }
};