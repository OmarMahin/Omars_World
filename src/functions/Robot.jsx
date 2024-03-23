import * as cannon from "cannon-es"
import * as THREE from "three"
import { changeBallPostion, checkBallVisibility } from "../functions/Ball.jsx"

let wheelL = null,
	wheelR = null
let wheel_R = null
let wheelShapeL = null,
	wheelShapeR = null
let casterWheel = null
let front_pointSphere1 = null,
	front_pointSphere2 = null
let botPhysicalBody_ = null,
	botPhysicalBodyShape = null,
	botPhysicalBodyShapeWithTarget = null
const distanceDiffThreshold = 0.8

let side = null
const targetPosition = new THREE.Vector2(0, 0)
let rotate = true,
	forward = false
let speed = 0
let destinationReached = false
let setDestination2 = false
let destinationReached2 = false
let initialBotCoordsReached = false
let reverse = -1
let timeStamp = 0

let initialBotCoordsSphere = null

export function groundPhyBody(physics_world) {
	const groundBody = new cannon.Body({
		type: cannon.Body.STATIC,
		shape: new cannon.Plane(),
	})

	groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
	physics_world.addBody(groundBody)
}

function botPhysicalBody(w, h, d, px, py, pz, m) {
	botPhysicalBody_ = new cannon.Body({
		mass: m,
		position: new cannon.Vec3(px, py, pz),
		shape: new cannon.Box(new cannon.Vec3(w / 2, h / 2, d / 2)),
	})

	botPhysicalBody_.quaternion.setFromEuler(0, (-Math.PI * 2.9) / 4, 0)

	return botPhysicalBody_
}

export function bot(w, h, d, px, py, pz, m, radius, wheel_mass, render_scene) {
	initialBotCoordsSphere = new THREE.Mesh(
		new THREE.SphereGeometry(0.5),
		new THREE.MeshBasicMaterial({
			transparent: true,
			color: "green",
			opacity: 0,
		})
	)

	initialBotCoordsSphere.position.set(px, py, pz)
	initialBotCoordsSphere.userData.draggable = false
	initialBotCoordsSphere.userData.name = "Bot Coords"
	render_scene.add(initialBotCoordsSphere)

	const chassis = new cannon.RigidVehicle({
		chassisBody: botPhysicalBody(w, h, d, px, py, pz, m),
	})

	wheelL = wheel(radius, wheel_mass)
	wheelR = wheel(radius, wheel_mass)
	casterWheel = wheel(radius, 1)
	front_pointSphere1 = wheel(0.5, 0.1)
	front_pointSphere2 = wheel(0.5, 0.1)

	wheelL.quaternion.copy(botPhysicalBody_.quaternion)
	wheelR.quaternion.copy(botPhysicalBody_.quaternion)

	wheel_R = radius

	chassis.addWheel({
		body: wheelR,
		position: new cannon.Vec3(-0.8, -0.5, d / 2 + 0.2),
		axis: new cannon.Vec3(0, 0, 1),
	})

	chassis.addWheel({
		body: wheelL,
		position: new cannon.Vec3(-0.8, -0.5, -d / 2 - 0.2),
		axis: new cannon.Vec3(0, 0, 1),
	})

	chassis.addWheel({
		body: casterWheel,
		position: new cannon.Vec3(2.1, -0.5, 0),
		axis: new cannon.Vec3(0, 0, 0),
	})

	chassis.addWheel({
		body: front_pointSphere1,
		position: new cannon.Vec3(w / 2 + 1, 1, -3),
		axis: new cannon.Vec3(0, 1, 0),
	})

	chassis.addWheel({
		body: front_pointSphere2,
		position: new cannon.Vec3(w / 2 + 1, 1, 3),
		axis: new cannon.Vec3(0, 1, 0),
	})

	return chassis
}

function wheel(radius, wheel_mass) {
	const body = new cannon.Body({
		mass: wheel_mass,
		shape: new cannon.Sphere(radius),
	})

	body.angularDamping = 0.5

	return body
}

