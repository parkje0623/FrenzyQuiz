import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import check from "../img/check.png";
import wrong from "../img/wrong.png";
import apiUrl from "../api-config";

function QuizInfo() {
  const navigate = useNavigate();
  const params = useParams();
  const [quizInfo, setQuizInfo] = useState([]);
  const fetchQuizInfo = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/getQuizInfo/${params.uid}/${params.qid}`
      );
      const data = await response.json();
      console.log(data);
      console.log(response);
      setQuizInfo(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    fetchQuizInfo();
  }, []);

  const getQuestionType = (qt) => {
    if (qt === "multiple") {
      return "Multiple Choice";
    } else if (qt === "tf") {
      return "True or False";
    } else if (qt === "short") {
      return "Short Answer";
    } else {
      return "Invalid Question Type";
    }
  };
  return (
    <div className="m-5">
      <h1>Question Information</h1>
      <ol>
        {quizInfo.map((info) => (
          <li>
            <div className="m-3" key={info.id}>
              <h3>Question: {info.question}</h3>
              <p>Question Points: {info.points}</p>
              <p>Question Type: {getQuestionType(info.qtype)}</p>
              <h5>
                You answered: <b>{info.submitted}</b>
              </h5>
              <h5>
                Correct Answer: <b>{info.answer}</b>
              </h5>
              {}
              <img src={info.correct ? check : wrong} alt="iscorrectlogo"></img>
            </div>
          </li>
        ))}
      </ol>
      <button className="btn btn-primary" onClick={() => navigate("/QuizList")}>
        {" "}
        Go Back
      </button>
    </div>
  );
}

export default QuizInfo;
