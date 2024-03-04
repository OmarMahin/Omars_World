import * as cannon from 'cannon-es'

function botBody(w, h, d, px, py, pz, m) {

    const body = new cannon.Body({
        mass: m,
        position: new cannon.Vec3(px, py, pz),
        shape: new cannon.Box(new cannon.Vec3(w / 2, h / 2, d / 2))
    })

    return body

}

export function bot(w, h, d, px, py, pz, m, radius, wheel_mass) {
    const chassis = new cannon.RigidVehicle({
        chassisBody: botBody(w, h, d, px, py, pz, m),

    })

    chassis.addWheel({
        body: wheel(radius, wheel_mass),
        position: new cannon.Vec3(-1, 0, d / 2),
        axis: new cannon.Vec3(0, 0, 1)
    })

    chassis.addWheel({
        body: wheel(radius, wheel_mass),
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
        robot.setWheelForce(-10, 1)
        robot.setWheelForce(-10, 0)
        // robot.setMotorSpeed(0,0)
        robot.setMotorSpeed(0, 1)
    }

    else if (input == 'R') {
        robot.setWheelForce(-10, 1)
        robot.setWheelForce(-10, 0)
        robot.setMotorSpeed(0, 0)
        // robot.setMotorSpeed(0, 1)
    }

    else if (input == 'S') {
        robot.setWheelForce(-10, 1)
        robot.setWheelForce(-10, 0)
        robot.setMotorSpeed(0, 0)
        robot.setMotorSpeed(0, 1)
    }
}
