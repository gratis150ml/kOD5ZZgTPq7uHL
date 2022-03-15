import "./Register.css";
import { useState, useEffect } from "react";
export default function Register() {
  const is_logged = localStorage.getItem("logged");
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [errors, setErrors] = useState([]);
  return (
    <div className="iamretarded">
      {is_logged ? (
        <div>
          <h1>≧◠ᴥ◠≦</h1>
          <a href="logout">Logout</a>
        </div>
      ) : (
        <form className="main">
          <h1>Register</h1>
          <label for="text">Username: </label>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label for="text">Email: </label>
          <input
            className="form-control"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label for="text">Password: </label>
          <input
            className="form-control"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <input
            className="form-control"
            value="Submit"
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              const opt = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  username: username,
                  password: password,
                  email: email,
                }),
              };
              await fetch("http://127.0.0.1:8080/v1/users/register", opt)
                .then((resp) => resp.json())
                .then(async (data) => {
                  if (data.status == "ok") {
                    window.location.href = "/login";
                  } else {
                    setErrors(data.message);
                  }
                });
            }}
          ></input>
          <br />
          <p>{errors}</p>
        </form>
      )}
    </div>
  );
}
