import * as cannon from "cannon-es"
import * as THREE from "three"
import { MeshStandardMaterial } from "three"

export default class Ball {

    targetBody = null
    physicsBody = null

	constructor(_renderBody, _renderScene, _physicsScene, _px, _py, _pz) {
		this.renderBody = _renderBody
		this.scene = _renderScene
		this.physicsScene = _physicsScene
		this.ballPos = new THREE.Vector3(_px, _py, _pz)

		this.renderBody.position.set(new THREE.Vector3(0, 0, 0))

		this.targetBody = new THREE.Mesh(
			new THREE.SphereGeometry(0.85),
			new MeshStandardMaterial({
				transparent: true,
				opacity: 1,
				color: "red",
				visible: false,
			})
		)

		this.targetBody.userData.draggable = true

		this.physicsBody = new cannon.Body({
			mass: 0.1,
			shape: new cannon.Box(new cannon.Vec3(1.8 / 2, 1.8 / 2, 1.8 / 2)),
			position: new cannon.Vec3(this.ballPos.x, this.ballPos.y, this.ballPos.z),
		})

        this.scene.add(this.renderBody)
        this.scene.add(this.targetBody)

        this.physicsScene.addBody(this.physicsBody)
	}

    renderBall(){
        this.renderBody.position.copy(this.physicsBody.position)
        this.renderBody.quaternion.copy(this.physicsBody.quaternion)
        this.targetBody.position.copy(this.physicsBody.position)
    }

    checkBallVisibility(){
        return this.renderBody.visible
    }

    changeBallPosition(newPos, transparent, _physicsBody, _renderBody, drag){
        if (_physicsBody) this.physicsBody.position.copy(newPos)

        if (_renderBody) this.renderBody.position.copy(this.physicsBody.position)

        if (transparent){
            this.renderBody.visible = false
        }
        else{
            this.renderBody.visible = true
        }

        this.targetBody.userData.draggable = drag
    }
}
