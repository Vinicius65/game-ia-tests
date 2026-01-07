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
            scarf: null,
            sword: null,
            shield: null,
            rightHand: null,
            leftHand: null
        };
        
        // Animações
        this.walkAnimation = new WalkAnimation(this);
        this.idleAnimation = new IdleAnimation(this);
        
        this.create();
    }

    create() {
        // Materiais melhorados com variações de cor
        const foxOrangeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff8c42,
            flatShading: true,
            roughness: 0.85,
            metalness: 0.1
        });

        const foxDarkOrangeMaterial = new THREE.MeshStandardMaterial({
            color: 0xd97236,
            flatShading: true,
            roughness: 0.9,
            metalness: 0.1
        });

        const foxWhiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xfff5e8,
            flatShading: true,
            roughness: 0.9,
            metalness: 0.05
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
            roughness: 0.6,
            metalness: 0.3
        });

        const scarfMaterial = new THREE.MeshStandardMaterial({
            color: 0xe63946,
            flatShading: true,
            roughness: 0.7,
            metalness: 0.2
        });

        const beltMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b6f47,
            flatShading: true,
            roughness: 0.8,
            metalness: 0.4
        });

        // ========== CORPO PRINCIPAL ==========
        const bodyGeometry = new THREE.CylinderGeometry(0.28, 0.32, 0.55, 8);
        this.parts.body = new THREE.Mesh(bodyGeometry, foxWhiteMaterial);
        this.parts.body.position.y = 0.5;
        this.parts.body.castShadow = true;
        this.group.add(this.parts.body);

        // Barriga (detalhe)
        const bellyGeometry = new THREE.SphereGeometry(0.22, 8, 8);
        const belly = new THREE.Mesh(bellyGeometry, foxWhiteMaterial);
        belly.position.set(0, 0.45, 0.15);
        belly.scale.set(1, 1.2, 0.8);
        belly.castShadow = true;
        this.group.add(belly);

        // Costas/dorso (detalhe laranja)
        const backGeometry = new THREE.SphereGeometry(0.25, 8, 8);
        const back = new THREE.Mesh(backGeometry, foxOrangeMaterial);
        back.position.set(0, 0.55, -0.1);
        back.scale.set(1, 1.1, 0.7);
        back.castShadow = true;
        this.group.add(back);

        // ========== CABEÇA ==========
        this.parts.headGroup = new THREE.Group();
        
        // Cabeça principal (formato triangular mais detalhado)
        const headGeometry = new THREE.ConeGeometry(0.27, 0.38, 8);
        const head = new THREE.Mesh(headGeometry, foxOrangeMaterial);
        head.position.y = 0;
        head.rotation.x = Math.PI;
        head.castShadow = true;
        this.parts.headGroup.add(head);

        // Frente da face (branco)
        const faceGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const face = new THREE.Mesh(faceGeometry, foxWhiteMaterial);
        face.position.set(0, -0.05, 0.1);
        face.scale.set(0.9, 1, 1.2);
        face.castShadow = true;
        this.parts.headGroup.add(face);

        // Marcas escuras ao redor dos olhos
        const eyeMarkGeometry = new THREE.SphereGeometry(0.09, 6, 6);
        const leftEyeMark = new THREE.Mesh(eyeMarkGeometry, foxDarkOrangeMaterial);
        leftEyeMark.position.set(-0.12, 0.05, 0.15);
        leftEyeMark.scale.set(1.2, 0.8, 0.8);
        this.parts.headGroup.add(leftEyeMark);

        const rightEyeMark = new THREE.Mesh(eyeMarkGeometry, foxDarkOrangeMaterial);
        rightEyeMark.position.set(0.12, 0.05, 0.15);
        rightEyeMark.scale.set(1.2, 0.8, 0.8);
        this.parts.headGroup.add(rightEyeMark);

        // Focinho mais detalhado
        const snoutGeometry = new THREE.ConeGeometry(0.13, 0.22, 8);
        const snout = new THREE.Mesh(snoutGeometry, foxWhiteMaterial);
        snout.position.set(0, -0.05, 0.18);
        snout.rotation.x = Math.PI / 2;
        snout.castShadow = true;
        this.parts.headGroup.add(snout);

        // Nariz maior e mais definido
        const noseGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const nose = new THREE.Mesh(noseGeometry, darkMaterial);
        nose.position.set(0, -0.02, 0.31);
        nose.scale.set(1, 0.8, 1.2);
        this.parts.headGroup.add(nose);

        // Olhos mais expressivos
        const eyeGeometry = new THREE.SphereGeometry(0.06, 10, 10);
        const eyeWhiteGeometry = new THREE.SphereGeometry(0.07, 10, 10);
        
        // Olho esquerdo
        const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, new THREE.MeshStandardMaterial({ 
            color: 0xffffff, flatShading: false, roughness: 0.3 
        }));
        leftEyeWhite.position.set(-0.11, 0.06, 0.17);
        this.parts.headGroup.add(leftEyeWhite);

        const leftEye = new THREE.Mesh(eyeGeometry, darkMaterial);
        leftEye.position.set(-0.11, 0.06, 0.22);
        leftEye.scale.set(0.7, 0.7, 1);
        this.parts.headGroup.add(leftEye);

        // Brilho no olho
        const shineGeometry = new THREE.SphereGeometry(0.02, 6, 6);
        const shineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const leftShine = new THREE.Mesh(shineGeometry, shineMaterial);
        leftShine.position.set(-0.09, 0.09, 0.23);
        this.parts.headGroup.add(leftShine);

        // Olho direito
        const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, new THREE.MeshStandardMaterial({ 
            color: 0xffffff, flatShading: false, roughness: 0.3 
        }));
        rightEyeWhite.position.set(0.11, 0.06, 0.17);
        this.parts.headGroup.add(rightEyeWhite);

        const rightEye = new THREE.Mesh(eyeGeometry, darkMaterial);
        rightEye.position.set(0.11, 0.06, 0.22);
        rightEye.scale.set(0.7, 0.7, 1);
        this.parts.headGroup.add(rightEye);

        const rightShine = new THREE.Mesh(shineGeometry, shineMaterial);
        rightShine.position.set(0.13, 0.09, 0.23);
        this.parts.headGroup.add(rightShine);

        // Boca/sorriso sutil
        const mouthGeometry = new THREE.TorusGeometry(0.08, 0.015, 6, 12, Math.PI);
        const mouth = new THREE.Mesh(mouthGeometry, darkMaterial);
        mouth.position.set(0, -0.08, 0.25);
        mouth.rotation.x = Math.PI;
        mouth.rotation.z = 0.1;
        this.parts.headGroup.add(mouth);

        // ========== ORELHAS GRANDES E DETALHADAS ==========
        const earGeometry = new THREE.ConeGeometry(0.12, 0.3, 6);
        
        this.parts.leftEar = new THREE.Mesh(earGeometry, foxOrangeMaterial);
        this.parts.leftEar.position.set(-0.16, 0.32, -0.08);
        this.parts.leftEar.rotation.z = -0.3;
        this.parts.leftEar.rotation.x = -0.2;
        this.parts.leftEar.castShadow = true;
        this.parts.headGroup.add(this.parts.leftEar);

        this.parts.rightEar = new THREE.Mesh(earGeometry, foxOrangeMaterial);
        this.parts.rightEar.position.set(0.16, 0.32, -0.08);
        this.parts.rightEar.rotation.z = 0.3;
        this.parts.rightEar.rotation.x = -0.2;
        this.parts.rightEar.castShadow = true;
        this.parts.headGroup.add(this.parts.rightEar);

        // Interior das orelhas (rosa/branco)
        const innerEarGeometry = new THREE.ConeGeometry(0.07, 0.2, 6);
        const innerEarMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffb8c6, flatShading: true, roughness: 0.9 
        });
        
        const leftInnerEar = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
        leftInnerEar.position.set(-0.16, 0.32, -0.03);
        leftInnerEar.rotation.z = -0.3;
        leftInnerEar.rotation.x = -0.2;
        this.parts.headGroup.add(leftInnerEar);

        const rightInnerEar = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
        rightInnerEar.position.set(0.16, 0.32, -0.03);
        rightInnerEar.rotation.z = 0.3;
        rightInnerEar.rotation.x = -0.2;
        this.parts.headGroup.add(rightInnerEar);

        // Tufos de pelo nas orelhas
        const tuftGeometry = new THREE.ConeGeometry(0.04, 0.08, 5);
        const leftTuft = new THREE.Mesh(tuftGeometry, foxDarkOrangeMaterial);
        leftTuft.position.set(-0.16, 0.45, -0.08);
        this.parts.headGroup.add(leftTuft);

        const rightTuft = new THREE.Mesh(tuftGeometry, foxDarkOrangeMaterial);
        rightTuft.position.set(0.16, 0.45, -0.08);
        this.parts.headGroup.add(rightTuft);

        this.parts.headGroup.position.set(0, 0.85, 0.1);
        this.group.add(this.parts.headGroup);

        // ========== PERNAS COM ARTICULAÇÕES ==========
        this.createLeg(-0.18, 0.25, 0.18, 'frontLeft');
        this.createLeg(0.18, 0.25, 0.18, 'frontRight');
        this.createLeg(-0.18, 0.25, -0.15, 'backLeft');
        this.createLeg(0.18, 0.25, -0.15, 'backRight');

        // ========== CAUDA GRANDE E FOFA (3 SEGMENTOS) ==========
        // Segmento base
        this.parts.tailBase = new THREE.Group();
        const tailBaseGeometry = new THREE.ConeGeometry(0.14, 0.35, 8);
        const tailBaseMesh = new THREE.Mesh(tailBaseGeometry, foxOrangeMaterial);
        tailBaseMesh.rotation.x = Math.PI / 2;
        tailBaseMesh.position.z = 0.175;
        tailBaseMesh.castShadow = true;
        this.parts.tailBase.add(tailBaseMesh);

        // Segmento médio
        this.parts.tailMid = new THREE.Group();
        const tailMidGeometry = new THREE.ConeGeometry(0.16, 0.3, 8);
        const tailMidMesh = new THREE.Mesh(tailMidGeometry, foxOrangeMaterial);
        tailMidMesh.rotation.x = Math.PI / 2;
        tailMidMesh.position.z = 0.15;
        tailMidMesh.castShadow = true;
        this.parts.tailMid.add(tailMidMesh);
        this.parts.tailMid.position.z = 0.35;
        this.parts.tailBase.add(this.parts.tailMid);

        // Segmento ponta (branca)
        this.parts.tailTip = new THREE.Group();
        const tailTipGeometry = new THREE.ConeGeometry(0.14, 0.25, 8);
        const tailTipMesh = new THREE.Mesh(tailTipGeometry, foxWhiteMaterial);
        tailTipMesh.rotation.x = Math.PI / 2;
        tailTipMesh.position.z = 0.125;
        tailTipMesh.castShadow = true;
        this.parts.tailTip.add(tailTipMesh);
        this.parts.tailTip.position.z = 0.3;
        this.parts.tailMid.add(this.parts.tailTip);

        // Pelos na cauda
        for (let i = 0; i < 5; i++) {
            const furGeometry = new THREE.ConeGeometry(0.03, 0.1, 4);
            const fur = new THREE.Mesh(furGeometry, foxDarkOrangeMaterial);
            const angle = (i / 5) * Math.PI * 2;
            fur.position.set(
                Math.cos(angle) * 0.12,
                Math.sin(angle) * 0.12,
                0.3
            );
            fur.rotation.x = Math.PI / 2;
            this.parts.tailMid.add(fur);
        }

        this.parts.tailBase.position.set(0, 0.5, -0.35);
        this.parts.tailBase.rotation.x = -0.3;
        this.group.add(this.parts.tailBase);

        // ========== CAPA/MANTO ==========
        const capeGeometry = new THREE.ConeGeometry(0.38, 0.55, 6);
        this.parts.cape = new THREE.Mesh(capeGeometry, capeMaterial);
        this.parts.cape.position.set(0, 0.58, -0.05);
        this.parts.cape.castShadow = true;
        this.group.add(this.parts.cape);

        // Detalhe da capa (gola)
        const collarGeometry = new THREE.TorusGeometry(0.32, 0.04, 6, 8);
        const collar = new THREE.Mesh(collarGeometry, new THREE.MeshStandardMaterial({
            color: 0x3a6280,
            flatShading: true,
            roughness: 0.5,
            metalness: 0.4
        }));
        collar.position.set(0, 0.75, 0);
        collar.rotation.x = Math.PI / 2;
        this.group.add(collar);

        // ========== CACHECOL/LENÇO ==========
        this.parts.scarf = new THREE.Group();
        const scarfMainGeometry = new THREE.BoxGeometry(0.35, 0.08, 0.08);
        const scarfMain = new THREE.Mesh(scarfMainGeometry, scarfMaterial);
        scarfMain.position.set(0, 0.73, 0.15);
        scarfMain.castShadow = true;
        this.parts.scarf.add(scarfMain);

        // Ponta do cachecol
        const scarfEndGeometry = new THREE.BoxGeometry(0.06, 0.25, 0.06);
        const scarfEnd = new THREE.Mesh(scarfEndGeometry, scarfMaterial);
        scarfEnd.position.set(0.15, 0.6, 0.18);
        scarfEnd.rotation.z = 0.3;
        scarfEnd.castShadow = true;
        this.parts.scarf.add(scarfEnd);

        this.group.add(this.parts.scarf);

        // ========== CINTO ==========
        const beltGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 8);
        const belt = new THREE.Mesh(beltGeometry, beltMaterial);
        belt.position.set(0, 0.48, 0);
        this.group.add(belt);

        // Fivela do cinto
        const buckleGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.04);
        const buckleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            flatShading: true,
            roughness: 0.3,
            metalness: 0.8
        });
        const buckle = new THREE.Mesh(buckleGeometry, buckleMaterial);
        buckle.position.set(0, 0.48, 0.3);
        this.group.add(buckle);

        // ========== MÃOS E ARMAS ==========
        this.createWeapons();

        // Adicionar grupo à cena
        this.scene.add(this.group);
    }

    createWeapons() {
        // Materiais para armas
        const swordBladeMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            flatShading: true,
            roughness: 0.3,
            metalness: 0.9
        });

        const swordHandleMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            flatShading: true,
            roughness: 0.7,
            metalness: 0.2
        });

        const goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            flatShading: true,
            roughness: 0.3,
            metalness: 0.8
        });

        const shieldMaterial = new THREE.MeshStandardMaterial({
            color: 0x4169e1,
            flatShading: true,
            roughness: 0.6,
            metalness: 0.5
        });

        const shieldTrimMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            flatShading: true,
            roughness: 0.3,
            metalness: 0.8
        });

        // ========== ESPADA ==========
        this.parts.sword = new THREE.Group();

        // Lâmina
        const bladeGeometry = new THREE.BoxGeometry(0.05, 0.5, 0.02);
        const blade = new THREE.Mesh(bladeGeometry, swordBladeMaterial);
        blade.position.y = 0.25;
        blade.castShadow = true;
        this.parts.sword.add(blade);

        // Ponta da lâmina
        const bladeTipGeometry = new THREE.ConeGeometry(0.025, 0.08, 4);
        const bladeTip = new THREE.Mesh(bladeTipGeometry, swordBladeMaterial);
        bladeTip.position.y = 0.54;
        bladeTip.castShadow = true;
        this.parts.sword.add(bladeTip);

        // Detalhe da lâmina (ranhura central)
        const grooveGeometry = new THREE.BoxGeometry(0.015, 0.45, 0.015);
        const groove = new THREE.Mesh(grooveGeometry, new THREE.MeshStandardMaterial({
            color: 0xa0a0a0,
            flatShading: true,
            roughness: 0.4,
            metalness: 0.8
        }));
        groove.position.set(0, 0.25, 0);
        this.parts.sword.add(groove);

        // Guarda (crossguard)
        const guardGeometry = new THREE.BoxGeometry(0.2, 0.04, 0.03);
        const guard = new THREE.Mesh(guardGeometry, goldMaterial);
        guard.castShadow = true;
        this.parts.sword.add(guard);

        // Detalhes da guarda
        const guardBallLeft = new THREE.SphereGeometry(0.03, 6, 6);
        const guardLeft = new THREE.Mesh(guardBallLeft, goldMaterial);
        guardLeft.position.x = -0.1;
        this.parts.sword.add(guardLeft);

        const guardRight = new THREE.Mesh(guardBallLeft, goldMaterial);
        guardRight.position.x = 0.1;
        this.parts.sword.add(guardRight);

        // Cabo (handle)
        const handleGeometry = new THREE.CylinderGeometry(0.025, 0.03, 0.15, 8);
        const handle = new THREE.Mesh(handleGeometry, swordHandleMaterial);
        handle.position.y = -0.075;
        handle.castShadow = true;
        this.parts.sword.add(handle);

        // Detalhes do cabo (espiral de couro)
        for (let i = 0; i < 3; i++) {
            const wrapGeometry = new THREE.TorusGeometry(0.03, 0.008, 6, 8);
            const wrap = new THREE.Mesh(wrapGeometry, new THREE.MeshStandardMaterial({
                color: 0x654321,
                flatShading: true,
                roughness: 0.9
            }));
            wrap.position.y = -0.03 - i * 0.04;
            wrap.rotation.x = Math.PI / 2;
            this.parts.sword.add(wrap);
        }

        // Pomo (pommel)
        const pommelGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const pommel = new THREE.Mesh(pommelGeometry, goldMaterial);
        pommel.position.y = -0.16;
        pommel.castShadow = true;
        this.parts.sword.add(pommel);

        // Joia no pomo
        const gemGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const gem = new THREE.Mesh(gemGeometry, new THREE.MeshStandardMaterial({
            color: 0xff0000,
            flatShading: false,
            roughness: 0.1,
            metalness: 0.5,
            emissive: 0x330000
        }));
        gem.position.y = -0.16;
        this.parts.sword.add(gem);

        // Posicionar espada na mão direita
        this.parts.sword.position.set(0.22, 0.35, 0.15);
        this.parts.sword.rotation.set(-0.5, 0, -0.3);
        this.parts.rightHand = this.parts.sword; // Referência para animação
        this.group.add(this.parts.sword);

        // ========== ESCUDO ==========
        this.parts.shield = new THREE.Group();

        // Base do escudo (formato heráldico)
        const shieldMainGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.08, 6);
        const shieldMain = new THREE.Mesh(shieldMainGeometry, shieldMaterial);
        shieldMain.rotation.z = Math.PI / 2;
        shieldMain.rotation.x = Math.PI / 2;
        shieldMain.castShadow = true;
        this.parts.shield.add(shieldMain);

        // Parte superior do escudo
        const shieldTopGeometry = new THREE.ConeGeometry(0.15, 0.1, 6);
        const shieldTop = new THREE.Mesh(shieldTopGeometry, shieldMaterial);
        shieldTop.position.y = 0.09;
        shieldTop.rotation.x = Math.PI;
        shieldTop.castShadow = true;
        this.parts.shield.add(shieldTop);

        // Parte inferior do escudo (ponta)
        const shieldBottomGeometry = new THREE.ConeGeometry(0.12, 0.15, 6);
        const shieldBottom = new THREE.Mesh(shieldBottomGeometry, shieldMaterial);
        shieldBottom.position.y = -0.115;
        shieldBottom.castShadow = true;
        this.parts.shield.add(shieldBottom);

        // Borda dourada do escudo
        const rimGeometry = new THREE.TorusGeometry(0.15, 0.012, 8, 6, Math.PI);
        const rim = new THREE.Mesh(rimGeometry, shieldTrimMaterial);
        rim.position.y = 0.04;
        rim.rotation.x = Math.PI;
        this.parts.shield.add(rim);

        // Emblema no centro (triforce style)
        const emblemGeometry = new THREE.ConeGeometry(0.06, 0.08, 3);
        const emblem = new THREE.Mesh(emblemGeometry, goldMaterial);
        emblem.position.set(0, 0, 0.045);
        emblem.rotation.x = Math.PI;
        this.parts.shield.add(emblem);

        // Triângulos adicionais do emblema
        const emblemTop = new THREE.Mesh(emblemGeometry, goldMaterial);
        emblemTop.position.set(0, 0.05, 0.045);
        emblemTop.rotation.x = Math.PI;
        emblemTop.scale.set(0.6, 0.6, 0.6);
        this.parts.shield.add(emblemTop);

        // Boss central (protuberância)
        const bossGeometry = new THREE.SphereGeometry(0.035, 8, 8);
        const boss = new THREE.Mesh(bossGeometry, goldMaterial);
        boss.position.z = 0.05;
        this.parts.shield.add(boss);

        // Alças do escudo (atrás)
        const strapGeometry = new THREE.BoxGeometry(0.1, 0.02, 0.02);
        const strap1 = new THREE.Mesh(strapGeometry, swordHandleMaterial);
        strap1.position.z = -0.04;
        strap1.position.y = 0.05;
        this.parts.shield.add(strap1);

        const strap2 = new THREE.Mesh(strapGeometry, swordHandleMaterial);
        strap2.position.z = -0.04;
        strap2.position.y = -0.05;
        this.parts.shield.add(strap2);

        // Posicionar escudo na mão esquerda
        this.parts.shield.position.set(-0.25, 0.4, 0.1);
        this.parts.shield.rotation.set(0, 0.5, -0.2);
        this.parts.leftHand = this.parts.shield; // Referência para animação
        this.group.add(this.parts.shield);
    }

    createLeg(x, y, z, name) {
        const legGroup = new THREE.Group();
        
        const foxOrangeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff8c42,
            flatShading: true,
            roughness: 0.85,
            metalness: 0.1
        });

        const darkMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c1810,
            flatShading: true,
            roughness: 1,
            metalness: 0
        });

        // Parte superior da perna (coxa)
        const thighGeometry = new THREE.CylinderGeometry(0.08, 0.07, 0.22, 6);
        const thigh = new THREE.Mesh(thighGeometry, foxOrangeMaterial);
        thigh.position.y = -0.11;
        thigh.castShadow = true;
        legGroup.add(thigh);

        // Joelho (articulação)
        const kneeGroup = new THREE.Group();
        const kneeGeometry = new THREE.SphereGeometry(0.07, 6, 6);
        const knee = new THREE.Mesh(kneeGeometry, foxOrangeMaterial);
        knee.castShadow = true;
        kneeGroup.add(knee);

        // Parte inferior da perna (canela)
        const shinGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.2, 6);
        const shin = new THREE.Mesh(shinGeometry, foxOrangeMaterial);
        shin.position.y = -0.1;
        shin.castShadow = true;
        kneeGroup.add(shin);

        // Pata
        const pawGeometry = new THREE.BoxGeometry(0.1, 0.06, 0.12);
        const paw = new THREE.Mesh(pawGeometry, darkMaterial);
        paw.position.set(0, -0.23, 0.02);
        paw.castShadow = true;
        kneeGroup.add(paw);

        // Dedos da pata
        for (let i = 0; i < 3; i++) {
            const toeGeometry = new THREE.SphereGeometry(0.02, 4, 4);
            const toe = new THREE.Mesh(toeGeometry, darkMaterial);
            toe.position.set((i - 1) * 0.03, -0.26, 0.06);
            kneeGroup.add(toe);
        }

        kneeGroup.position.y = -0.22;
        legGroup.add(kneeGroup);

        legGroup.position.set(x, y, z);
        this.group.add(legGroup);

        // Salvar referências
        this.parts[name + 'Leg'] = legGroup;
        this.parts[name + 'Knee'] = kneeGroup;
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
            this.walkAnimation.update(deltaTime);
        } else {
            this.idleAnimation.update(deltaTime);
        }
    }

    getPosition() {
        return this.position.clone();
    }
}
