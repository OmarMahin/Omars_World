import React from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as CANNON from 'cannon-es'
import CannonDebugger, * as C_DEBUGGER from 'cannon-es-debugger'
import {groundPhyBody, bot, controlBot, botAddToScene, botRender, target_pick_drop, addRenderRobotBodyParts } from '../functions/Robot.jsx'

import { ball, render_Ball } from '../functions/Ball.jsx'
import { Vector3 } from 'three'
import { useEffect } from 'react'
import { useState } from 'react'





const First_animation = () => {
    
    const sizes = {
        width: 1150,
        height: 600,

    }

    //Scene

    const scene = new THREE.Scene()
    //shape


    //plane

    const plane = new THREE.Plane(new Vector3(0, 1, 0), 0)

    //target_sphere

    const target_sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshBasicMaterial({
        transparent: true,
        color: 'green',
        opacity: 1,
    }))

    target_sphere.userData.draggable = false
    target_sphere.userData.name = 'Target'
    target_sphere.position.set(5,1,3.12)
    scene.add(target_sphere)

    // light

    const light = new THREE.DirectionalLight( '#EDEDED', 2.5)
    light.position.set(0, 100, 0)
    scene.add(light)

    const light2 = new THREE.HemisphereLight( 'white', 'white', 1 )
    light2.position.set(0, 100, 0)
    scene.add(light2)

    //camera
    let fov = 45
    console.log(sizes.width / sizes.height)
    const camera = new THREE.PerspectiveCamera(fov, 1150/600, 1, 1000)
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


    //bot
    let robot = null
    const loadManager = new THREE.LoadingManager()
    const model = new GLTFLoader(loadManager)

    loadManager.onProgress = (url,items,number)=>{
        console.log( 'Loading file: ' + url + '.\nLoaded ' + items + ' of ' + number + ' files.' )
    }

    
    let botBody = null, botWithBall = null, botWheelL = null, botWheelR = null

    model.load('/3d_models/TuFu.glb', (body)=>{botBody = body.scene}, ()=>{})
    model.load('/3d_models/TuFu_Ball.glb', (body)=>{botWithBall = body.scene
    // botWithBall.position.set(0,-10,0)
    // scene.add(botWithBall)
}, ()=>{})
    model.load('/3d_models/TuFu_wheel.glb', (body)=>{botWheelL = body.scene}, ()=>{})
    model.load('/3d_models/TuFu_wheel.glb', (body)=>{botWheelR = body.scene}, ()=>{})
    

    loadManager.onLoad = ()=>{
        robot = bot(5, 2, 3.99, -10, 2, 0, 7, 1.3, 5)
        robot.addToWorld(physics_world)
        addRenderRobotBodyParts(botBody, botWithBall, botWheelL, botWheelR, scene)
        console.log("Complete")
        console.log(botWheelR)
        
    }

    loadManager.onError = function ( url ) {
        console.log( 'There was an error loading ' + url );
    };
    

    

    // const robot = bot(5, 2, 3.99, -10, 2, 0, 7, 1.3, 5)
    // robot.addToWorld(physics_world)
    // botAddToScene(scene, physics_world)

    // controlBot(robot, 'S')



    // const [physics_ball, ball_body, positionBall] = ball(physics_world, scene, 5,1+1,3.12)


    //render

    const canvas = document.querySelector(".webgl")
    const renderer = new THREE.WebGLRenderer({ canvas: canvas,
    alpha: true })

    renderer.setSize(sizes.width, sizes.height)
    renderer.render(scene, camera)


    // //update sizes
    window.addEventListener('resize', () => {
        const browserZoomLevel = window.devicePixelRatio;
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        camera.aspect = sizes.width / sizes.height


        if (camera.aspect > 16/9) {
            // window too large
            camera.fov = fov;
        } else {
            // window too narrow
            const cameraHeight = Math.tan(MathUtils.degToRad(fov / 2));
            const ratio = camera.aspect / planeAspectRatio;
            const newCameraHeight = cameraHeight / ratio;
            camera.fov = MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
        }

        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height)
        // console.log(window.innerWidth)
    })


    // ray casting

    const raycaster = new THREE.Raycaster()
    let mouse = new THREE.Vector2()
    let mouseMove = new THREE.Vector2()
    let objects = new THREE.Object3D
    let picked = false
    let y_pos = null

    // window.addEventListener('mousedown', (e) => {

    //     const lL = window.innerWidth/2 - 1150/2
    //     const hL = window.innerWidth/2 + 1150/2

    //     const lL_y = 0
    //     const hL_y = 600

    //     if (e.clientX >= lL && e.clientX <= hL){
    //         const posX = e.clientX - lL

    //         mouse.x = (posX / 1150) * 2 - 1
    //     }
    //     else{
    //         mouse.x = (mouse.x) < 0 ? -1 : 1
    //     }

    //     if (e.clientY >= lL_y && e.clientY <= hL_y){
    //         const posY = e.clientY - lL_y

    //         mouse.y = -(posY / 600) * 2 + 1
    //     }
    //     else{
    //         mouse.y = (mouse.y) < 0 ? -1 : 1
    //     }

    //     raycaster.setFromCamera(mouse, camera)

    //     objects = raycaster.intersectObjects(scene.children)

    //     console.log(objects)

    //     if (objects.length > 0 && objects[0].object.userData.draggable) {
    //         y_pos = objects[0].object.position.y
    //         picked = true
    //     }

    // })

    // //letting the object drop

    // window.addEventListener('mouseup', (e) => {
    //     if (picked) {
    //         picked = false
    //         ball_body.position.y = 5
    //         physics_ball.position.copy(ball_body.position)
    //         physics_ball.quaternion.copy(ball_body.quaternion)
    //     }
    // })

    // //dragging the object

    // window.addEventListener('mousemove', (e) => {

    //     const past_mouseMove_x = mouseMove.x
    //     const past_mouseMove_y = mouseMove.y

    //     // mouseMove.x = (e.clientX / sizes.width) * 2 - 1;
    //     // mouseMove.y = - (e.clientY / window.innerHeight) * 2 + 1;

    //     const lL = window.innerWidth/2 - 1150/2
    //     const hL = window.innerWidth/2 + 1150/2

    //     const lL_y = 0
    //     const hL_y = 600

    //     if (e.clientX >= lL && e.clientX <= hL){
    //         const posX = e.clientX - lL

    //         mouseMove.x = (posX / 1150) * 2 - 1
    //     }
    //     else{
    //         mouseMove.x = (mouseMove.x) < 0 ? -1 : 1
    //     }

    //     if (e.clientY >= lL_y && e.clientY <= hL_y){
    //         const posY = e.clientY - lL_y

    //         mouseMove.y = -(posY / 600) * 2 + 1
    //     }
    //     else{
    //         mouseMove.y = (mouseMove.y) < 0 ? -1 : 1
    //     }
        
    //     // console.log(mouseMove.x + ' ' + mouseMove.y)

    //     if (mouseMove.x < -1 || mouseMove.x > 1) {
    //         mouseMove.x = past_mouseMove_x
    //     }
    //     if (mouseMove.y < -1 || mouseMove.y > 1) {
    //         mouseMove.y = past_mouseMove_y
    //     }

    // })

    // //picking object and dragging it

    // let pickedObject = () => {
    //     if (picked) {
    //         raycaster.setFromCamera(mouseMove, camera)
    //         console.log(raycaster)
    //         let intersects = new THREE.Vector3()    
    //         raycaster.ray.intersectPlane(plane, intersects)

    //         ball_body.position.set(intersects.x, y_pos, intersects.z)


    //     }
    // }

    // //cannon-es-debugger

    const c_debug = new CannonDebugger(scene, physics_world, {})

    

    const animate = () => {
        physics_world.fixedStep()
        c_debug.update() //physics debugger

        // render_Ball()
        botRender()
        
        // target_pick_drop(positionBall, target_sphere, robot)
        // pickedObject()
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        
    }

    // // console.log(elementPos)
    animate()

    

    return (
        <>

        </>
    )
}

export default First_animation