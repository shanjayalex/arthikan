import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { signal, energy } from '../lib/signal'
import { useTheme } from '../lib/theme'

const N = 2400
const LIME = new THREE.Color('#BAF709')

function Points({ base }: { base: string }) {
  const ref = useRef<THREE.Points>(null)
  const wire = useRef<THREE.LineSegments>(null)
  const baseColor = useMemo(() => new THREE.Color(base), [base])

  // Fibonacci sphere: evenly spread points.
  const { positions, home, colors } = useMemo(() => {
    const home = new Float32Array(N * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = golden * i
      home.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3)
    }
    return { home, positions: home.slice(), colors: new Float32Array(N * 3) }
  }, [])

  const wireGeo = useMemo(() => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.985, 3)), [])
  const c = useMemo(() => new THREE.Color(), [])

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    const e = energy()
    const flat = 1 - signal.heroProgress * 0.96
    const geo = ref.current!.geometry
    const pos = geo.attributes.position.array as Float32Array
    const col = geo.attributes.color.array as Float32Array
    for (let i = 0; i < N; i++) {
      const x = home[i * 3], y = home[i * 3 + 1], z = home[i * 3 + 2]
      // audio-like ripple: bands travelling over the sphere
      const w = Math.sin(y * 9 - t * 2.4) * Math.cos(x * 5 + t * 1.3) * Math.sin(z * 7 + t * 0.8)
      const d = 1 + w * (0.06 + e * 0.2)
      pos[i * 3] = x * d
      pos[i * 3 + 1] = y * d * flat
      pos[i * 3 + 2] = z * d
      const k = Math.max(0, Math.min(1, (w + 0.15) * 2.2))
      c.copy(baseColor).lerp(LIME, k)
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.color.needsUpdate = true
    const g = ref.current!
    g.rotation.y += dt * 0.12
    g.rotation.x = 0.25 + signal.pointer.y * 0.15
    g.rotation.z = signal.pointer.x * -0.1
    wire.current!.rotation.copy(g.rotation)
    wire.current!.scale.set(1, flat, 1)
  })

  return (
    <>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.022} vertexColors sizeAttenuation transparent opacity={0.95} depthWrite={false} />
      </points>
      <lineSegments ref={wire} geometry={wireGeo}>
        <lineBasicMaterial color={base} transparent opacity={0.08} />
      </lineSegments>
    </>
  )
}

/** The hero's one 3D moment: a point-cloud sphere that ripples like an audio waveform. */
export default function SignalSphere() {
  const theme = useTheme()
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 3.1], fov: 45 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} aria-hidden="true">
      <Points base={theme === 'dark' ? '#F5F5F0' : '#0E0F0C'} />
    </Canvas>
  )
}