export function controlBot(robot, input, speed, r1, r0) {
	if (input == "F") {
		robot.setWheelForce(-speed, 1)
		robot.setWheelForce(-speed, 0)
	} else if (input == "L") {
		robot.setWheelForce(speed, 1) //left wheel
		robot.setWheelForce(-speed, 0) //right wheel
	} else if (input == "R") {
		robot.setWheelForce(-speed, 1) //left wheel
		robot.setWheelForce(speed, 0) //right wheel
	} else if (input == "S") {
		robot.setWheelForce(-r1 * Math.abs(speed) * 10, 1) //left wheel
		robot.setWheelForce(-r0 * Math.abs(speed) * 10, 0) //right wheel
	}
}

export function addRenderRobotBodyParts(
	body_without_Target,
	body_with_Target,
	wheel_L,
	wheel_R,
	render_world
) {
	botPhysicalBodyShape = body_without_Target
	botPhysicalBodyShapeWithTarget = body_with_Target
	wheelShapeL = wheel_L
	wheelShapeR = wheel_R

	const arr = [botPhysicalBodyShape, botPhysicalBodyShapeWithTarget, wheelShapeL, wheelShapeR]
	for (let i = 0; i < 4; i++) {
		render_world.add(arr[i])
		console.log(arr[i])
		arr[i].position.set(0, 0, 0)
	}
}

export function botRender() {
	if (wheelShapeL && wheelShapeR && botPhysicalBodyShape) {
		wheelShapeL.position.copy(wheelL.position)
		wheelShapeL.quaternion.copy(wheelL.quaternion)
		wheelShapeR.position.copy(wheelR.position)
		wheelShapeR.quaternion.copy(wheelR.quaternion)

		if (destinationReached && !destinationReached2) {
			botPhysicalBodyShapeWithTarget.visible = true
			botPhysicalBodyShape.visible = false
		} else {
			botPhysicalBodyShapeWithTarget.visible = false
			botPhysicalBodyShape.visible = true
		}

		botPhysicalBodyShapeWithTarget.position.copy(botPhysicalBody_.position)
		botPhysicalBodyShapeWithTarget.quaternion.copy(botPhysicalBody_.quaternion)

		botPhysicalBodyShape.position.copy(botPhysicalBody_.position)
		botPhysicalBodyShape.quaternion.copy(botPhysicalBody_.quaternion)
	}
}

export function distanceFromBot(body) {
	const distance1 = Math.sqrt(
		Math.abs(body.position.x - front_pointSphere1.position.x) +
			Math.abs(body.position.z - front_pointSphere1.position.z)
	)

	const distance2 = Math.sqrt(
		Math.abs(body.position.x - front_pointSphere2.position.x) +
			Math.abs(body.position.z - front_pointSphere2.position.z)
	)

	const distance3 = Math.sqrt(
		Math.abs(body.position.x - casterWheel.position.x) +
			Math.abs(body.position.z - casterWheel.position.z)
	)

	return [distance1, distance2, distance3]
}

