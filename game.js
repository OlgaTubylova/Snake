module.exports = {
    startGameLoop,
    getCurrentState,
    changeDirection,
    joinTheGame
};

function getCurrentState() {
    return {
        x, y, snakes, food, gameOver
    }
}

const x = 30;
const y = 30;
const LEFT = 0, RIGHT = 1, UP = 2, DOWN = 3;

const snakes = [
    // {
    //     segments: [
    //         { x: 5, y: 10 },
    //         { x: 5, y: 9 },
    //         { x: 5, y: 8 }
    //     ],
    //     direction: RIGHT,
    //     symbol: "*",
    //     id:
    // },
    // {
    //     segments: [
    //         { x: 8, y: 8 },
    //         { x: 8, y: 9 },
    //         { x: 8, y: 10 },
    //     ],
    //     direction: LEFT,
    //     symbol: "#",
    //     id:
    // }
]

let food = { x: 2, y: 2 };
let gameOver = false;

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

function updateState() {
    for (let i = 0; i < snakes.length; i++) {
        const newHead = newHeadPosition(snakes[i].segments[0], snakes[i].direction)

        if (newHead.x == food["x"] && newHead.y == food["y"]) {
            food = {
                x: Math.floor(Math.random() * x),
                y: Math.floor(Math.random() * y)
            }

            while (snakes[i].segments.some(segment => segment.x === food.x && segment.y === food.y)) {
                food = {
                    x: Math.floor(Math.random() * x),
                    y: Math.floor(Math.random() * y)
                }
            }
        } else {
            snakes[i].segments.pop()
        }

        if (snakes[i].segments.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            alert("Snake bit itself!")
            gameOver = true
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
        if (snake == null) {
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
    for (let i = 0; i < snakes.length; i++) {
        if (snakes[i].id === userId) {
            return
        }
    }

    snakes.push({
        segments: [
            { x: 5, y: 10 },
            { x: 5, y: 9 },
            { x: 5, y: 8 }
        ],
        direction: RIGHT,
        symbol: "*",
        id: userId
    })
}

function arePointsEqual(point1, point2) {
    return point1.x === point2.x && point1.y === point2.y
}

function startGameLoop() {
    setInterval(() => {
        if (!gameOver) {
            updateState()
        }
    }, 500);
}