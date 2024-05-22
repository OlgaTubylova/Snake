import keyboard
import time
import os
import random


snake = [
    {"row": 5, "col": 8},
    {"row": 5, "col": 9}
]

rows = 10
cols = 10

food: dict[str, int] = {"row": 5, "col": 2}

LEFT = 0
RIGHT = 1
UP = 2
DOWN = 3

direction = LEFT

game_over = False


def update_state():
    global snake
    global food
    global game_over

    if direction == LEFT:
        snake = [{
            "row": snake[0]["row"],
            "col": snake[0]["col"] - 1 if snake[0]["col"] > 0 else cols - 1
        }] + snake
    elif direction == RIGHT:
        snake = [{
            "row": snake[0]["row"],
            "col": (snake[0]["col"] + 1) % cols
        }] + snake
    elif direction == UP:
        snake = [{
            "row": snake[0]["row"] - 1 if snake[0]["row"] > 0 else rows - 1,
            "col": snake[0]["col"]
        }] + snake
    elif direction == DOWN:
        snake = [{
            "row": (snake[0]["row"] + 1) % rows,
            "col": snake[0]["col"]
        }] + snake

    if snake[0]["row"] == food["row"] and snake[0]["col"] == food["col"]:
        food = {
            "row": random.randrange(0, rows, 1),
            "col": random.randrange(0, cols, 1)
        }

        while contains(snake, food["row"], food["col"]):
            food = {
                "row": random.randrange(0, rows, 1),
                "col": random.randrange(0, cols, 1)
            }
    else:
        snake.pop()

    if contains(snake[1:], snake[0]["row"], snake[0]["col"]):
        print("Snake bit itself!")
        game_over = True


def contains(array, row, col):
    for point in array:
        if point["row"] == row and point["col"] == col:
            return True
    return False


def render():
    os.system('clear')
    global snake
    global food

    for row in range(rows):
        print("| ", end="")

        for col in range(cols):
            if food["row"] == row and food["col"] == col:
                print("@ ", end="")
            elif contains(snake, row, col):
                print("* ", end="")
            else:
                print("  ", end="")

        print("|")


def on_key_event(e):
    global direction

    if e.name == 'left' and direction != RIGHT:
        direction = LEFT

    if e.name == 'right' and direction != LEFT:
        direction = RIGHT

    if e.name == 'up' and direction != DOWN:
        direction = UP

    if e.name == 'down' and direction != UP:
        direction = DOWN


keyboard.hook(on_key_event)

try:
    while not game_over:
        time.sleep(0.5)
        update_state()
        render()

finally:
    keyboard.unhook_all()
