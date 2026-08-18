/* ==========================================================================
   Begino Tech — Desktop 3D Hero Scene (Three.js Module)
   ========================================================================== */

(function () {
  const heroEl = document.getElementById('home');
  const container = document.getElementById('hero3d');
  if (!container || !heroEl) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tooNarrow = window.innerWidth < 900;
  const noWebGL = !window.WebGLRenderingContext;

  if (prefersReduced || tooNarrow || noWebGL) return;

  init().catch((err) => {
    console.warn('3D Hero scene initialized fallback:', err);
  });

  async function init() {
    const THREE = await import('three');
    const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
    buildScene(THREE, RoomEnvironment);
  }

  function buildScene(THREE, RoomEnvironment) {
    const width = heroEl.clientWidth;
    const height = heroEl.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.02);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    scene.add(new THREE.HemisphereLight(0xd8bfff, 0x2b2b2b, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 1.15);
    dir.position.set(4, 6, 5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.near = 1;
    dir.shadow.camera.far = 20;
    dir.shadow.radius = 6;
    scene.add(dir);

    const mouseLight = new THREE.PointLight(0x7c3aed, 6, 14, 2);
    mouseLight.position.set(0, 0, 4);
    scene.add(mouseLight);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.12 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.4;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    /* Materials */
    const glassMat = (c, rough) => new THREE.MeshPhysicalMaterial({ color: c, transmission: 1, thickness: 0.6, roughness: rough != null ? rough : 0.06, ior: 1.4, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.2 });
    const metalMat = (c) => new THREE.MeshStandardMaterial({ color: c, metalness: 1, roughness: 0.3, envMapIntensity: 1 });

    const group = new THREE.Group();
    group.position.set(1.35, -0.15, 0);
    group.scale.setScalar(0.85);
    scene.add(group);
    const objects = [];

    function addObj(mesh, x, y, z, s) {
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(s || 1);
      mesh.traverse(n => { if (n.isMesh) n.castShadow = true; });
      group.add(mesh);
      objects.push({
        mesh, baseY: y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.4,
        bob: 0.16 + Math.random() * 0.1,
        spin: (Math.random() - 0.5) * 0.25,
        kick: 0
      });
    }

    /* Meta Ads — Torus sphere */
    (function () {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), glassMat(0xcfa8f2)));
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 16, 48), metalMat(0x7c3aed));
      ring.rotation.x = Math.PI / 2.4;
      g.add(ring);
      addObj(g, -2.6, 1.1, -0.6, 1);
    })();

    /* Acrylic Faceted Gem */
    addObj(new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 0), glassMat(0xd8c6ee, 0.12)), 2.7, 0.6, 0.4, 1);

    /* Magnifying Glass */
    (function () {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.08, 16, 40), glassMat(0xe4d4fb)));
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 12), metalMat(0x7c3aed));
      handle.position.set(0.55, -0.55, 0);
      handle.rotation.z = Math.PI / 4;
      g.add(handle);
      addObj(g, -1.6, -0.9, 0.8, 0.9);
    })();

    /* Ascending Growth Bars */
    (function () {
      const g = new THREE.Group();
      [0.4, 0.7, 1.0, 1.35].forEach((h, i) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.28, h, 0.28), glassMat(i % 2 ? 0x7c3aed : 0xdccbf3, 0.1));
        bar.position.set(i * 0.36 - 0.5, h / 2 - 0.6, 0);
        g.add(bar);
      });
      addObj(g, 2.4, -1.0, -0.5, 0.85);
    })();

    /* Glass Browser Window */
    (function () {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.75, 0.06), glassMat(0xf1e8fb)));
      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.14, 0.07), metalMat(0x7c3aed));
      bar.position.y = 0.3;
      g.add(bar);
      addObj(g, 0, -0.2, 1.6, 0.8);
    })();

    let targetRotX = 0, targetRotY = 0;
    const mouseWorld = new THREE.Vector3(0, 0, 3.5);
    heroEl.addEventListener('mousemove', (e) => {
      const rect = heroEl.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotY = nx * 0.14;
      targetRotX = ny * 0.08;
      mouseWorld.set(nx * 4, -ny * 2.5, 3.5);
    });

    let isVisible = true;
    new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(heroEl);

    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;
      const t = clock.getElapsedTime();

      objects.forEach(o => {
        o.mesh.rotation.y += o.spin * 0.01;
        o.mesh.rotation.x += o.spin * 0.006;
        o.mesh.position.y = o.baseY + Math.sin(t * o.speed + o.phase) * o.bob;
      });

      group.rotation.y += (targetRotY - group.rotation.y) * 0.04;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.04;
      mouseLight.position.lerp(mouseWorld, 0.08);

      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
      if (window.innerWidth < 900) {
        container.style.display = 'none';
        return;
      }
      const w = heroEl.clientWidth, h = heroEl.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }
})();
