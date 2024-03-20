import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const StudentQuizDetail = () => {
    const { id } =  useParams();

    // this hook is for fetching quiz information
    useEffect(() => {
        // todo: fetch quiz data from nodejs
        // GET (`quizDetail/${id}`)
        // setQuiz(data)
    }, [id]);

    // FOR TESTING PURPOSES -> Should use data from the database later
    const quiz = [
        {
            id: "123",
            name: "quiz1",
            total_score: 10,
            quiz_date: '06-08-2023',
            score: 7,
            rating: 5
          }
    ];
    const questions = [
        {
            id: "1",
            quiz_id: "123",
            question: "What is the name of this application?",
            points: 1
        },
        {
            id: "2",
            quiz_id: "123",
            question: "Professor's Name?",
            points: 2
        }
    ];
    const answers = [
        {
            id: "11",
            question_id: "1",
            correct: true,
            score: 1,
            answer: 'Frenzy Quiz'
        },
        {
            id: "12",
            question_id: "2",
            correct: true,
            score: 2,
            answer: 'Bobby Chan'
        }
    ];

    return (
        <div className='container'>
            <div className='row'>
                <div className="col-lg-6 col-md-12">
                    <h3>Quiz id: {id}</h3>
                    <h3>{quiz[0].name}</h3>
                    <p className="mb-1">CMPT372 quiz</p>
                    <small>
                        Quiz Taken: {quiz[0].quiz_date} <br/>
                        Score: {quiz[0].score}/{quiz[0].total_score} <br/>
                        Rating: {quiz[0].rating} <br/>
                    </small>

                    <div className='list-group'>
                        {
                            questions.map((question) => (
                                <div key={question.id} className="list-group-item list-group-item-action flex-column align-items-start">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">
                                            {question.question}
                                        </h5>
                                    </div>

                                    <div className='answers'>
                                        {
                                            answers
                                                .filter((answer) => answer.question_id === question.id)
                                                .map((answer) => (
                                                    <div key={answer.id}>
                                                        <label htmlFor={answer.id}>
                                                            Score: {answer.score}/{question.points} <br/>
                                                            Answer: {answer.answer} <br/>
                                                        </label>
                                                    </div>
                                                ))
                                        }
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentQuizDetail;