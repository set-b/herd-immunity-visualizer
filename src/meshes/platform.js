import { MeshBuilder, StandardMaterial, Color3, PhysicsAggregate, PhysicsShapeType, PhysicsMotionType, Quaternion } from "@babylonjs/core";

export class Platform {
    constructor(name, width, depth, scene, rotationLimitAlpha, rotationLimitBeta){
        this.name = name;
        this.width = width;
        this.depth = depth;
        this.scene = scene;
        this.rotationLimitAlpha = rotationLimitAlpha;
        this.rotationLimitBeta = rotationLimitBeta;
        this.platform = this.createPlatform(
            name, 
            width, 
            depth, 
            scene
        );
        this.aggregate = new PhysicsAggregate(
            this.platform,
            PhysicsShapeType.BOX,
            { mass: 0, friction: 0 },
            scene        
        );
        this.aggregate.body.setMotionType(PhysicsMotionType.ANIMATED);
        this.aggregate.body.disablePreStep = false;
        this.platform.rotationQuaternion = 
        this.platform.rotationQuaternion || BABYLON.Quaternion.Identity();
    }

    createPlatform(name, width, depth, scene) {

        const platform = new MeshBuilder.CreateBox(
             name,
            { width: width, depth: depth, height: 0.5 },
            scene
        );

        const platformMaterial = new StandardMaterial("platformMaterial");
        platformMaterial.backFaceCulling = false;
        platformMaterial.diffuseColor = new Color3(1, 0.5, 0.3);
    
        platform.material = platformMaterial;

        return platform;
    }

    update(keyChecker, deltaTime) {
    const rotationSpeed = 1;
    let rotatedX = false;
    let rotatedZ = false;

    // Track current euler angles for limit checking
    const euler = this.platform.rotationQuaternion.toEulerAngles();

    if (keyChecker.isKeyDown("w")) {
        euler.z += rotationSpeed * deltaTime;
        rotatedZ = true;
    }
    if (keyChecker.isKeyDown("s")) {
        euler.z -= rotationSpeed * deltaTime;
        rotatedZ = true;
    }
    if (keyChecker.isKeyDown("a")) {
        euler.x -= rotationSpeed * deltaTime;
        rotatedX = true;
    }
    if (keyChecker.isKeyDown("d")) {
        euler.x += rotationSpeed * deltaTime;
        rotatedX = true;
    }

    // Apply limits
    euler.x = Math.max(-this.rotationLimitAlpha, Math.min(this.rotationLimitAlpha, euler.x));
    euler.z = Math.max(-this.rotationLimitBeta, Math.min(this.rotationLimitBeta, euler.z));

    // Convert back to quaternion
    this.platform.rotationQuaternion = Quaternion.FromEulerAngles(euler.x, euler.y, euler.z);
}
}