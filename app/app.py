from flask import Flask, render_template, request, jsonify, session

app = Flask(__name__)
app.secret_key = "supersecretkey"


@app.route("/")
def home():
    # Initialize the board and player
    if "board" not in session:
        session["board"] = [""] * 9
        session["current_player"] = "X"
    return render_template("index.html")


@app.route("/move", methods=["POST"])
def move():
    data = request.json
    index = data["index"]

    # In any case if the board is not initialized
    if "board" not in session:
        session["board"] = [""] * 9
        session["current_player"] = "X"

    board = session["board"]
    current_player = session["current_player"]

    if board[index] == "":
        board[index] = current_player
        current_player = "O" if current_player == "X" else "X"

    session["board"] = board
    session["current_player"] = current_player

    return jsonify(board=board)


@app.route("/reset")
def reset():
    # Reset game state
    session["board"] = [""] * 9
    session["current_player"] = "X"
    return jsonify(board=session["board"])


@app.route("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)