export function target_pick_drop(target, target_pos, robot) {
	const null_pos = new THREE.Vector2(0, 0)
	const pos = new THREE.Vector2(target.position.x, target.position.z)
	const threshold = 0.5
	const distance = Math.sqrt(
		Math.abs(target_pos.position.x - target.position.x) +
			Math.abs(target_pos.position.z - target.position.z)
	)

	if (distance <= threshold && !destinationReached) {
		return
	} else {
		if (targetPosition.equals(null_pos)) {
			targetPosition.copy(pos)
		}

		if (targetPosition.distanceTo(pos) > 1 && !destinationReached) {
			if (Math.abs(robot.getWheelSpeed(0)) < 0.01 || Math.abs(robot.getWheelSpeed(0)) < 0.01) {
				targetPosition.copy(pos)
				controlBot(robot, "S", speed, 0, 0)
				side = calculateSide(target)
				rotate = true
				forward = false
			} else {
				controlBot(robot, "S", -speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
			}
		} else {
			if (destinationReached == false) {
				botMovement(target, robot)
			} else if (destinationReached && !setDestination2) {
				if (timeStamp == 0) {
					controlBot(robot, "S", speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
					const pos = new THREE.Vector3(100, 10, 100)
					changeBallPostion(pos, true, true, false)
					timeStamp += 1
				} else if (timeStamp < 50) {
					controlBot(robot, "F", speed)
					timeStamp += 1
				} else {
					controlBot(robot, "S", speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
				}
				if (
					Math.abs(robot.getWheelSpeed(0)) < 0.01 &&
					Math.abs(robot.getWheelSpeed(1)) < 0.01
				) {
					setDestination2 = true
					timeStamp = 0
				}
			} else if (setDestination2 && !initialBotCoordsReached) {
				botMovement(initialBotCoordsSphere, robot)
			} else if (setDestination2 && !destinationReached2 && initialBotCoordsReached) {
				botMovement(target_pos, robot)
			} else if (destinationReached2) {
				const distance = Math.abs(
					botPhysicalBodyShape.position.distanceTo(initialBotCoordsSphere.position)
				)
				if (!checkBallVisibility()) {
					controlBot(robot, "S", speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
					changeBallPostion(target_pos.position, false, true, true)
				}

				if (distance > 1) {
					controlBot(robot, "F", -speed)
				} else {
					if (
						Math.abs(robot.getWheelSpeed(0)) < 0.01 &&
						Math.abs(robot.getWheelSpeed(1)) < 0.01
					) {
						resetBot(robot, target_pos)
					} else {
						console.log("Here")
						controlBot(robot, "S", speed * 2, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
					}
				}
			}
		}
	}
}

function botMovement(target, robot) {
	const targetDistance1 = front_pointSphere1.position.distanceTo(target.position)
	const targetDistance2 = front_pointSphere2.position.distanceTo(target.position)
	const targetDistance3 = casterWheel.position.distanceTo(target.position)
	const targetDistance4 = Math.abs(botPhysicalBodyShape.position.distanceTo(target.position))
	// console.log(targetDistance3 - targetDistance2 + ' ' + rotate + ' ' + forward)
	// console.log(targetDistance3 - targetDistance2);
	if (!side) side = calculateSide(target)
	speed = 10
	if (
		targetDistance4 < 7 &&
		!initialBotCoordsReached &&
		destinationReached &&
		targetDistance3 - targetDistance2 < -1 &&
		reverse == -1
	) {
		reverse = 1
	} else if (destinationReached && reverse == -1 && !initialBotCoordsReached) {
		reverse = 0
	}

	if (reverse == 1 && !initialBotCoordsReached) {
		reverseTakeTurns(side, targetDistance1, targetDistance2, targetDistance3, robot)

		if (Math.abs(robot.getWheelSpeed(0)) < 0.01 && rotate == false) {
			forward = true
			rotate = false
		}

		if (forward && !rotate) {
			speed = -20
			if (
				Math.abs(targetDistance1 - targetDistance2) > distanceDiffThreshold &&
				targetDistance3 > 5
			) {
				controlBot(robot, "S", speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
				if (
					Math.abs(robot.getWheelSpeed(0)) < 0.01 &&
					Math.abs(robot.getWheelSpeed(1)) < 0.01
				) {
					side = calculateSide(target)
					forward = false
					rotate = true
				}
			} else {
				controlBot(robot, "F", speed)
				rotate = false
			}

			if (targetDistance4 < 0.7) {
				controlBot(robot, "S", -speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
				forward = false
				rotate = false
				initialBotCoordsReached = true
			}
		}
	} else {
		if (targetDistance3 > 5 && rotate) {
			takeTurns(side, targetDistance1, targetDistance2, targetDistance3, robot)
		} else {
			if (Math.abs(targetDistance1 - targetDistance2) <= distanceDiffThreshold && !forward) {
				controlBot(robot, "S", -speed * 2, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
				rotate = false
				if (
					Math.abs(robot.getWheelSpeed(0)) < 0.01 &&
					Math.abs(robot.getWheelSpeed(1)) < 0.01
				) {
					forward = true
				}
			} else {
				takeTurns(side, targetDistance1, targetDistance2, targetDistance3, robot)
			}
		}

		if (Math.abs(robot.getWheelSpeed(0)) < 0.01 && rotate == false) {
			forward = true
			rotate = false
		}

		if (forward && !rotate) {
			speed = 20
			if (
				(Math.abs(targetDistance1 - targetDistance2) > distanceDiffThreshold ||
					targetDistance3 - targetDistance2 < -1) &&
				targetDistance3 > 5
			) {
				controlBot(robot, "S", speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
				if (
					Math.abs(robot.getWheelSpeed(0)) < 0.01 &&
					Math.abs(robot.getWheelSpeed(1)) < 0.01
				) {
					side = calculateSide(target)
					forward = false
					rotate = true
				}
			} else {
				controlBot(robot, "F", speed)
				rotate = false
			}

			if (destinationReached && !initialBotCoordsReached) {
				if (targetDistance4 < 0.7) {
					controlBot(robot, "S", -speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
					forward = false
					rotate = false
					initialBotCoordsReached = true
				}
			} else if (targetDistance3 < 4) {
				controlBot(robot, "S", speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
				forward = false
				rotate = false
				destinationReached == true ? (destinationReached2 = true) : (destinationReached = true)
			}
		}
	}
}

function calculateSide(target) {
	const x = target.position.x
	const y = target.position.z
	const x1 = botPhysicalBodyShape.position.x
	const y1 = botPhysicalBodyShape.position.z
	const x2 = casterWheel.position.x
	const y2 = casterWheel.position.z

	const d = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)

	if (d > 0) return 2
	else if (d < 0) return 1
}

function takeTurns(sides, targetDistance1, targetDistance2, targetDistance3, robot) {
	if (sides == 1) {
		if (Math.abs(targetDistance1 - targetDistance2) > distanceDiffThreshold && rotate) {
			controlBot(robot, "R", speed)
		} else if (
			Math.abs(targetDistance1 - targetDistance2) <= distanceDiffThreshold &&
			rotate &&
			targetDistance3 - targetDistance1 < -1
		) {
			controlBot(robot, "R", speed)
		} else if (targetDistance3 - targetDistance1 > 0 || rotate == false) {
			rotate = false
			controlBot(robot, "S", -speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
		}
	} else if (sides == 2) {
		if (Math.abs(targetDistance1 - targetDistance2) > distanceDiffThreshold && rotate) {
			controlBot(robot, "L", speed)
		} else if (
			Math.abs(targetDistance1 - targetDistance2) <= distanceDiffThreshold &&
			rotate &&
			targetDistance3 - targetDistance1 < -1
		) {
			controlBot(robot, "L", speed)
		} else if (targetDistance3 - targetDistance1 > 0 || rotate == false) {
			rotate = false
			controlBot(robot, "S", -speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
		}
	}
}

function reverseTakeTurns(sides, targetDistance1, targetDistance2, targetDistance3, robot) {
	if (sides == 1) {
		if (Math.abs(targetDistance1 - targetDistance2) > distanceDiffThreshold && rotate) {
			controlBot(robot, "R", speed)
		} else if (targetDistance3 - targetDistance1 < -1 || rotate == false) {
			rotate = false
			controlBot(robot, "S", -speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
		}
	} else if (sides == 2) {
		if (Math.abs(targetDistance1 - targetDistance2) > distanceDiffThreshold && rotate) {
			controlBot(robot, "L", speed)
		} else if (targetDistance3 - targetDistance1 < -1 || rotate == false) {
			rotate = false
			controlBot(robot, "S", -speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
		}
	}
}

export function resetBot(robot, target) {
	console.log("Reset")
	const newPos = new THREE.Vector2(0, 0)
	side = null
	targetPosition.equals(newPos)
	;(rotate = true), (forward = false)
	speed = 0
	destinationReached = false
	setDestination2 = false
	destinationReached2 = false
	initialBotCoordsReached = false
	timeStamp = 0
	controlBot(robot, "S", 0, 0, 0)
	changeBallPostion(target.position, false, true, true)
	reverse = -1
}
