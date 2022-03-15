import "./Profile.css";
import { useState, useEffect } from "react";
export default function Profile() {
  const [content, setContent] = useState(
    <div class="text-center">
      <div class="spinner-border"></div>
    </div>
  );
  const is_logged = localStorage.getItem("logged");
  if (!is_logged) {
    window.location.href = "/login";
  }
  const rftoken = localStorage.getItem("refresh_token");
  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState([]);
  const [errors2, setErrors2] = useState();
  const [dataUsername, setUsername] = useState();
  const [id, setID] = useState();
  const [active, setActive] = useState();
  const [email, setEmail] = useState();
  const [is_banned, setIs_banned] = useState();
  const [rank, setRank] = useState();
  const [username2, setUsername2] = useState();
  const [desc, setDesc] = useState();
  const [desc2, setDesc2] = useState();
  const style = { color: "#dd3e3e" };
  useEffect(() => {
    const opt = {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    };
    fetch("http://127.0.0.1:8080/v1/user/info", opt)
      .then((resp) => resp.json())
      .then((data) => {
        setID(data.data._id);
        setActive(data.data.active);
        setEmail(data.data.email);
        setIs_banned(data.data.is_banned);
        setRank(data.data.rank);
        setUsername2(data.data.username);
        setDesc(data.data.description);
      });
  }, []);
  return (
    <>
      <div className="profile">
        <h1>Profile</h1>
        <p>ID: {id}</p>
        <p>Username: {username2}</p>
        <p>Email: {email}</p>
        <p>Activated: {active === true ? "true" : "false"}</p>
        <p>is_banned: {is_banned === true ? "true" : "false"}</p>
        <p>Rank: {rank === 0 ? "normal" : "high"}</p>
        <p>Description: {desc}</p>
        <div className="div2">
          <label to="text">Change username</label>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            className="form-control"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              const opt = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                body: JSON.stringify({
                  username: dataUsername,
                }),
              };
              fetch("http://127.0.0.1:8080/v1/user/change_username", opt)
                .then((resp) => resp.json())
                .then((data) => {
                  console.log(dataUsername);
                  console.log(data);
                  if (data.status == "ok") {
                    window.location.href = "/profile";
                  } else {
                    setErrors(data.message);
                  }
                });
            }}
          />
        </div>
        <br />
        <p style={style}>{errors}</p>
        <br />
        <div className="div3">
          <label to="text">Change description</label>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setDesc2(e.target.value)}
          />
          <br />
          <input
            className="form-control"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              const opt = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                body: JSON.stringify({
                  description: desc2,
                }),
              };
              fetch("http://127.0.0.1:8080/v1/user/change_description", opt)
                .then((resp) => resp.json())
                .then((data) => {
                  console.log(dataUsername);
                  console.log(data);
                  if (data.status == "ok") {
                    window.location.href = "/profile";
                  } else {
                    setErrors2(data.message);
                  }
                });
            }}
          />
        </div>
        <br />
        <p style={style}>{errors2}</p>
      </div>
    </>
  );
}
