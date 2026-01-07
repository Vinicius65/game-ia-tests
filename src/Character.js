import * as THREE from 'three';
import { WalkAnimation } from './animations/WalkAnimation.js';
import { IdleAnimation } from './animations/IdleAnimation.js';

export class Character {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = 0;
        this.targetRotation = 0;
        this.velocity = new THREE.Vector3();
        this.speed = 3.5;
        this.isMoving = false;
        
        // Partes do corpo organizadas
        this.parts = {
            body: null,
            headGroup: null,
            leftEar: null,
            rightEar: null,
            frontLeftLeg: null,
            frontLeftKnee: null,
            frontRightLeg: null,
            frontRightKnee: null,
            backLeftLeg: null,
            backLeftKnee: null,
            backRightLeg: null,
            backRightKnee: null,
            tailBase: null,
            tailMid: null,
            tailTip: null,
            cape: null,
            scarf: null
        };
        
        // Animações
        this.walkAnimation = new WalkAnimation(this);
        this.idleAnimation = new IdleAnimation(this);
        
        this.create();
    }

    create() {
        // Materiais
        const foxOrangeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff8c42,
            flatShading: true,
            roughness: 0.9,
            metalness: 0.1
        });

        const foxWhiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xfff5e8,
            flatShading: true,
            roughness: 0.9,
            metalness: 0.1
        });

        const darkMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c1810,
            flatShading: true,
            roughness: 1,
            metalness: 0
        });

        const capeMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a7c9e,
            flatShading: true,
            roughness: 0.7,
            metalness: 0.2
        });

        // Corpo principal
        const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.28, 0.5, 6);
        this.body = new THREE.Mesh(bodyGeometry, foxOrangeMaterial);
        this.body.position.y = 0.5;
        this.body.castShadow = true;
        this.group.add(this.body);

        // Cabeça (formato triangular/piramidal)
        this.headGroup = new THREE.Group();
        
        const headGeometry = new THREE.ConeGeometry(0.25, 0.35, 6);
        this.head = new THREE.Mesh(headGeometry, foxOrangeMaterial);
        this.head.position.y = 0;
        this.head.rotation.x = Math.PI;
        this.head.castShadow = true;
        this.headGroup.add(this.head);

        // Focinho
        const snoutGeometry = new THREE.ConeGeometry(0.12, 0.2, 6);
        const snout = new THREE.Mesh(snoutGeometry, foxWhiteMaterial);
        snout.position.set(0, -0.05, 0.15);
        snout.rotation.x = Math.PI / 2;
        snout.castShadow = true;
        this.headGroup.add(snout);

        // Nariz
        const noseGeometry = new THREE.SphereGeometry(0.04, 6, 6);
        const nose = new THREE.Mesh(noseGeometry, darkMaterial);
        nose.position.set(0, -0.03, 0.28);
        this.headGroup.add(nose);

        // Olhos
        const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const leftEye = new THREE.Mesh(eyeGeometry, darkMaterial);
        leftEye.position.set(-0.1, 0.05, 0.1);
        this.headGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, darkMaterial);
        rightEye.position.set(0.1, 0.05, 0.1);
        this.headGroup.add(rightEye);

        // Orelhas (triangulares grandes - característica da raposa)
        const earGeometry = new THREE.ConeGeometry(0.1, 0.25, 4);
        
        const leftEar = new THREE.Mesh(earGeometry, foxOrangeMaterial);
        leftEar.position.set(-0.15, 0.3, -0.1);
        leftEar.rotation.z = -0.3;
        leftEar.castShadow = true;
        this.headGroup.add(leftEar);
        this.ears.push(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, foxOrangeMaterial);
        rightEar.position.set(0.15, 0.3, -0.1);
        rightEar.rotation.z = 0.3;
        rightEar.castShadow = true;
        this.headGroup.add(rightEar);
        this.ears.push(rightEar);

        // Interior das orelhas
        const innerEarGeometry = new THREE.ConeGeometry(0.06, 0.15, 4);
        const leftInnerEar = new THREE.Mesh(innerEarGeometry, foxWhiteMaterial);
        leftInnerEar.position.set(-0.15, 0.3, -0.05);
        leftInnerEar.rotation.z = -0.3;
        this.headGroup.add(leftInnerEar);

        const rightInnerEar = new THREE.Mesh(innerEarGeometry, foxWhiteMaterial);
        rightInnerEar.position.set(0.15, 0.3, -0.05);
        rightInnerEar.rotation.z = 0.3;
        this.headGroup.add(rightInnerEar);

        this.headGroup.position.set(0, 0.85, 0.1);
        this.group.add(this.headGroup);

        // Pernas (4 pernas curtas)
        const legGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.3, 6);
        
        const positions = [
            [-0.15, 0.15, 0.15],  // frente esquerda
            [0.15, 0.15, 0.15],   // frente direita
            [-0.15, 0.15, -0.15], // trás esquerda
            [0.15, 0.15, -0.15]   // trás direita
        ];

        positions.forEach(pos => {
            const legGroup = new THREE.Group();
            const leg = new THREE.Mesh(legGeometry, foxOrangeMaterial);
            leg.position.y = -0.15;
            leg.castShadow = true;
            legGroup.add(leg);
            
            // Pata
            const pawGeometry = new THREE.CylinderGeometry(0.07, 0.06, 0.05, 6);
            const paw = new THREE.Mesh(pawGeometry, darkMaterial);
            paw.position.y = -0.3;
            legGroup.add(paw);
            
            legGroup.position.set(pos[0], pos[1], pos[2]);
            this.legs.push(legGroup);
            this.group.add(legGroup);
        });

        // Cauda grande e fofa (característica de raposa)
        this.tailGroup = new THREE.Group();
        
        // Base da cauda
        const tailBase = new THREE.ConeGeometry(0.12, 0.3, 6);
        const tailBaseMesh = new THREE.Mesh(tailBase, foxOrangeMaterial);
        tailBaseMesh.rotation.x = Math.PI / 2;
        tailBaseMesh.position.z = 0.15;
        tailBaseMesh.castShadow = true;
        this.tailGroup.add(tailBaseMesh);

        // Parte média da cauda
        const tailMid = new THREE.ConeGeometry(0.15, 0.25, 6);
        const tailMidMesh = new THREE.Mesh(tailMid, foxOrangeMaterial);
        tailMidMesh.rotation.x = Math.PI / 2;
        tailMidMesh.position.z = 0.35;
        tailMidMesh.castShadow = true;
        this.tailGroup.add(tailMidMesh);

        // Ponta da cauda (branca)
        const tailTip = new THREE.ConeGeometry(0.12, 0.2, 6);
        const tailTipMesh = new THREE.Mesh(tailTip, foxWhiteMaterial);
        tailTipMesh.rotation.x = Math.PI / 2;
        tailTipMesh.position.z = 0.5;
        tailTipMesh.castShadow = true;
        this.tailGroup.add(tailTipMesh);

        this.tailGroup.position.set(0, 0.45, -0.3);
        this.tail = this.tailGroup;
        this.group.add(this.tailGroup);

        // Capa/manto (como no Tunic)
        const capeGeometry = new THREE.ConeGeometry(0.35, 0.5, 4);
        const cape = new THREE.Mesh(capeGeometry, capeMaterial);
        cape.position.set(0, 0.55, -0.05);
        cape.castShadow = true;
        this.group.add(cape);

        // Adicionar grupo à cena
        this.scene.add(this.group);
    }

    update(deltaTime, input) {
        this.velocity.set(0, 0, 0);
        this.isMoving = false;

        // Processar input (ajustado para câmera isométrica)
        if (input.forward) {
            this.velocity.z -= 1;
            this.velocity.x -= 1;
            this.isMoving = true;
        }
        if (input.backward) {
            this.velocity.z += 1;
            this.velocity.x += 1;
            this.isMoving = true;
        }
        if (input.left) {
            this.velocity.x -= 1;
            this.velocity.z += 1;
            this.isMoving = true;
        }
        if (input.right) {
            this.velocity.x += 1;
            this.velocity.z -= 1;
            this.isMoving = true;
        }

        // Normalizar e aplicar velocidade
        if (this.velocity.length() > 0) {
            this.velocity.normalize();
            this.position.x += this.velocity.x * this.speed * deltaTime;
            this.position.z += this.velocity.z * this.speed * deltaTime;

            // Calcular rotação alvo baseada na direção
            this.targetRotation = Math.atan2(this.velocity.x, this.velocity.z);
        }

        // Interpolar rotação suavemente
        let rotDiff = this.targetRotation - this.rotation;
        // Normalizar a diferença para o caminho mais curto
        while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
        while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
        this.rotation += rotDiff * 0.15;

        // Limitar movimento dentro do mundo
        this.position.x = Math.max(-10, Math.min(10, this.position.x));
        this.position.z = Math.max(-10, Math.min(10, this.position.z));

        // Aplicar transformações
        this.group.position.copy(this.position);
        this.group.rotation.y = this.rotation;

        // Animações
        this.animate(deltaTime);
    }

    animate(deltaTime) {
        if (this.isMoving) {
            // Ciclo de caminhada mais rápido e natural
            this.walkCycle += deltaTime * 10;

            // Animar pernas com movimento mais pronunciado
            const legSwing = 0.6;
            this.legs[0].rotation.x = Math.sin(this.walkCycle) * legSwing;
            this.legs[1].rotation.x = Math.sin(this.walkCycle + Math.PI) * legSwing;
            this.legs[2].rotation.x = Math.sin(this.walkCycle + Math.PI) * legSwing;
            this.legs[3].rotation.x = Math.sin(this.walkCycle) * legSwing;

            // Bobbing do corpo (pulo sutil ao caminhar)
            this.bobAmount = Math.abs(Math.sin(this.walkCycle * 2)) * 0.05;
            this.body.position.y = 0.5 + this.bobAmount;
            
            // Cabeça acompanha o movimento com delay
            this.headGroup.position.y = 0.85 + this.bobAmount * 0.8;
            
            // Inclinar corpo levemente na direção do movimento
            this.body.rotation.z = Math.sin(this.walkCycle) * 0.05;
            
            // Cabeça balança sutilmente
            this.headGroup.rotation.y = Math.sin(this.walkCycle * 0.5) * 0.08;
            this.headGroup.rotation.z = -Math.sin(this.walkCycle) * 0.03;

            // Orelhas se movem com a caminhada
            this.ears[0].rotation.z = -0.3 + Math.sin(this.walkCycle) * 0.1;
            this.ears[1].rotation.z = 0.3 - Math.sin(this.walkCycle) * 0.1;

            // Cauda balança mais ativamente ao caminhar
            this.tailGroup.rotation.x = -0.5 + Math.sin(this.walkCycle * 0.8) * 0.3;
            this.tailGroup.rotation.z = Math.sin(this.walkCycle * 0.6) * 0.4;
            
            // Reset idle time
            this.idleTime = 0;
        } else {
            // Animações idle (quando parado)
            this.idleTime += deltaTime;
            
            // Retornar pernas suavemente à posição normal
            this.legs.forEach(leg => {
                leg.rotation.x *= 0.85;
            });
            
            // Respiração sutil
            const breathe = Math.sin(this.idleTime * 2) * 0.02;
            this.body.position.y = THREE.MathUtils.lerp(this.body.position.y, 0.5 + breathe, 0.1);
            this.headGroup.position.y = THREE.MathUtils.lerp(this.headGroup.position.y, 0.85 + breathe, 0.1);
            
            // Retornar rotações do corpo
            this.body.rotation.z *= 0.9;
            this.headGroup.rotation.y *= 0.9;
            this.headGroup.rotation.z *= 0.9;

            // Orelhas se mexem ocasionalmente
            const earTwitch = Math.sin(this.idleTime * 3) * 0.05;
            this.ears[0].rotation.z = THREE.MathUtils.lerp(this.ears[0].rotation.z, -0.3 + earTwitch, 0.1);
            this.ears[1].rotation.z = THREE.MathUtils.lerp(this.ears[1].rotation.z, 0.3 - earTwitch, 0.1);

            // Cauda balança devagar quando idle
            this.tailGroup.rotation.x = THREE.MathUtils.lerp(
                this.tailGroup.rotation.x, 
                -0.5 + Math.sin(this.idleTime * 1.5) * 0.15, 
                0.1
            );
            this.tailGroup.rotation.z = THREE.MathUtils.lerp(
                this.tailGroup.rotation.z,
                Math.sin(this.idleTime * 2) * 0.2,
                0.1
            );
        }
    }

    getPosition() {
        return this.position.clone();
    }
}
