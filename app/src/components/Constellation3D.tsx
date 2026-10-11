import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  interestLabels,
  type CultureProfile,
  type Interest,
  type Recommendation,
} from "../domain/types";
import "./Constellation3D.css";
import {
  animatedPosition,
  formationProgress,
  spatialPhase,
} from "./spatial-motion";

type Position = [number, number, number];
type LabelMap = MutableRefObject<Map<string, HTMLDivElement>>;
type NodeModel = Map<string, THREE.Vector3>;
type FocusNode = { id: string; step?: number } | null;
interface Props {
  recommendations: Recommendation[];
  profile: CultureProfile;
  selectedId: string;
  onSelect: (id: string) => void;
  onOpen?: (id: string) => void;
  energy?: MutableRefObject<number>;
  soundActive?: boolean;
  compact?: boolean;
}
const colours: Record<string, string> = {
  music: "#d6ff75",
  theatre: "#ff8e73",
  "visual-arts": "#c4acff",
  heritage: "#e1c28d",
  workshop: "#9bcfff",
  film: "#9bcfff",
  literature: "#c4acff",
  other: "#c4acff",
};
const origin: Position = [-0.3, 0.12, 0];
const eventPositions: Position[] = [
  [-3.05, 1.2, 0.55],
  [0.1, -1.2, 1.12],
  [3.05, 0.72, -0.65],
];
const interestPositions: Position[] = [
  [-1.9, -1.18, -0.78],
  [-0.9, 2.0, -0.7],
  [1.5, 1.58, 0.25],
  [1.72, -0.6, -1.28],
  [-2.2, -1.45, -0.4],
];
const eventPosition = (
  r: Recommendation,
  index: number,
  narrow = false,
): Position => [
  eventPositions[index % 3][0],
  narrow && index % 3 === 1 ? -0.9 : eventPositions[index % 3][1],
  r.bridge ? -0.85 : r.matchedTags.length ? 0.7 : -1.15,
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function supportsWebGL() {
  try {
    if (typeof document === "undefined") return false;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const supported = !!context;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return supported;
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Paths read the same moving positions as the meshes and projected text. */
function MovingPath({
  model,
  from,
  to,
  colour,
  selected,
  dashed,
  motion,
  time,
}: {
  model: NodeModel;
  from: string;
  to: string;
  colour: string;
  selected: boolean;
  dashed?: boolean;
  motion: boolean;
  time: MutableRefObject<number>;
}) {
  const geometry = useMemo(() => {
    const value = new THREE.BufferGeometry();
    value.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(33 * 3), 3),
    );
    value.setAttribute(
      "lineDistance",
      new THREE.BufferAttribute(new Float32Array(33), 1),
    );
    return value;
  }, []);
  const material = useMemo(
    () =>
      dashed
        ? new THREE.LineDashedMaterial({
            color: colour,
            transparent: true,
            dashSize: 0.11,
            gapSize: 0.075,
          })
        : new THREE.LineBasicMaterial({ color: colour, transparent: true }),
    [colour, dashed],
  );
  const line = useMemo(() => {
    const value = new THREE.Line(geometry, material);
    value.frustumCulled = false;
    value.raycast = () => {};
    return value;
  }, [geometry, material]);
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tracer = useRef<THREE.Mesh>(null);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  useFrame(() => {
    const start = model.get(from),
      end = model.get(to);
    if (!start || !end) return;
    curve.v0.copy(start);
    curve.v2.copy(end);
    curve.v1.copy(start).lerp(end, 0.5);
    curve.v1.y += 0.26;
    curve.v1.z -= 0.45;
    const buffer = geometry.getAttribute("position") as THREE.BufferAttribute;
    const distances = geometry.getAttribute(
      "lineDistance",
    ) as THREE.BufferAttribute;
    let distance = 0,
      lastX = 0,
      lastY = 0,
      lastZ = 0;
    for (let i = 0; i <= 32; i++) {
      curve.getPoint(i / 32, point);
      if (i)
        distance += Math.hypot(
          point.x - lastX,
          point.y - lastY,
          point.z - lastZ,
        );
      buffer.setXYZ(i, point.x, point.y, point.z);
      distances.setX(i, distance);
      lastX = point.x;
      lastY = point.y;
      lastZ = point.z;
    }
    buffer.needsUpdate = true;
    distances.needsUpdate = true;
    material.opacity = selected ? 0.74 : 0.23;
    if (tracer.current) {
      curve.getPoint(
        motion ? (time.current * 0.2 + spatialPhase(to) / 6.28) % 1 : 0.55,
        tracer.current.position,
      );
      tracer.current.visible = selected;
    }
  });
  return (
    <>
      <primitive object={line} />
      <mesh ref={tracer} visible={selected}>
        <sphereGeometry args={[0.035, 10, 8]} />
        <meshBasicMaterial color={colour} />
      </mesh>
    </>
  );
}

function Glow({ colour, size }: { colour: string; size: number }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { tint: { value: new THREE.Color(colour) } },
        transparent: true,
        depthWrite: false,
        vertexShader: `varying vec3 vNormal; varying vec3 vView; void main(){ vec4 p=modelViewMatrix*vec4(position,1.); vNormal=normalize(normalMatrix*normal); vView=normalize(-p.xyz); gl_Position=projectionMatrix*p; }`,
        fragmentShader: `uniform vec3 tint; varying vec3 vNormal; varying vec3 vView; void main(){ float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),2.8); gl_FragColor=vec4(tint,rim*.58); }`,
      }),
    [colour],
  );
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh material={material}>
      <sphereGeometry args={[size * 1.09, 40, 28]} />
    </mesh>
  );
}

