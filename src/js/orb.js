/**
 * Volumetric scroll orb — Three.js MeshPhysicalMaterial + RoomEnvironment
 * (approach from three.js clearcoat / physical material examples).
 */
export async function initScrollOrb(options = {}) {
  const canvas = document.querySelector("#orb-canvas");
  if (!canvas) return null;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    canvas.remove();
    return null;
  }

  const THREE = await import("three");
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
  camera.position.set(0, 0, 4.2);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const segments = window.innerWidth < 768 ? 48 : 96;
  const geometry = new THREE.SphereGeometry(1, segments, segments);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#e8875c"),
    metalness: 0.05,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    sheen: 0.55,
    sheenColor: new THREE.Color("#ffd2bc"),
    sheenRoughness: 0.35,
    envMapIntensity: 1.15,
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const key = new THREE.DirectionalLight(0xfff1e6, 1.4);
  key.position.set(3, 4, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffc4a8, 0.55);
  fill.position.set(-4, -1, 2);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffe8dc, 0.35));

  const order = options.order || ["hero", "zhanna", "uslugi", "ceny", "zapis"];
  const state = {
    x: window.innerWidth * 0.72,
    y: window.innerHeight * 0.42,
    scale: 1,
    opacity: 1,
    targetX: 0,
    targetY: 0,
    targetScale: 1,
    targetOpacity: 1,
  };

  let raf = 0;
  let visible = true;
  let running = true;

  const readAnchors = () => {
    return order
      .map((id) => {
        const el = document.querySelector(`[data-orb-anchor="${id}"]`);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY + rect.height / 2;
        return {
          id,
          top,
          x: rect.left + rect.width / 2,
          y: rect.top + window.scrollY + rect.height / 2,
          scale: Number(el.dataset.orbScale || (id === "hero" ? 1 : id === "zapis" ? 0.55 : 0.78)),
          opacity: Number(el.dataset.orbOpacity || (id === "zapis" ? 0 : 1)),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.top - b.top);
  };

  let anchors = readAnchors();

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const ease = (t) => t * t * (3 - 2 * t);

  const updateTarget = () => {
    if (!anchors.length) return;
    const focus = window.scrollY + window.innerHeight * 0.42;

    if (focus <= anchors[0].top) {
      state.targetX = anchors[0].x;
      state.targetY = anchors[0].y - window.scrollY;
      state.targetScale = anchors[0].scale;
      state.targetOpacity = anchors[0].opacity;
      return;
    }

    const last = anchors[anchors.length - 1];
    if (focus >= last.top) {
      state.targetX = last.x;
      state.targetY = last.y - window.scrollY;
      state.targetScale = last.scale;
      state.targetOpacity = last.opacity;
      return;
    }

    for (let i = 0; i < anchors.length - 1; i += 1) {
      const a = anchors[i];
      const b = anchors[i + 1];
      if (focus >= a.top && focus <= b.top) {
        const t = ease(clamp01((focus - a.top) / Math.max(1, b.top - a.top)));
        state.targetX = lerp(a.x, b.x, t);
        state.targetY = lerp(a.y - window.scrollY, b.y - window.scrollY, t);
        state.targetScale = lerp(a.scale, b.scale, t);
        state.targetOpacity = lerp(a.opacity, b.opacity, t);
        return;
      }
    }
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const size = Math.round(Math.min(360, Math.max(180, window.innerWidth * 0.28)) * dpr);
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    canvas.style.width = `${size / dpr}px`;
    canvas.style.height = `${size / dpr}px`;
    anchors = readAnchors();
    updateTarget();
  };

  const placeCanvas = () => {
    const size = canvas.clientWidth || 240;
    canvas.style.transform = `translate3d(${state.x - size / 2}px, ${state.y - size / 2}px, 0) scale(${state.scale})`;
    canvas.style.opacity = String(state.opacity);
  };

  const tick = (time) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);

    state.x = lerp(state.x, state.targetX, 0.12);
    state.y = lerp(state.y, state.targetY, 0.12);
    state.scale = lerp(state.scale, state.targetScale, 0.1);
    state.opacity = lerp(state.opacity, state.targetOpacity, 0.1);
    placeCanvas();

    if (!visible || state.opacity < 0.02) return;

    const t = time * 0.001;
    sphere.rotation.y = t * 0.35;
    sphere.rotation.x = Math.sin(t * 0.4) * 0.15;
    sphere.position.y = Math.sin(t * 0.9) * 0.04;
    renderer.render(scene, camera);
  };

  const onScroll = () => updateTarget();
  const onResize = () => resize();

  document.documentElement.classList.add("has-webgl-orb");
  resize();
  updateTarget();
  state.x = state.targetX;
  state.y = state.targetY;
  state.scale = state.targetScale;
  state.opacity = state.targetOpacity;
  placeCanvas();
  raf = requestAnimationFrame(tick);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  document.addEventListener("visibilitychange", () => {
    visible = document.visibilityState === "visible";
  });

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    canvas.remove();
    document.documentElement.classList.remove("has-webgl-orb");
  };
}
