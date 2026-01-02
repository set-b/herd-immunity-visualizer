import { UISTATE } from "./uiState";
import { pawn } from "./meshes/pawn";
import { ImmunityLevel } from "./constants/immunityLevels";
import { HealthState } from "./constants/healthStates";

export function validatePopulationSize() {
    let isValid = true;
    
    if (isNaN(UISTATE.POPULATION_SIZE) ||
        UISTATE.POPULATION_SIZE > 200 ||
        UISTATE.POPULATION_SIZE < 10) {
        isValid = false; 
    }

    return isValid;
}

export function spawnPawns(scene, highlightLayer) { // look at this again
    // might turn this whole file into a class to instantiate with scene as part of constructor method
    // could call it gameLogicHandler.js
    // might not be necessary to export every function?

    const pawnsPerRow = Math.ceil(Math.sqrt(UISTATE.POPULATION_SIZE));
    const spacing = 2;

    const pawnArray = [];
    const totalPawns = UISTATE.POPULATION_SIZE;
    let pawnCounter = 0;

    for (let row = 0; row < pawnsPerRow && pawnCounter < totalPawns; row++) {

        pawnArray[row] = [];

        for (let col = 0; col < pawnsPerRow && pawnCounter < totalPawns; col++){

            const x = (col - pawnsPerRow / 2) * spacing; // columns are horizontal
            const z = (row - pawnsPerRow / 2) * spacing; // rows are vertical
    
            const position = new Vector3(x, 0, z);

            pawnArray[row][col] = new pawn(
                scene,
                determineInitialImmunityLevel(pawnStatusCalculation(UISTATE.IMMUNOCOMPROMISED_RATE)),
                position,
                highlightLayer
            );

            pawnCounter++;
        }
    }

    return pawnArray;
}

export function pawnStatusCalculation(rate) {
    const calculation = Math.random() < (rate / 100);
    return calculation;
}

export function determineInitialImmunityLevel(calculation) {

    let pawnIsImmunocompromised = calculation;
    let resultMessage = ImmunityLevel.NORMAL;
    if (pawnIsImmunocompromised) {
        resultMessage = ImmunityLevel.IMMUNOCOMPROMISED;
    }

    return resultMessage;
}

export function pickPatientZero(pawnArray){

    const patientZeroIndex = Math.floor(Math.random() * pawnArray.length);
    pawnArray[patientZeroIndex].healthState = HealthState.EXPOSED;    

    return;
}

export function startGame(scene) {
    if (validatePopulationSize() === false){
        return;
    }

    const pawns = spawnPawns(scene);
    pickPatientZero(pawns);

    //onbeforerenderobservable or something to run executeTurn?
}

export function executeTurn(pawnArray){ // put this in observable?
    // need to add delay when symptoms onset.
    const immunocompromisedModifier = 0.2;

    for (let row = 0; row < pawnArray.length; row++){
        for(let col = 0; col < pawnArray[row].length; col++){
            const pawn = pawnArray[row][col];
            
            if (pawn === undefined) continue;

            if (pawn.healthState === HealthState.EXPOSED ||
                pawn.healthState === HealthState.SYMPTOMATIC
            ){
                updateNeighboringPawns(pawnArray, row, col);

                if (pawn.healthState === HealthState.EXPOSED){
                    // check if it gets infected
                    if (pawnStatusCalculation(UISTATE.INFECTION_RATE)){
                        pawn.getSick();
                    }
                }

                if (pawn.healthState === HealthState.SYMPTOMATIC){
                    // check if it dies or recovers
                    if (pawn.immunityLevel === ImmunityLevel.IMMUNOCOMPROMISED){
                        if (pawnStatusCalculation(UISTATE.FATALITY_RATE + immunocompromisedModifier)){
                            pawn.die();
                        } else {
                            pawn.recover();
                        }
                    } else {
                        if (pawnStatusCalculation(UISTATE.FATALITY_RATE)){
                            pawn.die();
                        }
                        else {
                            pawn.recover();
                        }
                    }
                }

                
            }
            if (pawn.healthState === HealthState.HEALTHY) {
                if (pawn.vaccinated){
                       pawn.gainVaccineImmunity();
                } else {
                    if (pawnStatusCalculation(UISTATE.VACCINATION_RATE)){
                        pawn.vaccinate();
                    }
                }
            }
        }
    }

    // still need to update counts, day/turn, etc.
    updateCounts(); // will probably iterate flat throught the array and set counters to update UISTATE variables
    UISTATE.DAY++;
    // need to run this in observable or something****
}

export function updateNeighboringPawns(pawnArray, row, col){
    const directions = [
        [-1,0], [1,0], [0,-1], [0,1],
        [-1,-1], [-1,1], [1, -1], [1,1]
    ];

    for (const [r, c] of directions){
        const neighborRow = row + r;
        const neighborColumn = col + c;

        // check that it's not out of bounds
        if (neighborRow >= 0 && neighborRow < pawnArray.length &&
            neighborColumn >= 0 && neighborColumn < pawnArray[neighborRow].length
        ) {
            const neighboringPawn = pawnArray[neighborRow][neighborColumn];
            if (neighboringPawn !== undefined){
                if (neighboringPawn.healthState === HealthState.HEALTHY){
                    // add nuance based on pawn statuses
                    const cannotBeInfected = (neighboringPawn.healthState === HealthState.RECOVERED ||
                        neighboringPawn.immunityLevel === ImmunityLevel.RESISTANT
                    );

                    if (pawnStatusCalculation(UISTATE.INFECTION_RATE) && cannotBeInfected === false) {
                        neighboringPawn.healthState = HealthState.EXPOSED;
                    }
                }
            }
        }

    }
}

function updateCounts() {
    // update the counts in the UISTATE file here
}