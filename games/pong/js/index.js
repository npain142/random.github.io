const canvas  = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const bounds = canvas.getBoundingClientRect();
const gameSize = {
    width: 700,
    height: 500
}

const ball = {
    radius: 5,
    x: 0,
    y: gameSize.height + 10,
    dirX: "n",
    gradfactor: 0
}


const platform = {
    width: 10,
    height: 60
}

const player1 = {
    x: 5,
    y: 0,
    dir: "n",       // av: up (u), neutral (n), down (d)
    points: 0
}

const player2 = {
    x: gameSize.width - platform.width - 5,
    y: 0,
    dir: "n", 
    points: 0
}
player1.y = player2.y = gameSize.height/2 - platform.height/2;

//Draw Players
    //Player 1
ctx.fillStyle = "white"
const playerVis1 = new Path2D();
playerVis1.rect(player1.x, player1.y, platform.width, platform.height);
ctx.fill(playerVis1);
    //Player2
const playerVis2 = new Path2D();
playerVis2.rect(player2.x, player2.y, platform.width, platform.height);
ctx.fill(playerVis2);

//Draw Ball (Random)
ctx.save();
ball.x = (gameSize.width/2 - ball.radius/2);
ctx.fillStyle = "#8080ff";
ctx.beginPath();
ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
ctx.fill();
ctx.restore();

//Keylisteners
document.onkeydown = e => {
    switch (e.code) {
        case "KeyW":
            player1.dir = "u";
            break;
        case "KeyS":
            player1.dir = "d";
            break;
        case "ArrowUp":
            player2.dir = "u";
            break;
        case "ArrowDown":
            player2.dir = "d";
            break;
    }
}

//Calc playerposition
function playerPos(p) {
    if (p.dir === "u") {
        p.y -= 2;
    } else if (p.dir == "d") {
        p.y += 2;
    }
}  

//Calc Ballposition
function ballPos() {
    ball.y += ball.gradfactor;
    if (ball.dirX == "l") {
        ball.x -= 1;
    } else if (ball.dirX == "r") {
        ball.x += 1;
    }
}

function ballBoost(duration, boostFactor) {
    const ballBoostAnim = setInterval(() => {
        if (ball.dirX == "l") {
            ball.x -= boostFactor;
        } else if (ball.dirX == "r") {
            ball.x += boostFactor;
        }
    }, 1)
    setTimeout(() => {
        clearInterval(ballBoostAnim);
    }, duration)
}

//Collisiondetection
//Player -- Wall
function wallCollision(p) {
    if (p.y < 0 || p.y + platform.height > gameSize.height)
        return true;
}

//Player -- Ball
function ballPlayerCollisionP1() {
    if ((player1.x + platform.width >= ball.x - ball.radius) && (player1.y <= ball.y + ball.radius) && (player1.y + platform.height >= ball.y + ball.radius)) {
        for (let i = 1; i <= 5; i++) {
            if (player1.y + i*platform.height/5 >= ball.y) {
                return i;
            }
        }
    }
    return -1;
}

function ballPlayerCollisionP2() {
    if ((player2.x <= ball.x + ball.radius) && (player2.y <= ball.y + ball.radius) && (player2.y + platform.height >= ball.y + ball.radius)) {
        for (let i = 1; i <= 5; i++) {
            if (player2.y + i*platform.height/5 >= ball.y) {
                return i;
            }
        }
    }
    return -1;
}

//Ball -- Wall (Horizontal)
function ballWallCollisionHor() {
    if (ball.x < player1.x + platform.width/2) {
        return true;
    }
}


//Ball -- Wall (Vertical)
function ballWallCollisionVer() {
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= gameSize.height) {
        return true;
    }
}


//ANIMATIONS

//Tailanimations
//Playertail
const playerTail = [];
function playerTailAnimation(p) {
    ctx.save();
    if (p.dir == "u") {
        playerTail.unshift({x: player1.x, y: player1.y + platform.height});
    } else if (p.dir == "d") {
        playerTail.unshift({x: player1.x, y: player1.y});
    }
    for (let i = 0; i < playerTail.length; i++) {
        ctx.fillStyle = "rgba(255, 255, 255," + 1/i + ")";
        ctx.fillRect(playerTail[i].x + i/4, playerTail[i].y , 10 - i/2, 10 - i/2);
    }
    if (playerTail.length >= 20)
    playerTail.pop();
    ctx.restore();
}

