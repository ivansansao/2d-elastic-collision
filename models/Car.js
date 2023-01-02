class Car {

    constructor(marca = '?', inteligente = true, allowLazy = false, randomHeading = false) {

        this.pos = createVector(100, 100);
        this.lastPos = createVector();
        this.heading = randomHeading ? random(360) : 0;
        this.rotation = 0;
        this.marcha = 0;
        this.lastMarcha = 0;
        this.cor = 'hsla(' + Math.floor(Math.random() * 360) + ',100%,50%,0.8)';
        this.volanteAngle = '';
        this.demoLado = '';
        this.inteligente = inteligente;
        this.batido = false;
        this.km = 0;
        this.kmMax = 0;
        this.kmMin = 0;
        this.kmMMCount = 0;
        this.lastKm = 0;
        this.marca = marca;
        this.aliveTime = 0;
        this.updates = 0;
        this.showSensorValue = false;
        this.qtdReh = 0;
        this.ranhurasColetadas = [];
        this.allowLazy = allowLazy;
        this.id = Number(random(0, 9999).toFixed(0));
        this.luzes = true;
        this.lapCount = 0;
        this.showInfo = false;
        this.speed = 0;
        this.gear = 1; // -1 Reverse, 1 Dinamic
        this.braking = false;
        this.speedingUp = false;
        this.demo = new Demo();
        this.trail = [];

        if (this.pos.x == -1) {
            this.pos = createVector(random(20, 1700), random(20, 800));
        }


    }

    randomizePos() {
        this.pos = createVector(random(20, windowWidth), random(20, windowHeight));;
    }

    speedUp() {
        this.speed += 0.005;

        if (this.gear == 1) {
            // Limita a velocidade pra frente em 2
            if (this.speed > 2) {
                this.speed = 2;
            }
        } else {

            // Limita a velocidade da ré em 0.5
            if (this.speed > 0.5) {
                this.speed = 0.5;
            }
        }

        this.speedingUp = true;
        this.braking = false;
    }

    freeSpeedUp() {
        if (this.speed > 0) {
            this.speed -= 0.004;
            if (this.speed < 0) {
                this.speed = 0;
            }
        }
        this.speedingUp = false;

    }

    brake() {

        this.speed -= 0.04;
        if (this.speed < 0) {
            this.speed = 0;
        }
        this.braking = true;
        if (this.speed > 0.0) {
            this.trail.push({ pos: this.pos.copy(), heading: this.heading });
            this.drawTrailPg();
        }

    }

    vaiPraDireita() {

        if (this.speed > 0) {

            if (this.speed < 0.1) {
                if (this.gear == 1)
                    this.rotation = this.speed * 0.4; // this.speed * 0.4
                else if (this.gear == -1)
                    this.rotation = -this.speed * 0.4;
            } else {
                if (this.gear == 1)
                    this.rotation = 0.1; // this.speed * 0.4
                else if (this.gear == -1)
                    this.rotation = -0.1;
            }

        }
        this.volanteAngle = 'r';
    }
    vaiPraEsquerda() {
        if (this.speed > 0) {

            if (this.speed < 0.1) {
                if (this.gear == 1)
                    this.rotation = -this.speed * 0.4;
                else if (this.gear == -1)
                    this.rotation = this.speed * 0.4;
            } else {
                if (this.gear == 1)
                    this.rotation = -0.1;
                else if (this.gear == -1)
                    this.rotation = 0.1;
            }

        }
        this.volanteAngle = 'l';
    }

    engageDinamic() {
        if (this.speed == 0) {
            this.gear = 1;
        }
    }

    engageReverse() {
        if (this.speed == 0) {
            this.gear = -1;
        }
    }

    update() {

        if (this.batido) {
            return false;
        }

        this.heading += this.rotation * 0.3;

        let irPara = p5.Vector.fromAngle(this.heading).mult(3).mult(this.gear == -1 ? -this.speed : this.speed);

        this.pos.add(irPara);

        this.km += this.marcha;
        this.aliveTime++;

        this.marcha = 0;
        this.rotation = 0;
        this.speed = Number(this.speed.toFixed(3));

    }

    show() {

        this.showInfoCar();


        if (this.batido) {
            // imageMode(CENTER);
            // image(pista.spriteRip, this.pos.x, this.pos.y);
            strokeWeight(1);
            fill(0, 0, 255);
            stroke(255);
            circle(this.pos.x, this.pos.y, 5);
        } else {

            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.heading);
            this.drawCar();

            pop();

            this.volanteAngle = '';
        }

        this.braking = false;

        // const element = this;

        // push();
        // translate(element.pos.x, element.pos.y);
        // rotate(element.heading);

        // strokeWeight(0);
        // fill(255, 0, 0);
        // stroke(255);

        // circle(-3, -10, 8);
        // circle(-3, +10, 8);
        // pop();


    }

    showInfoCar() {

        if (this.showInfo) {

            let x = this.pos.x - 50;
            let y = this.pos.y - 100;

            stroke(0, 0, 255);
            fill(255, 255, 255);
            strokeWeight(1);
            line(this.pos.x, y + 50, this.pos.x, this.pos.y);
            rect(x, y, 130, 65, 4);

            textSize(10);
            fill(0, 0, 255);
            noStroke();
            strokeWeight(1);

            text(`km: ${this.km}`, x + 2, y += 12);
            text(`Marcha: ${this.gear == 1 ? 'Auto' : 'Ré'}`, x + 2, y += 12);
            text(`Velocidade: ${this.speed}`, x + 2, y += 12);
            text(`Acelerador: ${this.speedingUp ? 'Acelerou' : 'Aliviou'}`, x + 2, y += 12);
            text(`Freio: ${this.braking ? 'Freiou' : 'Soltou'}`, x + 2, y += 12);

        }
    }

    drawTrail() {
        if (this.trail.length > 0) {

            this.trail.forEach(element => {
                // circle(element.pos.x - 4, element.pos.y - 4, 8);
                // circle(element.pos.x + 4, element.pos.y + 4, 8);

                push();
                translate(element.pos.x, element.pos.y);
                rotate(element.heading);

                strokeWeight(0);
                stroke(255);

                fill(200, 200, 0, 70);
                square(-6, -12, 6, 1);

                // fill(0, 0, 255, 20);
                square(-6, +6, 6, 1);
                pop();

            });
        }
    }
    drawTrailPg() {
                
        pg.push();

        pg.translate(this.pos.x,this.pos.y);  
        pg.rotate(this.heading);        
        pg.strokeWeight(0);
        pg.stroke(255);
        pg.noStroke();
        
        pg.fill(50, 50, 50, 20);
        // pg.square(-6, -12, 6, 10); // Left
        // pg.square(-6, +6, 6, 10); // Right       
        // pg.circle(-6, -12, 10); // Left
        // pg.circle(-6, +6, 10); // Right
               
        pg.rect(-6, -12, 4, 2, 10); // Left
        pg.rect(-6, -9, 4, 2, 10); // Left

        pg.rect(-6, +10, 8, 2, 10); // Right
        pg.rect(-6, +7, 8, 2, 10); // Right

        pg.pop();

    }

    drawCar() {

        stroke(100);
        strokeWeight(2);

        fill(100);

        rect(-3, -11.5, 6, 4, 1); // Roda traseira esquerda
        rect(-3, 7.5, 6, 4, 1); // Roda traseira direita

        push();
        translate(23, -12);
        
        let mapLWeel
        let mapRWeel

        if (this.volanteAngle == 'l') {
            mapLWeel = map(this.speed, 0, 2, 0.7, 0.1);
            mapRWeel = map(this.speed, 0, 2, 0.45, 0.0);
        }
        if (this.volanteAngle == 'r') {
            mapLWeel = map(this.speed, 0, 2, 0.45, 0.0);
            mapRWeel = map(this.speed, 0, 2, 0.7, 0.1);
        }
        
        if (this.volanteAngle == 'l') rotate(-mapLWeel);
        if (this.volanteAngle == 'r') rotate(mapLWeel);
        rect(-3, 0.5, 6, 4, 1); // Roda dianteira esquerda
        
        pop();

        push();
        translate(23, 12);
        if (this.volanteAngle == 'l') rotate(-mapRWeel);
        if (this.volanteAngle == 'r') rotate(mapRWeel);
        rect(-3, -4.5, 6, 4, 1); // Roda dianteira direita
        pop();


        // Corpo do carro.
        stroke(0);
        fill(this.cor);
        rect(-8, -10, 40, 20, 5);

        // Vidros.
        noStroke();
        fill(0);
        rect(-8, -10, 28, 20, 4);

        // Teto.
        fill(this.cor);
        rect(-2, -9, 15, 18, 4);

        // Ré.
        if (this.braking) {

            stroke(255, 0, 0);
            strokeWeight(2);
            fill(0);
            rect(-9, 2, 3, 6, 4);
            rect(-9, -8, 3, 6, 4);

            // Faixa
            // fill(255, 0, 0, 100);
            // rect(-2, -12, -11, 24, 8);            

        } else if (this.gear == -1) {

            stroke(255, 255, 0);
            strokeWeight(2);
            fill(0);
            rect(-9, 2, 3, 6, 4);
            rect(-9, -8, 3, 6, 4);
        }



        if (this.luzes) {

            // Faróis dianteiros acesos.
            // strokeWeight(6);
            // stroke(255);
            // point(28, -6);
            // point(28, 6);

            noStroke();

            // Feixo de luz perto.                
            fill(255, 255, 255, 40);
            rect(60, -20, -30, 40, 10);

            // Feixo de luz longe.                
            fill(241, 255, 176, 40);
            rect(80, -25, -50, 50, 10);

        } else {
            // Faróis dianteiros apagados.
            strokeWeight(6);
            stroke(80);
            point(28, -6);
            point(28, 6);

        }

        noStroke();


    }

    runDemo(run) {

        if (!run) return

        if (frameCount % 50 == 0) {

            this.demo.think();

        }
        if (this.demo.brake) {
            this.brake();
        }
        if (this.demo.speedUp) {
            this.speedUp();
        } else if (this.demo.freeSpeedUp) {
            this.freeSpeedUp();
        }

        if (this.demo.gear == -1) {
            this.engageReverse();
        } else if (this.demo.gear == 1) {
            this.engageDinamic();
        }

        if (this.demo.side == 'r')
            this.vaiPraDireita();
        else if (this.demo.side == 'l')
            this.vaiPraEsquerda();

        if (this.pos.x > width)
            this.pos.x = 0;

        if (this.pos.x < 0)
            this.pos.x = width;

        if (this.pos.y > height)
            this.pos.y = 0;

        if (this.pos.y < 0)
            this.pos.y = height;
    }

}
