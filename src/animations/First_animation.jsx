import React from 'react'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger, * as C_DEBUGGER from 'cannon-es-debugger'


const First_animation = () => {

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,

    }

    //Scene

    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#E5E1DA" )

    //shape

    //ground
    const ground = new THREE.Mesh(new THREE.BoxGeometry( 100, 1, 100 ), new THREE.MeshStandardMaterial(
        { color: "E5E1DA", }
    ))
    ground.position.y = -1
    scene.add(ground)
    
    //box
    const box = new THREE.Mesh(new THREE.BoxGeometry( 2, 2, 2 ), new THREE.MeshStandardMaterial(
        { color: "green", }
    ))
    // ground.position.y = -1
    scene.add(box)


    // // light

    const light = new THREE.PointLight("white", 10000)
    light.castShadow = true
    light.position.set(0,50,10)
    scene.add(light)

    // //camera

    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000)
    camera.position.z = 20
    camera.position.y = 20  
    camera.lookAt(0,0,0)
    scene.add(camera)


    //physics

    //physics world

    const physics_world = new CANNON.World({
        gravity: new CANNON.Vec3(0,-9.81,0),
    })

    //creating ground plane

    const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),

    })

    groundBody.quaternion.setFromEuler(-Math.PI/2, 0,0)
    physics_world.addBody(groundBody)


    //creating box

    const boxBody = new CANNON.Body({
        mass: 2,
        shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),

    })


    boxBody.position.set(0,20,0)
    boxBody.quaternion.setFromEuler(Math.PI/4,Math.PI/4,0)

    physics_world.addBody(boxBody)

    // //render

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

    //cannon-es-debugger

    const c_debug = new CannonDebugger(scene, physics_world, {})

    const animate = () => {

        physics_world.fixedStep()
        // c_debug.update() //physics debugger

        box.position.copy(boxBody.position)
        box.quaternion.copy(boxBody.quaternion)

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