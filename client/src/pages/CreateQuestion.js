import React, { useEffect, useState } from "react";
import QuesitonList from "./QuestionList";
import apiUrl from "../api-config";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

function CreateQuestion() {
  const [type, setType] = useState("multiple");
  const [question, setQuestion] = useState("Add Question");
  const [option1, setOption1] = useState("Add Option");
  const [option2, setOption2] = useState("Add Option");
  const [option3, setOption3] = useState("Add Option");
  const [option4, setOption4] = useState("Add Option");
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState("");
  const [points, setPoints] = useState("");
  const [state, setState] = useState([]);
  const [temp, setTemp] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  const box = {
    width: "300px",
    border: "1px solid black",
    padding: "50px",
    margin: "auto",
  };
  const handleType = (event) => {
    setType(event.target.value);
  };
  const handleQuestion = (event) => {
    setQuestion(event.target.value);
  };
  const handleOption1 = (event) => {
    setOption1(event.target.value);
  };
  const handleOption2 = (event) => {
    setOption2(event.target.value);
  };
  const handleOption3 = (event) => {
    setOption3(event.target.value);
  };
  const handleOption4 = (event) => {
    setOption4(event.target.value);
  };
  const handleAnswer = (event) => {
    setAnswer(event.target.value);
  };
  const handleTime = (event) => {
    setTime(event.target.value);
  };
  const handlePoints = (event) => {
    setPoints(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    var target = event.target;
    var input;
    if (type == "multiple") {
      input = {
        id: params.id,
        type: target.type.value,
        question: target.question.value,
        o1: target.option1.value,
        o2: target.option2.value,
        o3: target.option3.value,
        o4: target.option4.value,
        answer: target.answer.value,
        time: target.time.value,
        points: target.points.value,
        qnum: params.qnum,
      };
    } else {
      input = {
        id: params.id,
        type: target.type.value,
        question: target.question.value,
        answer: target.answer.value,
        time: target.time.value,
        points: target.points.value,
        qnum: params.qnum,
      };
    }

    var data = JSON.stringify(input);

    try {
      const q = await fetch(`${apiUrl}/createQuestion`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: data,
      }).then((response) => {
        console.log(response.status);
        navigate(-1);
      });
    } catch (err) {
      console.error(err.message);
    }
    console.log(state);
  };

  return (
    <>
      <div className="container ">
        <h1 className=" d-flex justify-content-center">New Quiz</h1>

        <div className="row ">
          <div className="col-6 bg-light">
            <div>
              <h2 className="row d-flex justify-content-center">Preview</h2>
              <h3 className="row d-flex justify-content-center">{question}</h3>
              {type === "multiple" && (
                <>
                  <div className=" mt-auto ">
                    <div className="row ">
                      <p className="col d-flex justify-content-center border border-dark">
                        {option1}
                      </p>
                      <p className="col d-flex justify-content-center border border-dark">
                        {option2}
                      </p>
                    </div>
                    <div className="row ">
                      <p className="col d-flex justify-content-center border border-dark ">
                        {option3}
                      </p>
                      <p className="col d-flex justify-content-center border border-dark">
                        {option4}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {type === "short" && (
                <>
                  <div style={box}> </div>
                </>
              )}
              {type === "tf" && (
                <>
                  <div className=" mt-auto ">
                    <div className="row ">
                      <p className="col d-flex justify-content-center border border-dark ">
                        True
                      </p>
                      <p className="col d-flex justify-content-center border border-dark">
                        False
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <form className="col" method="POST" onSubmit={handleSubmit}>
            <div className="row py-1">
              <label className="col">Question Type</label>
              <select
                id="type"
                name="type"
                defaultValue="multiple"
                className="form-select col"
                onChange={handleType}
                required
              >
                <option value="multiple">Multiple</option>
                <option value="short">Short</option>
                <option value="tf">True or False</option>
              </select>
            </div>
            <div className="row py-1">
              <label id="question" name="question" className="col">
                Question
              </label>
              <input
                onChange={handleQuestion}
                id="question"
                name="question"
                className="col"
                required
              ></input>
            </div>

            {type === "multiple" && (
              <>
                <div className="row py-1">
                  <label className="col">Option 1</label>
                  <input
                    id="option1"
                    name="option1"
                    onChange={handleOption1}
                    className="col"
                    required
                  ></input>
                </div>
                <div className="row py-1">
                  <label className="col">Option 2</label>
                  <input
                    id="option2"
                    name="option2"
                    onChange={handleOption2}
                    className="col"
                    required
                  ></input>
                </div>
                <div className="row py-1">
                  <label className="col">Option 3</label>
                  <input
                    id="option3"
                    name="option3"
                    onChange={handleOption3}
                    className="col"
                    required
                  ></input>
                </div>
                <div className="row py-1">
                  <label className="col">Option 4</label>
                  <input
                    id="option4"
                    name="option4"
                    onChange={handleOption4}
                    className="col"
                    required
                  ></input>
                </div>

                <div className="row py-1">
                  <label className="col">Answer</label>
                  <select
                    onChange={handleAnswer}
                    id="answer"
                    name="answer"
                    defaultValue={option1}
                    className="col"
                    required
                  >
                    <option value={option1}>Option 1</option>
                    <option value={option2}>Option 2</option>
                    <option value={option3}>Option 3</option>
                    <option value={option4}>Option 4</option>
                  </select>
                </div>
              </>
            )}
            {type === "short" && (
              <>
                <div className="row py-1">
                  <label className="col">Answer</label>
                  <textarea
                    id="answer"
                    name="answer"
                    onChange={handleAnswer}
                    className="col"
                    required
                  ></textarea>
                </div>
              </>
            )}
            {type === "tf" && (
              <>
                <div className="row py-1">
                  <label className="col">Answer</label>
                  <select
                    onChange={handleAnswer}
                    className="col"
                    id="answer"
                    name="answer"
                    required
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              </>
            )}
            <div className="row py-1">
              <label className="col">Time(seconds)</label>
              <input
                type="number"
                min="0"
                id="time"
                name="time"
                className="w-25 col"
                onChange={handleTime}
                required
              ></input>
            </div>

            <div className="row py-1">
              <label className="col">Points</label>
              <input
                type="number"
                min="0"
                id="points"
                name="points"
                className="w-25 col"
                onChange={handlePoints}
                required
              ></input>
            </div>

            <button type="submit" className="btn btn-primary btn-block mb-4">
              Add Quesiton
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateQuestion;
