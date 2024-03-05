import * as cannon from 'cannon-es'
import * as THREE from 'three'

let wheelL = null, wheelR = null
let wheel_R = null
let wheelShapeL = null, wheelShapeR = null
let botBody_ = null
let botBodyShape = null

function botBody(w, h, d, px, py, pz, m) {

    botBody_ = new cannon.Body({
        mass: m,
        position: new cannon.Vec3(px, py, pz),
        shape: new cannon.Box(new cannon.Vec3(w / 2, h / 2, d / 2))
    })

    return botBody_

}

export function bot(w, h, d, px, py, pz, m, radius, wheel_mass, physics_world, render_world) {
    const chassis = new cannon.RigidVehicle({
        chassisBody: botBody(w, h, d, px, py, pz, m),

    })


    wheelL = wheel(radius, wheel_mass)
    wheelR = wheel(radius, wheel_mass)
    botBodyShape = bodyShape(w, h, d)
    wheel_R = radius

    chassis.addWheel({
        body: wheelR,
        position: new cannon.Vec3(-1, 0, d / 2),
        axis: new cannon.Vec3(0, 0, 1)
    })

    chassis.addWheel({
        body: wheelL,
        position: new cannon.Vec3(-1, 0, -d / 2),
        axis: new cannon.Vec3(0, 0, 1)
    })

    chassis.addWheel({
        body: wheel(radius, 1),
        position: new cannon.Vec3(2.1, 0, 0),
        axis: new cannon.Vec3(0, 0, 0),

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


export function controlBot(robot, input) {
    if (input == 'F') {
        robot.setWheelForce(-10, 1)
        robot.setWheelForce(-10, 0)
        // robot.setMotorSpeed(0,0)
        // robot.setMotorSpeed(0, 1)
    }

    else if (input == 'L') {
        robot.setWheelForce(0, 1)//left wheel
        robot.setWheelForce(-10, 0)//right wheel
        // robot.setMotorSpeed(0,0)//left wheel
        robot.setMotorSpeed(0, 1)//right wheel
    }

    else if (input == 'R') {
        robot.setWheelForce(-10, 1)//left wheel
        robot.setWheelForce(0, 0)//right wheel
        robot.setMotorSpeed(0, 0)//left wheel
        // robot.setMotorSpeed(0, 1)//right wheel
    }

    else if (input == 'S') {
        robot.setWheelForce(0, 1)//left wheel
        robot.setWheelForce(0, 0)//right wheel
        // robot.setMotorSpeed(0, 0)//left wheel
        // robot.setMotorSpeed(0, 1)//right wheel
    }
}


function wheelShape(){
    const wheelBody = new THREE.Mesh(new THREE.SphereGeometry(wheel_R), new THREE.MeshStandardMaterial({
        color: "white",
    }))

    return wheelBody
}

function bodyShape(w, h, d){
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({
        color: "white",
    }))

    return body
}

export function botAddToScene(render_world){

    wheelShapeL = wheelShape()
    wheelShapeR = wheelShape() 

    render_world.add(wheelShapeL)
    render_world.add(wheelShapeR)
    render_world.add(botBodyShape)

}

export function botRender(){

    wheelShapeL.position.copy(wheelL.position)
    wheelShapeL.quaternion.copy(wheelL.quaternion)
    wheelShapeR.position.copy(wheelR.position)
    wheelShapeR.quaternion.copy(wheelR.quaternion)

    botBodyShape.position.copy(botBody_.position)
    botBodyShape.quaternion.copy(botBody_.quaternion)
}


export function distanceFromBot(body){
    const distance = Math.sqrt(
        Math.abs(body.position.x-botBody_.position.x) + 
        Math.abs(body.position.z-botBody_.position.z))

    const angle = (Math.atan2(
        (body.position.z-botBody_.position.z),
        (body.position.x-botBody_.position.x))*180)/Math.PI
    
    return [distance, angle]
}