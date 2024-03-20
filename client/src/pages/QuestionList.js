import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useParams } from "react-router";
import apiUrl from "../api-config";
import { useNavigate } from "react-router-dom";

function QuesitonList() {
  const navigate = useNavigate();

  const [questions, setQuestion] = useState([]);
  const [total, setTotal] = useState(0);
  const params = useParams();

  const fetchQuestions = async () => {
    try {
      const responsee = await fetch(`${apiUrl}/getQuestions/${params.id}`);
      const data = await responsee.json();
      //console.log("Fetched questions:", data[data.length - 1].qnum + 1);
      setQuestion(data);
      if (data.length == 0) {
        setTotal(0);
      } else {
        setTotal(data[data.length - 1].qnum + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQuestion = async (quizid, qid, type, qnum) => {
    console.log(qnum);
    try {
      const response = await fetch(
        `${apiUrl}/deleteQuestion/${quizid}/${qid}/${type}/${qnum}`,
        {
          method: "DELETE",
        }
      ).then((response) => {
        console.log(response.status);
        if (response.status == 200) {
          setQuestion(questions.filter((q) => q.qnum !== qnum));
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  console.log("size is " + total);
  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
      <div className="app">
        <div className="container w-75">
          <h3 className="textcenter">{params.name}</h3>
          <div className="list-group">
            {questions.map((questions, index) => (
              <div
                key={index}
                className="list-group-item list-group-item-action flex-column align-items-start"
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{questions.question}</h5>
                  <div>
                    <button
                      type="button"
                      className="close"
                      aria-label="Close"
                      onClick={() =>
                        deleteQuestion(
                          questions.quizid,
                          questions.id,
                          questions.type,
                          questions.qnum
                        )
                      }
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>
                <small>
                  Quiz Type:
                  {" " + questions.type}
                </small>
                <p className="mb-1"></p>
              </div>
            ))}
          </div>

          <Link
            activeclassname="active"
            className="nav-link"
            to={"/Create/" + params.id + "/" + total}
          >
            <button className="btn btn-primary ">Add Question</button>
          </Link>

          <button
            className="btn btn-success "
            onClick={() => navigate("/QuizList")}
          >
            Finish Quiz
          </button>
        </div>
      </div>
    </>
  );
}

export default QuesitonList;
