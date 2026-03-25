class Block {
    constructor(isBomb, bombsNearby, isPressed) {
        this._isBomb = isBomb
        this._bombsNearby = bombsNearby
        this._isPressed = isPressed
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
                for([x, y] of directions){
                    let newI = i + x
                    let newJ = j + y

                    const isPossible = newI >= 0 && newI < rows && newJ >= 0 && newJ < cols
                    if(isPossible)
                        blocks[newI][newJ].increment() 
                }
            }
    }

}

function showBlocksWithoutBombs(blocks, row, col){
    let rows = blocks.length
    let cols = blocks[0].length
    const isPossible = row >= 0 &&  row < rows && col >= 0 && col < cols
    if(!isPossible)
        return

    const block = blocks[row][col]

    if (block.isBomb || block.isPressed) 
        return

    block.isPressed = true

    if (block.bombsNearby > 0) 
        return

    for([x, y] of directions){
        let newI = row + x
        let newJ = col + y
        showBlocksWithoutBombs(blocks, newI, newJ)
        
    }
}

function renderBoard(blocks){
    const boxes = document.querySelectorAll(".box")
    boxes.forEach((box, i) =>{
        box.textContent = ""
        box.classList.remove("pressed")
        const row = Math.floor(i / 5)
        const col = i % 5
        const block = blocks[row][col]

        if (!block.isPressed) return

        box.classList.add("pressed")

        if (block.isBomb) {
            box.textContent = "💣"
        } else if (block.bombsNearby > 0) {
            box.textContent = block.bombsNearby
        }
    })
}


let blocks = []
let gameOver = false
const restart = document.getElementById("face")
restart.addEventListener("click", () =>{
    for (let i = 0; i < 5; i++) {
        blocks[i] = [] 
        for (let j = 0; j < 5; j++) {
            blocks[i][j] = new Block(false, 0, false)
        }
    }
    let nrBombs = 0
    while(nrBombs < 4){
        let number1 = Math.floor(Math.random() * (5 - 0))
        let number2 = Math.floor(Math.random() * (5 - 0))
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
        const row = Math.floor(i / 5)
        const col = i % 5
        box.onclick = () => {
            const block = blocks[row][col]
            if(block.isBomb){
                block.isPressed = true
                if(!gameOver){
                    const newDiv = document.createElement("h2")
                    const text = document.createTextNode("Game Over! Good luck next time!")
                    document.querySelector("body").appendChild(newDiv)
                    newDiv.appendChild(text)
                    gameOver = true
                }
                renderBoard(blocks)
            
                
            }
            else
                if(block.bombsNearby != 0){
                    block.isPressed = true
                    renderBoard(blocks)
                }
                else{
                    showBlocksWithoutBombs(blocks, row, col)
                    renderBoard(blocks)
                }
        }
    })
})