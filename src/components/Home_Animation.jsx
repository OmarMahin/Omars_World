import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import Button from "./Button";
import Container from "./Container";

import Robot from "./classes/Robot_Class";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import CannonDebugger, * as C_DEBUGGER from "cannon-es-debugger";
import {
    groundPhyBody,
    bot,
    botRender,
    target_pick_drop,
    addRenderRobotBodyParts,
    resetBot,
} from "../functions/Robot.jsx";

import { ball, loadBall, render_Ball } from "../functions/Ball.jsx";
import { Vector3 } from "three";
import { normaliseCoordinates } from "../functions/2d_3d_conversion.jsx";
import { useRef } from "react";
import Flex from "./Flex";
import { decideSizeAndPos } from "../functions/SizeAndPosition";

const Home_Animation = () => {

    const letter_O_ref = useRef(null);
    const letter_L_ref = useRef(null);
    const containerRef = useRef();

    let letter_O_Coords = new THREE.Vector2();
    let letter_L_Coords = new THREE.Vector2();
    let resized = false;
    let timer = 0;

    let past_sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const [zoomed, setZoomed] = useState(false);

    window.onbeforeunload = () => {
        window.scrollTo(0, 0);
    };

    let sizes = {
        width: null,
        height: null,
    };

    let [w, h] = decideSizeAndPos(window.innerWidth, true, false, false);

    sizes.width = w;
    sizes.height = h;

    useEffect(() => {
        console.log("Refreshed");
        timer = 0;
        if (robot) {
            resetBot(robot);
        }
    }, [zoomed]);

    //Scene

    const scene = new THREE.Scene();
    //shape

    //plane

    const plane = new THREE.Plane(new Vector3(0, 1, 0), 0);

    //target_sphere

    const target_sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5),
        new THREE.MeshBasicMaterial({
            transparent: true,
            color: "green",
            opacity: 0,
        })
    );

    target_sphere.userData.draggable = false;
    target_sphere.userData.name = "Target";
    scene.add(target_sphere);

    // light

    const light = new THREE.DirectionalLight("#EDEDED", 2.5);
    light.position.set(0, 100, 0);
    scene.add(light);

    const light2 = new THREE.HemisphereLight("white", "white", 1);
    light2.position.set(0, 100, 0);
    scene.add(light2);

    let fov = 45;
    let cameraDis = decideSizeAndPos(window.innerWidth, false, true, false);

    //camera
    const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 1, 1000);
    camera.position.z = cameraDis;
    camera.position.y = cameraDis;
    camera.lookAt(0, 0, 0);

    scene.add(camera);

    //physics

    //physics world

    const physics_world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.81, 0),
    });

    //creating ground plane
    groundPhyBody(physics_world);

    //bot
    let robot = null;
    const loadManager = new THREE.LoadingManager();
    const model = new GLTFLoader(loadManager);

    loadManager.onProgress = (url, items, number) => {
        console.log("Loading file: " + url + ".\nLoaded " + items + " of " + number + " files.");
    };

    let botBody = null,
        botWithBall = null,
        botWheelL = null,
        botWheelR = null;
    let physics_ball = null,
        positionBall = null,
        ball_body = null;
    let _robot = null

    model.load(
        "/3d_models/TuFu.glb",
        (body) => {
            botBody = body.scene;
        },
        () => {}
    );
    model.load(
        "/3d_models/TuFu_Ball.glb",
        (body) => {
            botWithBall = body.scene;
        },
        () => {}
    );
    model.load(
        "/3d_models/TuFu_wheel.glb",
        (body) => {
            botWheelL = body.scene;
        },
        () => {}
    );
    model.load(
        "/3d_models/TuFu_wheel.glb",
        (body) => {
            botWheelR = body.scene;
        },
        () => {}
    );
    model.load(
        "/3d_models/Ball.glb",
        (body) => {
            ball_body = body.scene.children[0];
        },
        () => {}
    );

    loadManager.onLoad = () => {
        const letter_L_info = letter_L_ref.current.getBoundingClientRect();
        const letter_O_info = letter_O_ref.current.getBoundingClientRect();

        let [l_x, l_y, o_x, o_y] = decideSizeAndPos(
            window.innerWidth,
            false,
            false,
            true,
            letter_L_info,
            letter_O_info
        );

        letter_L_Coords.x = l_x;
        letter_L_Coords.y = l_y;

        letter_O_Coords.x = o_x;
        letter_O_Coords.y = o_y;

        let coords_L = new THREE.Vector2();
        coords_L = normaliseCoordinates(
            letter_L_Coords.x,
            letter_L_Coords.y,
            sizes.width,
            sizes.height
        );

        raycaster.setFromCamera(coords_L, camera);
        let intersects = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersects);
        
        _robot = new Robot(botBody,botWithBall, botWheelR,botWheelL, scene, physics_world, intersects.x, 2, intersects.z)

        robot = bot(5, 2, 3.99, intersects.x, 2, intersects.z, 7, 1.3, 5, scene);
        // robot.addToWorld(physics_world);
        // addRenderRobotBodyParts(botBody, botWithBall, botWheelL, botWheelR, scene);

        let coords_O = new THREE.Vector2();
        coords_O = normaliseCoordinates(
            letter_O_Coords.x,
            letter_O_Coords.y,
            sizes.width,
            sizes.height
        );
        raycaster.setFromCamera(coords_O, camera);
        intersects = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersects);

        loadBall(ball_body, scene);
        let [physical_Body, render_body, target_body] = ball(
            physics_world,
            scene,
            intersects.x,
            1 + 1,
            intersects.z
        );
        physics_ball = physical_Body;
        ball_body = render_body;
        positionBall = target_body;

        target_sphere.position.set(intersects.x, 1, intersects.z);

        const loadingScreen = document.getElementById("loading");
        if (loadingScreen) {
            const loadingTimer = setInterval(() => {
                console.log("delay");

                loadingScreen.classList.add("opacity-0");
                loadingScreen.addEventListener("transitionend", () => {
                    loadingScreen.remove();
                    clearInterval(loadingTimer);
                });
            }, 1000);
        }

        console.log("Complete");
    };

    loadManager.onError = function (url) {
        console.log("There was an error loading " + url);
    };

    //render

    const canvas = document.querySelector(".webgl");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas, alpha: true });

    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

    // //update sizes
    window.addEventListener("resize", () => {
        if (past_sizes.width != window.innerWidth && past_sizes.height != window.innerHeight) {
            past_sizes.width = window.innerWidth;
            past_sizes.height = window.innerHeight;

            // camera.aspect = 1024/700;

            // camera.updateProjectionMatrix();
            // renderer.setSize(sizes.width, sizes.height);
            resized = true;
            timer = 0;
        }
    });

    // ray casting

    const raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let mouseMove = new THREE.Vector2();
    let objects = new THREE.Object3D();
    let picked = false;
    let y_pos = null;

    window.addEventListener("touchstart", touchDown, false);
    window.addEventListener("mousedown", mouseDown, false);

    // //letting the object drop
    window.addEventListener("touchend", touchUp, false);
    window.addEventListener("mouseup", mouseUp, false);

    window.addEventListener(
        "scroll",
        (e) => {
            if (picked) {
                picked = false;
                ball_body.position.y = 5;
                physics_ball.position.copy(ball_body.position);
                physics_ball.quaternion.copy(ball_body.quaternion);

                let html = document.getElementById("html");
                let body = document.getElementById("body");
                html.style.overflowY = "auto";
                body.style.overflowY = "auto";
                html.style.overscrollBehavior = "auto";
                body.style.overscrollBehavior = "auto";
            }
        },
        true
    );

    //dragging the object
    window.addEventListener("touchmove", touchMove, false);
    window.addEventListener("mousemove", mouseMovement, false);

    if (matchMedia("(pointer: coarse)").matches) {
        window.removeEventListener("mousedown", mouseDown);
        window.removeEventListener("mouseup", mouseUp);
        window.removeEventListener("mousemove", mouseMovement);
    }

    function mouseDown(e) {
        mouse = normaliseCoordinates(e.clientX, e.clientY, sizes.width, sizes.height);

        raycaster.setFromCamera(mouse, camera);

        objects = raycaster.intersectObjects(scene.children, false);

        if (window.scrollY == 0) {
            if (objects.length > 0 && objects[0].object.userData.draggable) {
                y_pos = objects[0].object.position.y;
                picked = true;
            }
        }
    }

    function touchDown(e) {
        mouse = normaliseCoordinates(
            e.touches[0].clientX,
            e.touches[0].clientY,
            sizes.width,
            sizes.height
        );

        raycaster.setFromCamera(mouse, camera);

        objects = raycaster.intersectObjects(scene.children, false);

        if (window.scrollY == 0) {
            if (objects.length > 0 && objects[0].object.userData.draggable) {
                y_pos = objects[0].object.position.y;
                picked = true;
                let html = document.getElementById("html");
                let body = document.getElementById("body");
                html.style.overflowY = "hidden";
                body.style.overflowY = "hidden";
                html.style.overscrollBehavior = "none";
                body.style.overscrollBehavior = "none";
            }
        }
    }

    function mouseUp(e) {
        if (picked) {
            picked = false;
            ball_body.position.y = 5;
            physics_ball.position.copy(ball_body.position);
            physics_ball.quaternion.copy(ball_body.quaternion);
        }
    }

    function touchUp(e) {
        if (picked) {
            picked = false;
            ball_body.position.y = 5;
            physics_ball.position.copy(ball_body.position);
            physics_ball.quaternion.copy(ball_body.quaternion);

            let html = document.getElementById("html");
            let body = document.getElementById("body");
            html.style.overflowY = "auto";
            body.style.overflowY = "auto";
            html.style.overscrollBehavior = "auto";
            body.style.overscrollBehavior = "auto";
        }
    }

    function mouseMovement(e) {
        const past_mouseMove_x = mouseMove.x;
        const past_mouseMove_y = mouseMove.y;

        mouseMove = normaliseCoordinates(e.clientX, e.clientY, sizes.width, sizes.height);

        if (mouseMove.x < -1 || mouseMove.x > 1) {
            mouseMove.x = past_mouseMove_x;
        }
        if (mouseMove.y < -1 || mouseMove.y > 1) {
            mouseMove.y = past_mouseMove_y;
        }
    }

    function touchMove(e) {
        const past_mouseMove_x = mouseMove.x;
        const past_mouseMove_y = mouseMove.y;

        mouseMove = normaliseCoordinates(
            e.touches[0].clientX,
            e.touches[0].clientY,
            sizes.width,
            sizes.height
        );

        if (mouseMove.x < -1 || mouseMove.x > 1) {
            mouseMove.x = past_mouseMove_x;
        }
        if (mouseMove.y < -1 || mouseMove.y > 1) {
            mouseMove.y = past_mouseMove_y;
        }
    }

    // else{
    //     window.removeEventListener('touchstart')
    //     window.removeEventListener('touchend')
    //     window.removeEventListener('touchmove')
    // }

    //picking object and dragging it

    let pickedObject = () => {
        if (timer < 51) {
            timer += 1;
        }

        if (timer == 50 && resized) {
            setZoomed(!zoomed);
            resized = false;
        }

        if (picked) {
            raycaster.setFromCamera(mouseMove, camera);
            let intersects = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersects);

            ball_body.position.set(intersects.x, y_pos, intersects.z);
        }
    };

    // //cannon-es-debugger

    const c_debug = new CannonDebugger(scene, physics_world, {});

    const animate = () => {
        physics_world.fixedStep();
        if (_robot && ball_body) {
            c_debug.update() //physics debugger

            render_Ball();
            // botRender();
            _robot.botRender()

            target_pick_drop(positionBall, target_sphere, robot);
            pickedObject();
        }

        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();

    return (
        <div className='w-full pb-64 bg-backgroundColor'>
            <Container>
                <div className='lg:pl-[190px] lg:pt-52 pt-24' ref={containerRef}>
                    {/* <div>{window.innerWidth}</div> */}
                    <h3 className='text-[20px] lg:text-[40px] font-subHeading text-[#1B1B1B] w-[40%]'>
                        Hi! Welcome to
                    </h3>

                    <div className='lg:ml-16 lg:mt-0 mt-4 lg:text-left text-center'>
                        <h1 className='lg:text-[100px] font-mainHeading text-fontColor text-[70px]  lg:font-normal font-semibold leading-[80px] lg:leading-normal'>
                            Omar’s W
                            <span ref={letter_O_ref} className='text-transparent'>
                                o
                            </span>
                            r<span ref={letter_L_ref}>l</span>d
                        </h1>

                        <p className='mt-6 max-w-480B lg:max-w-[650px] text-mainFont font-bold text-[#3C3C3C] lg:leading-8 lg:text-lg text-base leading-8'>
                            My name is Omar. I love to play with codes and make my own mechanical
                            buddies, like the one you are seeing here, right on top of the word
                            ‘World’. (
                            <span className='text-[#5B5B5B]'>
                                The letter ‘o’ in ‘World’ looks a bit suspicious. I wonder what
                                happens if you move it far away....
                            </span>
                            ) Learn more...
                        </p>
                        {/* <p className="mt-6 max-w-480B lg:max-w-[650px] text-mainFont font-bold text-[#5B5B5B] lg:leading-8 lg:text-lg text-base leading-8">
            The letter ‘o’ in ‘World’ looks a bit suspicious. I wonder what
                happens if you move it far away.... 
            </p> */}
                        <div className='mt-11'>
                            <Flex
                                className={
                                    "flex-wrap gap-4 justify-center lg:justify-start relative z-20"
                                }
                            >
                                <Button text={"About me"} className='relative z-20' />
                                <Button text={"About the robot"} className='' />
                            </Flex>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Home_Animation;
