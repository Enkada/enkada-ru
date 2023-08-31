import React, { useEffect, useRef, useState } from 'react';

function generateInitialState(numKeys) {
	const initialState = {};
	for (let i = 1; i <= numKeys; i++) {
		initialState[i] = [];
	}
	return initialState;
}

function generateInitialAssumedSequenceState(numKeys) {
	const initialState = {};
	for (let i = 0; i < numKeys; i++) {
		initialState[i] = null;
	}
	return initialState;
}

export const SequenceGamePage = () => {
	const [numberLength, setNumberLength] = useState(0);

	const [inputValue, setInputValue] = useState(Array.from({ length: numberLength }, (_, i) => (i + 1).toString()).join(''));
	const [statusMessage, setStatusMessage] = useState('');
	const [guessHistory, setGuessHistory] = useState([]);
	const [incorrectPositions, setIncorrectPositions] = useState(generateInitialState(numberLength));
	const [secretNumber, setSecretNumber] = useState("");
	const [isGuessed, setIsGuessed] = useState(false);
	const [assumedSequence, setAssumedSequence] = useState(generateInitialAssumedSequenceState(numberLength));

	const handleChange = (event) => {
		const newValue = event.target.value;

		// Validate the input
		if (new RegExp('^[1-' + numberLength + ']*$').test(newValue) && !/(.).*?\1/.test(newValue)) {
			setInputValue(newValue);
		}
	};

	

	const addToIncorrectPositions = (key, value) => {
		setIncorrectPositions(prevState => ({
			...prevState,
			[key]: [...prevState[key], value]
		}));
	};

	function generateRandomSequence(length) {		
		const availableNumbers = Array.from({ length: length }, (_, index) => (index + 1).toString());
		let sequence = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * availableNumbers.length);
			const randomDigit = availableNumbers.splice(randomIndex, 1)[0];
			sequence += randomDigit;
		}

		console.clear();
		console.log(sequence);
		return sequence;
	}

	const handleRestartClick = () => {
		setSecretNumber(generateRandomSequence(numberLength));
		setStatusMessage('');
		setIncorrectPositions(generateInitialState(numberLength));
		setInputValue(Array.from({ length: numberLength }, (_, i) => (i + 1).toString()).join(''));
		setGuessHistory([]);
		setIsGuessed(false);
		setAssumedSequence(generateInitialAssumedSequenceState(numberLength));
	}

	const handleCheckClick = (inputValue = inputValue) => {

		if (inputValue.length !== numberLength) {
			setStatusMessage(`Please enter a ${numberLength}-digit sequence.`);
			return;
		}

		let correctCount = 0;
		for (let i = 0; i < numberLength; i++) {
			if (inputValue[i] === secretNumber[i]) {
				correctCount++;
			}
		}

		if (correctCount == 0) {
			for (let i = 0; i < numberLength; i++) {
				addToIncorrectPositions(inputValue[i], i)
			}
		}

		if (correctCount == numberLength) {
			setIsGuessed(true);
			setStatusMessage(`Solved in ${guessHistory.length} guesses`);
		}
		else {
			setStatusMessage(`${correctCount} number(s) in correct position`);
		}

		
		setInputValue("");
		setGuessHistory([...guessHistory, { input: inputValue, correct: correctCount }]);
	};

	const getLogs = () => {
		let logs = [];

		// for (var i = 0; i < 5; i++) {
		// 	(function(i) {
		// 		logs.push(<span key={i} onClick={() => console.log(i)}>{i}</span>);
		// 	})(i);
		// }

		guessHistory.forEach((guess, index) => {
			let numberValue = [<strike key={-1}>{n}</strike>];


			for (var i = 0; i < guess.input.length; i++) {
				var n = guess.input[i];

				if (incorrectPositions[n].includes(i)) {
					numberValue.push(<strike key={i}>{n}</strike>);
				}
				else {
					(function (number, index) {
						const isAssumed = assumedSequence[index] == number;
						const isAssumedOut = assumedSequence[index] && assumedSequence[index] != number || Object.keys(assumedSequence).some(key => assumedSequence[key] == number);

						let isLog = false;

						// Count assummed
						let assumed = 0;

						for (var j = 0; j < guess.input.length; j++) {

							if (assumedSequence[j] == guess.input[j]) {
								assumed++;
							}
						}

						if (guess.correct != 0 && assumed == guess.correct) {
							if (assumedSequence[index] != guess.input[index]) {
								isLog = true;
							}
						}


						numberValue.push(<span
							key={index}
							className={`${isLog ? "logged-out" : ""} ${isAssumed ? "assumed" : isAssumedOut ? "assumed-out" : ""}`}
							onClick={!isLog ? () => assumeNumberAtPosition(number, index) : null}
						>{number}</span>);
					})(n, i);
				}
			}

			logs.push(<div className='sequence__log__row' key={index}>
				<div className="sequence__log__row__number">
					{numberValue}
				</div>
				<div className="sequence__log__row__correct">
					{guess.correct}
				</div>
			</div>);
		});

		return logs;
	}

	const assumeNumberAtPosition = (number, index) => {
		setAssumedSequence({ ...assumedSequence, [index]: number });
	}

	const getGrid = () => {
		let grid = []
		for (let index = 0; index < numberLength; index++) {
			let col = [];

			for (let number = 1; number <= numberLength; number++) {

				if (incorrectPositions[number].includes(index)) {
					col.push(<strike key={number}>{number}</strike>);
				}
				else {
					const isAssumed = assumedSequence[index] == number;
					const isAssumedOut = assumedSequence[index] && assumedSequence[index] != number || Object.keys(assumedSequence).some(key => assumedSequence[key] == number);

					let isLog = false;

					guessHistory.forEach((guess) => {
						// Count assummed
						let assumed = 0;

						for (var i = 0; i < guess.input.length; i++) {
							if (assumedSequence[i] == guess.input[i]) {
								assumed++;
							}
						}

						if (guess.correct != 0 && assumed == guess.correct) {
							if (number == guess.input[index] && assumedSequence[index] != guess.input[index]) {
								isLog = true;
							}
						}
					});

					col.push(<span
						key={number}
						className={`${isLog ? "logged-out" : ""} ${isAssumed ? "assumed" : isAssumedOut ? "assumed-out" : ""}`}
						onMouseDown={!(isAssumedOut || isLog) ? (e) => {
							if (e.button === 0) {
								assumeNumberAtPosition(number, index);
							}
						} : null}
						onContextMenu={(e) => {
							e.preventDefault()
							assumeNumberAtPosition(null, index);
						}}
					>{number}</span>);
				}

			}

			grid.push(<div key={index} className='sequence__grid__col'>{col}</div>);
		}

		return grid;
	}

	const handleCheckAssumption = () => {
		let number = "";
		for (let index = 0; index < numberLength; index++) {
			number += assumedSequence[index];
		}

		handleCheckClick(number);
		setAssumedSequence(generateInitialAssumedSequenceState(numberLength));
	}

	const factorial = n => (n === 0 || n === 1) ? 1 : n * factorial(n - 1);

	const calculateVariants = () => {
		const prem = generatePermutations(numberLength).filter(x => !guessHistory.map(x => x.input).includes(x));

		return filterCombinationsByIncorrectPositions(prem).length;
	}

	function generatePermutations(X) {
		const numbers = Array.from({ length: X }, (_, i) => (i + 1).toString());
		const permutations = [];

		function backtrack(currentPermutation) {
			if (currentPermutation.length === X) {
				permutations.push(currentPermutation.join(""));
				return;
			}

			for (const num of numbers) {
				if (!currentPermutation.includes(num)) {
					currentPermutation.push(num);
					backtrack([...currentPermutation]);
					currentPermutation.pop();
				}
			}
		}

		backtrack([]);
		return permutations;
	}

	function filterCombinationsByIncorrectPositions(combinations) {
		return combinations.filter(combination => {
			for (const num in incorrectPositions) {
				if (incorrectPositions[num].includes(combination.indexOf(num))) {
					return false;
				}
			}
			return true;
		});
	}

	
	const [numberLengthInput, setNumberLengthInput] = useState(4);

	if (numberLength == 0) {
		return (
			<div className="sequence">
				<input
					className="sequence__input"
					type="number"
					value={numberLengthInput}
					onChange={(e) => {
						const inputValue = e.target.value;
						if (/^[2-9]$/.test(inputValue)) {
							setNumberLengthInput(Number(inputValue));
						}
					}}
				/>
				<button onClick={() => {
					setNumberLength(numberLengthInput);

					setSecretNumber(generateRandomSequence(numberLengthInput));
					setStatusMessage('');
					setIncorrectPositions(generateInitialState(numberLengthInput));
					setInputValue(Array.from({ length: numberLengthInput }, (_, i) => (i + 1).toString()).join(''));
					setGuessHistory([]);
					setIsGuessed(false);
					setAssumedSequence(generateInitialAssumedSequenceState(numberLengthInput));
				}}>Start</button>
				<div className="sequence__status">Input Sequence Length</div>
			</div>
		);
	}

	return (
		<div className='sequence'>
			<input
				className="sequence__input"
				type="text"
				value={inputValue}
				onChange={handleChange}
			/>
			{
				isGuessed
					? <button onClick={handleRestartClick}>Restart</button>
					: <>
						<button onClick={() => handleCheckClick(inputValue)}>Check</button>
						<button onClick={() => {
							handleCheckClick(generateRandomSequence(numberLength));
						}}>Random</button>
					</>
			}
			<div className="sequence__status">{statusMessage} ({calculateVariants()})</div>
			<div className="sequence__log">
				{getLogs()}
			</div>
			<div className="sequence__grid">
				{getGrid()}
			</div>
			{!!(!isGuessed && Object.keys(assumedSequence).some(key => assumedSequence[key] != null)) && <button onClick={() => setAssumedSequence(generateInitialAssumedSequenceState(numberLength))}>Clear Assumption</button>}
			{!!(!Object.keys(assumedSequence).some(key => assumedSequence[key] == null)) && <button onClick={() => handleCheckAssumption()}>Check Assumption</button>}
		</div>
	);
}
