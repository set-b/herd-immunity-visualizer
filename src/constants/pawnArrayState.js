export const pawnArrayState = {
    PAWN_ARRAY: null
};

// remove this from this file
export function reset() { // triggered by UISTATE.RESET in event listener in uiState.js
    const pawnArray = pawnArrayState.PAWN_ARRAY.flat();
    for (let index = 0; index < pawnArray.length; index++) {
        let pawn = pawnArray[index];
        if (pawn){
            pawn.mesh.dispose();
        }
    }

    pawnArrayState.PAWN_ARRAY = null
}