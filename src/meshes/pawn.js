import { ImmunityLevel } from "../constants/immunityLevels";
import { HealthState } from "../constants/healthStates";
import { Mesh, MeshBuilder, StandardMaterial } from "@babylonjs/core";
import { DEFAULT_MERGE_CONFIG } from "../constants/mergeConfig";
import { BASE_DIMENSIONS, HEAD_DIMENSIONS } from "../constants/pawnDimensions";
import { COLORS, HIGHLIGHTS } from "../constants/colorPalette";

export class pawn {
    constructor(scene, immunityLevel, position, highlightLayer) {
        this.scene = scene
        this.highlightLayer = highlightLayer;
        this.immunityLevel = immunityLevel;
        this.healthState = HealthState.HEALTHY;
        this.vaccinated = false;
        // this.spawnCoordinates = spawnCoordinates;
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
                pawnMaterial.diffuseColor = COLORS.YELLOW;
                break;
        
            case ImmunityLevel.NORMAL:
                pawnMaterial.diffuseColor = COLORS.CYAN;
                break;
            
            case ImmunityLevel.RESISTANT:
                pawnMaterial.diffuseColor = COLORS.GREEN;
                break;

            default:
                break;
        }

        if (this.healthState === HealthState.EXPOSED){
            this.highlightLayer.addMesh(this.mesh, HIGHLIGHTS.ORANGE);
        }

        if (this.healthState === HealthState.SYMPTOMATIC){
            pawnMaterial.diffuseColor = COLORS.RED;
        }

        if (this.vaccinated === true &&
            this.immunityLevel !== ImmunityLevel.RESISTANT
        ){
            this.highlightLayer.addMesh(this.mesh, HIGHLIGHTS.GREEN);
        }

        if (this.healthState === HealthState.DEAD){
            pawnMaterial.diffuseColor = COLORS.DARK_GRAY;
        }

        this.mesh.material = pawnMaterial;
    }

    expose() {
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