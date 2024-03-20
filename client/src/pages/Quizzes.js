import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { NavLink } from "react-router-dom";
import apiUrl from "../api-config";

function Quizzes() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  console.log(user);

  const handleSubmit = async (event) => {
    event.preventDefault();
    var target = event.target;
    var input = {
      name: target.name.value,
      tid: user.uid,
    };
    var data = JSON.stringify(input);
    try {
      await fetch(`${apiUrl}/createQuiz`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: data,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) =>{
          console.log("print quiz just created: ", data)
          navigate("/QuesitonList/" + data[0].quizid + "/" + data[0].tname)
        })
        .then(console.log("quiz made"));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <h1 className=" d-flex justify-content-center">Make A Quiz</h1>
      <p>{}</p>
      {user === null && (
        <div className=" d-flex justify-content-center">
          <NavLink activeclassname="active" className="nav-link" to="/Register">
            <button className="btn btn-primary mt-2">
              Please login or create an account
            </button>
          </NavLink>
        </div>
      )}
      {user !== null && (
        <form
          className=" d-flex justify-content-center"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div className="form-row">
            <label>Enter Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              required
            ></input>
            <button type="submit" className="btn btn-primary btn-block mt-2">
              Create
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default Quizzes;
