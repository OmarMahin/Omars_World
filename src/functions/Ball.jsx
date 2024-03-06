import * as cannon from 'cannon-es'
import * as THREE from 'three'
import { MeshStandardMaterial } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let physics_body = null, render_body = null

export function ball(physics_world,render_world, px, py, pz){

    //physics body

    physics_body = new cannon.Body({
        mass: 0.1,
        shape: new cannon.Sphere(1.5),
        position: new cannon.Vec3(px,py,pz)
    })

    physics_world.addBody(physics_body)

    //render body

    render_body = new THREE.Mesh(new THREE.SphereGeometry(1.5), new MeshStandardMaterial({color: "red"}))
    render_body.userData.draggable = true

    render_world.add(render_body)

    return [physics_body,render_body]
}




export function render_Ball(){
    render_body.position.copy(physics_body.position)
    render_body.quaternion.copy(physics_body.quaternion)
}