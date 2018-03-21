
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

		turn(square.target.id, huPlayer)   //human player doing the turn
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
}

