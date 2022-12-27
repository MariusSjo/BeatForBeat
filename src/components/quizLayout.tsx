import React, { useState } from 'react';
import './quizLayout.css';
import Teamcomponent from './teamcomponent';


function QuizLayout() {
	const [words, setWords] = useState(['Han', 'lever', 'livet', 'i', 'baris'])
	const [counter, setCounter] = useState(0)
	const teams = ['nagell', 'gisle']
	const audio = new Audio(require('./wrong.mp3'));
	
	function shuffle(array: Array<number>) {
		let ci = array.length,
			ri;
		while (ci !== 0) {
			ri = Math.floor(Math.random() * ci);
			ci--;
			[array[ci], array[ri]] = [array[ri], array[ci]];
		}
		return array;
	}

	let currentcolors = shuffle([0, 0, 1, 1, 0]);
	const songs = [
		['Chiketita', 'tell', 'me', 'whats', 'wrong'], ['Some', 'say', 'love', 'it', 'is']
	];

	function handleClick(id: number) {
		const box: HTMLElement | null = document.getElementById((id+''));
		if (box !== null) {
			if (currentcolors[id]) {
				box.style.backgroundColor = 'red';
				audio.play();
			} else {
				box.style.backgroundColor = 'blue';
			}
			box.innerHTML = words[id];
		}
	}

	function next():void {
		currentcolors = shuffle(currentcolors);
		setWords(songs[counter]);
		setCounter(counter + 1)
	}



	return <>
		<div className="boxes">
			{words.map((value, key) => (<p id={key + ''} key={value + ''} onClick={() => handleClick(key)}>{key + 1}</p>))}
		</div>
		<div className='gameArea'>
			<button onClick={() => next()}> Neste sang </button>
			<div className='points'>
				{teams.map((value, key) => (<input className={value} type='number' />))}
			</div>
			<div className='competitors'>
				{teams.map((value, key) => (<Teamcomponent name={value} />))}
			</div>
		</div>
	</>;
}

export default QuizLayout;


