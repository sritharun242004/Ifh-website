/* IFH Connects — 3D iPhone for the home hero.
   Drag the phone to spin it a full 360 degrees. */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import modelUrl from "../iphone 18 pro max blinkxblacked_no_reflection.glb?url";
import screenUrl from "../assets/img/app-screen.png?url";

const stage = document.querySelector("[data-phone-stage]");
if (stage) init(stage).catch(() => { /* keep the static fallback image */ });

async function init(stage) {
  const canvas = stage.querySelector("canvas");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(2, 3, 4);
  scene.add(key);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

  const [gltf, screenTexture] = await Promise.all([
    new GLTFLoader().loadAsync(modelUrl),
    makeScreenTexture(renderer),
  ]);
  const model = gltf.scene;

  // Put the app screen on the "Front_Screen" mesh, mapped to fit its outline.
  const screen = model.getObjectByName("Front_Screen");
  const pos = screen.geometry.attributes.position;
  const box = new THREE.Box3().setFromBufferAttribute(pos);
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - box.min.x) / (box.max.x - box.min.x);
    uv[i * 2 + 1] = (pos.getY(i) - box.min.y) / (box.max.y - box.min.y);
  }
  screen.geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  screen.geometry.deleteAttribute("color");
  screen.material = new THREE.MeshBasicMaterial({
    map: screenTexture, toneMapped: false,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
  });

  // Centre the model and frame it.
  const pivot = new THREE.Group();
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  model.position.sub(bounds.getCenter(new THREE.Vector3()));
  pivot.add(model);
  scene.add(pivot);

  function resize() {
    const { clientWidth: w, clientHeight: h } = stage;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // fit the whole phone in view, whether the stage is tall or narrow
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const byHeight = (size.y * 0.62) / tan;
    const byWidth = (size.x * 0.8) / (tan * camera.aspect);
    camera.position.set(0, 0, Math.max(byHeight, byWidth));
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // Interaction: drag (mouse, pen or touch) to spin the phone a full 360 degrees.
  // Vertical page scrolling still works on touch screens (touch-action: pan-y).
  let yaw = -0.32, pitch = 0.06, velocity = 0, dragging = false, lastX = 0, lastY = 0, visible = true;
  stage.addEventListener("pointerdown", (e) => {
    dragging = true; lastX = e.clientX; lastY = e.clientY; velocity = 0;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add("dragging");
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    velocity = dx * 0.012;
    yaw += velocity;
    pitch = THREE.MathUtils.clamp(pitch + dy * 0.004, -0.5, 0.5);
  });
  const release = () => { dragging = false; stage.classList.remove("dragging"); };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  // Keyboard: arrow keys also rotate
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") yaw -= 0.3;
    if (e.key === "ArrowRight") yaw += 0.3;
  });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    if (!dragging) {
      yaw += velocity;                 // keep spinning a little after release
      velocity *= 0.94;
      pitch += (0.06 - pitch) * 0.04;  // ease back to a slight tilt
    }
    pivot.rotation.y = yaw;
    pivot.rotation.x = pitch;
    pivot.rotation.z = -0.05;
    pivot.position.y = reduce ? 0 : Math.sin(t * 1.2) * size.y * 0.012;
    renderer.render(scene, camera);
  }
  frame();
  stage.classList.add("ready");
}

// The screenshot is slightly taller/narrower than the phone screen, so it is
// stretched a little to fill the screen edge to edge (about 16% wider) and the
// empty margins at the top and bottom are trimmed.
function makeScreenTexture(renderer) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const screenAspect = 0.073 / 0.1585;
      const c = document.createElement("canvas");
      c.height = img.height;
      c.width = Math.round(img.height * screenAspect);
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, -12, c.width, img.height * 1.06);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      resolve(tex);
    };
    img.onerror = reject;
    img.src = screenUrl;
  });
}
