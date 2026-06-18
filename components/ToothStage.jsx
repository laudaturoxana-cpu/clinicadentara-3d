'use client'
import { useEffect, useRef } from 'react'

export default function ToothStage() {
  const stageRef = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const stage = stageRef.current
    if (!stage) return

    // ── bubbles ──────────────────────────────────────────
    const bubblesEl = stage.querySelector('#twBubbles')
    const isMobile = window.innerWidth < 640
    const BUBBLE_COUNT = isMobile ? 9 : 16
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const b = document.createElement('div')
      b.className = 'tw-bubble'
      const size = 4 + Math.random() * 12
      const dur = 8 + Math.random() * 18
      const delay = Math.random() * -20
      const left = 5 + Math.random() * 90
      const driftX = (Math.random() - 0.5) * 60
      b.style.cssText = `
        width:${size}px; height:${size}px;
        left:${left}%;
        animation-duration:${dur}s;
        animation-delay:${delay}s;
        --bx:${driftX}px;
      `
      bubblesEl.appendChild(b)
    }

    // ── Three.js ─────────────────────────────────────────
    let renderer, scene, camera, molarMesh, cleanMat, tartarMat
    let animFrameId
    let progress = 0
    let stageOpacity = 1

    async function initThree() {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js')

      const canvas = stage.querySelector('#toothCanvas')
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
      renderer.outputColorSpace = THREE.SRGBColorSpace

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.set(0, 0, 6.2)

      // lighting
      const ambLight = new THREE.AmbientLight(0xadd8f0, 0.9)
      scene.add(ambLight)
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.4)
      dirLight.position.set(2, 4, 5)
      scene.add(dirLight)
      const rimLight = new THREE.DirectionalLight(0x80c8e8, 0.5)
      rimLight.position.set(-3, -1, -4)
      scene.add(rimLight)

      // env gradient texture
      const envCanvas = document.createElement('canvas')
      envCanvas.width = 4; envCanvas.height = 256
      const ctx = envCanvas.getContext('2d')
      const grad = ctx.createLinearGradient(0, 0, 0, 256)
      grad.addColorStop(0, '#1a6090')
      grad.addColorStop(0.5, '#0d3a5c')
      grad.addColorStop(1, '#061a2e')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 4, 256)
      const envTex = new THREE.CanvasTexture(envCanvas)
      envTex.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = envTex

      // textures
      const texLoader = new THREE.TextureLoader()
      let tartarTexture = null
      let cleanTexture = null

      try {
        tartarTexture = await texLoader.loadAsync('/assets/molar_tex.png')
        tartarTexture.colorSpace = THREE.SRGBColorSpace
      } catch {}
      try {
        cleanTexture = await texLoader.loadAsync('/assets/molar_clean.png')
        cleanTexture.colorSpace = THREE.SRGBColorSpace
      } catch {}

      // load GLB
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
      const gltfLoader = new GLTFLoader()
      gltfLoader.setDRACOLoader(dracoLoader)

      try {
        const gltf = await gltfLoader.loadAsync('/assets/molar.glb')
        molarMesh = gltf.scene
        molarMesh.scale.setScalar(1)

        // two material layers: tartar + clean
        molarMesh.traverse(child => {
          if (child.isMesh) {
            tartarMat = new THREE.MeshStandardMaterial({
              map: tartarTexture,
              roughness: 0.55,
              metalness: 0.08,
              envMapIntensity: 1.2,
            })
            cleanMat = new THREE.MeshStandardMaterial({
              map: cleanTexture,
              roughness: 0.28,
              metalness: 0.15,
              envMapIntensity: 1.6,
              transparent: true,
              opacity: 0,
            })
            child.material = tartarMat
            // clone mesh for clean layer
            const cleanChild = child.clone()
            cleanChild.material = cleanMat
            child.parent.add(cleanChild)
          }
        })
        scene.add(molarMesh)
      } catch {
        // GLB failed to load (truncated file) — show CSS-only effects
      }

      // ── scroll logic ───────────────────────────────────
      function smoothstep(edge0, edge1, x) {
        const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
        return t * t * (3 - 2 * t)
      }

      let bookingTop = null
      function getBookingTop() {
        if (bookingTop !== null) return bookingTop
        const el = document.querySelector('#programare')
        if (el) bookingTop = el.getBoundingClientRect().top + window.scrollY
        return bookingTop
      }

      function onScroll() {
        const vh = window.innerHeight
        const sy = window.scrollY
        const bTop = getBookingTop() || vh * 8

        // cleaning progress
        const rawProgress = sy / (bTop - vh * 0.45)
        progress = Math.max(0, Math.min(1, rawProgress))

        // stage fade out near booking
        const fadeStart = bTop - vh * 1.2
        const rawOpacity = 1 - (sy - fadeStart) / (vh * 0.8)
        stageOpacity = Math.max(0, Math.min(1, rawOpacity))
        stage.style.opacity = stageOpacity

        if (cleanMat) {
          cleanMat.opacity = smoothstep(0.05, 0.92, progress)
        }
        if (tartarMat) {
          tartarMat.roughness = 0.55 - progress * 0.27
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()

      // ── animation loop ─────────────────────────────────
      let t = 0
      function animate() {
        animFrameId = requestAnimationFrame(animate)
        t += 0.008
        if (molarMesh) {
          molarMesh.rotation.y += 0.004
          molarMesh.position.y = Math.sin(t) * 0.04
        }
        renderer.render(scene, camera)
      }

      // resize
      function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        bookingTop = null
      }
      window.addEventListener('resize', onResize)

      animate()

      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(animFrameId)
        renderer.dispose()
      }
    }

    let cleanup
    initThree().then(fn => { cleanup = fn })

    return () => {
      if (cleanup) cleanup()
      if (animFrameId) cancelAnimationFrame(animFrameId)
    }
  }, [])

  return (
    <div id="toothStage" ref={stageRef}>
      <canvas id="toothCanvas"></canvas>
      <div className="tw-rays"></div>
      <div className="tw-bubbles" id="twBubbles"></div>
      <div className="tw-surface"></div>
      <div className="tw-refract"></div>
      <div className="tw-caustics"></div>
      <div className="tw-vignette"></div>
    </div>
  )
}
