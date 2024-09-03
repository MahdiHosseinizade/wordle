import React, { useState, useEffect } from 'react';
import './App.css';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

const targetWord = "PHONE";
const maxGuesses = 6;
const wordLength = 5;

const App: React.FC = () => {
    const [guesses, setGuesses] = useState<string[]>(Array(maxGuesses).fill(''));
    const [submittedGuesses, setSubmittedGuesses] = useState<boolean[]>(Array(maxGuesses).fill(false));
    const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        updateCurrentGuessInList();
    }, [currentGuess]);

    const updateCurrentGuessInList = () => {
        const updatedGuesses = [...guesses];
        updatedGuesses[currentGuessIndex] = currentGuess;
        setGuesses(updatedGuesses);
    };

    const handleKeyPress = (key: string) => {
        if (key === 'Enter') {
            submitGuess();
        } else if (key === 'Delete') {
            deleteLastCharacter();
        } else if (isLetter(key) && currentGuess.length < wordLength) {
            addCharacter(key);
        }
    };

    const submitGuess = () => {
        if (currentGuess.length < wordLength) {
            toast.error('Not enough letters');
            return;
        }

        if (!containsValidLetter(currentGuess)) {
            toast.error('Not in word list');
            return;
        }

        if (currentGuess === targetWord) {
            showModal();
            markGuessAsSubmitted();
            return;
        }

        if (currentGuess.length === wordLength && currentGuessIndex < maxGuesses) {
            markGuessAsSubmitted();
            moveToNextGuess();
        }
    };

    const containsValidLetter = (guess: string) => {
        return guess.split('').some(char => targetWord.includes(char));
    };

    const markGuessAsSubmitted = () => {
        setSubmittedGuesses(prev => {
            const newSubmittedGuesses = [...prev];
            newSubmittedGuesses[currentGuessIndex] = true;
            return newSubmittedGuesses;
        });
    };

    const moveToNextGuess = () => {
        setCurrentGuessIndex(prev => prev + 1);
        setCurrentGuess('');
    };

    const deleteLastCharacter = () => {
        setCurrentGuess(prev => prev.slice(0, -1));
    };

    const addCharacter = (char: string) => {
        setCurrentGuess(prev => prev + char);
    };

    const isLetter = (char: string) => /^[A-Z]$/.test(char);

    const showModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setIsModalOpen(false);
        resetGame();
    };

    const resetGame = () => {
        setGuesses(Array(maxGuesses).fill(''));
        setSubmittedGuesses(Array(maxGuesses).fill(false));
        setCurrentGuessIndex(0);
        setCurrentGuess('');
    };

    const renderCell = (guess: string, colIndex: number, isSubmitted: boolean) => {
        const guessChar = guess[colIndex];
        const targetChar = targetWord[colIndex];
        const cellColor = getCellColor(guessChar, targetChar, isSubmitted);

        return (
            <td key={colIndex} className={cellColor}>
                {guessChar || ''}
            </td>
        );
    };

    const getCellColor = (guessChar: string, targetChar: string, isSubmitted: boolean) => {
        if (!isSubmitted) return '';

        if (guessChar === targetChar) return 'green';
        if (targetWord.includes(guessChar)) return 'yellow';
        return 'gray';
    };

    const renderKeyboard = () => {
        const keys = [
            'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
            'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
            'Z', 'X', 'C', 'V', 'B', 'N', 'M'
        ];

        return (
            <div className="keyboard">
                {renderKeyboardRow(keys.slice(0, 10))}
                {renderKeyboardRow(keys.slice(10, 19))}
                {renderKeyboardRow(keys.slice(19))}
                <div className="keyboard-row">
                    <button onClick={() => handleKeyPress('Enter')}>Enter</button>
                    <button onClick={() => handleKeyPress('Delete')}>Delete</button>
                </div>
            </div>
        );
    };

    const renderKeyboardRow = (keys: string[]) => (
        <div className="keyboard-row">
            {keys.map(key => (
                <button key={key} onClick={() => handleKeyPress(key)}>{key}</button>
            ))}
        </div>
    );

    return (
        <div className="App">
            <table>
                <tbody>
                    {guesses.map((guess, rowIndex) => (
                        <tr key={rowIndex}>
                            {[...Array(wordLength)].map((_, colIndex) => renderCell(guess, colIndex, submittedGuesses[rowIndex]))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {renderKeyboard()}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="Modal"
                overlayClassName="Overlay"
            >
                <h2>Congratulations!</h2>
                <p>You guessed the word correctly!</p>
                <button onClick={closeModal}>Play Again</button>
            </Modal>
        </div>
    );
};

export default App;
