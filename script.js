/* ----------------- Xử lý để chuyển màn hình chơi.
- Màn hình chờ game.
 */
let playerName = "";

/* - Lấy tên người dùng nhập vào input.
=> Nếu người dùng không nhập gì, sử dụng tên "Ẩn danh".
 */
function getPlayerName() {
    playerName = document.getElementById("playerName").value;
    if (playerName.trim() === "") {
        playerName = "Ẩn danh";
    }
}

document.getElementById("startButton").addEventListener("click", playGame);

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

function playGame() {
    document.getElementById("startScreen").style.display = "none"; // Ẩn màn hình chờ.
    document.getElementById("playScreen").style.display = "block";
    getPlayerName();

}


//Xử lý phần hướng dẫn và giới thiệu game.

var manual = document.getElementById("manual");
var introduction = document.getElementById("introduction");
var reportManual = document.getElementById("reportManual");
var reportIntro = document.getElementById("reportIntro");
var closeM = document.getElementById("close1");
var closeI = document.getElementById("close2");
var overlay = document.getElementById("overlay");


manual.onclick = function () {
    overlay.style.display = "block";
    reportManual.style.display = "block";

}
closeM.onclick = function () {
    reportManual.style.display = "none";
    overlay.style.display = "none";
}

introduction.onclick = function () {
    overlay.style.display = "block";
    reportIntro.style.display = "block";

}
closeI.onclick = function () {
    reportIntro.style.display = "none";
    overlay.style.display = "none";
}


// -----------------Màn hình chơi game chính.--------------------------
// Thêm viền canvas.

canvas.style.border = "2px solid  #EAEAEA";
// Tạo màu sắc chính.

const WHITE_COLOR = "#EAEAEA";
const PINK_COLOR = "#FF2E63";
const BLUE_COLOR = "#08D9D6"
const BLACK_COLOR = "#252A34";

// Các thông số trò chơi.

let scoreStart = 0;
const SCORE_BONUS = 10;
let level = 1;
const MAX_LEVEL = 3;
let heart = 3;
let gameOv = false;
let pi = 1;

// Tạo ảnh/icon hiển thị cho game
const BG_IMG = new Image();
BG_IMG.src = "data/background.jpg"

const IC_HEART = new Image();
IC_HEART.src = "data/heart.png";

const IC_LEVEL = new Image();
IC_LEVEL.src = "data/star.png";

const IC_SCORE = new Image();
IC_SCORE.src = "data/goal.png";

const WINNER = new Image();
WINNER.src = "data/win.png";

const LOSER = new Image();
LOSER.src = "data/lost.png";


/* Xử lý bàn phím trong trò chơi
  + Mũi tên trái/ phải để di chuyển thanh chắn.
  + Phím cách để bắt đầu trò chơi.
  + Esc để tạm dừng trò chơi.
 */
// Tạo caác phím:
let leftArrow = false;
let rightArrow = false;
let enter = false;



document.addEventListener("keydown", function (event) {
    if (gameOv) {
        if (event.code === "Space") {
            resetBall();
            resetLine();
            resetGame();
        }
        return;
    }
    if (event.key === "Enter") {
        enter = true;
    }
    if(event.key == "Escape") {
        enter = false;
    }


    if (event.key === "ArrowLeft") {
        console.log("left");
        leftArrow = true;
    } else if (event.key === "ArrowRight") {
        rightArrow = true;
        console.log("right");
    }
});
document.addEventListener("keyup", function (event) {

    if (event.key === "ArrowLeft") {
        leftArrow = false;
    } else if (event.key === "ArrowRight") {
        rightArrow = false;
    }
})

/* Tạo Object thanh chắn ngang đỡ bóng.

- 1. Tạo 1 số biến => dễ dàng thay đổi sau này.
- LINE_WIDTH, LINE_HEIGHT : lần luượt là chiều dài và cao của thanh chắn.
- MARGIN_LINE_BOTTOM: Khoảng cách từ khung nhìn dưới tới thanh chắn cạnh dưới.

- 2. Các thuộc tính trong thanh chắn.
- x, y : Tọa độ điểm góc trái trên cùng của thanh chắn.
- Khi bắt đâu, thanh chắn phải nằm chính giữa khung, do đó:
- Vị trí x = kích thước 1/2 khung - 1/2 kích thước thanh chắn.
- Vị trí y = chiều cao của canvas - khoảng cách margin dưới cùng - chiều cao thanh chắn..
- width, height chiều dài và cao của thanh chắn
- dx: Số lượng px mà mỗi lần ta di chuyển thanh chắn.
 */
const LINE_WIDTH = 100;
const LINE_HEIGHT = 15;
const MARGIN_LINE_BOTTOM = 40;

