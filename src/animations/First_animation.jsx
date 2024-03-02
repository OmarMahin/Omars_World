import React from 'react'
import * as THREE from 'three'


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
    const box = new THREE.Mesh(new THREE.BoxGeometry( 10, 10, 10 ), new THREE.MeshStandardMaterial(
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


    const animate = () => {
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