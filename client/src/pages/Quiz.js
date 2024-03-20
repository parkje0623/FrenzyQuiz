import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext, UserContext, QuizContext } from '../App';
import apiUrl from "../api-config";
import Timer from './Timer';
import Leaderboard from './Leaderboard';


const Quiz = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    // const [question, setQuestion] = useState([]);
    const [creator,  setCreator] = useState(false);
    const [timer, setTimer] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const { user } = useContext(UserContext);
    const params = useParams();
    const navigate = useNavigate();
    const { id } = useParams();
    const socket = useContext(SocketContext)
    const {currentQuestion, setCurrentQuestion} = useContext(QuizContext)
    const [showLeaderboard, setShowLeaderboard] = useState(false)
    const [showAnswer, setShowAnswer] = useState(false)
    const [leaderboardData, setLeaderboardData] = useState("unknown")
    const [currentAnswer, setCurrentAnswer] = useState(null);
    const [showStat, setShowStat] = useState(false)
    const [rank, setRank] = useState(0)
    const [mean, setMean] = useState(0)

    const [shortAnswer, setShortAnswer] = useState('');

    const handleOptionClick = (option) => {
        console.log("Just selected an option: ", option)
        setSelectedOption(option);
    };

    const goToNextQuestion = () => {
        socket.emit('next_question', {quizid: Number(id)})
    }

    

    const exitQuiz = () => {
        if (creator){
            socket.emit('delete_room', { email: user.email, quizId: Number(id) })
            navigate(`/`)
            
        }
        else {
            socket.emit('leave_room', { email: user.email, quizId: Number(id) })
            navigate(`/`)

        }
    }

    useEffect(() => {
        console.log("check creator change: ", creator)
    }, [creator])

    useEffect(() => {
       
        if (socket) {
            console.log("check currentQuestion in Quiz.js: ", currentQuestion)
            if (currentQuestion.qnum === 0){
                console.log("first timer here, check creator: ", currentQuestion.uid === user.uid)
                setTimer(currentQuestion.sec * 1000)
                setCreator(currentQuestion.uid === user.uid)
            }

            
            const handleNextQuestion = (data) => {
              console.log("next quesion arrived in QUiz.js:", data)
              setCurrentQuestion(data)
              setShowAnswer(false)
              setShowLeaderboard(false)
              setTimer(data.sec*1000)
              setSubmitted(false)
              
            };

            const handleShowAnswer = (data) => {
                console.log("show correct answer: ", data)
                if (!creator){
                    // todo add leaderboardData here
                    setCurrentAnswer(data)
                    setShowAnswer(true)

                }
            }

            const handleShowLeaderboard = (data) => {
                console.log("show leaderboard:", data)
                if (creator){
                    setLeaderboardData(data)
                    setShowLeaderboard(true)
                } else {
                    setLeaderboardData(data)
                }
            }

            const handleShowStat = (data) => {
                // calculate mean
                setShowAnswer(false)
                setShowLeaderboard(false)
                const totalScore = Object.values(leaderboardData).reduce((total, user) => total + user.score, 0);
                const meanScore = totalScore / Object.keys(leaderboardData).length;
                console.log('Mean Score:', meanScore);
                setMean(meanScore)
                // calculate  user's rank
                // const sortedLeaderboardData = Object.entries(leaderboardData).sort((a, b) => b[1].score - a[1].score);
                // const userPosition = sortedLeaderboardData.findIndex(entry => {
                //     console.log("Current entry's email:", entry[0]);
                //     return entry[0] === user.email;
                // });
                // console.log(sortedLeaderboardData)
                // setRank(userPosition + 1)
                // console.log("User position is", userPosition)
                // setShowStat(true)
                const sortedLeaderboardData = Object.entries(leaderboardData).sort((a, b) => b[1].score - a[1].score);
                const userScore = leaderboardData[user.email]?.score;
                let userRank = sortedLeaderboardData.findIndex(entry => entry[1].score === userScore) + 1;
                console.log("User rank is", userRank);
                setRank(userRank);
                setShowStat(true);
            }

            const handleCrazyTest = (data) => {
                console.log("show crazy test", data)
            }



            socket.on("next_question", handleNextQuestion);
            socket.on("show_answer", handleShowAnswer);
            socket.on("show_leaderboard", handleShowLeaderboard);
            socket.on("show_stat", handleShowStat);
            socket.on("crazy_test", handleCrazyTest);
            

            return () => {
              socket.off('next_question', handleNextQuestion);
              socket.off('show_answer', handleShowAnswer);
              socket.off('show_leaderboard', handleShowLeaderboard);
              socket.off('show_stat', handleShowStat)
              socket.off('crazy_test', handleCrazyTest);
              console.log("Called")
            };
          }
    },[socket, id, creator, currentQuestion, user.uid, setCurrentQuestion, leaderboardData, user.email])


    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }

        setSubmitted(true);
        var target = event ? event.target : null;
        var input;
        if (currentQuestion.type === 'tf') {
            input = { 
                quizid: Number(currentQuestion.quizid), 
                uid: user.uid, email: user.email, 
                fname: user.fname, 
                type: currentQuestion.type, 
                submitted: selectedOption, 
                correct: selectedOption === currentQuestion.answer ? true : false, 
                score: selectedOption === currentQuestion.answer ? currentQuestion.points : 0,
                points: currentQuestion.points
            };
        } else if (currentQuestion.type === 'multiple') {
            input = { 
                quizid: Number(currentQuestion.quizid), 
                uid: user.uid,  
                email: user.email, 
                fname: user.fname, 
                type: currentQuestion.type, 
                submitted: selectedOption, 
                correct: selectedOption === currentQuestion.answer ? true : false, 
                score: selectedOption === currentQuestion.answer ? currentQuestion.points : 0,
                points: currentQuestion.points
            };
        }  else if (currentQuestion.type === 'short') {
            input = { 
              quizid: Number(currentQuestion.quizid), 
              uid: user.uid,  
              email: user.email, 
              fname: user.fname, 
              type: currentQuestion.type, 
              submitted: shortAnswer, 
              correct: shortAnswer.toLowerCase() === (currentQuestion.answer).toLowerCase(), 
              score: shortAnswer.toLowerCase() === (currentQuestion.answer).toLowerCase() ? currentQuestion.points : 0,
              points: currentQuestion.points
            }; 
        }
        var data = JSON.stringify(input);

        console.log("Are about to submit: ", data, " Option: ", selectedOption)
        socket.emit("submit", input) 

        try {
            await fetch(`${apiUrl}/quiz/${params.id}/question/${currentQuestion.id}/submitAnswer`, {
                method: "POST",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
                body: data,
            });
            console.log("Submitted Data: ", data);
        } catch (err) {
            console.error(err);
            console.log("Error Submitting question answer");
        }
    };

    const handleTimerTimeout = () => {
        if (!submitted && creator === false) {
            console.log("About to submit")
            handleSubmit();

        }
    };

    const box = {
        width: "300px",
        border: "1px solid black",
        padding: "50px",
        margin: "auto",
    };
    return (
        <div className='app'>
            {showStat ? (
                <>
                <Leaderboard leaderboardData={leaderboardData} />
                <div className='container'>
                    {!creator? (<><h1>Your points:  {leaderboardData[user.email]?.score}</h1></>):(<></>)}
                    {!creator? (<><h1>Your place:  {rank} out of {Object.keys(leaderboardData).length}</h1></>):(<></>)}
                    <h1>Class average: {mean}</h1>
                    <button className='btn btn-primary btn-lg'  onClick={() => exitQuiz()}>Exit</button>
                </div>
                </>
            ) : showLeaderboard ? (
                <>
                <Leaderboard leaderboardData={leaderboardData} />
                <div className='d-flex justify-content-center'>
                    <button className='btn btn-primary btn-lg'  onClick={() => goToNextQuestion()}>Next question</button>
                </div>
                </>
            ) : showAnswer ? (
                <>
                <h1 className="d-flex justify-content-center">Correct Answer is {currentAnswer} </h1>
                <h1 className="d-flex justify-content-center">Your points: {leaderboardData[user.email]?.score}  </h1>
                </>
            ) : (
                <>
                <h1 className="d-flex justify-content-center">Question #{currentQuestion.qnum}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-6 bg-light">
                            <div>
                                <Timer totalTime={timer} onTimeout={handleTimerTimeout} />
                                <h3 className="row d-flex justify-content-center">{currentQuestion.question}</h3>
                                {currentQuestion.type === "multiple" && (
                                    <>
                                        <div className=" mt-auto ">
                                            {currentQuestion.options.map((option, index) => (
                                                <p key={index} className={`col d-flex justify-content-center border border-dark 
                                                ${creator && option === currentQuestion.answer ? 'bg-success' : ''}`}
                                                    onClick={creator || submitted ? null : () => handleOptionClick(option)}
                                                    style={{ backgroundColor: selectedOption === option ? 'yellow' : 'white' }}>
                                                    {option}
                                                </p>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {currentQuestion.type === "short" && (
                                    <>
                                        <div className="row py-1">
                                            <textarea 
                                                id='answer'
                                                name='answer'
                                                className='col'
                                                style={box}
                                                required
                                                disabled={creator || submitted}
                                                value={shortAnswer}
                                                onChange={e => setShortAnswer(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                                {currentQuestion.type === "tf" && (
                                    <>
                                        <div className=" mt-auto ">
                                            <div className="row ">
                                                <p className={`col d-flex justify-content-center border border-dark 
                                                                ${creator && currentQuestion.answer === "true" ? 'bg-success' : ''}`}
                                                    onClick={creator || submitted ? null : () => handleOptionClick("true")}
                                                    style={{ backgroundColor: selectedOption === "true" ? 'yellow' : 'white' }}>
                                                    True
                                                </p>
                                                <p className={`col d-flex justify-content-center border border-dark 
                                                                ${creator && currentQuestion.answer === "false" ? 'bg-success' : ''}`}
                                                    onClick={creator || submitted ? null : () => handleOptionClick("false")}
                                                    style={{ backgroundColor: selectedOption === "false" ? 'yellow' : 'white' }}>
                                                    False
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {creator ? (
                                    <>
                                        <h4>Answer:</h4>
                                        <p>{currentQuestion.answer}</p>
                                    </>
                                ) : (
                                    <>
                                        {!submitted ? (
                                            <>
                                                <button type="submit" className="btn btn-primary btn-sm mt-2 ml-2">Submit</button>
                                            </>
                                        ) : (
                                            <div>
                                                <strong className='text-primary'>Answer Submitted</strong>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
                </>
            )}
           
       </div>
    );
    
    
    // return (
    //     <div className='app'>
    //         <h1 className="d-flex justify-content-center">Question #{question.qnum}</h1>
    //         <div className="row d-flex justify-content-center align-items-center">
    //             <div className="col-6 bg-light">
    //                 <div>
    //                     {/* <div className="progress">
    //                         <div
    //                             className="progress-bar"
    //                             role="progressbar"
    //                             style={{ width: `${(timeRemaining / question.time) * 100}%` }}
    //                             aria-valuenow={timeRemaining}
    //                             aria-valuemin="0"
    //                             aria-valuemax={question.time}
    //                         ></div>
    //                     </div> */}
    //                     <h3 className="row d-flex justify-content-center">{question.question}</h3>
    //                     {question.type === "multiple" && (
    //                         <>
    //                             <div className=" mt-auto ">
    //                                 <div className="row ">
    //                                     <p className="col d-flex justify-content-center border border-dark"
    //                                         onClick={() => handleOptionClick(question.option1)}
    //                                         style={{ backgroundColor: selectedOption === question.option1 ? 'yellow' : 'white' }}>
    //                                         {question.option1}
    //                                     </p>
    //                                     <p className="col d-flex justify-content-center border border-dark"
    //                                         onClick={() => handleOptionClick(question.option2)}
    //                                         style={{ backgroundColor: selectedOption === question.option2 ? 'yellow' : 'white' }}>
    //                                         {question.option2}
    //                                     </p>
    //                                 </div>
    //                                 <div className="row ">
    //                                     <p className="col d-flex justify-content-center border border-dark "
    //                                         onClick={() => handleOptionClick(question.option3)}
    //                                         style={{ backgroundColor: selectedOption === question.option3 ? 'yellow' : 'white' }}>
    //                                         {question.option3}
    //                                     </p>
    //                                     <p className="col d-flex justify-content-center border border-dark"
    //                                         onClick={() => handleOptionClick(question.option4)}
    //                                         style={{ backgroundColor: selectedOption === question.option4 ? 'yellow' : 'white' }}>
    //                                         {question.option4}
    //                                     </p>
    //                                 </div>
    //                             </div>
    //                         </>
    //                     )}
    //                     {question.type === "short" && (
    //                         <>
    //                             <div className="row py-1">
    //                                 <textarea 
    //                                     id='answer'
    //                                     name='answer'
    //                                     className='col'
    //                                     style={box}
    //                                     required
    //                                 />
    //                             </div>
    //                         </>
    //                     )}
    //                     {question.type === "tf" && (
    //                         <>
    //                             <div className=" mt-auto ">
    //                                 <div className="row ">
    //                                     <p className="col d-flex justify-content-center border border-dark "
    //                                         onClick={() => handleOptionClick("True")}
    //                                         style={{ backgroundColor: selectedOption === "True" ? 'yellow' : 'white' }}>
    //                                         True
    //                                     </p>
    //                                     <p className="col d-flex justify-content-center border border-dark"
    //                                         onClick={() => handleOptionClick("False")}
    //                                         style={{ backgroundColor: selectedOption === "False" ? 'yellow' : 'white' }}>
    //                                         False
    //                                     </p>
    //                                 </div>
    //                             </div>
    //                         </>
    //                     )}
    //                     {creator ? (
    //                         <>
    //                             <h4>Answer:</h4>
    //                             <p>{question.answer}</p>
    //                         </>
    //                     ) : (
    //                         <>
    //                             <button>Submit</button>
    //                         </>
    //                     )}
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default Quiz;