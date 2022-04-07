const canvasGame = document.querySelector("#canvasGame");
const canvasPiezes = document.querySelector("#canvasPiezes");
const ctxG = canvasGame.getContext("2d");
const ctxP = canvasPiezes.getContext("2d");
const canvasGWidth = canvasGame.width;
const canvasGHeight = canvasGame.height;
const canvasGameBC = "salmon";

const tableroTamañoX = 10;
const tableroTamañoY = 20;
let tablero = [];
const unitSize = canvasGWidth / tableroTamañoX;         //10 x 20, cuadrado sino unitSizeX=width/10 y unitSizeY=height/20.

const formas = {
    I : [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}],
    O : [{x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}],
    S : [{x:0, y:0}, {x:0, y:1}, {x:-1, y:1}, {x:1, y:0}],
    Z : [{x:0, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:1, y:1}],
    L : [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:1, y:2}],
    J : [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:-1, y:2}],
    T : [{x:0, y:0}, {x:0, y:1}, {x:-1, y:1}, {x:1, y:1}]
}
let forma = [];
const piezas = [["I", "cyan", formas.I],
                ["O", "yellow", formas.O],
                ["S", "green", formas.S],
                ["Z", "red", formas.Z],
                ["L", "orange", formas.L],
                ["J", "blue", formas.J],
                ["T", "violet", formas.T]];
let pieza = { name : "", color : "" };

let xPos = 0;
let yPos = 0;
let canMoveLeft = true;
let canMoveRight = true;

//Purebas
for(let i = 0; i <= tableroTamañoX; i+=1){
    tablero[i] = [];
    for(let j = 0; j <= tableroTamañoY; j+=1){
        tablero[i][j] = 0;
    }
}



//tablero[tableroTamañoX / 2][tableroTamañoY / 2] = 1;

window.addEventListener("keydown", event => {
    move(event);
    checkLine();
});

spawn();
spawnPieze();


//pruebas




function spawn(){
    let random = Math.floor(Math.random() * 7);
    forma = piezas[random][2];
    pieza.name = piezas[random][0];
    pieza.color = piezas[random][1];
  
}
async function spawnPieze(){
    xPos = unitSize * (tableroTamañoX / 2 - 1);
    yPos = 0;
    //While mientras cae, variando yPos y xPos
    let repeat = checkLine();
    drawPieze();
    while(repeat){  
        await sleep(300);              
        clearPieze();
        console.log("while");
        yPos = yPos + unitSize;
        drawPieze(); 
        repeat = checkLine();
    }

    spawn();
    spawnPieze(); 
}
function drawPieze(){
    ctxG.fillStyle = pieza.color;
    ctxG.strokeStyle = "black";

    forma.forEach( cuad => {
        ctxG.fillRect(cuad.x * unitSize + xPos, cuad.y * unitSize  +yPos, unitSize, unitSize);
        ctxG.strokeRect(cuad.x * unitSize + xPos, cuad.y * unitSize  +yPos, unitSize, unitSize);
    });    
}
function clearPieze(){
    ctxG.fillStyle = canvasGameBC;
    forma.forEach( cuad => {
        ctxG.fillRect(cuad.x * unitSize + xPos, cuad.y * unitSize  +yPos, unitSize, unitSize);        
    }); 
}

function checkLine(){
    let check = true;
    canMoveLeft=true;
    canMoveRight=true;
    forma.forEach( cuad => {
        if(tablero[cuad.x + xPos / unitSize][cuad.y + yPos / unitSize + 1] == 1){
            drawStatic();
            //spawn();
            //spawnPieze(); 
            check = false;
        }
        else if(cuad.y * unitSize  +yPos >= (tableroTamañoY-1) * unitSize){
            drawStatic();
            //spawn();
            //spawnPieze(); 
            check = false;
        }
        if(tablero[cuad.x + xPos / unitSize + 1][cuad.y + yPos / unitSize] == 1 || cuad.x + xPos / unitSize == tableroTamañoX - 1){
            canMoveRight = false;
        }

        if(cuad.x + xPos / unitSize == 0){
            canMoveLeft = false;
        }
        else if(tablero[cuad.x + xPos / unitSize - 1][cuad.y + yPos / unitSize] == 1){      //No existe teblero[-1]
            canMoveLeft = false;
        }
        
    })
    
    
    return check;
    
}
function drawStatic(){
    forma.forEach(cubo => {
        tablero[cubo.x + xPos / unitSize][cubo.y + yPos / unitSize] = 1;
        if(cubo == 1){
            //drawPieze();

        }
    });
}



function move(event){
    console.log(event.key);
    switch(event.key){
        case "ArrowRight":
            moveRight();
            break;
        case "ArrowLeft":
            moveLeft();
            break;  
        case "ArrowUp":
            rotateUp();
            break; 
        case "ArrowDown":
            rotateDown();
            break;    
    }
}
function moveRight(){
    if(canMoveRight){
        clearPieze();
        xPos = xPos + unitSize;
        drawPieze();
    }
}
function moveLeft(){
    if(canMoveLeft){
        clearPieze();
        xPos = xPos - unitSize;
        drawPieze();
    }
}
function rotateUp(){
    let temp = 0;
    clearPieze();
    forma.forEach(cuad => {
        temp = cuad.x;
        cuad.x = cuad.y;
        cuad.y = temp;
    });
    forma.forEach(cuad => {
        if(cuad.x + xPos / unitSize == -1){         //Rotar sobre pared izquierda
            xPos += unitSize;
        }
        else if (cuad.x + xPos / unitSize == 0){}
        else if (tablero[cuad.x + xPos / unitSize - 1][cuad.y + yPos / unitSize] == 1){     //Rotar sobre elemento izquierda
            rotateUp();
        }
        
        
        

        if(cuad.x + xPos / unitSize == tableroTamañoX){         //Rotar sobre pared derecha
            xPos -= unitSize;
        }
        else if (tablero[cuad.x + xPos / unitSize + 1][cuad.y + yPos / unitSize] == 1){     //Rotar sobre elemento derecha
            rotateUp();
        }

    });
    


    drawPieze();

}
function rotateDown(){

}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}