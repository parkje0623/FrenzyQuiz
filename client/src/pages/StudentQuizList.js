import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentQuizList = () => {
    const [hoveredQuizId, setHoveredQuizId] = useState(false);
    const navigate = useNavigate();
    const quizzes = [
        {
          id: "123",
          name: "quiz1",
          total_score: 10,
          quiz_date: '06-08-2023',
          score: 7,
          rating: 5
        },
        {
          id: "456",
          name: "quiz2",
          total_score: 10,
          quiz_date: '06-15-2023',
          score: 2,
          rating: 1 
        }
    ];

    const goToQuizDetail = (quizId) => {
        // todo: check if quizId exist
    
        navigate(`/StudentQuizDetail/${quizId}`);
    };

    const handleMouseEnter = (quizId) => {
        setHoveredQuizId(quizId);
    };
    
      const handleMouseLeave = () => {
        setHoveredQuizId(null);
    };

    const getQuizItemStyle = (quizId) => {
        if (quizId === hoveredQuizId) {
            return {
                color: 'blue',
                textDecoration: 'underline',
            };
        }
        return { color:'blue' };
    };

    return (
      <div className='app'>
        <div className='container w-75'>
            <h3 className='textcenter'>Previous Quizzes Taken</h3>
            <div className='list-group'>
                {
                    quizzes.map((quiz, index) => (
                        <div key={index} className="list-group-item list-group-item-action flex-column align-items-start">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1" 
                                    onClick={() => goToQuizDetail(quiz.id)} 
                                    style={getQuizItemStyle(quiz.id)}
                                    onMouseEnter={() => handleMouseEnter(quiz.id)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {quiz.name}
                                </h5>
                            </div>
                            <p className="mb-1">CMPT372 quiz</p>
                            <small>
                                Quiz Taken: {quiz.quiz_date} <br/>
                                Score: {quiz.score}/{quiz.total_score} <br/>
                                Rating: {quiz.rating} <br/>
                            </small>
                        </div>
                    ))
                }
            </div>
        </div>
      </div>  
    );
}

export default StudentQuizList;