
//set variables

var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
//array of arrays show the winning combonation

const cells = document.querySelectorAll('.cell');
//cells store a reference of each cell

startGame();  //run the function at the beginning 

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	//create array from 0 to 9

	for (var i = 0; i < cells.length; i++) {  //remove all "x" and "o" from the board
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false); //called every time click on the cells
	}
}

function turnClick(square) {    //called every time click on the cells

	if (typeof origBoard[square.target.id] == 'number') { //nobody play in the spot
		turn(square.target.id, huPlayer)   //human player doing the turn

		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
		// not all the square are full
	}
}

function turn(squareId, player) {

	origBoard[squareId] = player;   // set the board array at the id we clicked to player
	//show the player who took a turn on this spot 

	document.getElementById(squareId).innerText = player; //update the display so we see where just clicked

	let gameWon = checkWin(origBoard, player) //when turn is taken check if the game has been won 
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>   // find the places on the board that already been played in
		(e === player) ? a.concat(i) : a, []); // a is the value that we get back in the end , e is the elemnt in the array, i is index
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =   //highlight the winning squers 
			gameWon.player == huPlayer ? "blue" : "red";
	}

	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");

}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number'); //filter every element on origBoard 
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;   //find spot to aiPlayer
}

function checkTie() {
	if (emptySquares().length == 0) {  //every square is filled up and nobody 
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}


function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}