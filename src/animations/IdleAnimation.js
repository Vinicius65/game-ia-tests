export class IdleAnimation {
    constructor(character) {
        this.character = character;
        this.time = 0;
    }

    update(deltaTime) {
        this.time += deltaTime;

        const { parts } = this.character;

        // Respiração sutil
        const breathe = Math.sin(this.time * 2) * 0.025;
        parts.body.position.y = parts.body.position.y * 0.95 + (0.5 + breathe) * 0.05;
        parts.headGroup.position.y = parts.headGroup.position.y * 0.95 + (0.85 + breathe) * 0.05;
        
        // Retornar rotações do corpo suavemente
        parts.body.rotation.z *= 0.9;
        parts.body.rotation.x *= 0.9;
        parts.headGroup.rotation.y *= 0.9;
        parts.headGroup.rotation.z *= 0.9;
        parts.headGroup.rotation.x *= 0.9;

        // Pernas retornam à posição normal
        parts.frontLeftLeg.rotation.x *= 0.85;
        parts.frontLeftLeg.rotation.z *= 0.85;
        parts.frontLeftKnee.rotation.x *= 0.85;
        
        parts.frontRightLeg.rotation.x *= 0.85;
        parts.frontRightLeg.rotation.z *= 0.85;
        parts.frontRightKnee.rotation.x *= 0.85;
        
        parts.backLeftLeg.rotation.x *= 0.85;
        parts.backLeftLeg.rotation.z *= 0.85;
        parts.backLeftKnee.rotation.x *= 0.85;
        
        parts.backRightLeg.rotation.x *= 0.85;
        parts.backRightLeg.rotation.z *= 0.85;
        parts.backRightKnee.rotation.x *= 0.85;

        // Orelhas se mexem ocasionalmente
        const earTwitch = Math.sin(this.time * 3) * 0.08;
        parts.leftEar.rotation.z = parts.leftEar.rotation.z * 0.9 + (-0.3 + earTwitch) * 0.1;
        parts.rightEar.rotation.z = parts.rightEar.rotation.z * 0.9 + (0.3 - earTwitch) * 0.1;
        parts.leftEar.rotation.x *= 0.9;
        parts.rightEar.rotation.x *= 0.9;

        // Cauda balança devagar
        const tailSway = Math.sin(this.time * 1.5) * 0.2;
        parts.tailBase.rotation.x = parts.tailBase.rotation.x * 0.9 + (-0.3 + tailSway * 0.5) * 0.1;
        parts.tailBase.rotation.z = parts.tailBase.rotation.z * 0.9 + (tailSway) * 0.1;
        
        parts.tailMid.rotation.x *= 0.9;
        parts.tailMid.rotation.z = parts.tailMid.rotation.z * 0.9 + (Math.sin(this.time * 2) * 0.1) * 0.1;
        
        parts.tailTip.rotation.x *= 0.9;
        parts.tailTip.rotation.z *= 0.9;

        // Capa retorna à posição normal
        if (parts.cape) {
            parts.cape.rotation.z *= 0.92;
            parts.cape.rotation.x *= 0.92;
        }

        // Cachecol/lenço balança levemente
        if (parts.scarf) {
            parts.scarf.rotation.z = parts.scarf.rotation.z * 0.9 + Math.sin(this.time * 2) * 0.05 * 0.1;
        }

        // Pequena animação de "olhar ao redor" ocasionalmente
        if (Math.sin(this.time * 0.3) > 0.95) {
            parts.headGroup.rotation.y = Math.sin(this.time * 5) * 0.3;
        }
    }

    reset() {
        this.time = 0;
    }
}
