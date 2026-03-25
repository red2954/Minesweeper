class Block {
    constructor(isBomb = false, bombsNearby = 0, isPressed = false) {
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

function calculateBombsNearby(board) {
    const rows = board.length
    const cols = board[0].length

    const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1],          [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1]
]

    // reset counts
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            board[row][col].bombsNearby = 0
        }
    }

    // for each bomb, increment its neighbors
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!board[row][col].isBomb) continue

            for (const [dr, dc] of directions) {
                const newRow = row + dr
                const newCol = col + dc

                const isInsideBoard =
                    newRow >= 0 &&
                    newRow < rows &&
                    newCol >= 0 &&
                    newCol < cols

                if (isInsideBoard && !board[newRow][newCol].isBomb) {
                    board[newRow][newCol].increment()
                }
            }
        }
    }
}


let blocks = []
const restart = document.getElementById("face")
restart.addEventListener("click", () =>{
    for (let i = 0; i < 5; i++) {
        blocks[i] = [] 
        for (let j = 0; j < 5; j++) {
            blocks[i][j] = new Block(false, 0, false)
    }
}
    let nrBombs = 0
    while(nrBombs < 8){
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
        const row = Math.floor(i / 5)
        const col = i % 5
        box.onclick = () => {
            const block = blocks[row][col]
            if(block.isBomb)
                box.textContent = "💣"
            else
                box.textContent = block._bombsNearby
        }
    })
})