import * as cannon from 'cannon-es'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { randInt } from 'three/src/math/mathutils'
import { changeBallPostion, checkBallVisibility } from '../functions/Ball.jsx'

let wheelL = null, wheelR = null
let wheel_R = null
let wheelShapeL = null, wheelShapeR = null
let casterWheel = null
let front_pointSphere1 = null, front_pointSphere2 = null
let botBody_ = null, botBodyShape = null, botBodyShapeWithTarget = null
const distanceDiffThreshold = 0.7

let side = null
const targetPosition = new THREE.Vector2(0, 0)
let rotate = true, forward = false
let speed = 0
let destinationReached = false
let setDestination2 = false
let destinationReached2 = false
let timeStamp = 0

export function groundPhyBody(physics_world) {

    const groundBody = new cannon.Body({
        type: cannon.Body.STATIC,
        shape: new cannon.Plane(),
    })

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    physics_world.addBody(groundBody)
}


function botBody(w, h, d, px, py, pz, m) {

    botBody_ = new cannon.Body({
        mass: m,
        position: new cannon.Vec3(px, py, pz),
        shape: new cannon.Box(new cannon.Vec3(w / 2, h / 2, d / 2)),

    })

    botBody_.quaternion.setFromEuler(0, -Math.PI/4, 0)

    return botBody_

}