function World({
  recommendations,
  profile,
  selectedId,
  onSelect,
  focusNode,
  resetKey,
  compact,
  energy,
  reduced,
  onContextLost,
  labelRefs,
  motion,
  heldId,
  onHold,
  openingId,
}: Props & {
  focusNode: FocusNode;
  resetKey: number;
  reduced: boolean;
  onContextLost: () => void;
  labelRefs: LabelMap;
  motion: boolean;
  heldId: string | null;
  onHold: (id: string | null) => void;
  openingId: string | null;
}) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const cameraGoal = useRef(new THREE.Vector3(0, 0.55, 8.8));
  const targetGoal = useRef(new THREE.Vector3(0, 0, 0));
  const transitioning = useRef(false);
  const light = useRef<THREE.PointLight>(null);
  const memoryCore = useRef<THREE.Group>(null);
  const atmosphereRings = useRef<THREE.Group>(null);
  const time = useRef(0);
  const frames = useRef(0);
  const groups = useRef(new Map<string, THREE.Group>());
  const { camera, gl, size, invalidate } = useThree();
  const narrow = size.width < 550;
  // Compact art occupies a very different aspect ratio from the discovery atlas.
  // Fit its complete seven-unit world width, then leave room above/below each orb.
  const scale = compact ? 1 : narrow ? 0.84 : 1;
  const compactDistance = Math.max(
    10.5,
    4.05 / Math.tan(THREE.MathUtils.degToRad(18)) / (size.width / size.height),
  );
  const restDistance = compact
    ? compactDistance
    : Math.max(
        8.8,
        (4.8 * scale) /
          Math.tan(THREE.MathUtils.degToRad(18)) /
          (size.width / size.height),
      );
  const interests = profile.interests.slice(0, 5);
  const nodes = useMemo(
    () => [
      { id: "origin", anchor: origin, kind: "origin" as const, order: 0 },
      ...interests.map((id, i) => ({
        id,
        anchor: interestPositions[i],
        kind: "taste" as const,
        order: i + 1,
      })),
      ...recommendations.slice(0, 3).map((r, i) => ({
        id: r.event.id,
        anchor: eventPosition(r, i, narrow),
        kind: "event" as const,
        order: i + interests.length + 1,
      })),
    ],
    [
      narrow,
      profile.interests.join(","),
      recommendations
        .map((r) => `${r.event.id}-${r.bridge}-${r.matchedTags.join(",")}`)
        .join("|"),
    ],
  );
  const previousModel = useRef<NodeModel>(new Map());
  const model = useMemo<NodeModel>(() => {
    const next = new Map(
      nodes.map((n) => [
        n.id,
        previousModel.current.get(n.id) ?? new THREE.Vector3(...n.anchor),
      ]),
    );
    previousModel.current = next;
    return next;
  }, [nodes]);
  const formationStarts = useRef(new Map<string, number>());
  const destination = useMemo(() => new THREE.Vector3(), []);
  const originVector = useMemo(() => new THREE.Vector3(...origin), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => {
    // A replacement forms on its own; the other two choices retain their positions.
    for (const id of formationStarts.current.keys())
      if (!model.has(id)) formationStarts.current.delete(id);
    for (const node of nodes)
      if (!formationStarts.current.has(node.id))
        formationStarts.current.set(node.id, time.current);
    invalidate();
  }, [model, nodes, invalidate]);
  const capture = (id: string) => (group: THREE.Group | null) => {
    if (group) groups.current.set(id, group);
    else groups.current.delete(id);
  };
  useEffect(() => {
    const loss = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    gl.domElement.addEventListener("webglcontextlost", loss);
    return () => gl.domElement.removeEventListener("webglcontextlost", loss);
  }, [gl, onContextLost]);
  useEffect(() => {
    if (!focusNode) return;
    const node = nodes.find((n) => n.id === focusNode.id);
    if (!node) return;
    const p = node.anchor;
    targetGoal.current.set(
      p[0] * (narrow ? 0.12 : 0.3) * scale,
      p[1] * 0.3 * scale,
      p[2] * 0.25,
    );
    cameraGoal.current.set(
      p[0] * 0.24,
      p[1] * 0.18 + 0.55,
      restDistance - (openingId ? 0.8 : 0.2),
    );
    transitioning.current = true;
    invalidate();
  }, [focusNode, nodes, narrow, scale, restDistance, openingId, invalidate]);
  useEffect(() => {
    cameraGoal.current.set(0, 0.55, restDistance);
    targetGoal.current.set(0, 0, 0);
    transitioning.current = true;
    invalidate();
  }, [resetKey, restDistance, invalidate]);
  useFrame((_, delta) => {
    const frameDelta = Math.min(delta, 0.04);
    if (motion) time.current += frameDelta;
    const signal = motion ? Math.min(1, energy?.current ?? 0) : 0;
    let formationComplete = true;
    for (const node of nodes) {
      const position = model.get(node.id)!;
      const formationElapsed = time.current - (formationStarts.current.get(node.id) ?? 0);
      const stillForming = formationElapsed < node.order * .12 + .8 + .55;
      if (stillForming) formationComplete = false;
      const progress = motion
        ? formationProgress(formationElapsed, node.order)
        : 1;
      if (!motion) {
        if (reduced) position.set(...node.anchor);
      } else if (node.id !== heldId || stillForming) {
        destination
          .set(
            ...(node.kind === "origin"
              ? node.anchor
              : animatedPosition(
                  node.anchor,
                  node.id,
                  time.current,
                  node.kind,
                )),
          )
          .lerp(originVector, 1 - progress);
        position.lerp(destination, 1 - Math.exp(-frameDelta * 8));
      }
      const group = groups.current.get(node.id);
      if (group) {
        group.position.copy(position);
        if (motion || reduced)
          group.scale.setScalar(motion ? 0.28 + 0.72 * progress : 1);
        if (motion && node.kind === "taste") {
          group.rotation.y = time.current * 0.34 + spatialPhase(node.id);
          group.rotation.z =
            0.2 * Math.sin(time.current * 0.3 + spatialPhase(node.id));
        }
      }
    }
    if (memoryCore.current && motion) {
      memoryCore.current.rotation.y += frameDelta * 0.24;
      memoryCore.current.rotation.z = 0.15 * Math.sin(time.current * 0.3);
      memoryCore.current.scale.setScalar(1 + signal * 0.045);
    }
    if (atmosphereRings.current && motion)
      atmosphereRings.current.rotation.y = Math.sin(time.current * 0.09) * 0.12;
    gl.domElement.dataset.motionTime = time.current.toFixed(3);
    gl.domElement.dataset.formationComplete = String(formationComplete || reduced);
    gl.domElement.dataset.sceneFrames = String(++frames.current);
    gl.domElement.dataset.nodePositions = recommendations
      .slice(0, 3)
      .map((r) =>
        model
          .get(r.event.id)!
          .toArray()
          .map((v) => v.toFixed(3))
          .join(","),
      )
      .join("|");
    if (!compact) {
      const project = (id: string, position: Position) => {
        const element = labelRefs.current.get(id);
        if (!element) return;
        const point = projected
          .set(...position)
          .multiplyScalar(scale)
          .project(camera);
        const halfWidth = element.offsetWidth / 2;
        const halfHeight = element.offsetHeight / 2;
        const x = Math.min(
          size.width - halfWidth - 8,
          Math.max(halfWidth + 8, ((point.x + 1) * size.width) / 2),
        );
        const isEvent = id !== "origin" && !interests.includes(id as Interest);
        // Long event titles sit below their planet instead of covering its artwork.
        const labelOffset = isEvent ? Math.max(0, halfHeight - 16) : 0;
        const y = Math.min(
          size.height - halfHeight - 64,
          Math.max(
            halfHeight + 48,
            ((-point.y + 1) * size.height) / 2 + labelOffset,
          ),
        );
        element.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
        element.style.visibility =
          point.z > 1 || point.z < -1 ? "hidden" : "visible";
      };
      const memory = model.get("origin")!;
      project("origin", [memory.x, memory.y - 0.55, memory.z]);
      interests.forEach((tag) => {
        const p = model.get(tag)!;
        project(tag, [p.x, p.y + 0.24, p.z]);
      });
      recommendations.slice(0, 3).forEach((r) => {
        const p = model.get(r.event.id)!;
        project(r.event.id, [p.x, p.y - 0.77, p.z]);
      });
    }
    if (light.current) light.current.intensity = 2.3 + signal * 1.2;
    if (!transitioning.current || !controls.current) return;
    const amount = reduced ? 1 : 1 - Math.exp(-frameDelta * 4.8);
    camera.position.lerp(cameraGoal.current, amount);
    controls.current.target.lerp(targetGoal.current, amount);
    controls.current.update();
    gl.domElement.dataset.cameraPosition = camera.position
      .toArray()
      .map((v) => v.toFixed(2))
      .join(",");
    if (camera.position.distanceTo(cameraGoal.current) < 0.012)
      transitioning.current = false;
    else invalidate();
  }, -1);
  const select = (id: string) => onSelect(id);
  return (
    <>
      <color attach="background" args={["#090e18"]} />
      <fog attach="fog" args={["#090e18", 12, 24]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[-4, 6, 5]} intensity={2.8} color="#e4f2ff" />
      <pointLight
        ref={light}
        position={[0, 2, 3]}
        intensity={2.3}
        color="#d6ff75"
        distance={15}
      />
      <pointLight
        position={[5, -3, -1]}
        intensity={3}
        color="#9bcfff"
        distance={10}
      />
      <group scale={scale}>
        <group ref={atmosphereRings}>
          {[3.35, 4.25].map((radius, i) => (
            <mesh
              key={radius}
              rotation={[Math.PI / 2.65, 0.18, i * 0.19]}
              position={[0, -0.25, -1.3]}
            >
              <torusGeometry args={[radius, 0.007, 3, 140]} />
              <meshBasicMaterial color="#9bcfff" transparent opacity={0.11} />
            </mesh>
          ))}
        </group>
        {interests.map((tag, i) => (
          <MovingPath
            key={`story-${tag}`}
            model={model}
            from="origin"
            to={tag}
            colour="#9bcfff"
            selected={focusNode?.id === tag}
            motion={motion}
            time={time}
          />
        ))}
        {recommendations.slice(0, 3).flatMap((r, eventIndex) => {
          const links = r.matchedTags.filter((tag) => interests.includes(tag));
          const isSelected = r.event.id === selectedId;
          return (links.length ? links : [null]).map((tag, i) => {
            const direct = tag !== null && r.event.tags.includes(tag);
            return (
              <MovingPath
                key={`${r.event.id}-${tag ?? i}`}
                model={model}
                from={tag ?? "origin"}
                to={r.event.id}
                colour={colours[r.event.category] ?? "#9bcfff"}
                selected={isSelected}
                motion={motion}
                time={time}
                dashed={!direct}
              />
            );
          });
        })}
        <group ref={capture("origin")} position={origin}>
          <group ref={memoryCore}>
            <mesh rotation={[0.25, 0.15, 0.4]}>
              <icosahedronGeometry args={[0.28, 0]} />
              <meshBasicMaterial
                color="#9bcfff"
                wireframe
                transparent
                opacity={0.85}
              />
            </mesh>
            {[0, 1].map((i) => (
              <mesh key={i} rotation={[1.12 + i * 0.55, 0.4 + i * 0.7, 0.2]}>
                <torusGeometry args={[0.49, 0.012, 5, 64]} />
                <meshBasicMaterial color="#9bcfff" transparent opacity={0.6} />
              </mesh>
            ))}
          </group>
        </group>
        {interests.map((tag, i) => (
          <group key={tag} ref={capture(tag)} position={interestPositions[i]}>
            <mesh rotation={[0, Math.PI / 4, Math.PI / 4]}>
              <octahedronGeometry args={[0.1]} />
              <meshStandardMaterial
                color="#c1d4ea"
                emissive="#9bcfff"
                emissiveIntensity={focusNode?.id === tag ? 1 : 0.5}
                roughness={0.3}
              />
            </mesh>
          </group>
        ))}
        {recommendations.slice(0, 3).map((r, index) => (
          <group
            key={r.event.id}
            ref={capture(r.event.id)}
            position={eventPosition(r, index, narrow)}
          >
            <EventPlanet
              recommendation={r}
              index={index}
              selected={r.event.id === selectedId}
              compact={compact}
              onSelect={select}
              motion={motion}
              time={time}
              energy={energy}
              onHold={onHold}
              saved={profile.savedEventIds.includes(r.event.id)}
            />
          </group>
        ))}
      </group>
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableDamping={!reduced}
        dampingFactor={0.075}
        minDistance={7.7}
        maxDistance={Math.max(13, restDistance * 1.2)}
        minPolarAngle={0.78}
        maxPolarAngle={1.95}
        minAzimuthAngle={-1.05}
        maxAzimuthAngle={1.05}
        rotateSpeed={0.45}
        zoomSpeed={0.6}
        onStart={() => {
          transitioning.current = false;
        }}
        onChange={() => {
          gl.domElement.dataset.cameraPosition = camera.position
            .toArray()
            .map((v) => v.toFixed(2))
            .join(",");
        }}
      />
    </>
  );
}

