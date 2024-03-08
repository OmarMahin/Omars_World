import React from 'react'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger, * as C_DEBUGGER from 'cannon-es-debugger'
import {groundPhyBody, bot, controlBot, botAddToScene, botRender, target_pick_drop } from '../functions/Robot.jsx'

import { ball, render_Ball } from '../functions/Ball.jsx'
import { Vector3 } from 'three'



const First_animation = () => {

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,

    }

    //Scene

    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#E5E1DA")//

    //axis

    const axis = new THREE.AxesHelper(8)
    scene.add(axis)

    //shape

    //ground
    const ground = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshStandardMaterial(
        { color: "black", }//d1d1d1
    ))
    ground.name = 'ground'
    ground.position.y = -1
    ground.userData.draggable = false
    ground.userData.name = 'ground'
    scene.add(ground)

    //plane

    const plane = new THREE.Plane(new Vector3(0, 1, 0), 0)

    //target_sphere

    const target_sphere = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial({
        transparent: false,
        color: 'green'
    }))

    target_sphere.userData.draggable = false
    target_sphere.userData.name = 'Target'
    target_sphere.position.set(0,1.5,0)
    scene.add(target_sphere)

    // light

    const light = new THREE.PointLight("white", 60000)
    light.position.set(0, 100, 10)
    scene.add(light)

    //camera

    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000)
    camera.position.z = 20
    camera.position.y = 20
    camera.lookAt(0, 0, 0)
    scene.add(camera)


    //physics

    //physics world

    const physics_world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.81, 0),
    })

    //creating ground plane
    groundPhyBody(physics_world)

    // const staticCube = new CANNON.Body({
    //     type: CANNON.Body.STATIC,
    //     shape: new CANNON.Box(1,1,1),
    //     position: new CANNON.Vec3(0,1,0)

    // })

    

    //bot

    const robot = bot(5, 2, 3.99, -10, 5, -10, 7, 1.3, 5)

    robot.addToWorld(physics_world)
    botAddToScene(scene, physics_world)

    // controlBot(robot, 'S')



    const [physics_ball, ball_body, positionBall] = ball(physics_world, scene, 0, 10, 0)


    //render

    const canvas = document.querySelector(".webgl")
    const renderer = new THREE.WebGLRenderer({ canvas })

    renderer.setSize(sizes.width, sizes.height)
    renderer.render(scene, camera)


    // //update sizes
    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height)
    })


    // ray casting

    const raycaster = new THREE.Raycaster()
    let mouse = new THREE.Vector2()
    let mouseMove = new THREE.Vector2()
    let objects = new THREE.Object3D
    let picked = false
    let y_pos = null

    window.addEventListener('mousedown', (e) => {

        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera)

        objects = raycaster.intersectObjects(scene.children)



        if (objects.length > 0 && objects[0].object.userData.draggable) {
            y_pos = objects[0].object.position.y
            picked = true
        }

    })

    //letting the object drop

    window.addEventListener('mouseup', (e) => {
        if (picked) {
            picked = false
            ball_body.position.y = 5
            physics_ball.position.copy(ball_body.position)
            physics_ball.quaternion.copy(ball_body.quaternion)
        }
    })

    //dragging the object

    window.addEventListener('mousemove', (e) => {

        const past_mouseMove_x = mouseMove.x
        const past_mouseMove_y = mouseMove.y

        mouseMove.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseMove.y = - (e.clientY / window.innerHeight) * 2 + 1;

        if (mouseMove.x < -1 || mouseMove.x > 1) {
            mouseMove.x = past_mouseMove_x
        }
        if (mouseMove.y < -1 || mouseMove.y > 1) {
            mouseMove.y = past_mouseMove_y
        }

    })

    //picking object and dragging it

    let pickedObject = () => {
        if (picked) {
            raycaster.setFromCamera(mouseMove, camera)

            let intersects = new THREE.Vector3()
            raycaster.ray.intersectPlane(plane, intersects)

            ball_body.position.set(intersects.x, y_pos, intersects.z)


        }
    }

    //cannon-es-debugger

    const c_debug = new CannonDebugger(scene, physics_world, {})

    

    const animate = () => {

        physics_world.fixedStep()
        // c_debug.update() //physics debugger

        render_Ball()
        botRender()

        target_pick_drop(positionBall, target_sphere, robot)
        pickedObject()
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }


    animate()

    return (
        <>

        </>
    )
}

export default First_animation