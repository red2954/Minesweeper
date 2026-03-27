class Block {
    constructor(isBomb, bombsNearby, isPressed, isFlagged) {
        this._isBomb = isBomb
        this._bombsNearby = bombsNearby
        this._isPressed = isPressed
        this._isFlagged = isFlagged
    }

    get isBomb() {
        return this._isBomb
    }

    set isBomb(value) {
        this._isBomb = value
    }

    get bombsNearby() {
        return this._bombsNearby
    }

    set bombsNearby(value) {
        this._bombsNearby = value
    }

    get isPressed() {
        return this._isPressed
    }

    set isPressed(value) {
        this._isPressed = value
    }

    get isFlagged(){
        return this._isFlagged
    }

    set isFlagged(value){
        this._isFlagged = value
    }

    increment() {
        this._bombsNearby++
    }
}
const directions = [[1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]]
function calculateBombsNearby(blocks) {
    let rows = blocks.length
    let cols = blocks[0].length

    for(let i = 0; i < rows; i++)
        for(let j = 0; j < cols; j++)
            blocks[i][j].bombsNearby = 0
    
    for(let i = 0; i < rows; i++)
        for(let j = 0; j < cols; j++){
            if(blocks[i][j].isBomb){
                for(let [x, y] of directions){
                    let newI = i + x
                    let newJ = j + y

                    const isPossible = newI >= 0 && newI < rows && newJ >= 0 && newJ < cols
                    if(isPossible)
                        blocks[newI][newJ].increment() 
                }
            }
    }

}

function revealEmptyArea(blocks, row, col){
    let rows = blocks.length
    let cols = blocks[0].length
    const isPossible = row >= 0 &&  row < rows && col >= 0 && col < cols
    if(!isPossible)
        return

    const block = blocks[row][col]

    if (block.isBomb || block.isPressed || block.isFlagged) 
        return

    block.isPressed = true
    gameSettings.visibleBlocks++

    if (block.bombsNearby > 0) 
        return

    for(let [x, y] of directions){
        let newI = row + x
        let newJ = col + y
        revealEmptyArea(blocks, newI, newJ)
        
    }
}

function renderBoard(blocks, cols){
    const boxes = document.querySelectorAll(".box")
    boxes.forEach((box, i) =>{
        const row = Math.floor(i / cols)
        const col = i % cols
        const block = blocks[row][col]

        box.textContent = "";
        box.classList.remove("pressed");

        if(block.isFlagged && !block.isPressed){
            box.textContent = "🚩"
            return;
        }

        if (!block.isPressed) return

        box.classList.add("pressed")

        if (block.isBomb) {
            box.textContent = "💣"
        } else if (block.bombsNearby > 0) {
            box.textContent = block.bombsNearby
        }
    })
}

function createBoard(rows, cols){
    const container = document.getElementById("container")
    container.innerHTML = ""
    container.style.gridTemplateColumns = `repeat(${cols}, 25px)`
    container.style.gridTemplateRows = `repeat(${rows}, 25px)`
    for(let i = 1; i <= rows * cols; i++){
        let block = document.createElement("div")
        block.classList.add("box")
        container.appendChild(block)
        
    }
}

let buttons = document.querySelectorAll(".difficulty")
buttons[0].addEventListener("click", () => startGame(9, 9, 10))
buttons[1].addEventListener("click", () => startGame(16, 16, 40))
buttons[2].addEventListener("click", () => startGame(16, 30, 99))


let blocks = []
let gameOver = false
let gameSettings = {}
const restart = document.getElementById("face")
const container = document.getElementById("container")
function startGame(rows, cols, bombs){
    blocks = []
    restart.style.backgroundImage = `url(data/alive.png)`
    createBoard(rows, cols)
    restart.classList.remove("hidden")
    container.classList.remove("hidden")
    gameSettings = {rows: rows, cols: cols, bombs: bombs, visibleBlocks: 0}

    gameOver = false

    const oldMsg1 = document.getElementById("GameOverMessage")
    if (oldMsg1) 
        oldMsg1.remove()
    
    const oldMsg2 = document.getElementById("WinMessage")
    if(oldMsg2)
        oldMsg2.remove()


    for (let i = 0; i < rows; i++) {
        blocks[i] = [] 
        for (let j = 0; j < cols; j++) {
            blocks[i][j] = new Block(false, 0, false, false)
        }
    }

    let nrBombs = 0
    while(nrBombs < bombs){
        let number1 = Math.floor(Math.random() * rows)
        let number2 = Math.floor(Math.random() * cols)
        if(!blocks[number1][number2].isBomb){
            blocks[number1][number2].isBomb = true
            nrBombs++
        }
    }

    calculateBombsNearby(blocks)

    const boxes = document.querySelectorAll(".box")
    boxes.forEach((box, i) =>{
        box.textContent = ""
        box.classList.remove("pressed")
        const row = Math.floor(i / cols)
        const col = i % cols
        box.onclick = () => {
            if(gameOver)
                return
            const block = blocks[row][col]
            if(!block.isFlagged){
                if(block.isBomb){
                    block.isPressed = true
                    if(!gameOver){
                        const newDiv = document.createElement("h2")
                        newDiv.id = "GameOverMessage"
                        const text = document.createTextNode("Game Over! Good luck next time!")
                        document.querySelector("body").appendChild(newDiv)
                        newDiv.appendChild(text)
                        restart.style.backgroundImage = `url(data/dead.jpg)`
                        gameOver = true
                    }
                    renderBoard(blocks, cols)
                }
                else
                    if(block.bombsNearby != 0){
                        block.isPressed = true
                        gameSettings.visibleBlocks++
                        renderBoard(blocks, cols)
                    }
                    else{
                        revealEmptyArea(blocks, row, col)
                        renderBoard(blocks, cols)
                    }
            }
            if (gameSettings.visibleBlocks === rows * cols - gameSettings.bombs) {
            gameOver = true
            const oldWin = document.getElementById("WinMessage")
            const win = document.createElement("h2")
            win.id = "WinMessage"
            win.textContent = "Congratulations! You won!"
            document.body.appendChild(win)
            restart.style.backgroundImage = `url(data/win.png)`
            return
            
    }
        }
        box.oncontextmenu = (e) =>{
            e.preventDefault();

            if (gameOver) 
                return;

            const block = blocks[row][col];
            if (block.isPressed) return;

            block.isFlagged = !block.isFlagged;
            renderBoard(blocks, cols);
        }
    })
    renderBoard(blocks, cols)
}


restart.addEventListener("click", () =>{
    const oldMsg = document.getElementById("GameOverMessage")
    if(oldMsg)
        oldMsg.remove()
    gameOver = false
    startGame(gameSettings.rows, gameSettings.cols, gameSettings.bombs)
})