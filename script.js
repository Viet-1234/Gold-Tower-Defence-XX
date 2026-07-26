// ======================================
// Tower Defense X
// script.js - Part 1/6
// ======================================

// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Kích thước
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Game
let running = false;

// Người chơi
const player = {
    hp: 20,
    gold: 500,
    wave: 1,
    score: 0
};

// Cập nhật giao diện
function updateUI() {

    document.getElementById("hp").textContent = player.hp;

    document.getElementById("gold").textContent = player.gold;

    document.getElementById("wave").textContent = player.wave;

    document.getElementById("score").textContent = player.score;

}

// Mảng dữ liệu
const towers = [];
const enemies = [];
const bullets = [];

// Tháp đang chọn
let selectedTower = "archer";

// Nút chọn tháp
document.getElementById("tower1").onclick = () => {

    selectedTower = "archer";

};

document.getElementById("tower2").onclick = () => {

    selectedTower = "fire";

};

document.getElementById("tower3").onclick = () => {

    selectedTower = "ice";

};

// Đặt tháp
canvas.addEventListener("click", function(e){

    if(!running) return;

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    let cost = 100;

    if(selectedTower==="fire") cost = 150;

    if(selectedTower==="ice") cost = 200;

    if(player.gold < cost){

        return;

    }

    player.gold -= cost;

    towers.push({

        x:x,

        y:y,

        type:selectedTower,

        damage:selectedTower==="fire"?40:25,

        range:selectedTower==="ice"?180:140,

        reload:0

    });

});
// ======================================
// Tower Defense X
// script.js - Part 2/6
// ======================================

// Sinh quái
function spawnEnemy() {

    enemies.push({

        x: -30,

        y: 270,

        hp: 100 + player.wave * 20,

        maxHp: 100 + player.wave * 20,

        speed: 1 + player.wave * 0.05,

        alive: true

    });

}

// Cập nhật quái
function updateEnemies() {

    for (let enemy of enemies) {

        if (!enemy.alive) continue;

        enemy.x += enemy.speed;

        if (enemy.x > WIDTH + 30) {

            enemy.alive = false;

            player.hp--;

        }

    }

}

// Vẽ quái
function drawEnemies() {

    for (let enemy of enemies) {

        if (!enemy.alive) continue;

        // Quái
        ctx.fillStyle = "#d32f2f";

        ctx.beginPath();

        ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);

        ctx.fill();

        // Thanh máu
        ctx.fillStyle = "black";

        ctx.fillRect(enemy.x - 18, enemy.y - 25, 36, 5);

        ctx.fillStyle = "lime";

        ctx.fillRect(

            enemy.x - 18,

            enemy.y - 25,

            (enemy.hp / enemy.maxHp) * 36,

            5

        );

    }

}

// Sinh quái mỗi 2 giây
setInterval(function () {

    if (running) {

        spawnEnemy();

    }

}, 2000);
// ======================================
// Tower Defense X
// script.js - Part 3/6
// ======================================

// Tháp tấn công
function updateTowers() {

    for (let tower of towers) {

        if (tower.reload > 0) {

            tower.reload--;

            continue;

        }

        let target = null;
        let minDistance = 999999;

        for (let enemy of enemies) {

            if (!enemy.alive) continue;

            const dx = enemy.x - tower.x;
            const dy = enemy.y - tower.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= tower.range && distance < minDistance) {

                minDistance = distance;
                target = enemy;

            }

        }

        if (target) {

            bullets.push({

                x: tower.x,
                y: tower.y,

                target: target,

                speed: 8,

                damage: tower.damage

            });

            tower.reload = 30;

        }

    }

}

// Cập nhật đạn
function updateBullets() {

    for (let i = bullets.length - 1; i >= 0; i--) {

        const bullet = bullets[i];

        if (!bullet.target || !bullet.target.alive) {

            bullets.splice(i, 1);

            continue;

        }

        const dx = bullet.target.x - bullet.x;
        const dy = bullet.target.y - bullet.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 8) {

            bullet.target.hp -= bullet.damage;

            if (bullet.target.hp <= 0) {

                bullet.target.alive = false;

                player.gold += 20;

                player.score += 10;

            }

            bullets.splice(i, 1);

            continue;

        }

        bullet.x += dx / distance * bullet.speed;
        bullet.y += dy / distance * bullet.speed;

    }

}

// Vẽ đạn
function drawBullets() {

    ctx.fillStyle = "yellow";

    for (let bullet of bullets) {

        ctx.beginPath();

        ctx.arc(

            bullet.x,

            bullet.y,

            4,

            0,

            Math.PI * 2

        );

        ctx.fill();

    }

}

