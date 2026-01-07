export class WalkAnimation {
    constructor(character) {
        this.character = character;
        this.time = 0;
    }

    update(deltaTime) {
        this.time += deltaTime * 10;

        const { parts } = this.character;

        // Ciclo de caminhada das pernas - movimento mais complexo
        const legSwing = 0.7;
        const legBend = 0.3;
        
        // Pernas dianteiras (alternadas)
        parts.frontLeftLeg.rotation.x = Math.sin(this.time) * legSwing;
        parts.frontLeftLeg.rotation.z = Math.sin(this.time) * 0.1;
        parts.frontLeftKnee.rotation.x = Math.max(0, -Math.sin(this.time) * legBend);
        
        parts.frontRightLeg.rotation.x = Math.sin(this.time + Math.PI) * legSwing;
        parts.frontRightLeg.rotation.z = -Math.sin(this.time + Math.PI) * 0.1;
        parts.frontRightKnee.rotation.x = Math.max(0, -Math.sin(this.time + Math.PI) * legBend);

        // Pernas traseiras (alternadas com as dianteiras)
        parts.backLeftLeg.rotation.x = Math.sin(this.time + Math.PI) * legSwing * 0.8;
        parts.backLeftLeg.rotation.z = Math.sin(this.time + Math.PI) * 0.08;
        parts.backLeftKnee.rotation.x = Math.max(0, -Math.sin(this.time + Math.PI) * legBend);
        
        parts.backRightLeg.rotation.x = Math.sin(this.time) * legSwing * 0.8;
        parts.backRightLeg.rotation.z = -Math.sin(this.time) * 0.08;
        parts.backRightKnee.rotation.x = Math.max(0, -Math.sin(this.time) * legBend);

        // Bobbing vertical do corpo
        const bobAmount = Math.abs(Math.sin(this.time * 2)) * 0.06;
        parts.body.position.y = 0.5 + bobAmount;
        
        // Corpo balança nos lados ao caminhar
        parts.body.rotation.z = Math.sin(this.time) * 0.06;
        parts.body.rotation.x = Math.sin(this.time * 0.5) * 0.03;
        
        // Cabeça acompanha o movimento com delay
        parts.headGroup.position.y = 0.85 + bobAmount * 0.7;
        parts.headGroup.rotation.y = Math.sin(this.time * 0.5) * 0.1;
        parts.headGroup.rotation.z = -Math.sin(this.time) * 0.04;
        parts.headGroup.rotation.x = Math.sin(this.time * 2) * 0.02;

        // Orelhas batem ao caminhar
        parts.leftEar.rotation.z = -0.3 + Math.sin(this.time * 1.5) * 0.15;
        parts.leftEar.rotation.x = Math.sin(this.time) * 0.05;
        parts.rightEar.rotation.z = 0.3 - Math.sin(this.time * 1.5) * 0.15;
        parts.rightEar.rotation.x = Math.sin(this.time) * 0.05;

        // Cauda balança energeticamente
        parts.tailBase.rotation.x = -0.3 + Math.sin(this.time * 0.8) * 0.4;
        parts.tailBase.rotation.z = Math.sin(this.time * 0.6) * 0.5;
        
        parts.tailMid.rotation.x = Math.sin(this.time * 0.9 + 0.5) * 0.3;
        parts.tailMid.rotation.z = Math.sin(this.time * 0.7 + 0.3) * 0.2;
        
        parts.tailTip.rotation.x = Math.sin(this.time * 1.0 + 1.0) * 0.25;
        parts.tailTip.rotation.z = Math.sin(this.time * 0.8 + 0.6) * 0.15;

        // Capa balança com o movimento
        if (parts.cape) {
            parts.cape.rotation.z = Math.sin(this.time * 0.5) * 0.08;
            parts.cape.rotation.x = Math.sin(this.time) * 0.05;
        }

        // Cachecol/lenço balança
        if (parts.scarf) {
            parts.scarf.rotation.z = Math.sin(this.time * 0.6 + 0.5) * 0.12;
        }
    }

    reset() {
        this.time = 0;
    }
}
