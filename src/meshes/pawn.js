import { ImmunityLevel } from "../immunityLevels";
import { HealthState } from "../healthStates";
import { Color3, Mesh, MeshBuilder, StandardMaterial } from "@babylonjs/core";
import { DEFAULT_MERGE_CONFIG } from "../mergeConfig";
import { BASE_DIMENSIONS, HEAD_DIMENSIONS } from "../pawnDimensions";

export class pawn { // get rid of magic number colors
    constructor(scene, immunityLevel, position, highlightLayer) {
        this.scene = scene
        this.highlightLayer = highlightLayer;
        this.immunityLevel = immunityLevel;
        this.healthState = HealthState.HEALTHY;
        this.vaccinated = false;
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

        pawn.position = position;
        this.mesh = pawn;
        this.updateColor();
        return pawn;
    }

    updateColor() {

        this.highlightLayer.removeMesh(this.mesh);

        const pawnMaterial = new StandardMaterial("pawnMaterial");

        switch (this.immunityLevel) {
            case ImmunityLevel.IMMUNOCOMPROMISED:
                pawnMaterial.diffuseColor = new Color3(255, 255, 0); // yellow
                break;
        
            case ImmunityLevel.NORMAL:
                pawnMaterial.diffuseColor = new Color3(0, 255, 255); // cyan
                break;
            
            case ImmunityLevel.RESISTANT:
                pawnMaterial.diffuseColor = new Color3(0,255,0); // green
                break;

            default:
                break;
        }

        if (this.healthState === HealthState.EXPOSED){
            this.highlightLayer.addMesh(this.mesh, new Color3(1,0.3,0)); // orange highlight
        }

        if (this.healthState === HealthState.SYMPTOMATIC){
            pawnMaterial.diffuseColor = new Color3(255,0,0); // red
        }

        if (this.vaccinated === true &&
            this.immunityLevel !== ImmunityLevel.RESISTANT
        ){
            this.highlightLayer.addMesh(this.mesh, new Color3(0,255,0)); // green highlight
        }

        if (this.healthState === HealthState.DEAD){
            pawnMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2); // dark gray
        }

        this.mesh.material = pawnMaterial;
    }

    expose() { // take argument and use that for the infectedOnTurn value?
        if (this.healthState === HealthState.HEALTHY){
            this.healthState = HealthState.EXPOSED;
        }
        this.updateColor();
    }

    getSick() {
        if (this.healthState === HealthState.EXPOSED){
            this.healthState = HealthState.SYMPTOMATIC
        }
        this.updateColor();
    }

    recover() {
        if (this.healthState === HealthState.EXPOSED ||
            this.healthState === HealthState.SYMPTOMATIC
        ) {
            this.healthState = HealthState.RECOVERED;
            this.immunityLevel = ImmunityLevel.RESISTANT;
        }
     
        this.updateColor();
    }

    die() {
        if (this.healthState === HealthState.SYMPTOMATIC){
            this.healthState = HealthState.DEAD;
        }
        this.updateColor();
    }

    vaccinate() {
        if (this.healthState !== HealthState.EXPOSED &&
            this.healthState !== HealthState.SYMPTOMATIC){
            this.vaccinated = true;
        }
        this.updateColor();
    }

    gainVaccineImmunity() {
        if (this.vaccinated === true) {
            this.healthState = HealthState.HEALTHY;
            this.immunityLevel = ImmunityLevel.RESISTANT;
        }
        this.updateColor();
    }
}