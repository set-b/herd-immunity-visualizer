import { UISTATE, updateDayDisplay, updateStatsDisplay } from "./uiState";
import { pawn } from "./meshes/pawn";
import { ImmunityLevel } from "./constants/immunityLevels";
import { HealthState } from "./constants/healthStates";
import { Vector3 } from "@babylonjs/core";
import { pawnArrayState } from "./constants/pawnArrayState";

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

    const patientZeroIndexRow = Math.floor(Math.random() * pawnArray.length);
    const patientZeroIndexCol = Math.floor(Math.random() * pawnArray[patientZeroIndexRow].length);
    pawnArray[patientZeroIndexRow][patientZeroIndexCol].expose();   

    return;
}

export function startGame(scene, highlightLayer) {
    if (validatePopulationSize() === false){
        return;
    }

    if (pawnArrayState.PAWN_ARRAY === null){
        const pawns = spawnPawns(scene, highlightLayer);
        pickPatientZero(pawns);

        UISTATE.PAUSE = false;
    
        pawnArrayState.PAWN_ARRAY = pawns;
    }
}

export function executeTurn(pawnArray){ // put this in observable?
    // need to add delay when symptoms onset.
    const immunocompromisedModifier = 0.2;

    for (let row = 0; row < pawnArray.length; row++){
        for(let col = 0; col < pawnArray[row].length; col++){
            const pawn = pawnArray[row][col];
            
            if (pawn === undefined) continue;
            if (pawn.healthState === HealthState.DEAD) {
                console.log('updating color of dead pawn');
                pawn.updateColor();
                continue;
            }

            if (pawn.healthState === HealthState.EXPOSED ||
                pawn.healthState === HealthState.SYMPTOMATIC
            ){
                updateNeighboringPawns(pawnArray, row, col);

                if (pawn.healthState === HealthState.EXPOSED){
                    if (pawnStatusCalculation(UISTATE.INFECTION_RATE)){
                        pawn.getSick(); //why is this yellow?
                    }
                }

                else if (pawn.healthState === HealthState.SYMPTOMATIC){
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

    updateCounts(pawnArray);
}

export function updateNeighboringPawns(pawnArray, row, col){ // CHECK THIS!!!
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
                    if (pawnStatusCalculation(UISTATE.INFECTION_RATE) && 
                        neighboringPawn.immunityLevel !== ImmunityLevel.RESISTANT) {
                        neighboringPawn.expose();
                    }
                }
            }
        }

    }
}

function updateCounts(pawnArray) {
    // update the counts in the UISTATE file here
    const counts = {
        normal: 0,
        immunocompromised: 0,
        exposed: 0,
        infected: 0,
        resistant: 0,
        dead: 0
    };

    const flatArray = pawnArray.flat();
    // for loop on all pawns to check statuses
    for (let index = 0; index < flatArray.length; index++) {
        const pawn = flatArray[index];
        
        switch (pawn.healthState) {
            case HealthState.EXPOSED:
                counts.exposed++;
                break;
            case HealthState.SYMPTOMATIC:
                counts.infected++;
                break;
            case HealthState.DEAD:
                counts.dead++;
                break;
            default:
                break;
        }

        switch (pawn.immunityLevel) {
            case ImmunityLevel.IMMUNOCOMPROMISED:
                counts.immunocompromised++;
                break;
            case ImmunityLevel.NORMAL:
                counts.normal++;
                break;
            case ImmunityLevel.RESISTANT:
                counts.resistant++;
            default:
                break;
        }
    }

    updateStatsDisplay(counts);
    let day = UISTATE.DAY + 1;
    updateDayDisplay(day);
}

// TODO: updateCounts, make sure logic works, somehow get it to run in onbeforerenderobservable or something