function EventPlanet({
  recommendation: r,
  index,
  selected,
  compact,
  onSelect,
  motion,
  time,
  energy,
  onHold,
  saved,
}: {
  recommendation: Recommendation;
  index: number;
  selected: boolean;
  compact?: boolean;
  onSelect: (id: string) => void;
  motion: boolean;
  time: MutableRefObject<number>;
  energy?: MutableRefObject<number>;
  onHold: (id: string | null) => void;
  saved: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const colour = colours[r.event.category] ?? "#9bcfff";
  const active = hovered || selected;
  const rings = useRef<THREE.Group>(null);
  const planetMaterial = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (!motion) return;
    if (rings.current) {
      rings.current.rotation.y = Math.sin(time.current * 0.26 + index) * 0.48;
      rings.current.rotation.z = time.current * 0.085 * (index % 2 ? -1 : 1);
      rings.current.scale.setScalar(
        1 + Math.min(1, energy?.current ?? 0) * 0.055,
      );
    }
    if (planetMaterial.current)
      planetMaterial.current.emissiveIntensity =
        (active ? 0.23 : 0.06) + Math.min(1, energy?.current ?? 0) * 0.1;
  });
  return (
    <group>
      <mesh
        onClick={
          compact
            ? undefined
            : (event) => {
                event.stopPropagation();
                onSelect(r.event.id);
              }
        }
        onPointerOver={
          compact
            ? undefined
            : (event) => {
                event.stopPropagation();
                setHovered(true);
                onHold(r.event.id);
              }
        }
        onPointerOut={
          compact
            ? undefined
            : () => {
                setHovered(false);
                onHold(null);
              }
        }
      >
        <sphereGeometry args={[index === 0 ? 0.46 : 0.37, 32, 24]} />
        <meshStandardMaterial
          ref={planetMaterial}
          color={colour}
          emissive={colour}
          emissiveIntensity={active ? 0.25 : 0.06}
          metalness={0.25}
          roughness={0.36}
        />
      </mesh>
      <Glow colour={colour} size={index === 0 ? 0.46 : 0.37} />
      <group ref={rings}>
        <mesh rotation={[1.07, 0.22, index * 0.45]}>
          <torusGeometry
            args={[index === 0 ? 0.69 : 0.56, active ? 0.012 : 0.008, 6, 72]}
          />
          <meshBasicMaterial
            color={colour}
            transparent
            opacity={active ? 0.85 : 0.32}
          />
        </mesh>
        {saved && (
          <mesh rotation={[0.55, 1.12, 0.3]}>
            <torusGeometry args={[index === 0 ? 0.77 : 0.64, 0.018, 6, 64]} />
            <meshBasicMaterial color="#f5f4eb" transparent opacity={0.82} />
          </mesh>
        )}
      </group>
    </group>
  );
}

