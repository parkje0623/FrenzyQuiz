import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import apiUrl from "../api-config";
import { useNavigate } from "react-router-dom";

function Edit() {
  const navigate = useNavigate();

  const [questions, setQuestion] = useState([]);
  const params = useParams();

  const fetchQuestions = async () => {
    try {
      const responsee = await fetch(`${apiUrl}/getQuestions/${params.id}`);
      const data = await responsee.json();
      console.log("Fetched questions:", data);
      setQuestion(data);
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
  useEffect(() => {
    fetchQuestions();
  }, []);
  return (
    <>
      <div className="app">
        <div className="container w-75">
          <h3 className="textcenter">{"Editing: " + params.name}</h3>
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
                <button
                  type="button"
                  name="edit"
                  className="btn btn-warning btn-sm mt-2"
                  onClick={() =>
                    navigate(
                      `/Edit/${params.id}/${questions.id}/${questions.type}`
                    )
                  }
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-success " onClick={() => navigate(-1)}>
            Finish Editing
          </button>
        </div>
      </div>
    </>
  );
}

export default Edit;