const line = {
    x: canvas.width * 1 / 2 - 1 / 2 * LINE_WIDTH,
    y: canvas.height - MARGIN_LINE_BOTTOM - LINE_HEIGHT,
    width: LINE_WIDTH,
    height: LINE_HEIGHT,
    dx: 5
}

/*
    Vẽ thanh chắn ngang đỡ bóng.
 */
function drawLine() {
    c.fillStyle = PINK_COLOR;
    c.fillRect(line.x, line.y, line.width, line.height);
    c.strokeStyle = BLACK_COLOR;
    c.strokeRect(line.x, line.y, line.width, line.height);
}

/* CHỨC NĂNG CHO VIỆC DI CHUYỂN THANH CHẮN
1. Di chuyển sang trái chỉ có thể đến khung trái mà thôi
=> Điều kiện di chuyển là nhấn nút mũi tên trái & vị trí x > khung trái = 0.
- Khi này, vị trí x sẽ - đi dx lần.
2. Di chuyển phải cũng chỉ đc chạm tới khung phải:
=> Vị trí x + chiều dài thanh chắn không được phép lớn hơn khung phải.
- Khi này, vị trí x sẽ + lên dx lần.
 */
function moveLine() {

    if (leftArrow && line.x > 0) {
        line.x -= line.dx;
    }
    if (rightArrow && line.x + line.width < canvas.width) {
        line.x += line.dx;
    }
}

// Chỉ reset lại thanh chắn khi game over!
function resetLine() {
    line.x=canvas.width * 1 / 2 - 1 / 2 * LINE_WIDTH;
    line.y=canvas.height - MARGIN_LINE_BOTTOM - LINE_HEIGHT;
        }

/*
*           Tạo object trái bóng.
*  - Phải có 1 biến chứa bán kính của hình tròn.
*  - Tọa độ x,y tính là tâm của trái bóng - Nằm chính giữa màn và ngay trên thanh chắn bóng..
*  - X: Lại bằng 1 nửa chiều dài khung nhìn canvas
* - Y: Ghi nhớ tọa độ y của thanh chắn - bán kính của quả bóng.
* - radius : bán kính trái bóng.
* - speed : tốc độ trái bóng. khi dịch chuyển.
* - dx: lượng px dịch chuyển theo chiều dài / x.
* - dy: lượng px dịch chuyển theo chiều cao /y.
*  Giá trị -3 vì khi nẩy lên, bóng sẽ bật về phía trên => y sẽ giảm.
* */

const RADIUS_BALL = 10;
const ball = {
    x: canvas.width * 1 / 2,
    y: line.y - RADIUS_BALL,
    radius: RADIUS_BALL,
    speed: 7,
    dx: 3,
    dy: -3
}

/* Vẽ trái bóng.
 - Sử dụng cách vẽ vòng cung trong canvas.
- 0 -> 360 độ.
*
 */
function drawBall() {
    c.beginPath();
    c.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    c.fillStyle = BLACK_COLOR;
    c.fill();
    c.strokeStyle = PINK_COLOR;
    c.stroke();
    c.closePath();
}

//  Di chuyển quả bóng.
function moveBall() {
    if (enter) {
        ball.x += ball.dx;
        ball.y += ball.dy;
    }
}

/* - Bóng sẽ được băắt đầu lại khi người chơi bị trừ mất 1 tim.
+ Tương tự như khi bắt đầu trò chơi, bóng sẽ :
Các thuộc tính : x, y, dy sẽ giống như ban đầu.
+ Để trò chơi thêm phần thú vị, ta sẽ làm cho dx (hướng di chuyển
sang ngang ban đầu) đi một cách ngẫu nhiên.
+ Để di chuyển ngẫu nhiên => -3 < ball.dx < 3 .
        + Sử dụng hàm random => 0 < Math.random < 1  (Nhân 2) => 0 < 2* Math.random < 2
        + (Trừ 1) => -1 < 2 * Math.random < 1 => (Nhân 3) -3 < 3 * (2 * Math.random -1)) < 3 ~~~ Kết quả.
 */
function resetBall() {

    ball.x = canvas.width * 1 / 2;
    ball.y = line.y - RADIUS_BALL;
    ball.dy = -3;
    ball.dx = 3 * (2 * Math.random() - 1);
}


