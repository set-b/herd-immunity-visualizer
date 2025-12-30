import { ImmunityLevel } from "../immunityLevels";
import { HealthState } from "../healthStates";
import { Color3, Mesh, MeshBuilder, StandardMaterial } from "@babylonjs/core";
import { DEFAULT_MERGE_CONFIG } from "../mergeConfig";
import { BASE_DIMENSIONS, HEAD_DIMENSIONS } from "../pawnDimensions";

export class pawn { // find out vaccinatedOnTurn and infectedOnTurn
    constructor(scene, immunityLevel, position) {
        this.scene = scene
        this.immunityLevel = immunityLevel;
        this.healthState = HealthState.HEALTHY;
        this.vaccinated = false;
        this.vaccinatedOnTurn = null;
        this.infectedOnTurn = null;
        this.mesh = this.createMesh(position, scene);
    }

    createMesh(position, scene) {
        const base = MeshBuilder.CreateCylinder(
            "base",
            { 
                height: BASE_DIMENSIONS.BASE_HEIGHT, 
                diameter: BASE_DIMENSIONS.BASE_DIAMETER, 
                segments: BASE_DIMENSIONS.BASE_SEGMENTS
            },
            scene
        );

        base.position.y = BASE_DIMENSIONS.BASE_YPOSITION;
        
        const head = MeshBuilder.CreateSphere(
            "head",
            {
                segments: HEAD_DIMENSIONS.HEAD_SEGMENTS, 
                diameter: HEAD_DIMENSIONS.HEAD_DIAMETER
            },
            scene
        );

        const pawn = Mesh.MergeMeshes(
            [base, head],
            DEFAULT_MERGE_CONFIG.disposeSource,
            DEFAULT_MERGE_CONFIG.allow32BitIndices,
            DEFAULT_MERGE_CONFIG.meshSubClass,
            DEFAULT_MERGE_CONFIG.subdivideWithMeshes,
            DEFAULT_MERGE_CONFIG.multiMultiMaterials
        );

        // find a way to disable shadows

        pawn.position = position;
        this.mesh = pawn;
        this.updateColor();
        return pawn;
    }

    updateColor() {

        const pawnMaterial = new StandardMaterial("pawnMaterial");

        switch (this.immunityLevel) {
            case ImmunityLevel.IMMUNOCOMPROMISED:
                pawnMaterial.diffuseColor = Color3.Yellow;
                break;
        
            case ImmunityLevel.NORMAL:
                pawnMaterial.diffuseColor = Color3.Blue;
                break;
            
            case ImmunityLevel.RESISTANT:
                pawnMaterial.diffuseColor = Color3.Green;

            default:
                break;
        }

        // need to work on emissive/glow/outline part, or maybe particle if that's easier

        this.mesh.material = pawnMaterial;
    }

    infect() {
        if (this.healthState === HealthState.HEALTHY){
            this.healthState = HealthState.INFECTED;
        }
        this.infectedOnTurn = 1 // placeholder for getting data elsewhere
        this.updateColor();
    }

    recover() {
        this.healthState = HealthState.RECOVERED;
        this.immunityLevel = ImmunityLevel.RESISTANT;
        this.updateColor();
    }

    die() {
        this.healthState = HealthState.DEAD;
        // update color?
        // move position to other platform?
    }

    vaccinate() {
        this.immunityLevel = ImmunityLevel.RESISTANT;
        this.vaccinated = true;
        this.vaccinatedOnTurn = 1 // placeholder for getting data elsewhere
    }
}