//Balltail
const ballTail = [];
function ballTailAnimation() {
    ctx.save();
    if (ball.dirX == "l") {
        ballTail.unshift({x: ball.x, y: ball.y });
    } else if (ball.dirX == "r") {
        ballTail.unshift({x: ball.x, y: ball.y});
    }
    for (let i = 0; i < ballTail.length; i++) {
        ctx.fillStyle = "rgba(255, 255, 255," + 1/i + ")";
        ctx.beginPath();
        ctx.arc(ballTail[i].x, ballTail[i].y, ball.radius, 0, Math.PI*2, false);
        ctx.fill();
    }
    if (ballTail.length >= 20)
    ballTail.pop();
    ctx.restore();
}

//Ball starting animation
function startBall(checker) {
    ctx.save();
    //ball.dirX = (Math.random() <= 1/2) ? "l" : "r"; 
    ball.dirX = "l"
    const interval1 = setInterval(() => {
        if (ball.y >= gameSize.height/2 - ball.radius/2) {
            ctx.clearRect(ball.x - ball.radius, ball.y - ball.radius, ball.radius*2, ball.radius*2);
            ball.y -= 1;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
            ctx.fill();
        } else {
            clearInterval(interval1);
            checker[0] = true;
        }
    }, 10);
    ctx.restore();
}



function gameClock() {
    ctx.clearRect(0, 0, gameSize.width, gameSize.height);

    ballPos();
    ballTailAnimation();
    //Draw Ball
    ctx.save();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.fill();
    playerPos(player1);
    playerPos(player2);
    const bPColl1 = ballPlayerCollisionP1();
    const bPColl2 = ballPlayerCollisionP2();
    
    if (bPColl1 > 0 || bPColl2 > 0) {
        
        ball.dirX = (bPColl1 > 0) ? "r" : "l";
        if (ball.gradfactor == 0) {
            ball.gradfactor = Math.random() * 2;
            let sgn = Math.random();
            ball.gradfactor *= (sgn < 1/2) ? -1 : 1;
        }
        let tmp = (bPColl1 > 0) ? bPColl1 : bPColl2;
        switch (tmp) {
            case 1:
                ball.gradfactor = (ball.gradfactor < 0) ? -2 : 2;
                break;
            case 2:
                ball.gradfactor = (ball.gradfactor < 0) ? -1.5 : 1.5;
                break;
            case 3:
                ball.gradfactor = (ball.gradfactor < 0) ? -1 : 1;
                break;
            case 4:
                ball.gradfactor = (ball.gradfactor < 0) ? -1.5 : 1.5;
                break;
            case 5:
                ball.gradfactor = (ball.gradfactor < 0) ? -2 : 2;
                break;
        }
    }
    if (wallCollision(player1) || ballWallCollisionHor()) {
        alert("LOST");
    }
    if (ballWallCollisionVer()) {
        ball.gradfactor *= -1;
    }
    playerTailAnimation(player1);
    ctx.fillRect(player1.x, player1.y, platform.width, platform.height);
    ctx.fillRect(player2.x, player2.y, platform.width, platform.height);
    
    requestAnimationFrame(gameClock);
}

function startGame() {
    const checker = [false];
    startBall(checker);
    
    const starting = setInterval(() => {
        if (checker[0]) {
            let i = 0;
            const breakoutAnim = setInterval(() => {
                ctx.clearRect(ball.x - ball.radius*2, ball.y - ball.radius*2, ball.radius*10, ball.radius*10);
                ctx.beginPath();
                ctx.arc(ball.x + Math.sin(i++), ball.y + Math.sin(i++), ball.radius, 0, Math.PI * 2, false);
                ctx.fill();
            }, 10)
            setTimeout(() => {
                clearInterval(breakoutAnim);
                ballBoost(200, 2);
                gameClock();
            }, 1000)
            clearInterval(starting);
        }
    }, 10)
}
startGame();

