//html elements to manipulate
const board = document.getElementById('game-board');
const instruction = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreTxt = document.getElementById('highScore'); 

//game variables
const gridSize = 20;
let  snake = [{x:10, y:10}]; //initializes the snake's start position
let food = generateFood(); 
let highScore = 0;
let direction = "right"
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
function drawMap(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake(){
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement); 
    })
}

function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawFood(){
    if(gameStarted){
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food)
        board.appendChild(foodElement); 
    } 
}

function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y  = Math.floor(Math.random() * gridSize) + 1; 
    return {x,y};
}

function move(){
    const head = {...snake[0]}

    switch(direction){
        case "right":
            head.x++; //increments x coordinate 
            break;
        case "left":
            head.x--;
            break;
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
    }
    
    snake.unshift(head);
    
    if(head.x === food.x && head.y === food.y){
        food = generateFood(); // we generate a new food element 
        increaseSpeed();
        clearInterval(gameInterval); // it clears the past interval
        gameInterval = setInterval(() =>{
            move();
            checkCollision(); 
            drawMap();  
        }, gameSpeedDelay);

    }
    else{
        snake.pop(); 
    }
}
// setInterval(()=>{
//     move();
//     drawMap();
// },150);

function startGame(){
    gameStarted = true;
    instruction.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        drawMap();
    }, gameSpeedDelay) 
}

//keypress event listener
function handleKeyPress(event){
    if(
        (!gameStarted && event.code === 'space') ||
        (!gameStarted && event.key === ' ')
    ){
        startGame();
    }
    else{
        switch(event.key){
            case "ArrowUp":
                direction = "up";
                break;
            case "ArrowDown":
                direction = "down";
                break;
            case "ArrowRight":
                direction = "right";
                break;
            case "ArrowLeft":
                direction = "left";
                break;
            
            
        }
    }
}
document.addEventListener("keydown", handleKeyPress);

function increaseSpeed(){
    if(gameSpeedDelay > 100){
        gameSpeedDelay -= 5;
    }
    else if(gameSpeedDelay > 50){
        gameSpeedDelay -=3;
    }
    else if(gameSpeedDelay >  25){
        gameSpeedDelay -=1;
    }
}

function checkCollision(){
    const head = snake[0];

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }

    for(let i = 1; i < snake.length; i++){
        console.log("clash");
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x: 10, y:10}];
    food = generateFood();
    direction = "right";
    gameSpeedDelay = 200;
    updateScore();

}

function updateScore(){
    const currentScore = snake.length -1;
    score.textContent = currentScore.toString().padStart(3, '0');
    
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instruction.style.display = "block";
    logo.style.display = "block";
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreTxt.textContent = highScore.toString().padStart(3,0);
        highScoreTxt.style.display = "block";
    }
}