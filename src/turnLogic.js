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

export function spawnPawns(scene) { // look at this again
    // might turn this whole file into a class to instantiate with scene as part of constructor method
    // could call it gameLogicHandler.js
    // might not be necessary to export every function?
    const pawnArray = [];
    for (let index = 0; index < UISTATE.POPULATION_SIZE; index++) {
    // need to calculate odds for immunity level and calculate position along "grid"

    const spacing = 2;
    const pawnsPerRow = Math.ceil(Math.sqrt(populationSize));

    const row = Math.floor(i / pawnsPerRow);
    const col = i % pawnsPerRow;
    
    const x = (col - pawnsPerRow / 2) * spacing;
    const z = (row - pawnsPerRow / 2) * spacing;
    
    const position = new Vector3(x, 0, z);
    // create pawn at position

        pawnArray[index] = new pawn(
            scene,
            determineInitialImmunityLevel(pawnStatusCalculation(UISTATE.IMMUNOCOMPROMISED_RATE)),
            position        
        );
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

    const patientZero = Math.floor(Math.random() * pawnArray.length) + 1;
    pawnArray[patientZero].healthState = HealthState.EXPOSED;    

    return;
}

export function startGame(scene) {
    if (validatePopulationSize() === false){
        return;
    }

    const pawns = spawnPawns(scene);
    pickPatientZero(pawns);

    let simulationRunning = true;
    while(simulationRunning){ // maybe look at onObservable instead! might not need this!
        // maybe put time here for speed to wait between turns
        // according to speed
        executeTurn(pawns);
    }
}

export function executeTurn(pawns){
    // go through array and check for exposed or symptomatic
    const infected = pawns.filter(pawn => 
        pawn.HealthState === HealthState.EXPOSED ||
        pawn.healthState === HealthState.SYMPTOMATIC
    );
    // might need to get indices of these instead of the pawns themselves
    // use the indices to find the adjacent pawns (all 8 directions)

    // left and right pawn
    for (let index = 0; index < infected.length; index++) {
        const infectedPawn = infected[index];
        
        
    }
}