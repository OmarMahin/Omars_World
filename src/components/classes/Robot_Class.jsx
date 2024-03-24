import * as cannon from "cannon-es"
import * as THREE from "three"
import Ball from "./Ball_Class"

export default class RobotWithBall {
	reset = false
	ballTargetBody = null
	ballPhysicsBody = null

	constructor(
		_renderBody,
		_renderBodyWithTarget,
		_renderWheelR,
		_renderWheelL,
		_renderBallBody,
		_renderScene,
		_physicsScene,
		_ix,
		_iy,
		_iz,
		_bx,
		_by,
		_bz
	) {
		// Robot

		this.renderBody = _renderBody
		this.renderBodyWithTarget = _renderBodyWithTarget
		this.renderWheelR = _renderWheelR
		this.renderWheelL = _renderWheelL
		this.botPos_x = _ix
		this.botPos_y = _iy
		this.botPos_z = _iz

		this.scene = _renderScene
		this.physicsScene = _physicsScene
		this.width = 5
		this.height = 2
		this.depth = 3.99
		this.botPhysicalBody = null
		this.physicalWheelL = this.#genaratePhysicalWheel(1.3, 5)
		this.physicalWheelR = this.#genaratePhysicalWheel(1.3, 5)
		this.casterWHeel = this.#genaratePhysicalWheel(1.3, 1)
		this.frontPointSphere1 = this.#genaratePhysicalWheel(0.5, 0.1)
		this.frontPointSphere2 = this.#genaratePhysicalWheel(0.5, 0.1)

		//Robot Variables

		this.side = null
		this.targetPosition = new THREE.Vector2(0, 0)
		this.distanceDiffThreshold = 0.7
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
		this.flag = false

		this.initialBotCoordSphere = new THREE.Mesh(
			new THREE.SphereGeometry(0.5),
			new THREE.MeshBasicMaterial({
				transparent: true,
				color: "green",
				opacity: 0,
			})
		)

		this.initialBotCoordSphere.position.set(_ix, _iy, _iz)
		this.initialBotCoordSphere.userData.draggable = false
		this.initialBotCoordSphere.userData.name = "Bot Coord Sphere"

		this.scene.add(this.initialBotCoordSphere)

		this.chassis = this.#generateChassis(
			this.width,
			this.height,
			this.depth,
			this.botPos_x,
			this.botPos_y,
			this.botPos_z
		)
		this.physicalWheelL.quaternion.copy(this.botPhysicalBody.quaternion)
		this.physicalWheelR.quaternion.copy(this.botPhysicalBody.quaternion)

		this.#addWheelToChassis()

		this.chassis.addToWorld(this.physicsScene)

		const arr = [this.renderBody, this.renderBodyWithTarget, this.renderWheelL, this.renderWheelR]
		for (let i = 0; i < 4; i++) {
			this.scene.add(arr[i])
			arr[i].position.set(0, 0, 0)
		}

		// Ball class
		this.ballPos = new THREE.Vector3(_bx, _by, _bz)
		this.ball = new Ball(
			_renderBallBody,
			this.scene,
			this.physicsScene,
			this.ballPos.x,
			this.ballPos.y,
			this.ballPos.z
		)

