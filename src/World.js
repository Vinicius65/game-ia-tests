import * as THREE from 'three';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.trees = [];
        this.rocks = [];
        this.flowers = [];
        this.time = 0;
        
        this.setupLighting();
        this.createGround();
        this.populateWorld();
    }

    setupLighting() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Luz direcional (sol)
        const sunLight = new THREE.DirectionalLight(0xfff4e6, 0.8);
        sunLight.position.set(10, 15, 10);
        sunLight.castShadow = true;
        
        // Configurar sombras
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.left = -20;
        sunLight.shadow.camera.right = 20;
        sunLight.shadow.camera.top = 20;
        sunLight.shadow.camera.bottom = -20;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        
        this.scene.add(sunLight);

        // Luz de preenchimento
        const fillLight = new THREE.DirectionalLight(0x9dc3f0, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
    }

    createGround() {
        // Chão de grama com textura
        const groundSize = 40;
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, 20, 20);
        
        // Adicionar variação ao terreno
        const positions = groundGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const noise = (Math.sin(x * 0.5) * Math.cos(y * 0.5)) * 0.2;
            positions.setZ(i, noise);
        }
        groundGeometry.computeVertexNormals();

        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x6ba368,
            flatShading: true,
            roughness: 0.9,
            metalness: 0.1
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Adicionar grama baixa (pontos coloridos)
        this.createGrass(groundSize);
    }

    createGrass(size) {
        const grassCount = 500;
        const grassGeometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < grassCount; i++) {
            const x = (Math.random() - 0.5) * size * 0.9;
            const z = (Math.random() - 0.5) * size * 0.9;
            const y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.2 + 0.05;

            positions.push(x, y, z);

            // Variação de cor da grama
            const greenVariation = 0.7 + Math.random() * 0.3;
            colors.push(0.3 * greenVariation, greenVariation, 0.2 * greenVariation);
        }

        grassGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        grassGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const grassMaterial = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const grass = new THREE.Points(grassGeometry, grassMaterial);
        this.scene.add(grass);
    }

    populateWorld() {
        // Adicionar árvores
        this.createTree(-5, -5);
        this.createTree(6, -4);
        this.createTree(-7, 6);
        this.createTree(5, 7);
        this.createTree(-3, 8);
        this.createTree(8, -8);
        this.createTree(-8, -7);

        // Adicionar rochas
        this.createRock(3, 2, 0.3);
        this.createRock(-4, 3, 0.4);
        this.createRock(7, 5, 0.35);
        this.createRock(-6, -3, 0.5);
        this.createRock(2, -6, 0.3);

        // Adicionar flores
        this.createFlowerPatch(0, 3);
        this.createFlowerPatch(4, -2);
        this.createFlowerPatch(-5, 4);
    }

    createTree(x, z) {
        const treeGroup = new THREE.Group();

        // Tronco
        const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 6);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x5c4033,
            flatShading: true,
            roughness: 1,
            metalness: 0
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 0.75;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Copa da árvore (várias camadas de cones)
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x3d7c47,
            flatShading: true,
            roughness: 0.9,
            metalness: 0
        });

        const layers = [
            { y: 1.3, radius: 0.8, height: 0.8 },
            { y: 1.8, radius: 0.6, height: 0.7 },
            { y: 2.3, radius: 0.4, height: 0.6 }
        ];

        layers.forEach(layer => {
            const foliageGeometry = new THREE.ConeGeometry(layer.radius, layer.height, 6);
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = layer.y;
            foliage.castShadow = true;
            treeGroup.add(foliage);
        });

        const y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.2;
        treeGroup.position.set(x, y, z);
        
        this.trees.push(treeGroup);
        this.scene.add(treeGroup);
    }

    createRock(x, z, scale = 0.3) {
        // Rocha low-poly irregular
        const rockGeometry = new THREE.DodecahedronGeometry(scale, 0);
        
        // Deformar para parecer mais irregular
        const positions = rockGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const vertex = new THREE.Vector3(
                positions.getX(i),
                positions.getY(i),
                positions.getZ(i)
            );
            vertex.multiplyScalar(0.8 + Math.random() * 0.4);
            positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        rockGeometry.computeVertexNormals();

        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            flatShading: true,
            roughness: 0.9,
            metalness: 0.1
        });

        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        const y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.2 + scale * 0.3;
        rock.position.set(x, y, z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        rock.receiveShadow = true;

        this.rocks.push(rock);
        this.scene.add(rock);
    }

    createFlowerPatch(x, z) {
        const flowerCount = 5 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < flowerCount; i++) {
            const offsetX = (Math.random() - 0.5) * 1.5;
            const offsetZ = (Math.random() - 0.5) * 1.5;
            this.createFlower(x + offsetX, z + offsetZ);
        }
    }

    createFlower(x, z) {
        const flowerGroup = new THREE.Group();

        // Haste
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4);
        const stemMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a7c3a,
            flatShading: true
        });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.15;
        flowerGroup.add(stem);

        // Flor (escolher cor aleatória)
        const colors = [0xff6b9d, 0xffd93d, 0x6bcfff, 0xff8c42, 0xc77dff];
        const flowerColor = colors[Math.floor(Math.random() * colors.length)];
        
        const petalGeometry = new THREE.SphereGeometry(0.08, 5, 5);
        const petalMaterial = new THREE.MeshStandardMaterial({
            color: flowerColor,
            flatShading: true
        });

        // Criar pétalas em círculo
        const petalCount = 5;
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            petal.position.set(
                Math.cos(angle) * 0.08,
                0.35,
                Math.sin(angle) * 0.08
            );
            petal.scale.set(0.7, 0.7, 0.7);
            flowerGroup.add(petal);
        }

        // Centro da flor
        const centerGeometry = new THREE.SphereGeometry(0.05, 5, 5);
        const centerMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd93d,
            flatShading: true
        });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.position.y = 0.35;
        flowerGroup.add(center);

        const y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.2;
        flowerGroup.position.set(x, y, z);

        this.flowers.push(flowerGroup);
        this.scene.add(flowerGroup);
    }

    update(deltaTime) {
        this.time += deltaTime;

        // Animar árvores (balanço suave)
        this.trees.forEach((tree, index) => {
            const swayAmount = Math.sin(this.time * 0.5 + index) * 0.02;
            tree.rotation.z = swayAmount;
        });

        // Animar flores (balanço)
        this.flowers.forEach((flower, index) => {
            const swayAmount = Math.sin(this.time * 2 + index * 0.5) * 0.05;
            flower.rotation.z = swayAmount;
        });
    }
}
