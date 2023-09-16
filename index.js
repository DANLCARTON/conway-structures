import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls'; // Importez OrbitControls
import models from "./models.js"

const urlParams = new URLSearchParams(window.location.search);
const model = urlParams.get('model')
let gen = urlParams.get('generations')

const deleteBorders = (layer) => {
    // Copier le tableau pour éviter de modifier l'original
    let result = layer.map(row => row.slice());
    
    // Mettre les bords à zéro
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
            if (i === 0 || i === result.length-1 || j === 0 || j === result[i].length-1) {
                result[i][j] = 0;
            }
        }
    }
    // console.log(result)
    return result;
}

const countNeighbours = (x, z, cubes) => {
    let nb = 0;
    const isValid = (i, j) => i >= 0 && j >= 0 && i < cubes.length && j < cubes[0].length;

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dx, dz] of directions) {
        const newX = x + dx;
        const newZ = z + dz;

        if (isValid(newX, newZ) && cubes[newX][newZ] === 1) {
            nb++;
        }
    }

    return nb;
};

const generateNextLayer = (cubesLayer) => {
    let nextLayer = []; // Créez un nouveau tableau pour stocker la prochaine couche

    console.log("cubesLayer", cubesLayer)

    for (let i = 0; i < cubesLayer.length; i++) {
        let row = [];
        for (let j = 0; j < cubesLayer[i].length; j++) {
            row.push(cubesLayer[i][j]);
        }
        nextLayer.push(row);
    }

    for (let x = 0; x < 49; x++) {
        for (let z = 0; z < 49; z++) {
            const nb = countNeighbours(x, z, cubesLayer);
            if (cubesLayer[x][z] === 1) {
                if (nb < 2 || nb > 3) {
                    nextLayer[x][z] = 0; // La cellule meurt
                } else {
                    nextLayer[x][z] = 1; // La cellule survit
                }
            } else {
                if (nb === 3) {
                    nextLayer[x][z] = 1; // Une nouvelle cellule naît
                } else {
                    nextLayer[x][z] = 0; // La cellule reste morte
                }
            }
        }
    }
    return nextLayer;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let cubes = [];

if (model === "blincker") {
    cubes = models["blincker"]
} else if (model === "toad") {
    cubes = models["toad"]    
} else if (model === "beacon") {
    cubes = models["beacon"]    
} else if (model === "pulsar") {
    cubes = models["pulsar"]    
} else if (model === "pentadecathlon") {
    cubes = models["pentadecathlon"]    
} else if (model === "4blinckers") {
    cubes = models["4blinckers"]    
} else if (model === "oscillators") {
    cubes = models["oscillators"]    
} else if (model === "block") {
    cubes = models["block"]    
} else if (model === "beehive") {
    cubes = models["beehive"]    
} else if (model === "loaf") {
    cubes = models["loaf"]    
} else if (model === "boat") {
    cubes = models["boat"]    
} else if (model === "tub") {
    cubes = models["tub"]    
} else if (model === "pond") {
    cubes = models["pond"]    
} else if (model === "cthulhu") {
    cubes = models["cthulhu"]    
} else if (model === "stills") {
    cubes = models["stills"]    
} else if (model === "glider") {
    cubes = models["glider"]    
} else if (model === "lwss") {
    cubes = models["lwss"]    
} else if (model === "mwss") {
    cubes = models["mwss"]    
} else if (model === "hwss") {
    cubes = models["hwss"]    
} else if (model === "44p5h2v0") {
    cubes = models["44p5h2v0"]    
} else if (model === "spaceships") {
    cubes = models["spaceships"]    
} else if (model === "rpentomino") {
    cubes = models["rpentomino"]    
} else if (model === "diehard") {
    cubes = models["diehard"]    
} else if (model === "acorn") {
    cubes = models["acorn"]    
} else if (model === "metuselahs") {
    cubes = models["metuselahs"]    
} 


else {
    for (let i = 0; i <= 49; i++) {
        let row = [];
        for (let j = 0; j <= 49; j++) {
            // Générer aléatoirement 0 ou 1
            if (Math.round(Math.random()*8) == 1) row.push(1);
            else row.push(0)
            //row.push(0)
        }
        cubes.push(row);
    }
}

let layers = []

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({color: 0xffffff})

layers.push(cubes)

if (gen == null) gen = 50;
for (let i = 1; i <= gen; i++) {
    layers.push(deleteBorders(generateNextLayer(layers[i-1])))
    //layers.push(generateNextLayer(layers[i-1]))
}

let y = 0;
layers.map((layer) => {
    for (let x = 0; x <= 49; x++) {
        for (let z = 0; z <= 49; z++) {
            if (layer[x][z] == 1) {
                const cube = new THREE.Mesh(geometry, material)
                cube.position.set(x, y, z);
                scene.add(cube)
            }
        }
    }
    y--
})

// scene.add(new THREE.AmbientLight(0xffffff, .8))
const dir1 = new THREE.DirectionalLight(0xff0000, 1);
dir1.position.set(1, 0, 0)
scene.add(dir1)
const dir2 = new THREE.DirectionalLight(0x00ff00, 1);
dir2.position.set(-1, 0, 0)
scene.add(dir2)
const dir3 = new THREE.DirectionalLight(0x0000ff, 1);
dir3.position.set(0, 0, 1)
scene.add(dir3)
const dir4 = new THREE.DirectionalLight(0xffff00, 1);
dir4.position.set(0, 0, -1)
scene.add(dir4)
const dir5 = new THREE.DirectionalLight(0xff00ff, 1);
dir5.position.set(0, 1, 0)
scene.add(dir5)
const dir6 = new THREE.DirectionalLight(0x00ffff, 1);
dir6.position.set(0, -1, 0)
scene.add(dir6)

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

camera.position.z = 20;

const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(25, -25, 25)

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();