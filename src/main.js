import * as THREE from 'three';
import { World } from './World.js';
import { Character } from './Character.js';
import { CameraController } from './CameraController.js';
import { InputController } from './InputController.js';

class Game {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.world = null;
        this.character = null;
        this.cameraController = null;
        this.inputController = null;
        this.clock = new THREE.Clock();
        
        this.init();
    }

    init() {
        // Configurar cena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xb8d4e8);
        this.scene.fog = new THREE.Fog(0xb8d4e8, 20, 50);

        // Configurar renderizador
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Criar mundo
        this.world = new World(this.scene);

        // Criar personagem (raposa inspirada no Tunic)
        this.character = new Character(this.scene);
        
        // Configurar câmera isométrica
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.cameraController = new CameraController(this.camera, this.character);

        // Configurar controles de input
        this.inputController = new InputController();

        // Eventos
        window.addEventListener('resize', () => this.onWindowResize());

        // Iniciar loop de animação
        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update(deltaTime) {
        // Atualizar input
        const input = this.inputController.getInput();
        
        // Atualizar personagem
        this.character.update(deltaTime, input);
        
        // Atualizar câmera
        this.cameraController.update(deltaTime);
        
        // Atualizar mundo
        this.world.update(deltaTime);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        this.update(deltaTime);

        this.renderer.render(this.scene, this.camera);
    }
}

// Iniciar o jogo quando a página carregar
new Game();