// Vẽ tháp
function drawTowers() {

    for (let tower of towers) {

        if (tower.type === "archer") {

            ctx.fillStyle = "#2196F3";

        }

        else if (tower.type === "fire") {

            ctx.fillStyle = "#F44336";

        }

        else {

            ctx.fillStyle = "#00BCD4";

        }

        ctx.beginPath();

        ctx.arc(

            tower.x,

            tower.y,

            18,

            0,

            Math.PI * 2

        );

        ctx.fill();

    }

}
// ======================================
// Tower Defense X
// script.js - Part 4/6
// ======================================

// Nền map
function drawMap() {

    // Cỏ
    ctx.fillStyle = "#7CB342";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Đường đi
    ctx.fillStyle = "#BCAAA4";
    ctx.fillRect(0, 245, WIDTH, 50);

}

// Kiểm tra Game Over
function checkGameOver() {

    if (player.hp <= 0) {

        running = false;

        alert("💀 Game Over!\n\nScore: " + player.score);

    }

}

// Tăng Wave
setInterval(function(){

    if(!running) return;

    player.wave++;

},30000);

// Nút Start
document.getElementById("startBtn").onclick = function(){

    running = true;

};

// Nút Restart
document.getElementById("restartBtn").onclick = function(){

    location.reload();

};

// Game Loop
function gameLoop(){

    drawMap();

    updateEnemies();

    updateTowers();

    updateBullets();

    drawEnemies();

    drawTowers();

    drawBullets();

    updateUI();

    checkGameOver();

    requestAnimationFrame(gameLoop);

}

gameLoop();
// ======================================
// Tower Defense X
// script.js - Part 5/6
// ======================================

// Vẽ tháp
function drawTowers(){

    for(let tower of towers){

        ctx.fillStyle=tower.color;

        ctx.beginPath();

        ctx.arc(

            tower.x,

            tower.y,

            18,

            0,

            Math.PI*2

        );

        ctx.fill();

        // Nòng súng
        ctx.strokeStyle="black";

        ctx.lineWidth=3;

        ctx.beginPath();

        ctx.moveTo(tower.x,tower.y);

        ctx.lineTo(tower.x+12,tower.y);

        ctx.stroke();

    }

}

// Wave mới
function nextWave(){

    player.wave++;

    for(let i=0;i<player.wave+2;i++){

        setTimeout(function(){

            spawnEnemy();

        },i*800);

    }

}

// Boss
function spawnBoss(){

    enemies.push({

        x:-40,

        y:270,

        hp:1200+player.wave*300,

        maxHp:1200+player.wave*300,

        speed:0.7,

        alive:true,

        boss:true

    });

}

// Mỗi 5 wave sẽ có Boss
setInterval(function(){

    if(!running) return;

    if(player.wave%5===0){

        spawnBoss();

    }

    else{

        nextWave();

    }

},25000);

// Nhật ký
function addLog(text){

    const log=document.getElementById("log");

    const p=document.createElement("p");

    p.textContent=text;

    log.prepend(p);

}

addLog("🎮 Game đã sẵn sàng.");

document.getElementById("startBtn").onclick=function(){

    running=true;

    addLog("▶ Bắt đầu game.");

};

document.getElementById("restartBtn").onclick=function(){

    location.reload();

};
// ======================================
// Tower Defense X
// script.js - Part 6/6
// ======================================

// Hiệu ứng nổ
const explosions = [];

function createExplosion(x, y) {

    explosions.push({

        x: x,
        y: y,
        radius: 5,
        life: 25

    });

}

function updateExplosions() {

    for (let i = explosions.length - 1; i >= 0; i--) {

        let e = explosions[i];

        ctx.beginPath();

        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);

        ctx.strokeStyle = "orange";

        ctx.lineWidth = 3;

        ctx.stroke();

        e.radius += 2;

        e.life--;

        if (e.life <= 0) {

            explosions.splice(i, 1);

        }

    }

}

// Kiểm tra quái chết
function removeDeadEnemies() {

    for (let enemy of enemies) {

        if (!enemy.alive) continue;

        if (enemy.hp <= 0) {

            enemy.alive = false;

            player.gold += enemy.boss ? 250 : 25;

            player.score += enemy.boss ? 500 : 10;

            createExplosion(enemy.x, enemy.y);

        }

    }

}

// Kiểm tra thắng
function checkVictory() {

    if (player.wave >= 20) {

        running = false;

        alert(
            "🏆 Chúc mừng!\n\nBạn đã hoàn thành Version 1!"
        );

    }

}

// Game Over
function checkGameOver() {

    if (player.hp <= 0) {

        running = false;

        alert(
            "💀 Game Over!\n\nScore: " + player.score
        );

    }

}

// Game Loop
function gameLoop() {

    drawMap();

    updateEnemies();

    updateTowers();

    updateBullets();

    removeDeadEnemies();

    drawEnemies();

    drawTowers();

    drawBullets();

    updateExplosions();

    updateUI();

    checkGameOver();

    checkVictory();

    requestAnimationFrame(gameLoop);

}

gameLoop();
