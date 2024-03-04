import React from 'react'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger, * as C_DEBUGGER from 'cannon-es-debugger'


import { bot, controlBot} from '../functions/Robot.jsx'



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

    //box
    // const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial(
    //     { color: "green", }
    // ))
    // box.userData.draggable = true
    // box.userData.name = 'box'
    // scene.add(box)


    // const boxSphere = new THREE.Group()

    // boxSphere.add(testBox)
    // boxSphere.add(testSphere)

    // scene.add(boxSphere)

    // boxSphere.rotateY(Math.PI/4)

    // console.log(boxSphere)


    // light

    const light = new THREE.PointLight("white", 60000)
    light.castShadow = true
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

    const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
    })


    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    physics_world.addBody(groundBody)

    //bot

    const robot = bot(5, 2, 4, 0, 5, 0, 3, 1.3, 5)
    

    robot.addToWorld(physics_world)

    controlBot(robot, 'S')



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

    // window.addEventListener('mouseup', (e) => {
    //     if (picked) {
    //         picked = false
    //         box.position.y = 5
    //         boxBody.position.copy(box.position)
    //         boxBody.quaternion.copy(box.quaternion)
    //     }
    // })

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

            objects = raycaster.intersectObjects(scene.children)
            box.position.x = objects[0].point.x
            box.position.z = objects[0].point.z

        }
    }

    //cannon-es-debugger

    const c_debug = new CannonDebugger(scene, physics_world, {})

    const animate = () => {

        physics_world.fixedStep()
        c_debug.update() //physics debugger

        // box.position.copy(boxBody.position)
        // box.quaternion.copy(boxBody.quaternion)

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