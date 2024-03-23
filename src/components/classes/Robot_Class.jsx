import * as cannon from "cannon-es";
import * as THREE from "three";

export default class Robot {
    constructor(
        _renderBody,
        _renderBodyWithTarget,
        _renderWheelR,
        _renderWheelL,
        _renderScene,
        _physicsScene,
        _ix,
        _iy,
        _iz
    ) {
        this.renderBody = _renderBody;
        this.renderBodyWithTarget = _renderBodyWithTarget;
        this.renderWheelR = _renderWheelR;
        this.renderWheelL = _renderWheelL;

        this.scene = _renderScene;
        this.physicsScene = _physicsScene;
        this.width = 5;
        this.height = 2;
        this.depth = 3.99;
        this.botPhysicalBody = null;
        this.physicalWheelL = this.#genaratePhysicalWheel(1.3, 5);
        this.physicalWheelR = this.#genaratePhysicalWheel(1.3, 5);
        this.casterWHeel = this.#genaratePhysicalWheel(1.3, 1);
        this.frontPointSphere1 = this.#genaratePhysicalWheel(0.5, 0.1);
        this.frontPointSphere2 = this.#genaratePhysicalWheel(0.5, 0.1);

        //Variables

        this.side = null
        this.targetPosition = new THREE.Vector2(0,0)
        this.distanceDiffThreshold = 0.8
        this.rotate = true
        this.forward = false
        this.turningSpeed = 10
        this.forwardSpeed = 20
        this.destinationReached = false
        this.destinationReached2 = false
        this.setDestination2 = false
        this.initialBotCoordReached = false
        this.reverse = -1
        this.timeStamp = 0

        this.initialBotCoordSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5),
            new THREE.MeshBasicMaterial({
                transparent: true,
                color: "green",
                opacity: 0,
            })
        );

        this.initialBotCoordSphere.position.set(_ix, _iy, _iz);
        this.initialBotCoordSphere.userData.draggable = false;
        this.initialBotCoordSphere.userData.name = "Bot Coord Sphere";

        this.scene.add(this.initialBotCoordSphere);

        this.chassis = new cannon.RigidVehicle({
            chassisBody: this.#genarateBotPhysicalBody(
                this.width,
                this.height,
                this.depth,
                _ix,
                _iy,
                _iz
            ),
        });

        this.physicalWheelL.quaternion.copy(this.botPhysicalBody.quaternion);
        this.physicalWheelR.quaternion.copy(this.botPhysicalBody.quaternion);

        this.chassis.addWheel({
            body: this.physicalWheelL,
            position: new cannon.Vec3(-0.8, -0.5, -this.depth / 2 - 0.2),
            axis: new cannon.Vec3(0, 0, 1),
        });

        this.chassis.addWheel({
            body: this.physicalWheelR,
            position: new cannon.Vec3(-0.8, -0.5, this.depth / 2 + 0.2),
            axis: new cannon.Vec3(0, 0, 1),
        });

        this.chassis.addWheel({
            body: this.casterWHeel,
            position: new cannon.Vec3(2.1, -0.5, 0),
            axis: new cannon.Vec3(0, 0, 0),
        });
        this.chassis.addWheel({
            body: this.frontPointSphere1,
            position: new cannon.Vec3(this.width / 2 + 1, 1, -3),
            axis: new cannon.Vec3(0, 1, 0),
        });
        this.chassis.addWheel({
            body: this.frontPointSphere2,
            position: new cannon.Vec3(this.width / 2 + 1, 1, 3),
            axis: new cannon.Vec3(0, 1, 0),
        });

        this.chassis.addToWorld(this.physicsScene);

        const arr = [
            this.renderBody,
            this.renderBodyWithTarget,
            this.renderWheelL,
            this.renderWheelR,
        ];
        for (let i = 0; i < 4; i++) {
            this.scene.add(arr[i]);
            arr[i].position.set(0, 0, 0);
        }
    }

    #genarateBotPhysicalBody(w, h, d, px, py, pz) {
        this.botPhysicalBody = new cannon.Body({
            mass: 7,
            position: new cannon.Vec3(px, py, pz),
            shape: new cannon.Box(new cannon.Vec3(w / 2, h / 2, d / 2)),
        });

        this.botPhysicalBody.quaternion.setFromEuler(0, (-Math.PI * 2.9) / 4, 0);

        return this.botPhysicalBody;
    }

    #genaratePhysicalWheel(radius, mass) {
        return new cannon.Body({
            mass: mass,
            shape: new cannon.Sphere(radius),
            angularDamping: 0.5,
        });
    }

    botRender(){
        if (this.renderWheelL && this.renderWheelR && this.renderBody && this.renderBodyWithTarget) {
            this.renderWheelL.position.copy(this.physicalWheelL.position);
            this.renderWheelL.quaternion.copy(this.physicalWheelL.quaternion);
            this.renderWheelR.position.copy(this.physicalWheelR.position);
            this.renderWheelR.quaternion.copy(this.physicalWheelR.quaternion);
    
            if (this.destinationReached && !this.destinationReached2) {
                this.renderBodyWithTarget.visible = true;
                this.renderBody.visible = false;
            } else {
                this.renderBodyWithTarget.visible = false;
                this.renderBody.visible = true;
            }
    
            this.renderBodyWithTarget.position.copy(this.botPhysicalBody.position);
            this.renderBodyWithTarget.quaternion.copy(this.botPhysicalBody.quaternion);
    
            this.renderBody.position.copy(this.botPhysicalBody.position);
            this.renderBody.quaternion.copy(this.botPhysicalBody.quaternion);
        }
    }
}