export default function Constellation3D(props: Props) {
  const { recommendations, profile, selectedId, onSelect, compact } = props;
  const [supported, setSupported] = useState(supportsWebGL);
  const [focusNode, setFocusNode] = useState<FocusNode>(null);
  const [resetKey, setResetKey] = useState(0);
  const [inspectedTaste, setInspectedTaste] = useState<Interest | null>(null);
  const [heldId, setHeldId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [inView, setInView] = useState(true);
  const [tour, setTour] = useState<{
    id: string;
    taste: Interest;
    step: number;
  } | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<{
    id: string;
    x: number;
    y: number;
    pointerId: number;
  } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const reduced = useReducedMotion();
  const motion = !reduced && !paused && pageVisible && inView;
  const visible = recommendations.slice(0, 3);
  const selected = visible.find((r) => r.event.id === selectedId) ?? visible[0];
  const candidate = selected?.matchedTags.some((tag) =>
    profile.interests.includes(tag),
  )
    ? selected
    : (visible.find(
        (r) =>
          r.bridge &&
          r.matchedTags.some((tag) => profile.interests.includes(tag)),
      ) ??
      visible.find((r) =>
        r.matchedTags.some((tag) => profile.interests.includes(tag)),
      ));
  const touredEvent = tour ? visible.find((r) => r.event.id === tour.id) : null;
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!stageRef.current || typeof IntersectionObserver === "undefined")
      return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(
    () => () => {
      if (openTimer.current) clearTimeout(openTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (tour && !touredEvent) setTour(null);
  }, [tour, touredEvent]);
  const select = (id: string) => {
    onSelect(id);
    setFocusNode({ id });
    setInspectedTaste(null);
    setTour(null);
  };
  const beginTouch = (
    event: ReactPointerEvent<HTMLButtonElement>,
    id: string,
  ) => {
    if (event.pointerType === "touch" && event.isPrimary)
      touchStart.current = {
        id,
        x: event.clientX,
        y: event.clientY,
        pointerId: event.pointerId,
      };
  };
  const completeTouch = (
    event: ReactPointerEvent<HTMLButtonElement>,
    id: string,
  ) => {
    const start = touchStart.current;
    touchStart.current = null;
    // Chrome can suppress the compatibility click after a canvas drag.
    // A stationary primary touch still selects; a scroll/cancel never does.
    if (
      event.pointerType === "touch" &&
      start?.id === id &&
      start.pointerId === event.pointerId &&
      Math.hypot(event.clientX - start.x, event.clientY - start.y) < 8
    )
      select(id);
  };
  const visit = (next: { id: string; taste: Interest; step: number }) => {
    setTour(next);
    setFocusNode({
      id: next.step === 0 ? "origin" : next.step === 1 ? next.taste : next.id,
      step: next.step,
    });
    onSelect(next.id);
  };
  const openExperience = (id: string) => {
    if (!props.onOpen || openingId) return;
    setOpeningId(id);
    setFocusNode({ id });
    openTimer.current = setTimeout(
      () => {
        props.onOpen?.(id);
        setOpeningId(null);
        openTimer.current = null;
      },
      reduced ? 0 : 420,
    );
  };
  const relationship = inspectedTaste
    ? visible
        .filter((r) => r.matchedTags.includes(inspectedTaste))
        .map((r) => r.event.title)
        .join(" · ") ||
      "No recommendation in this view connects directly to this taste."
    : selected?.explanation;
  return (
    <section
      className={`culture-cosmos ${compact ? "culture-cosmos-compact" : ""}`}
      aria-label="Your three-dimensional Culture Constellation"
      data-testid="culture-constellation"
      data-renderer={supported ? "webgl" : "fallback"}
      data-motion={reduced ? "reduced" : motion ? "running" : "paused"}
    >
      <div className="cosmos-stage" ref={stageRef}>
        {supported ? (
          <SceneBoundary onError={() => setSupported(false)}>
            <Canvas
              camera={{ position: [0, 0.55, 9.8], fov: 36 }}
              dpr={[1, 1.5]}
              frameloop={motion ? "always" : "demand"}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: "low-power",
              }}
              aria-label={
                compact
                  ? "Illustrative cultural constellation"
                  : "Interactive 3D cultural connections. Equivalent controls and explanations are below."
              }
            >
              <World
                {...props}
                onSelect={select}
                focusNode={focusNode}
                resetKey={resetKey}
                reduced={reduced}
                onContextLost={() => setSupported(false)}
                labelRefs={labelRefs}
                motion={motion}
                heldId={heldId}
                onHold={setHeldId}
                openingId={openingId}
              />
            </Canvas>
          </SceneBoundary>
        ) : (
          <div
            className="cosmos-fallback"
            role="img"
            aria-label="Static cultural relationship map; use the accessible event controls below."
          >
            <div className="fallback-orbit" />
            <div className="fallback-orbit secondary" />
            <span className="fallback-origin">
              ◇<small>YOUR FIRST CHAPTER</small>
            </span>
            {visible.map((r, i) => (
              <span
                className={`fallback-planet planet-${i}`}
                key={r.event.id}
                style={
                  {
                    "--node-colour": colours[r.event.category],
                  } as React.CSSProperties
                }
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
            <p>Spatial view unavailable · your connections still work below</p>
          </div>
        )}
        {!compact && supported && (
          <div className="cosmos-projected-labels">
            <div
              className="cosmos-projected-label"
              ref={(node) => {
                if (node) labelRefs.current.set("origin", node);
                else labelRefs.current.delete("origin");
              }}
            >
              <span className="cosmos-origin-label">
                YOUR FIRST CHAPTER
                <strong title={profile.previousTitle}>
                  {profile.previousTitle?.trim() || "Your story begins here"}
                </strong>
              </span>
            </div>
            {profile.interests.slice(0, 5).map((tag) => (
              <div
                className={`cosmos-projected-label ${selected?.matchedTags.includes(tag) ? "is-relevant-taste" : "is-context-taste"}`}
                key={tag}
                ref={(node) => {
                  if (node) labelRefs.current.set(tag, node);
                  else labelRefs.current.delete(tag);
                }}
              >
                <span className="cosmos-interest-label">
                  {interestLabels[tag]}
                </span>
              </div>
            ))}
            {visible.map((r, index) => (
              <div
                className="cosmos-projected-label"
                key={r.event.id}
                ref={(node) => {
                  if (node) labelRefs.current.set(r.event.id, node);
                  else labelRefs.current.delete(r.event.id);
                }}
              >
                <button
                  className={`spatial-event-label cosmos-node-label ${r.event.id === selectedId ? "is-selected" : ""}`}
                  onClick={() => select(r.event.id)}
                  onFocus={() => {
                    select(r.event.id);
                    setHeldId(r.event.id);
                  }}
                  onMouseEnter={() => setHeldId(r.event.id)}
                  onMouseLeave={() => setHeldId(null)}
                  onPointerDown={(event) => {
                    setHeldId(r.event.id);
                    beginTouch(event, r.event.id);
                  }}
                  onPointerUp={(event) => {
                    setHeldId(null);
                    completeTouch(event, r.event.id);
                  }}
                  onPointerCancel={() => {
                    setHeldId(null);
                    touchStart.current = null;
                  }}
                  onBlur={() => setHeldId(null)}
                  aria-label={`Select ${r.event.title}`}
                  aria-pressed={r.event.id === selectedId}
                  style={
                    {
                      "--node-colour": colours[r.event.category],
                    } as React.CSSProperties
                  }
                >
                  <span>
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {r.bridge ? "NEW CONNECTION" : "FOR YOUR ORBIT"}
                  </span>
                  <strong>{r.event.title}</strong>
                  {profile.savedEventIds.includes(r.event.id) && (
                    <em className="cosmos-saved">Saved in My Loop</em>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="cosmos-coordinate" aria-hidden="true">
          SG / 01° N<br />
          <span>YOUR CULTURAL UNIVERSE</span>
        </div>
        {!compact && (
          <div className="cosmos-view-controls">
            <span>
              {supported
                ? "Drag to explore · pinch to zoom"
                : "Accessible relationship view"}
            </span>
            {supported && (
              <div className="cosmos-control-buttons">
                <button
                  onClick={() => setPaused((value) => !value)}
                  aria-pressed={paused || reduced}
                  disabled={reduced}
                >
                  {reduced
                    ? "Reduced motion"
                    : paused
                      ? "Resume motion"
                      : "Pause motion"}
                </button>
                <button
                  onClick={() => {
                    setFocusNode(null);
                    setTour(null);
                    setResetKey((key) => key + 1);
                  }}
                  aria-label="Reset constellation view"
                >
                  ↺ Reset view
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {!compact && (
        <div className="cosmos-interface">
          <div className={`cosmos-tour ${tour ? "is-touring" : ""}`}>
            {tour && touredEvent ? (
              <>
                <div className="cosmos-tour-copy" aria-live="polite">
                  <span className="cosmos-tour-step">
                    {String(tour.step + 1).padStart(2, "0")} / 03 · FOLLOW THE
                    CONNECTION
                  </span>
                  <h3>
                    {tour.step === 0
                      ? "Start with your story."
                      : tour.step === 1
                        ? `Follow ${interestLabels[tour.taste]}.`
                        : "Meet your next chapter."}
                  </h3>
                  <p>
                    {tour.step === 0
                      ? profile.previousTitle?.trim() ||
                        profile.previousCategory
                        ? `${profile.previousTitle?.trim() || "The experience you told us about"} is your starting point. Your chosen tastes show where you would like to go next.`
                        : "Your curiosity is the starting point. Your chosen tastes show where you would like to go next."
                      : tour.step === 1
                        ? touredEvent.event.tags.includes(tour.taste)
                          ? `You chose ${interestLabels[tour.taste]}. This experience shares that interest: ${touredEvent.event.culturalNotes[0] ?? touredEvent.event.description}`
                          : (touredEvent.event.bridgeExplanations[tour.taste] ??
                            touredEvent.explanation)
                        : touredEvent.explanation}
                  </p>
                </div>
                <div className="cosmos-tour-actions">
                  <button
                    onClick={() => visit({ ...tour, step: tour.step - 1 })}
                    disabled={tour.step === 0}
                  >
                    Back
                  </button>
                  {tour.step < 2 ? (
                    <button
                      className="cosmos-tour-next"
                      onClick={() => visit({ ...tour, step: tour.step + 1 })}
                    >
                      Next connection ↗
                    </button>
                  ) : (
                    props.onOpen && (
                      <button
                        className="cosmos-tour-next"
                        onClick={() => openExperience(tour.id)}
                        disabled={!!openingId}
                      >
                        {openingId ? "Opening…" : "Explore this experience ↗"}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => {
                      setTour(null);
                      setFocusNode({ id: tour.id });
                    }}
                  >
                    Exit guide
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="cosmos-tour-copy">
                  <span className="cosmos-tour-step">
                    A PATH THROUGH YOUR UNIVERSE
                  </span>
                  <p>Follow one taste into a new cultural experience.</p>
                </div>
                <button
                  className="cosmos-tour-start"
                  disabled={!candidate}
                  onClick={() => {
                    const taste = candidate?.matchedTags.find((tag) =>
                      profile.interests.includes(tag),
                    );
                    if (candidate && taste)
                      visit({ id: candidate.event.id, taste, step: 0 });
                  }}
                >
                  {candidate
                    ? "Follow a connection ↗"
                    : "Choose tastes to follow a connection"}
                </button>
              </>
            )}
          </div>
          <div
            className="cosmos-legend"
            aria-label="Constellation connection key"
          >
            <span>
              <i className="legend-origin" />
              Previous experience
            </span>
            <span>
              <i className="legend-interest" />
              Your tastes
            </span>
            <span>
              <i className="legend-event" />
              Next chapters
            </span>
          </div>
          <div
            className="cosmos-event-controls"
            aria-label="Accessible recommended event selection"
          >
            {visible.map((r, i) => (
              <button
                key={r.event.id}
                onClick={() => select(r.event.id)}
                onPointerDown={(event) => beginTouch(event, r.event.id)}
                onPointerUp={(event) => completeTouch(event, r.event.id)}
                onPointerCancel={() => {
                  touchStart.current = null;
                }}
                aria-pressed={r.event.id === selected?.event.id}
                aria-label={`Focus on ${r.event.title}`}
                className={`event-node ${r.event.id === selected?.event.id ? "active" : ""}`}
                style={
                  {
                    "--node-colour": colours[r.event.category],
                  } as React.CSSProperties
                }
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{r.event.title}</strong>
                <b aria-hidden="true">↗</b>
              </button>
            ))}
          </div>
          <details className="cosmos-relations">
            <summary>
              Read your connections <span aria-hidden="true">+</span>
            </summary>
            <p>
              <strong>
                {profile.previousTitle?.trim() || "Your story begins here"}
              </strong>{" "}
              anchors your constellation. Fine blue paths show the tastes you
              chose; they do not imply that your previous event contains those
              tastes.
            </p>
            <div className="cosmos-taste-controls">
              {profile.interests.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setInspectedTaste(tag)}
                  aria-pressed={inspectedTaste === tag}
                >
                  {interestLabels[tag]}
                </button>
              ))}
            </div>
            <p aria-live="polite">
              {inspectedTaste && (
                <strong>{interestLabels[inspectedTaste]} → </strong>
              )}
              {relationship ??
                "Choose your tastes to begin a new cultural chapter."}
            </p>
            <p>
              Solid paths connect shared event interests. Dashed paths show an
              authored discovery bridge, or open exploration when there is no
              matching taste. Familiar matches sit forward; discovery bridges
              sit deeper. Select a chapter above to read the actual
              recommendation explanation.
            </p>
          </details>
        </div>
      )}
    </section>
  );
}