		this.ballTargetBody = this.ball.targetBody
		this.ballPhysicsBody = this.ball.physicsBody
	}

	#generateChassis(w, h, d, ix, iy, iz) {
		return new cannon.RigidVehicle({
			chassisBody: this.#genarateBotPhysicalBody(w, h, d, ix, iy, iz),
		})
	}

	#addWheelToChassis() {
		this.chassis.addWheel({
			body: this.physicalWheelL,
			position: new cannon.Vec3(-0.8, -0.5, -this.depth / 2 - 0.2),
			axis: new cannon.Vec3(0, 0, 1),
		})

		this.chassis.addWheel({
			body: this.physicalWheelR,
			position: new cannon.Vec3(-0.8, -0.5, this.depth / 2 + 0.2),
			axis: new cannon.Vec3(0, 0, 1),
		})

		this.chassis.addWheel({
			body: this.casterWHeel,
			position: new cannon.Vec3(2.1, -0.5, 0),
			axis: new cannon.Vec3(0, 0, 0),
		})
		this.chassis.addWheel({
			body: this.frontPointSphere1,
			position: new cannon.Vec3(this.width / 2 + 1, 1, -3),
			axis: new cannon.Vec3(0, 1, 0),
		})
		this.chassis.addWheel({
			body: this.frontPointSphere2,
			position: new cannon.Vec3(this.width / 2 + 1, 1, 3),
			axis: new cannon.Vec3(0, 1, 0),
		})
	}

	#genarateBotPhysicalBody(w, h, d, px, py, pz) {
		this.botPhysicalBody = new cannon.Body({
			mass: 7,
			position: new cannon.Vec3(px, py, pz),
			shape: new cannon.Box(new cannon.Vec3(w / 2, h / 2, d / 2)),
		})

		this.botPhysicalBody.quaternion.setFromEuler(0, (-Math.PI * 2.9) / 4, 0)

		return this.botPhysicalBody
	}

	#genaratePhysicalWheel(radius, mass) {
		return new cannon.Body({
			mass: mass,
			shape: new cannon.Sphere(radius),
			angularDamping: 0.5,
		})
	}

	botRender() {
		if (this.renderWheelL && this.renderWheelR && this.renderBody && this.renderBodyWithTarget) {
			this.renderWheelL.position.copy(this.physicalWheelL.position)
			this.renderWheelL.quaternion.copy(this.physicalWheelL.quaternion)
			this.renderWheelR.position.copy(this.physicalWheelR.position)
			this.renderWheelR.quaternion.copy(this.physicalWheelR.quaternion)

			if (this.destinationReached && !this.destinationReached2) {
				this.renderBodyWithTarget.visible = true
				this.renderBody.visible = false
			} else {
				this.renderBodyWithTarget.visible = false
				this.renderBody.visible = true
			}

			this.renderBodyWithTarget.position.copy(this.botPhysicalBody.position)
			this.renderBodyWithTarget.quaternion.copy(this.botPhysicalBody.quaternion)

			this.renderBody.position.copy(this.botPhysicalBody.position)
			this.renderBody.quaternion.copy(this.botPhysicalBody.quaternion)
		}

		this.ball.renderBall()
	}

	controlBot(_input, speed) {
		if (_input == "F") {
			this.chassis.setWheelForce(-speed, 1)
			this.chassis.setWheelForce(-speed, 0)
		} else if (_input == "L") {
			this.chassis.setWheelForce(speed, 1)
			this.chassis.setWheelForce(-speed, 0)
		} else if (_input == "R") {
			this.chassis.setWheelForce(-speed, 1)
			this.chassis.setWheelForce(speed, 0)
		} else if (_input == "S") {
			this.chassis.setWheelForce(-this.chassis.getWheelSpeed(1) * Math.abs(speed) * 10, 1)
			this.chassis.setWheelForce(-this.chassis.getWheelSpeed(0) * Math.abs(speed) * 10, 0)
		}
	}

	#calculateSide(target) {
		const x = target.position.x
		const y = target.position.z
		const x1 = this.renderBody.position.x
		const y1 = this.renderBody.position.z
		const x2 = this.casterWHeel.position.x
		const y2 = this.casterWHeel.position.z

		const d = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)

		if (d > 0) return 2
		else if (d < 0) return 1
	}

	#takeTurns(targetDistance1, targetDistance2, targetDistance3) {
		if (this.side == 1) {
			if (
				Math.abs(targetDistance1 - targetDistance2) > this.distanceDiffThreshold &&
				this.rotate
			) {
				this.controlBot("L", this.turningSpeed)
			} else if (
				Math.abs(targetDistance1 - targetDistance2) <= this.distanceDiffThreshold &&
				this.rotate &&
				targetDistance3 - targetDistance1 < -1
			) {
				this.controlBot("L", this.turningSpeed)
			} else if (targetDistance3 - targetDistance1 > 0 || this.rotate == false) {
				this.rotate = false
				this.controlBot("S", -this.forwardSpeed)
			}
		} else if (this.side == 2) {
			if (
				Math.abs(targetDistance1 - targetDistance2) > this.distanceDiffThreshold &&
				this.rotate
			) {
				this.controlBot("R", this.turningSpeed)
			} else if (
				Math.abs(targetDistance1 - targetDistance2) <= this.distanceDiffThreshold &&
				this.rotate &&
				targetDistance3 - targetDistance1 < -1
			) {
				this.controlBot("R", this.turningSpeed)
			} else if (targetDistance3 - targetDistance1 > 0 || this.rotate == false) {
				this.rotate = false
				this.controlBot("S", -this.forwardSpeed)
			}
		}
	}

	#reverseTakeTurns(targetDistance1, targetDistance2, targetDistance3) {
		if (this.side == 1) {
			if (
				Math.abs(targetDistance1 - targetDistance2) > this.distanceDiffThreshold &&
				this.rotate
			) {
				this.controlBot("L", this.turningSpeed)
			} else if (targetDistance3 - targetDistance1 < -1 || this.rotate == false) {
				this.rotate = false
				this.controlBot("S", -this.forwardSpeed)
			}
		} else if (this.side == 2) {
			if (
				Math.abs(targetDistance1 - targetDistance2) > this.distanceDiffThreshold &&
				this.rotate
			) {
				this.controlBot("R", this.turningSpeed)
			} else if (targetDistance3 - targetDistance1 < -1 || this.rotate == false) {
				this.rotate = false
				this.controlBot("S", -this.forwardSpeed)
			}
		}
	}

	#botMovement(target) {
		const targetDistance1 = this.frontPointSphere1.position.distanceTo(target.position)
		const targetDistance2 = this.frontPointSphere2.position.distanceTo(target.position)
		const targetDistance3 = this.casterWHeel.position.distanceTo(target.position)
		const targetDistance4 = Math.abs(this.renderBody.position.distanceTo(target.position))

		if (!this.side) this.side = this.#calculateSide(target)

		if (
			targetDistance4 < 7 &&
			!this.initialBotCoordReached &&
			this.destinationReached &&
			targetDistance3 - targetDistance2 < -1 &&
			this.reverse == -1
		) {
			this.reverse = 1
		} else if (this.destinationReached && this.reverse == -1 && !this.initialBotCoordReached) {
			this.reverse = 0
		}

		if (this.reverse == 1 && !this.initialBotCoordReached) {
			this.#reverseTakeTurns(targetDistance1, targetDistance2, targetDistance3)

			if (Math.abs(this.chassis.getWheelSpeed(0)) < 0.01 && this.rotate == false) {
				this.forward = true
				this.rotate = false
			}

			if (this.forward && !this.rotate) {
				this.forwardSpeed = this.forwardSpeed < 0 ? this.forwardSpeed : this.forwardSpeed * -1

				if (
					Math.abs(targetDistance1 - targetDistance2) > this.distanceDiffThreshold &&
					targetDistance3 > 5
				) {
					this.controlBot("S", this.forwardSpeed)

					if (
						Math.abs(this.chassis.getWheelSpeed(0)) < 0.01 &&
						Math.abs(this.chassis.getWheelSpeed(1)) < 0.01
					) {
						this.side = this.#calculateSide(target)
						this.forward = false
						this.rotate = true
					}
				} else {
					this.controlBot("F", this.forwardSpeed)
					this.rotate = false
				}

				if (targetDistance4 < 0.7) {
					this.controlBot("S", -this.forwardSpeed)
					this.forward = false
					this.rotate = false
					this.initialBotCoordReached = true
				}
			}
		} else {
			if (targetDistance3 > 5 && this.rotate) {
				this.#takeTurns(targetDistance1, targetDistance2, targetDistance3)
			} else {
				if (
					Math.abs(targetDistance1 - targetDistance2) <= this.distanceDiffThreshold &&
					!this.forward
				) {
					this.controlBot("S", -this.forwardSpeed * 2)
					this.rotate = false

					if (
						Math.abs(this.chassis.getWheelSpeed(0)) < 0.01 &&
						Math.abs(this.chassis.getWheelSpeed(0)) < 0.01
					) {
						this.forward = true
					}
				} else {
					this.#takeTurns(targetDistance1, targetDistance2, targetDistance3)
				}
			}

			if (Math.abs(this.chassis.getWheelSpeed(0)) < 0.01 && this.rotate == false) {
				this.forward = true
				this.rotate = false
			}

			if (this.forward && !this.rotate) {
				this.forwardSpeed = this.forwardSpeed > 0 ? this.forwardSpeed : this.forwardSpeed * -1

				if (
					(Math.abs(targetDistance1 - targetDistance2) > this.distanceDiffThreshold ||
						targetDistance3 - targetDistance2 < -1) &&
					targetDistance3 > 5
				) {
					this.controlBot("S", this.forwardSpeed)
					if (
						Math.abs(this.chassis.getWheelSpeed(0)) < 0.01 &&
						Math.abs(this.chassis.getWheelSpeed(1)) < 0.01
					) {
						this.side = this.#calculateSide(target)
						this.forward = false
						this.rotate = true
					}
				} else {
					this.controlBot("F", this.forwardSpeed)
					this.rotate = false
				}

				if (this.destinationReached && !this.initialBotCoordReached) {
					if (targetDistance4 < 0.7) {
						this.controlBot("S", -this.forwardSpeed * 2)
						this.forward = false
						this.rotate = false
						this.initialBotCoordReached = true
					}
				} else if (targetDistance3 < 4) {
					this.controlBot("S", -this.forwardSpeed * 2)
					this.forward = false
					this.rotate = false
					this.destinationReached == true
						? (this.destinationReached2 = true)
						: (this.destinationReached = true)
				}
			}
		}
	}

	target_Pick_Drop(target, target_pos) {
		const null_pos = new THREE.Vector2(0, 0)
		const pos = new THREE.Vector2(target.position.x, target.position.z)

		const threshold = 0.5
		const distance = Math.sqrt(
			Math.abs(target_pos.position.x - target.position.x) +
				Math.abs(target_pos.position.z - target.position.z)
		)

		if (distance <= threshold && !this.destinationReached) {
			return
		} else {
			if (this.targetPosition.equals(null_pos)) {
				this.targetPosition.copy(pos)
			}

			if (this.targetPosition.distanceTo(pos) > 1 && !this.destinationReached) {
				if (
					Math.abs(this.chassis.getWheelSpeed(0)) < 0.01 ||
					Math.abs(this.chassis.getWheelSpeed(0)) < 0.01
				) {
					this.targetPosition.copy(pos)
					this.controlBot("S", 0)
					this.side = this.#calculateSide(target)
					this.rotate = true
					this.forward = false
				} else {
					this.controlBot("S", -this.forwardSpeed)
				}
			} else {
				if (this.destinationReached == false) {
					this.#botMovement(target)
				} else if (this.destinationReached && !this.setDestination2) {
					if (this.timeStamp == 0) {
						this.controlBot("S", this.forwardSpeed)
						const tempPos = new THREE.Vector3(100, 10, 100)
						this.ball.changeBallPosition(tempPos, true, true, false, false)
						this.timeStamp += 1
					} else if (this.timeStamp < 50) {
						this.controlBot("F", this.forwardSpeed)
						this.timeStamp += 1
					} else {
						this.controlBot("S", this.forwardSpeed)
					}

					if (
						Math.abs(this.chassis.getWheelSpeed(0)) < 0.01 &&
						Math.abs(this.chassis.getWheelSpeed(1)) < 0.01
					) {
						this.setDestination2 = true
						this.timeStamp = 0
					}
				} else if (this.setDestination2 && !this.initialBotCoordReached) {
					this.#botMovement(this.initialBotCoordSphere)
				} else if (
					this.setDestination2 &&
					!this.destinationReached2 &&
					this.initialBotCoordReached
				) {
					this.forwardSpeed = 10
					this.#botMovement(target_pos)
				} else if (this.destinationReached2) {
					const distance = Math.abs(
						this.renderBody.position.distanceTo(this.initialBotCoordSphere.position)
					)

					if (!this.ball.checkBallVisibility()) {
						
						this.controlBot("S", this.forwardSpeed)
						this.ball.changeBallPosition(target_pos.position, false, true, true, false)
						

						
					}

					if (this.timeStamp >= 0 && this.timeStamp < 250){
						this.controlBot('F', -this.forwardSpeed * 2)

						this.timeStamp += 1
					}
					else {
						if (Math.abs(this.chassis.getWheelSpeed(0)) < 0.01 &&
						Math.abs(this.chassis.getWheelSpeed(1)) < 0.01){
							this.controlBot('S', 0)
							this.resetEverything()
						}
						else{
							this.controlBot('S', this.forwardSpeed)
						}
						
					}
					

					// const distance = Math.abs(
					// 	this.renderBody.position.distanceTo(this.initialBotCoordSphere.position)

					// )
					// if (
					// 	Math.abs(this.chassis.getWheelSpeed(0)) < 0.01 &&
					// 	Math.abs(this.chassis.getWheelSpeed(1)) < 0.01
					// ) {
					// 	this.flag = false
					// }

					// if (this.flag == false){
					// 	if (distance > 1 && this.timeStamp == 0) {
					// 		this.controlBot("F", -10)
					// 	} else if (distance < 1) {
					// 		this.timeStamp = 1
					// 	} else {
					// 		if (
					// 			Math.abs(this.chassis.getWheelSpeed(0)) < 0.01 &&
					// 			Math.abs(this.chassis.getWheelSpeed(1)) < 0.01
					// 		) {
								
					// 		} else {
					// 			this.controlBot("S", this.forwardSpeed * 2)
					// 		}
					// 	}
					// }
				}
			}
		}
	}

	resetEverything() {
		this.ball.changeBallPosition(this.ballPos, false, true, true, true)

		this.side = null
		this.targetPosition = new THREE.Vector2(0, 0)
		this.distanceDiffThreshold = 0.6
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
		this.flag = false

		this.chassis.removeFromWorld(this.physicsScene)
		this.chassis = this.#generateChassis(
			this.width,
			this.height,
			this.depth,
			this.botPos_x,
			this.botPos_y,
			this.botPos_z
		)
		this.physicalWheelL.quaternion.copy(this.botPhysicalBody.quaternion)
		this.physicalWheelR.quaternion.copy(this.botPhysicalBody.quaternion)

		this.#addWheelToChassis()

		this.chassis.addToWorld(this.physicsScene)
	}
}
