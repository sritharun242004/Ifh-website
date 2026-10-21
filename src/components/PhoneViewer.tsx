"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const MODEL_URL = "/models/iphone-18-pro-max.glb";
const SCREEN_URL = "/assets/img/app-screen.png";
/** A render of the glb in the viewer's resting pose, shown until the live 3D model is ready. */
const POSTER_URL = "/assets/img/phone-poster.png";

/**
 * 3D iPhone for the home hero. Drag (or use the arrow keys) to spin it 360°.
 * three.js is loaded lazily on the client; the static screenshot stays as a
 * fallback if WebGL is unavailable or the model fails to load.
 */
export function PhoneViewer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { RoomEnvironment } =
        await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      const key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(2, 3, 4);
      scene.add(key);
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

      const [gltf, screenTexture] = await Promise.all([
        new GLTFLoader().loadAsync(MODEL_URL),
        loadScreenTexture(THREE, renderer),
      ]);
      if (disposed) {
        renderer.dispose();
        return;
      }
      const model = gltf.scene;

      // Put the app screenshot on the "Front_Screen" mesh, mapped to its outline.
      const screen = model.getObjectByName("Front_Screen") as InstanceType<typeof THREE.Mesh>;
      const pos = screen.geometry.attributes.position;
      const box = new THREE.Box3().setFromBufferAttribute(
        pos as InstanceType<typeof THREE.BufferAttribute>,
      );
      const uv = new Float32Array(pos.count * 2);
      for (let i = 0; i < pos.count; i++) {
        uv[i * 2] = (pos.getX(i) - box.min.x) / (box.max.x - box.min.x);
        uv[i * 2 + 1] = (pos.getY(i) - box.min.y) / (box.max.y - box.min.y);
      }
      screen.geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      screen.geometry.deleteAttribute("color");
      screen.material = new THREE.MeshBasicMaterial({
        map: screenTexture,
        toneMapped: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      });

      // Centre the model.
      const pivot = new THREE.Group();
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      model.position.sub(bounds.getCenter(new THREE.Vector3()));
      pivot.add(model);
      scene.add(pivot);

      // Fit the whole phone in view, whether the stage is tall or narrow.
      const resize = () => {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        // Share of the stage height the phone fills, set in globals.css (--phone-fill).
        const fill =
          parseFloat(getComputedStyle(stage).getPropertyValue("--phone-fill")) || 0.65;
        const byHeight = size.y / (2 * fill * tan);
        const byWidth = (size.x * 0.8) / (tan * camera.aspect);
        camera.position.set(0, 0, Math.max(byHeight, byWidth));
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
      resize();

      // Drag (mouse, pen or touch) to spin; momentum after release.
      let yaw = -0.32;
      let pitch = 0.06;
      let velocity = 0;
      let isDragging = false;
      let lastX = 0;
      let lastY = 0;
      let visible = true;

      const onDown = (e: PointerEvent) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        velocity = 0;
        stage.setPointerCapture(e.pointerId);
        setDragging(true);
      };
      const onMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        velocity = dx * 0.012;
        yaw += velocity;
        pitch = THREE.MathUtils.clamp(pitch + dy * 0.004, -0.5, 0.5);
      };
      const onUp = () => {
        isDragging = false;
        setDragging(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") yaw -= 0.3;
        if (e.key === "ArrowRight") yaw += 0.3;
      };
      stage.addEventListener("pointerdown", onDown);
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerup", onUp);
      stage.addEventListener("pointercancel", onUp);
      stage.addEventListener("keydown", onKey);
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      visibility.observe(stage);

      const clock = new THREE.Clock();
      let frame = 0;
      const render = () => {
        frame = requestAnimationFrame(render);
        if (!visible) return;
        const t = clock.getElapsedTime();
        if (!isDragging) {
          yaw += velocity;
          velocity *= 0.94;
          pitch += (0.06 - pitch) * 0.04;
        }
        pivot.rotation.set(pitch, yaw, -0.05);
        pivot.position.y = reduce ? 0 : Math.sin(t * 1.2) * size.y * 0.012;
        renderer.render(scene, camera);
      };
      render();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        visibility.disconnect();
        stage.removeEventListener("pointerdown", onDown);
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerup", onUp);
        stage.removeEventListener("pointercancel", onUp);
        stage.removeEventListener("keydown", onKey);
        screenTexture.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    })().catch(() => {
      /* keep the static fallback image */
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={`phone-stage${ready ? " ready" : ""}${dragging ? " dragging" : ""}`}
      tabIndex={0}
      role="img"
      aria-label="3D iPhone showing the IFH app. Drag or use the arrow keys to rotate."
    >
      <Image
        className="phone-fallback"
        src={POSTER_URL}
        alt="IFH Connects app showing rentals in Bengaluru"
        width={541}
        height={1100}
        style={{ width: "auto" }}
        priority
      />
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="drag-hint" aria-hidden="true">
        ↔ Drag to rotate 360°
      </span>
      <div className="float-card fc-top">
        <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <div>
          <small>248 homes</small>
          <strong>IFH verified</strong>
        </div>
      </div>
      <div className="float-card fc-bottom">
        <Image src="/assets/logo.png" alt="" width={40} height={26} />
        <div>
          <strong>IFH Connects</strong>
          <small>Zero brokerage, always</small>
        </div>
      </div>
    </div>
  );
}

// The screenshot is slightly taller/narrower than the phone screen, so it is
// stretched a little to fill the screen edge to edge (about 16% wider) and the
// empty margins at the top and bottom are trimmed.
function loadScreenTexture(
  THREE: typeof import("three"),
  renderer: InstanceType<typeof import("three").WebGLRenderer>,
) {
  return new Promise<InstanceType<typeof THREE.CanvasTexture>>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const screenAspect = 0.073 / 0.1585;
      const c = document.createElement("canvas");
      c.height = img.height;
      c.width = Math.round(img.height * screenAspect);
      const ctx = c.getContext("2d");
      if (!ctx) return reject(new Error("2D canvas unavailable"));
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, -12, c.width, img.height * 1.06);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      resolve(tex);
    };
    img.onerror = reject;
    img.src = SCREEN_URL;
  });
}
