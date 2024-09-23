import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js';

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcap = textureLoader.load('/textures/matcaps/2.png');
matcap.colorSpace = THREE.SRGBColorSpace;

// Fonts
// One method of using typefaceFont
    // import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json';
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry(
        'Han Seoul Oh',
        {
            font,
            size: 0.5,
            depth: 0.2, // used to be height
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4
        }
    );
    // Center text (Hard way/Old way)
        // textGeometry.computeBoundingBox(); // Only have sphere by default, this is needed to access box
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) / 2,
        //     - (textGeometry.boundingBox.max.y - 0.02) / 2,
        //     - (textGeometry.boundingBox.max.z - 0.03) / 2,
        // )
    textGeometry.center();

    // const material = new THREE.MeshMatcapMaterial({ matcap });
    const material = new THREE.MeshNormalMaterial();
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    // Check time taken
    console.time('donuts');
    const geometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45); // Take this line out of loop for performance

    for (let i = 0; i < 500; i++) {
        const donut = new THREE.Mesh(geometry, material);

        donut.position.x = (Math.random() - 0.5) * 15;
        donut.position.y = (Math.random() - 0.5) * 15;
        donut.position.z = (Math.random() - 0.5) * 15;

        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const scale = Math.random();
        donut.scale.set(scale, scale, scale);

        scene.add(donut);
    }
    // Check time taken: END
    console.timeEnd('donuts');
});

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

//scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()