export function bot(w, h, d, px, py, pz, m, radius, wheel_mass, physics_world, render_world) {
    const chassis = new cannon.RigidVehicle({
        chassisBody: botBody(w, h, d, px, py, pz, m),

    })


    wheelL = wheel(radius, wheel_mass)
    wheelR = wheel(radius, wheel_mass)
    casterWheel = wheel(radius, 1)
    front_pointSphere1 = wheel(0.5, 0.1)
    front_pointSphere2 = wheel(0.5, 0.1)

    wheelL.quaternion.copy(botBody_.quaternion)
    wheelR.quaternion.copy(botBody_.quaternion)

    wheel_R = radius

    chassis.addWheel({
        body: wheelR,
        position: new cannon.Vec3(-0.8, -0.5, d / 2 + 0.2),
        axis: new cannon.Vec3(0, 0, 1)
    })

    chassis.addWheel({
        body: wheelL,
        position: new cannon.Vec3(-0.8, -0.5, -d / 2 - 0.2),
        axis: new cannon.Vec3(0, 0, 1)
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
    if (input == 'F') {
        robot.setWheelForce(-speed, 1)
        robot.setWheelForce(-speed, 0)

    }

    else if (input == 'L') {
        robot.setWheelForce(speed, 1)//left wheel
        robot.setWheelForce(-speed, 0)//right wheel

    }

    else if (input == 'R') {

        robot.setWheelForce(-speed, 1)//left wheel
        robot.setWheelForce(speed, 0)//right wheel

    }

    else if (input == 'S') {
        robot.setWheelForce(-r1 * Math.abs(speed) * 10, 1)//left wheel
        robot.setWheelForce(-r0 * Math.abs(speed) * 10, 0)//right wheel

    }
}


function wheelShape() {
    const wheelBody = new THREE.Mesh(new THREE.SphereGeometry(wheel_R), new THREE.MeshStandardMaterial({
        color: "white",
    }))

    return wheelBody
}

export function addRenderRobotBodyParts(body_without_Target,body_with_Target,wheel_L, wheel_R, render_world){

    botBodyShape = body_without_Target
    botBodyShapeWithTarget = body_with_Target
    wheelShapeL = wheel_L
    wheelShapeR = wheel_R

    const arr = [botBodyShape, botBodyShapeWithTarget, wheelShapeL, wheelShapeR]
    for (let i = 0; i < 4; i++){
        render_world.add(arr[i])
        console.log(arr[i])
        arr[i].position.set(0,0,0)
    }
}

export function botAddToScene(render_world) {

    const model = new GLTFLoader()

    model.load('/3d_models/TuFu.glb', (body) => {
        body.scene.position.set(new THREE.Vector3(0, -10, 0))
        render_world.add(body.scene)

        botBodyShape = body.scene
    }, undefined, function (error) {

        console.error(error)

    })

    model.load('/3d_models/TuFu_Ball.glb', (body) => {
        body.scene.position.set(new THREE.Vector3(0, -10, 0))
        render_world.add(body.scene)

        botBodyShapeWithTarget = body.scene
    }, undefined, function (error) {

        console.error(error)

    })

    model.load('/3d_models/TuFu_wheel.glb', (wheel) => {
        wheel.scene.position.set(new THREE.Vector3(0, -10, 0))
        render_world.add(wheel.scene)

        wheelShapeL = wheel.scene

    }, undefined, function (error) {

        console.error(error)

    })

    model.load('/3d_models/TuFu_wheel.glb', (wheel) => {
        wheel.scene.position.set(new THREE.Vector3(0, -10, 0))
        render_world.add(wheel.scene)

        wheelShapeR = wheel.scene

    }, undefined, function (error) {

        console.error(error)

    })
}

export function botRender() {

    if (wheelShapeL && wheelShapeR && botBodyShape) {

        wheelShapeL.position.copy(wheelL.position)
        wheelShapeL.quaternion.copy(wheelL.quaternion)
        wheelShapeR.position.copy(wheelR.position)
        wheelShapeR.quaternion.copy(wheelR.quaternion)

        if (destinationReached && !destinationReached2) {
            botBodyShapeWithTarget.visible = true
            botBodyShape.visible = false
        }
        else {
            botBodyShapeWithTarget.visible = false
            botBodyShape.visible = true
        }

        botBodyShapeWithTarget.position.copy(botBody_.position)
        botBodyShapeWithTarget.quaternion.copy(botBody_.quaternion)


        botBodyShape.position.copy(botBody_.position)
        botBodyShape.quaternion.copy(botBody_.quaternion)




    }

}


export function distanceFromBot(body) {
    const distance1 = Math.sqrt(
        Math.abs(body.position.x - front_pointSphere1.position.x) +
        Math.abs(body.position.z - front_pointSphere1.position.z))

    const distance2 = Math.sqrt(
        Math.abs(body.position.x - front_pointSphere2.position.x) +
        Math.abs(body.position.z - front_pointSphere2.position.z))

    const distance3 = Math.sqrt(
        Math.abs(body.position.x - casterWheel.position.x) +
        Math.abs(body.position.z - casterWheel.position.z))

    const angle = (Math.atan2(
        (body.position.z - botBodyShape.position.z),
        (body.position.x - botBodyShape.position.x)) * 180) / Math.PI

    let botAngle = (botBodyShape.rotation.y * 180) / Math.PI

    // if (botAngle < 0) botAngle = 180 - botAngle

    // console.log(((2* Math.acos(botBody_.quaternion.w))*180)/Math.PI)

    // const pointA = botBodyShape.position
    // const pointB_1 = casterWheel.position
    // const pointB_2 = body.position

    // if (pointA.x == pointB_1.x && pointA.z == pointB_2.z){
    //     botAngle = 90
    // }

    // else{
    //     const m1 = (pointA.z - pointB_2.z)/(pointA.x - pointB_2.x)
    //     const m2 = (pointA.z - pointB_1.z)/(pointA.x - pointB_1.x)

    //     botAngle = ((Math.atan((m1-m2)/(1+m1*m2)))*180)/Math.PI

    //     console.log(m1 + ' ' + m2 + ' ' + botAngle)

    // }

    return [distance1, distance2, distance3]
}


export function target_pick_drop(target, target_pos, robot) {
    const null_pos = new THREE.Vector2(0, 0)
    const pos = new THREE.Vector2(target.position.x, target.position.z)
    const threshold = 2.5
    const distance = Math.sqrt(
        Math.abs(target_pos.position.x - target.position.x) +
        Math.abs(target_pos.position.z - target.position.z))

    if (distance <= threshold && !destinationReached) {
        return
    }
    else {


        if (targetPosition.equals(null_pos)) {
            targetPosition.copy(pos)
        }

        if (targetPosition.distanceTo(pos) > 1 && !destinationReached) {
            if (Math.abs(robot.getWheelSpeed(0)) < 0.01 || Math.abs(robot.getWheelSpeed(0)) < 0.01) {
                targetPosition.copy(pos)
                controlBot(robot, 'S', speed, 0, 0)
                side = calculateSide(target)
                rotate = true
                forward = false
            }
            else {
                controlBot(robot, 'S', -speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
            }

        }

        else {

            if (destinationReached == false) {
                botMovement(target, robot)
            }
            else if (destinationReached && !setDestination2) {
                if (timeStamp == 0){
                    controlBot(robot, 'S', speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
                changeBallPostion(target_pos.position, true, true, false)
                timeStamp += 1
                }
                
                else if (timeStamp < 200){
                    controlBot(robot, 'F', speed)
                    timeStamp += 1
                }
                else{
                    controlBot(robot, 'S', speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
                }
                if (Math.abs(robot.getWheelSpeed(0)) < 0.01 && Math.abs(robot.getWheelSpeed(1)) < 0.01) {
                    setDestination2 = true
                    timeStamp = 0
                }
            }

            else if (setDestination2 && !destinationReached2) {
                botMovement(target_pos, robot)
            }

            else if (destinationReached2) {
                if (!checkBallVisibility()) {
                    controlBot(robot, 'S', speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
                    changeBallPostion(target_pos.position, false, true, true)

                }


                if (Math.abs(robot.getWheelSpeed(0)) > 0.01 && Math.abs(robot.getWheelSpeed(1)) > 0.01 && timeStamp == 0) {
                    controlBot(robot, 'S', speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
                }

                else if (timeStamp < 350) {
                    controlBot(robot, 'F', -speed)
                    timeStamp += 1
                }

                else {
                    if (Math.abs(robot.getWheelSpeed(0)) < 0.01 && Math.abs(robot.getWheelSpeed(1)) < 0.01) {
                        console.log('Reset')
                        const newPos = new THREE.Vector2(0, 0)
                        side = null
                        targetPosition.equals(newPos)
                        rotate = true, forward = false
                        speed = 0
                        destinationReached = false
                        setDestination2 = false
                        destinationReached2 = false
                        timeStamp = 0
                        controlBot(robot, 'S', 0, 0, 0)
                        changeBallPostion(target_pos.position, false, true, true)

                    }

                    else {
                        controlBot(robot, 'S', speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))

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
    // console.log(targetDistance3 - targetDistance2 + ' ' + rotate + ' ' + forward)

    if (!side) side = calculateSide(target)
    speed = 5
    if (side == 1) {
        if ((Math.abs(targetDistance1 - targetDistance2) > distanceDiffThreshold) && rotate) {
            controlBot(robot, 'R', speed)

        }

        else if ((Math.abs(targetDistance1 - targetDistance2) <= distanceDiffThreshold) && rotate && (targetDistance3 - targetDistance1) < -1){
            controlBot(robot, 'R', speed)
        }

        else if ((targetDistance3 - targetDistance1) > 0 || rotate == false) {
            rotate = false
            controlBot(robot, 'S', -speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))


        }
    }

    else if (side == 2) {
        if ((Math.abs(targetDistance1 - targetDistance2) > distanceDiffThreshold) && rotate) {
            controlBot(robot, 'L', speed)
        }
        else if ((Math.abs(targetDistance1 - targetDistance2) <= distanceDiffThreshold) && rotate && (targetDistance3 - targetDistance1) < -1){
            controlBot(robot, 'L', speed)
        }

        else if ((targetDistance3 - targetDistance1) > 0 || rotate == false) {
            rotate = false
            controlBot(robot, 'S', -speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))

        }
    }

    if (Math.abs(robot.getWheelSpeed(0)) < 0.01 && rotate == false) {
        forward = true
        rotate = false


    }

    if (forward && !rotate) {
        speed = 10

        if (Math.abs(targetDistance1 - targetDistance2) > distanceDiffThreshold || ((targetDistance3 - targetDistance2) < -1)) {
            controlBot(robot, 'S', speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
            if (Math.abs(robot.getWheelSpeed(0)) < 0.01 && Math.abs(robot.getWheelSpeed(1)) < 0.01) {
                console.log("Ws here")
                side = calculateSide(target)
                forward = false
                rotate = true
            }
        }
        else {
            controlBot(robot, 'F', speed)
            rotate = false
        }

        if (targetDistance3 < 4) {

            controlBot(robot, 'S', speed, robot.getWheelSpeed(1), robot.getWheelSpeed(0))
            forward = false
            rotate = false
            destinationReached == true ? destinationReached2 = true : destinationReached = true


        }

    }
}


function calculateSide(target) {
    const x = target.position.x
    const y = target.position.z
    const x1 = botBodyShape.position.x
    const y1 = botBodyShape.position.z
    const x2 = casterWheel.position.x
    const y2 = casterWheel.position.z

    const d = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)

    if (d > 0) return 2
    else if (d < 0) return 1

}
let loaded = 0
export function loadRobotModels(){
    
    
    const manager = new THREE.LoadingManager()
    const model = new GLTFLoader(manager)

    manager.onProgress = (url,items,number)=>{
        console.log( 'Loading file: ' + url + '.\nLoaded ' + items + ' of ' + number + ' files.' )
    }

    manager.onLoad = ()=>{
        console.log("Complete")
    }

    model.load('/3d_models/TuFu.glb', (body) => {
        body.scene.position.set(new THREE.Vector3(0, -10, 0))
        // render_world.add(body.scene)

        // botBodyShape = body.scene
    }, ()=>{
        loaded += 1
    })
    model.load('/3d_models/TuFu_Ball.glb', (body) => {
        body.scene.position.set(new THREE.Vector3(0, -10, 0))
        // render_world.add(body.scene)

        // botBodyShape = body.scene
    }, ()=>{
        loaded += 1
    })

    model.load('/3d_models/TuFu_wheel.glb', (body) => {
        body.scene.position.set(new THREE.Vector3(0, -10, 0))
        // render_world.add(body.scene)

        // botBodyShape = body.scene
    }, ()=>{
        loaded += 1
    })
    model.load('/3d_models/TuFu_wheel.glb', (body) => {
        body.scene.position.set(new THREE.Vector3(0, -10, 0))
        // render_world.add(body.scene)

        // botBodyShape = body.scene
    }, ()=>{
        loaded += 1
    })
    console.log(loaded)
}