/*  Xử lý va chạm giữa trái bóng với 3 chiều left - top - right.
 + right : Bóng va chạm với tường phải khi mà:
    + Vị trí x + baán kính > width của khung.
       + Thấy rằng ban đầu, bóng sẽ di chuyển lên (y giảm) - và sang phải (x tăng).
       => Khi đập vào khung phải: bóng dội lên (y vẫn giảm) - và đổi hướng sang traái (x giảm).
 + top: Bóng va chạm vào tường trên khi :
    + Vị trí y + bán kính < 0 (chiều cao khung)
        + Dựa vào chiều bóng khi bật ra bên phải ta thấy :
        => Dội vào tường trên : bóng dội xuống (y sẽ tăng) và vẫn theo hướng trái (x giảm).
 + left : Bóng va chạm vào tường trái khi:
    + Vị trí x - bán kính < 0 (chiều dài khung).
        + Dựa vào chiều bóng khi dội lại từ trên :
        => Bật vào tường trái: bóng dội xuống (y vẫn tăng) và x lại 1 lần nữa đổi chiều (x tăng)
        Do đó, trường hợp naày giống trường hợp right ban đầu.
 + bottom : Khi để bóng xuống cuối, "tim" sẽ bị giảm 1.
*/
function ballCollideWall() {
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > canvas.height) {
        heart--; // giảm tim của người chơi.
        resetBall();
    }

}

/*  Xử lý bóng va chạm với thanh chắn
  + Va chạm khi tâm bóng chạm vào "giữa theo chiều cao" của thanh chắn.
  + Tùy vào vị trí va chạm theo chiều ngang mà bóng bật theo góc độ khác nhau !.
        + Ngay góc tọa độ : bóng sẽ bật theo chiều thẳng đứng.
        + Ngay góc trái thanh chắn : bóng bật 1 góc -60 so với hướng dọc.
        + Ngay góc phải thanh chắn : bóng bật 1 góc 60 so với hướng dọc.
   + x_deviation : Độ lệch theo px của điểm tiếp xúc bóng (theo phương ngang) so với trung tâm thanh chắn.
   + Giá trị x_deviation sẽ nằm trong khoảng -1/2 line.width đến 1/2 line.width
   + => Đưa về dạng đơn giản bằng cách chia cho 1/2 line.width !
   + angle : góc => tính góc bằng cách nhân 60 độ với tỷ lệ  x_deviation ! - Khoảng giá trị (-60 ; 60).
   + Có loại 3 thuộc tính liên quan như sau :
   + dy, dx : cái cần tìm !
   + angle : đã xác định được.
   + speed : đã cho từ đầu.
       Từ bài toán vector tam giác với cạnh huyền là speed (tốc độ trái bóng nảy ra) ta áp dụng cos & sin tính dy, dx.

 */
function ballCollideLine() {

    if (ball.y + ball.radius > line.y && ball.x > line.x && ball.x < line.x + line.width) {
        let x_deviation = ball.x - (line.x + 1 / 2 * line.width);
        x_deviation = x_deviation / (1 / 2 * line.width);
        let angle = x_deviation * (Math.PI / 4);
        ball.dx = ball.speed * Math.sin(angle);
        /* Ta thấy cos (-60) là giá trị - => giá trị biểu thức sẽ là âm.
        - Tuy nhiên, khi đầu ta cho dy giá trị âm, nên cộng dy sẽ thành tăng => bóng nảy xuống cuối
        => Vì thế ta phải thêm - vào để y giảm!
        **/

        ball.dy = -ball.speed * Math.cos(angle);
    }

}

/* 3.1.1. Tạo đối tượng gạch
+ margin_top : margin chừa trên top để viết thông số khác.
 */
brick = {
    width: 50,
    height: 30,
    marginLeftBrick: 25,
    marginTopBrick: 15,
    marginTop: 30,
    row: 3,
    collum: 6
}

/* 3.1.2. Tạo mảng Gạch 6x3.

 + Tọa độ x của mỗi viên gạch : ban đầu có margin left của viên gạch đầu tiên,
                                các viên sau đó thì sẽ phải thêm chiều dài viên gạch trước đó
                                và margin left của chính nó
 + Tọa độ y của mỗi viên gạch : ban đầu gồm margin top (lề trên cùng) + margin top của viên gạch đầu tiên.
                                các viên gạch tiếp theo sẽ = tọa độ y viên gạch trước đó + thêm margin top của chính nó.
 + def : Khả năng phòng thủ của viên đá
                                level 1 : nó sẽ chỉ có 1 => đụng vào sẽ về 0 và biến mất.
                                các level sau sẽ tăng khả năng phòng thủ.
*/
let brickArray = []; // tạo mảng gạch !


/*
    Tính toán khả năng tăng level của game.
    + Với level 3, khả năng phòng thủ của tảng đá sẽ là 2.


 */
function caculator() {
    if(level > 1) {
        pi = 2;
    }
    else pi =1;

}
function createBrick() {
    for (let i = 0; i < brick.row; i++) {
        brickArray[i] = [];
        for (let j = 0; j < brick.collum; j++) {
            brickArray[i][j] = {
                x: j * (brick.marginLeftBrick + brick.width) + brick.marginLeftBrick,
                y: brick.marginTop + brick.marginTop + i * (brick.marginTopBrick * brick.row),
                def: pi
            }
        }
    }
}

