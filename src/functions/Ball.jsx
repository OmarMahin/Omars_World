import * as cannon from 'cannon-es'
import * as THREE from 'three'
import { Color, MeshStandardMaterial } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let physics_body = null, render_body = null, targetBody = null

export function ball(physics_world, render_world, px, py, pz) {

    //render body


    render_body = new THREE.Mesh(new THREE.SphereGeometry(0.82), new MeshStandardMaterial({
        transparent: true,
        opacity: 1,
        color: "#E72648"
    }))
    render_body.position.set(new THREE.Vector3(0,0,0))
    render_body.userData.draggable = true

    render_world.add(render_body)

    targetBody = new THREE.Mesh(new THREE.SphereGeometry(0.25), new MeshStandardMaterial({
        transparent: true,
        opacity: 0,
    }))
    targetBody.userData.draggable = false

    render_world.add(targetBody)


    //physics body

    physics_body = new cannon.Body({
        mass: 0.1,
        shape: new cannon.Sphere(0.82),
        position: new cannon.Vec3(px, py, pz)
    })

    physics_world.addBody(physics_body)

    return [physics_body, render_body, targetBody]
}


export function changeBallPostion(newPos, transparent, physicsBody, renderBody) {
    if (physicsBody) physics_body.position.copy(newPos)
    if (renderBody) render_body.position.copy(physics_body.position)
    if (transparent) {
        render_body.material.opacity = 0
    }
    else {
        render_body.material.opacity = 1
    }

}



export function render_Ball() {
    render_body.position.copy(physics_body.position)
    render_body.quaternion.copy(physics_body.quaternion)
    targetBody.position.copy(physics_body.position)
}


export function checkBallVisibility() {
    return render_body.material.opacity
}