module.exports = {
    startGameLoop,
    getCurrentState,
    changeDirection,
    joinTheGame
};

function getCurrentState() {
    return {
        x, y, snakes, food
    }
}

const GAME_SPEED = 300;
const x = 30;
const y = 30;
const LEFT = 0, RIGHT = 1, UP = 2, DOWN = 3;

const snakes = []

let food = { x: 2, y: 2, symbol: randomFoodSymbol() };

function newHeadPosition(curentHead, direction) {
    if (direction === LEFT) {
        return {
            x: curentHead["x"],
            y: curentHead["y"] > 0 ? curentHead["y"] - 1 : y - 1
        }
    }

    if (direction === RIGHT) {
        return {
            x: curentHead["x"],
            y: (curentHead["y"] + 1) % y
        }
    }

    if (direction === UP) {
        return {
            x: (curentHead["x"] > 0) ? curentHead["x"] - 1 : x - 1,
            y: curentHead["y"]
        }
    }

    if (direction === DOWN) {
        return {
            x: (curentHead["x"] + 1) % x,
            y: curentHead["y"]
        }
    }
}

function regenerateFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * x),
            y: Math.floor(Math.random() * y),
            symbol: randomFoodSymbol()
        }

        let isFoodOnSnake = false;
        for (let i = 0; i < snakes.length; i++) {
            if (snakes[i].segments.some(segment => segment.x === food.x && segment.y === food.y)) {
                isFoodOnSnake = true;
                break;
            }
        }

        if (!isFoodOnSnake) {
            break;
        }
    }
}

function updateState() {
    for (let i = 0; i < snakes.length; i++) {

        if (snakes[i].gameOver) {
            continue
        }

        const newHead = newHeadPosition(snakes[i].segments[0], snakes[i].direction)

        if (newHead.x == food["x"] && newHead.y == food["y"]) {
            regenerateFood()
        } else {
            snakes[i].segments.pop()
        }

        if (snakes[i].segments.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            snakes[i].gameOver = true
        }

        for (let j = 0; j < snakes.length; j++) {
            if (snakes[j].gameOver) {
                continue;
            }

            if (i !== j && snakes[j].segments.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                snakes[i].gameOver = true;
            }
        }

        snakes[i].segments = [newHead, ...snakes[i].segments]
    }
}

function changeDirection(direction, userId) {
    const directionMap = {
        "LEFT": LEFT,
        "RIGHT": RIGHT,
        "UP": UP,
        "DOWN": DOWN
    };

    if (directionMap[direction] !== undefined) {
        const snake = snakes.find(snake => snake.id === userId);
        if (snake == null || snake.gameOver) {
            return
        }

        const nextHead = newHeadPosition(snake.segments[0], directionMap[direction])

        // Prevent snake from going in the opposite direction
        if (!arePointsEqual(nextHead, snake.segments[1])) {
            snake.direction = directionMap[direction]
        }
    }
}

function joinTheGame(userId) {
    const snake = snakes.find(snake => snake.id === userId)

    if (snake != null && !snake.gameOver) {
        return;
    }

    if (snake != null && snake.gameOver) {
        snake.segments = [
            { x: 5, y: 10 },
            { x: 5, y: 9 },
            { x: 5, y: 8 },
            { x: 5, y: 7 },
            { x: 5, y: 6 },
            { x: 5, y: 5 }
        ]
        snake.direction = RIGHT
        snake.gameOver = false
        return;
    }

    snakes.push({
        segments: [
            { x: 5, y: 10 },
            { x: 5, y: 9 },
            { x: 5, y: 8 },
            { x: 5, y: 7 },
            { x: 5, y: 6 },
            { x: 5, y: 5 }
        ],
        direction: RIGHT,
        symbol: randomSymbol(),
        id: userId,
        gameOver: false
    })
}



function randomSymbol() {
    const symbols = ["🟨", "🟩", "🟦", "🟥", "🟧", "🟪", "🟫", "💟"];
    let randomIndex = Math.floor(Math.random() * symbols.length)
    let result = symbols[randomIndex]
    return result;
}

function randomFoodSymbol() {
    const symbols = ["🐝", "🐭", "🍄", "🍒", "🎃", "🍓", "🍋", "🐙", "🌼"];
    let randomIndex = Math.floor(Math.random() * symbols.length)
    let result = symbols[randomIndex]
    return result;
}

function arePointsEqual(point1, point2) {
    return point1.x === point2.x && point1.y === point2.y
}

function startGameLoop() {
    setInterval(() => {
        updateState()
    }, GAME_SPEED);
}