let balls = []
const box = { x: 0, y: 0, x1: window.innerWidth, y1: window.innerHeight }
let compared = []
let id = 1;

function keyPressed() {

    if (key == 'l') {
        for (const ball of balls) {
            // ball.collide();
            // ball.collideWalls(box);
            ball.move();

        }
        loop()
    }

}

function setup() {

    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(60)
    // balls.push(new Ball({ m: 80, r: 30, v: { x: 0.5, y: 0.3 }, p: { x: 600, y: 200 } }))
    balls.push(new Ball({ name: 'a', m: 100, r: 60, v: { x: 0, y: 30 }, p: { x: 250, y: 100 } }))
    balls.push(new Ball({ name: 'b', m: 101, r: 60, v: { x: 0, y: 0 }, p: { x: 250, y: 270 } }))
    // balls.push(new Ball({ m: 5, r: 60, v: { x: -0.01, y: -0.01 }, p: { x: 400, y: 120 } }))
    // balls.push(new Ball({ m: 100, r: 60, v: { x: 1.8, y: 1.7 }, p: { x: 190, y: 100 } }))

    // balls.push(new Ball({ m: 800, r: 30, v: { x: 0.0, y: 0.01 }, p: { x: 500, y: 400 } }))
    // balls.push(new Ball({ m: 8000, r: 30, v: { x: 0.0, y: 0.0 }, p: { x: 320, y: 400 } }))

    // balls.push(new Ball({ m: 200, r: 30, v: { x: 0.0, y: 0.0 }, p: { x: 700, y: 100 } }))
    // balls.push(new Ball({ m: 200, r: 30, v: { x: -1.0, y: 0.0 }, p: { x: 1000, y: 100 } }))
    noLoop()

}

function draw() {
    // console.log('--- New loop ---')

    showGrid()

    logs = [];
    background(255, 255, 255, 5);

    compared = []
    for (const ball of balls) {
        // ball.collide();
        // ball.collideWalls(box);
        ball.show();
    }


    // logs.push("Framecount: " + frameCount);

    showInfo();
    // if (frameCount >= 200) {
    //     noLoop()
    // }
    noLoop()
}


function showInfo() {

    noStroke()

    for (let i = 0; i < logs.length; i++) {
        const element = logs[i];
        fill(255)
        rect(10, 4, 200, (i + 1) * 20);
        fill(0)
        text(element, 10, (i + 1) * 20);
    }

}

class Ball {

    constructor({ name, m, r, v, p }) {

        this.name = name // Mass scalar
        this.m = m // Mass scalar
        this.r = r // Ray scalar
        this.v = v // Valocity vector
        this.p = p // Position vector
        this.collided = false;
        this.id = id++;

    }

    show() {
        const mapId = map(this.id, 0, id, 0, 360)
        const color = 'hsla(' + mapId + ',100%,50%,0.8)';
        fill(color)
        strokeWeight(2)
        stroke(0)
        circle(this.p.x, this.p.y, this.r * 2)
        stroke(0)
        textAlign(CENTER)
        textSize(28)
        fill(255)
        text(this.name, this.p.x, this.p.y)


    }
    collideWalls(box) {

        if (this.p.y - this.r <= box.y) {
            this.v.y = -this.v.y
        }
        if (this.p.x - this.r <= box.x) {
            this.v.x = -this.v.x
        }
        if (this.p.y + this.r >= box.y1) {
            this.v.y = -this.v.y
        }
        if (this.p.x + this.r >= box.x1) {
            this.v.x = -this.v.x
        }

    }

    getNearstBall() {
        let nearstDist = 99999
        let nearstBall = false

        for (const othe of balls) {

            if (othe != this) {
                const b1 = this.p
                const b2 = othe.p
                let d = dist(b1.x, b1.y, b2.x, b2.y)

                if (d < nearstDist) {
                    nearstDist = d
                    nearstBall = othe
                }
            }
        }

        return nearstBall
    }

