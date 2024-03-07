import * as cannon from 'cannon-es'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { randInt } from 'three/src/math/mathutils'

let wheelL = null, wheelR = null
let wheel_R = null
let wheelShapeL = null, wheelShapeR = null
let casterWheel = null
let front_pointSphere1 = null, front_pointSphere2 = null
let botBody_ = null
let botBodyShape = null
let side = null
let init_targetPos = null
let f = false


function botBody(w, h, d, px, py, pz, m) {

    botBody_ = new cannon.Body({
        mass: m,
        position: new cannon.Vec3(px, py, pz),
        shape: new cannon.Box(new cannon.Vec3(w / 2, h / 2, d / 2)),

    })

    botBody_.quaternion.setFromEuler(0, -Math.PI / 2, 0)

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
        material: new cannon.Material('wheel'),

    })

    body.angularDamping = 0.4

    return body
}


export function controlBot(robot, input, speed) {
    if (input == 'F') {
        robot.setWheelForce(-speed, 1)
        robot.setWheelForce(-speed, 0)
        // robot.setMotorSpeed(speed,0)
        // robot.setMotorSpeed(speed, 1)
    }

    else if (input == 'L') {
        robot.setWheelForce(speed, 1)//left wheel
        robot.setWheelForce(-speed, 0)//right wheel
        // robot.setMotorSpeed(speed,0)//left wheel
        // robot.setMotorSpeed(0, 1)//right wheel
    }

    else if (input == 'R') {
        // robot.setMotorSpeed(0, 0)//left wheel
        // robot.setMotorSpeed(1000, 1)//right wheel
        // // robot.applyWheelForce(1,1)
        robot.setWheelForce(-speed, 1)//left wheel
        robot.setWheelForce(speed, 0)//right wheel

    }

    else if (input == 'S') {
        robot.setWheelForce(0, 1)//left wheel
        robot.setWheelForce(0, 0)//right wheel
        robot.setMotorSpeed(0.5, 0)//left wheel
        robot.setMotorSpeed(0.5, 1)//right wheel

    }
}


function wheelShape() {
    const wheelBody = new THREE.Mesh(new THREE.SphereGeometry(wheel_R), new THREE.MeshStandardMaterial({
        color: "white",
    }))

    return wheelBody
}

export function botAddToScene(render_world) {

    const model = new GLTFLoader()

    model.load('/3d_models/TuFu.glb', (body) => {
        render_world.add(body.scene)

        botBodyShape = body.scene
    }, undefined, function (error) {

        console.error(error)

    })

    model.load('/3d_models/TuFu_wheel.glb', (wheel) => {
        render_world.add(wheel.scene)

        wheelShapeL = wheel.scene

    }, undefined, function (error) {

        console.error(error)

    })

    model.load('/3d_models/TuFu_wheel.glb', (wheel) => {
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
    const threshold = 2.5
    const distance = Math.sqrt(
        Math.abs(target_pos.position.x - target.position.x) +
        Math.abs(target_pos.position.z - target.position.z))

    if (distance <= threshold) {
        return
    }
    else {

        if (!init_targetPos) init_targetPos = target_pos
        const targetDistance1 = front_pointSphere1.position.distanceTo(target.position)
        const targetDistance2 = front_pointSphere2.position.distanceTo(target.position)
        const targetDistance3 = casterWheel.position.distanceTo(target.position)

        if (!side) side = randInt(1, 2)

        if (side == 1) {
            if ((Math.abs(targetDistance1 - targetDistance2) > 0.4)) {
                controlBot(robot, 'R', 5)

            }

            else if (targetDistance1 < targetDistance3) {
                controlBot(robot, 'S', -10)
                // f = true
            }
        }

        else if (side == 2) {
            if ((Math.abs(targetDistance1 - targetDistance2) > 0.4)) {
                controlBot(robot, 'L', 5)

            }

            else if (targetDistance1 < targetDistance3) {
                controlBot(robot, 'S', -10)
                // f = true
            }
        }

        // if (f) controlBot(robot, 'F' , 200)
        console.log(targetDistance1 + ' ' + targetDistance3)
    }

}