createBrick();


// 3.2. Vẽ ô gạch lên canvas.
function drawBrick() {
    for (let i = 0; i < brick.row; i++) {
        for (let j = 0; j < brick.collum; j++) {
            if (brickArray[i][j].def > 0) {
                c.fillStyle = WHITE_COLOR;
                c.fillRect(brickArray[i][j].x, brickArray[i][j].y, brick.width, brick.height);

                c.strokeStyle = BLACK_COLOR;
                c.strokeRect(brickArray[i][j].x, brickArray[i][j].y, brick.width, brick.height);
            }
        }
    }
}

/* 3.3. Xử lý va chạm giữa bóng và gạch !.

 */
function ballCollideBrick() {
    for (let i = 0; i < brick.row; i++) {
        for (let j = 0; j < brick.collum; j++) {
            let temp = brickArray[i][j];
            if (temp.def > 0) {
                if (ball.x + ball.radius > temp.x && ball.x - ball.radius < temp.x + brick.width
                    && ball.y + ball.radius > temp.y && ball.y - ball.radius < temp.y + brick.height) {
                    temp.def -= 1;
                    ball.dy *= -1; // doi huong dy.
                    scoreStart += SCORE_BONUS;
                }
            }


        }
    }

}

// Tạo giao diện hiển thị level, mạng người chơi và điểm số. (cùng 1 mẫu)

function makeTemplet(char, charX, charY, icon, iconX, iconY, sizeX, sizeY) {
    c.fillStyle = BLACK_COLOR;
    c.font = "25px Monaco";
    c.fillText(char, charX, charY);
    c.drawImage(icon, iconX, iconY, sizeX, sizeY);
}

function statistic() {
    makeTemplet(level, 59, 33, IC_LEVEL, 25, 10, 25, 25);
    makeTemplet(scoreStart, 242, 33, IC_SCORE, 208, 12, 25, 25);
    makeTemplet(heart, 434, 33, IC_HEART, 400, 12, 25, 25);
}

// Kiểm tra nguười chơi thua cuộc
function gameOver() {

    if (heart <= 0) {
        gameOv = true;
        //  Hiển thị thông báo thua cuộc.
        c.font = "30px Monaco";
        c.fillStyle = BLACK_COLOR;
        makeTemplet("Nhấn nút cách để chơi lại !", canvas.width / 2 - 140, canvas.height / 2 + 50, LOSER, canvas.width / 2 - 64, canvas.height / 2 - 115, 128, 128);
        enter = false;
    }
}

function levelUp() {
    let levelDone = true;
    for (let i = 0; i < brick.row; i++) {
        for (let j = 0; j < brick.collum; j++) {
            if (brickArray[i][j].def > 0) {
                levelDone = false;
            }
        }
    }
    if (levelDone) {
        if (level >= MAX_LEVEL) {
            gameOv = true;
            c.font = "30px Monaco";
            c.fillStyle = BLACK_COLOR;
            makeTemplet("Nhấn nút cách để chơi lại !", canvas.width / 2 - 140, canvas.height / 2 + 50, WINNER, canvas.width / 2 - 64, canvas.height / 2 - 115, 128, 128);
            return;
        }

        caculator();
        // brick.row += 1;
        createBrick();
        ball.speed += 1;
        resetBall();
        level++;

    }
}

function resetGame() {
    gameOv = false;
    heart = 3;
    scoreStart = 0;
    createBrick();
    loop();
}

/*
- Sử dụng drawElement để vẽ các thành phần line (thanh gạch đỡ bóng), ball (quả bóng.
 */
function drawElement() {
    c.lineWidth = 3;
    drawLine();
    drawBall();
    drawBrick();
}

/*
- Sử dụng để tạo các chuyển động cho line & ball.
 */
function movement() {
    moveLine();
    moveBall();
    ballCollideWall();
    ballCollideLine();
    ballCollideBrick();
    statistic();
    gameOver();
    levelUp();
}

function loop() {

    c.drawImage(BG_IMG, 0, 0, canvas.width, canvas.height); // vẽ ảnh lên canvas.
    drawElement()
    if (!enter) {
        c.fillStyle = PINK_COLOR;
        c.fillText(`Xin chào ${playerName}, Enter để bắt đầu !`, canvas.width / 2 - 200, canvas.height / 2);
    }
    movement();
    if (!gameOv) {
        requestAnimationFrame(loop);
    }
}

loop();

/* ------------------- Màn hình chơi game chính.----
 */