    willOverlap() {


        let othe = this.getNearstBall()

        const b1 = this.p
        const b2 = othe.p
        const sumRays = this.r + othe.r
        let d = dist(b1.x, b1.y, b2.x, b2.y)
        const dBordas = d - sumRays

        const newP1 = createVector(this.p.x + this.v.x, this.p.y + this.v.y)
        const newP2 = createVector(othe.p.x + othe.v.x, othe.p.y + othe.v.y)
        const newDi = dist(newP1.x, newP1.y, newP2.x, newP2.y)

        if (this.name == 'a' && othe.name != 'a') {
            console.log(`(${this.name}) d:  ${d} Ray sum: ${sumRays}, Vel x: ${this.v.x} y: ${this.v.y} newDi ${newDi} dBordas: ${dBordas}`)
        }
        if (newDi < sumRays) {
            console.log(this.name + ' will overlap ' + othe.name)
            return true
        }



        return false

    }

    move() {
        this.p.x += this.v.x
        this.p.y += this.v.y
        this.willOverlap()

    }

    collide() {

        for (const other of balls) {

            if (other != this) {

                const dx = this.p.x - other.p.x;
                const dy = this.p.y - other.p.y;
                const distance = floor(Math.sqrt(dx * dx + dy * dy));
                const raysSum = this.r + other.r
                const collided = distance < raysSum
                const diference = raysSum - distance

                this.collided = collided
                other.collided = collided
                let allread = false
                for (const cp of compared) {

                    if (cp.id1 == this.id && cp.id2 == other.id) {
                        allread = true
                        // console.log("Allread")
                        // noLoop();
                        break
                    }
                }
                compared.push({ id1: this.id, id2: other.id })
                compared.push({ id1: other.id, id2: this.id })

                if (collided && !allread) {


                    console.log('Collided', compared)

                    console.log(`Distances masses ${this.m} and ${other.m}: ${distance}  Rays sum: ${raysSum} FC: ${frameCount} DIF: ${diference}`)
                    console.log('this.m: ', this.m, ' v: ', this.v); // {x: 1.6, y: 2.6}
                    console.log('other.m: ', other.m, ' v: ', other.v); // {x: -2.4, y: 0.6}
                    let angle = Math.atan2(dy, dx);
                    let sin = Math.sin(angle);
                    let cos = Math.cos(angle);

                    var c1Pos = {
                        x: 0,
                        y: 0
                    };
                    var c2Pos = {
                        x: 0,
                        y: 0
                    };

                    c1Pos.x += (cos * this.v.x) + (sin * this.v.y);
                    c1Pos.y += (cos * this.v.y) - (sin * this.v.x);
                    c2Pos.x += (cos * other.v.x) + (sin * other.v.y);
                    c2Pos.y += (cos * other.v.y) - (sin * other.v.x);

                    var c1Vel = {
                        x: (c1Pos.x * (this.m - other.m) + 2 * other.m * c2Pos.x) / (this.m + other.m),
                        y: c1Pos.y
                    }
                    var c2Vel = {
                        x: (c2Pos.x * (other.m - this.m) + 2 * this.m * c1Pos.x) / (this.m + other.m),
                        y: c2Pos.y
                    }

                    this.v.x = (cos * c1Vel.x) - (sin * c1Vel.y);
                    this.v.y = (cos * c1Vel.y) + (sin * c1Vel.x);
                    other.v.x = (cos * c2Vel.x) - (sin * c2Vel.y);
                    other.v.y = (cos * c2Vel.y) + (sin * c2Vel.x);

                    console.log('this.m: ', this.m, ' v: ', this.v); // {x: 1.6, y: 2.6}
                    console.log('other.m: ', other.m, ' v: ', other.v); // {x: -2.4, y: 0.6}

                    // if (frameCount > 145) noLoop()
                }



            }
            this.move()
            other.move()
            // this.p.x += this.v.x
            // this.p.y += this.v.y

            // other.p.x += other.v.x
            // other.p.y += other.v.y
        }
    }
}

function showGrid() {

    noFill()
    textSize(7)
    strokeWeight(0.3)
    for (let y = 0; y < innerHeight; y += 10) {
        stroke(230)
        line(0, y, innerWidth, y)
        stroke(0)
        text(y, 140, y - 1)
    }
}