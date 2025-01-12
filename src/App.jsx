import { useState } from 'react'
import { languages } from './language'
import clsx from 'clsx'
import { getFarewellText } from './farwell'
import { chooseWords } from './farwell'
import Confetti from 'react-confetti'

function App() {

  const [currentWord, setCurrentWord] = useState(()=>chooseWords())
  const [guess, setGuess]= useState([])
  let wrongGuessCount= guess.filter(letter => !currentWord.includes(letter)).length

  const word = currentWord.split("")
  const isGameWon = currentWord.split("").every(letter => guess.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver=isGameLost || isGameWon
  const lastGuessedLetter = guess[guess.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  const letter= word.map((eachLetter, index)=>{
    const isGuessed = guess.includes(eachLetter)

    const eachLetterClass= clsx('each-letter', isGameLost && !guess.includes(eachLetter) && "non-guessed")

    return <span className={eachLetterClass} key={index}>
            {isGuessed ? eachLetter.toUpperCase() : isGameLost?eachLetter.toUpperCase():null }
        </span>
  })
 
 function handleGuess(clickLetter){
      setGuess(prevLetters => prevLetters.includes(clickLetter) ? prevLetters : [...prevLetters, clickLetter])
    }

  const individualLanguage = languages.map((each, index)=>{
    const style ={backgroundColor:each.backgroundColor, color:each.color } 
    const isLanguageLost =index < wrongGuessCount
    return <div className= {clsx('chips',isLanguageLost && "lost")} style={style} key={each.name}>
      {each.name}
    </div>
  })

  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const eachAlphabet = alphabet.split("")

  const disabledStatus= isGameOver? true:false

  const individualAlphabet= eachAlphabet.map((alpha, index)=>{
      const isGuessed = guess.includes(alpha)
      const isCorrect = isGuessed && currentWord.includes(alpha)
      const isWrong = isGuessed && !currentWord.includes(alpha)
      
    return <button disabled={disabledStatus} onClick={()=>{handleGuess(alpha)}} className={clsx("eachAlpha",{ correct: isCorrect, notCorrect: isWrong})} key={index}>{alpha.toUpperCase()}</button>
  })

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
        return (
            <p 
                className="farewell-message"
            >
                {getFarewellText(languages[wrongGuessCount - 1].name)}
            </p>
        )
    }

    if (isGameWon) {
        return (
            <>
                <h2>You win!</h2>
                <p>Well done! 🎉</p>
            </>
        )
    } 
    if (isGameLost) {
        return (
            <>
                <h2>Game over!</h2>
                <p>You lose! Better start learning Assembly 😭</p>
            </>
        )
    }
    
    return null
}
  const gameStatusClass = clsx("status-section", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
})
function startNewGame() {
  setCurrentWord(chooseWords())
  setGuess([])
}
  return (
    <main>
      {isGameWon && <Confetti
      recycle={false}
      numberOfPieces={2000}
      />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <div className={gameStatusClass}>
        {renderGameStatus()}
      </div>
       
      <div className='language-container'>{individualLanguage}</div>
      <div className='letters-case'>{letter}</div>
      <div className='alpha-case'>{individualAlphabet}</div>
      {isGameOver? <button onClick={()=>startNewGame()} className="new-game">New Game</button>:null}
    </main>
  )
}

export default App