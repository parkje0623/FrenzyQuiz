import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import apiUrl from "../api-config";
import { useNavigate } from "react-router-dom";

function Edit() {
  const navigate = useNavigate();
  const params = useParams();
  const [qdata, setQData] = useState([]);
  const [type, setType] = useState("multiple");
  const [question, setQuestion] = useState("Add Question");
  const [option1, setOption1] = useState("Add Option");
  const [option2, setOption2] = useState("Add Option");
  const [option3, setOption3] = useState("Add Option");
  const [option4, setOption4] = useState("Add Option");
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState("");
  const [points, setPoints] = useState("");
  const [theme, setTheme] = useState("text-danger");
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
    setTheme("");
  };
  const handleTime = (event) => {
    setTime(event.target.value);
  };
  const handlePoints = (event) => {
    setPoints(event.target.value);
  };

  const fetchQuestion = async () => {
    try {
      const responsee = await fetch(
        `${apiUrl}/getQuestion/${params.qid}/${params.quesid}/${params.type}`
      );
      const data = await responsee.json();
      console.log("Fetched questions:", data);
      setQuestion(data[0].question);
      setAnswer(data[0].answer);
      setTime(data[0].sec);
      setPoints(data[0].points);

      if (params.type == "multiple") {
        setOption1(data[0].option1);
        setOption2(data[0].option2);
        setOption3(data[0].option3);
        setOption4(data[0].option4);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    var target = event.target;
    var input;
    if (params.type == "multiple") {
      input = {
        qid: params.qid,
        quesid: params.quesid,
        type: params.type,
        question: target.question.value,
        o1: target.option1.value,
        o2: target.option2.value,
        o3: target.option3.value,
        o4: target.option4.value,
        answer: target.answer.value,
        time: target.time.value,
        points: target.points.value,
      };
    } else {
      input = {
        id: params.qid,
        quesid: params.quesid,
        type: params.type,
        question: target.question.value,
        answer: target.answer.value,
        time: target.time.value,
        points: target.points.value,
      };
    }
    var data = JSON.stringify(input);

    await fetch(`${apiUrl}/update`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: data,
    })
      .then(console.log("updated"))
      .then(navigate(-1));
  };
  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <>
      <h1>Edit</h1>
      <form className="w-25 m-5 mx-auto" method="POST" onSubmit={handleSubmit}>
        <div className="row py-1">
          <label className="col">Question Type</label>
          <p>{params.type}</p>
        </div>
        <div className="row py-1">
          <label id="question" name="question" className="col">
            Question
          </label>
          <input
            onChange={handleQuestion}
            id="question"
            name="question"
            value={question}
            className="col"
            required
          ></input>
        </div>

        {params.type === "multiple" && (
          <>
            <div className="row py-1">
              <label className="col">Option 1</label>
              <input
                id="option1"
                name="option1"
                value={option1}
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
                value={option2}
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
                value={option3}
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
                value={option4}
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
                className={"col " + theme}
                required
              >
                <option hidden value="">
                  Choose Current Answer
                </option>
                <option value={option1}>Option 1</option>
                <option value={option2}>Option 2</option>
                <option value={option3}>Option 3</option>
                <option value={option4}>Option 4</option>
              </select>
            </div>
          </>
        )}
        {params.type === "short" && (
          <>
            <div className="row py-1">
              <label className="col">Answer</label>
              <textarea
                id="answer"
                name="answer"
                onChange={handleAnswer}
                className="col"
                value={answer}
                required
              ></textarea>
            </div>
          </>
        )}
        {params.type === "tf" && (
          <>
            <div className="row py-1">
              <label className="col">Answer</label>
              <select
                onChange={handleAnswer}
                className={"col " + theme}
                id="answer"
                name="answer"
                required
              >
                <option hidden value="">
                  Choose Current Answer
                </option>
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
            value={time}
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
            value={points}
            onChange={handlePoints}
            required
          ></input>
        </div>

        <button type="submit" className="btn btn-primary ">
          Edit Question
        </button>
        <button
          type="button"
          className="btn btn-danger "
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </form>
    </>
  );
}

export default Edit;
