import * as THREE from "three";
import gsap from "gsap";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// Create a sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Light
const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
light.position.set(0, 10, 10);
light.intensity = 125;
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
renderer.setPixelRatio(2);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resizing
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// Timeline Magic
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { opacity: 0 }, { opacity: 1 });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// Mouse Animation Color
let interactionDown = false;
let rgb = [];

// Common function to change color
function changeColor(pageX, pageY) {
  rgb = [
    Math.round((pageX / window.innerWidth) * 255),
    Math.round((pageY / window.innerHeight) * 255),
    150,
  ];
  let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
  gsap.to(mesh.material.color, {
    r: newColor.r,
    g: newColor.g,
    b: newColor.b,
  });
}

// Mouse events
window.addEventListener("mousedown", () => (interactionDown = true));
window.addEventListener("mouseup", () => (interactionDown = false));
window.addEventListener("mousemove", (e) => {
  if (interactionDown) {
    changeColor(e.pageX, e.pageY);
  }
});

// Touch events
window.addEventListener("touchstart", () => (interactionDown = true));
window.addEventListener("touchend", () => (interactionDown = false));
window.addEventListener(
  "touchmove",
  (e) => {
    if (interactionDown) {
      // Prevent the window from scrolling
      e.preventDefault();
      changeColor(e.touches[0].pageX, e.touches[0].pageY);
    }
  },
  { passive: false }
); // Use passive: false to allow preventDefault
