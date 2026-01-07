import * as THREE from 'three';

export class CameraController {
    constructor(camera, character) {
        this.camera = camera;
        this.character = character;
        
        // Configuração de câmera isométrica (estilo Tunic)
        this.offset = new THREE.Vector3(8, 10, 8);
        this.lookAtOffset = new THREE.Vector3(0, 0.5, 0);
        this.currentPosition = new THREE.Vector3();
        this.currentLookAt = new THREE.Vector3();
        
        // Suavização
        this.smoothness = 0.1;
        
        this.initialize();
    }

    initialize() {
        // Posição inicial da câmera
        const characterPos = this.character.getPosition();
        this.currentPosition.copy(characterPos).add(this.offset);
        this.currentLookAt.copy(characterPos).add(this.lookAtOffset);
        
        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookAt);
    }

    update(deltaTime) {
        // Obter posição do personagem
        const characterPos = this.character.getPosition();
        
        // Calcular posições desejadas
        const targetPosition = characterPos.clone().add(this.offset);
        const targetLookAt = characterPos.clone().add(this.lookAtOffset);
        
        // Interpolar suavemente
        this.currentPosition.lerp(targetPosition, this.smoothness);
        this.currentLookAt.lerp(targetLookAt, this.smoothness);
        
        // Aplicar à câmera
        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookAt);
    }
}
