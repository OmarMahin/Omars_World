import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import Button from "../components/Button";
import Container from "../components/Container";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import CannonDebugger, * as C_DEBUGGER from "cannon-es-debugger";
import {
  groundPhyBody,
  bot,
  controlBot,
  botAddToScene,
  botRender,
  target_pick_drop,
  addRenderRobotBodyParts,
} from "../functions/Robot.jsx";

import { ball, loadBall, render_Ball } from "../functions/Ball.jsx";
import { Vector3 } from "three";
import { normaliseCoordinates } from "../functions/2d_3d_conversion.jsx";
import { useRef } from "react";

const First_animation = () => {
  const worldRef = useRef(null);
  let worldCoords = new THREE.Vector2();

  // const [alphabetPosition, setAlphabetPosition] = useState()

  useEffect(() => {}, []);

  const sizes = {
    width: 1150,
    height: 600,
  };

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
  target_sphere.position.set(5.35, 1, 3.12);
  scene.add(target_sphere);

  // light

  const light = new THREE.DirectionalLight("#EDEDED", 2.5);
  light.position.set(0, 100, 0);
  scene.add(light);

  const light2 = new THREE.HemisphereLight("white", "white", 1);
  light2.position.set(0, 100, 0);
  scene.add(light2);

  //camera
  let fov = 45;
  console.log(sizes.width / sizes.height);
  const camera = new THREE.PerspectiveCamera(fov, 1150 / 600, 1, 1000);
  camera.position.z = 20;
  camera.position.y = 20;
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
    console.log(
      "Loading file: " +
        url +
        ".\nLoaded " +
        items +
        " of " +
        number +
        " files."
    );
  };

  let botBody = null,
    botWithBall = null,
    botWheelL = null,
    botWheelR = null;
  let physics_ball = null,
    positionBall = null,
    ball_body = null;

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
    worldCoords.x = worldRef.current.getBoundingClientRect().x;
    worldCoords.y = worldRef.current.getBoundingClientRect().y;

    let coords = new THREE.Vector2();
    coords = normaliseCoordinates(worldCoords.x, worldCoords.y, 1150, 600);
    raycaster.setFromCamera(coords, camera);
    let intersects = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersects);
    console.log(intersects);

    robot = bot(5, 2, 3.99, -10, 2, 0, 7, 1.3, 5);
    robot.addToWorld(physics_world);
    addRenderRobotBodyParts(botBody, botWithBall, botWheelL, botWheelR, scene);
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
    console.log("Complete");

    
  };

  loadManager.onError = function (url) {
    console.log("There was an error loading " + url);
  };

  // const robot = bot(5, 2, 3.99, -10, 2, 0, 7, 1.3, 5)
  // robot.addToWorld(physics_world)
  // botAddToScene(scene, physics_world)

  // controlBot(robot, 'S')

  // const [physics_ball, ball_body, positionBall] = ball(physics_world, scene, 5,1+1,3.12)

  //render

  const canvas = document.querySelector(".webgl");
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  // //update sizes
  window.addEventListener("resize", () => {
    const browserZoomLevel = window.devicePixelRatio;
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;

    if (camera.aspect > 16 / 9) {
      // window too large
      camera.fov = fov;
    } else {
      // window too narrow
      const cameraHeight = Math.tan(MathUtils.degToRad(fov / 2));
      const ratio = camera.aspect / planeAspectRatio;
      const newCameraHeight = cameraHeight / ratio;
      camera.fov = MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
    }

    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    // console.log(window.innerWidth)
  });

  // ray casting

  const raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  let mouseMove = new THREE.Vector2();
  let objects = new THREE.Object3D();
  let picked = false;
  let y_pos = null;

  window.addEventListener("mousedown", (e) => {
    mouse = normaliseCoordinates(e.clientX, e.clientY, 1150, 600);

    raycaster.setFromCamera(mouse, camera);

    objects = raycaster.intersectObjects(scene.children, false);

    // console.log(objects);
    // console.log(ball_body);

    if (objects.length > 0 && objects[0].object.userData.draggable) {
      y_pos = objects[0].object.position.y;
      picked = true;
      console.log("EEE");
    }
  });

  // //letting the object drop

  window.addEventListener("mouseup", (e) => {
    if (picked) {
      picked = false;
      ball_body.position.y = 5;
      physics_ball.position.copy(ball_body.position);
      physics_ball.quaternion.copy(ball_body.quaternion);
    }
  });

  //dragging the object

  window.addEventListener("mousemove", (e) => {
    const past_mouseMove_x = mouseMove.x;
    const past_mouseMove_y = mouseMove.y;

    // mouseMove.x = (e.clientX / sizes.width) * 2 - 1;
    // mouseMove.y = - (e.clientY / window.innerHeight) * 2 + 1;

    mouseMove = normaliseCoordinates(e.clientX, e.clientY, 1150, 600);

    // console.log(mouseMove);

    if (mouseMove.x < -1 || mouseMove.x > 1) {
      mouseMove.x = past_mouseMove_x;
    }
    if (mouseMove.y < -1 || mouseMove.y > 1) {
      mouseMove.y = past_mouseMove_y;
    }
  });

  //picking object and dragging it

  let pickedObject = () => {
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
    if (robot && ball_body) {
      // c_debug.update() //physics debugger

      render_Ball();
      botRender();

      target_pick_drop(positionBall, target_sphere, robot);
      pickedObject();
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();

  return (
    <div className="absolute top-0 left-0 w-full pb-64 bg-backgroundColor">
      <Container>
        {/* <div>{containerRef}</div> */}
        <div className="pl-[190px] mt-52">
          <h3 className="text-[40px] font-subHeading text-[#1B1B1B]">
            Hi! Welcome to
          </h3>

          <div className="ml-16 ">
            <h1 className=" text-[100px] font-mainHeading text-fontColor">
              Omar’s W
              <span ref={worldRef} className="text-transparent">
                o
              </span>
              rld
            </h1>

            <p className="mt-6 w-[650px] text-mainFont font-bold text-[#3C3C3C] leading-8 text-lg">
              My name is Omar. I love to play with codes and make my own
              mechanical buddies, like the one you are seeing here, right on top
              of the word ‘World’. (
              <span className="text-[#5B5B5B]">
                The letter ‘o’ in ‘World’ looks a bit suspicious. I wonder what
                happens if you move it far away....
              </span>
              ) Learn more...
            </p>
            <div className="mt-11">
              <Button text={"About me"} />
              <Button text={"About the robot"} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default First_animation;
