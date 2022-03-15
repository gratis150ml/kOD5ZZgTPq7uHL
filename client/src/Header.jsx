import "./Header.css";
import { Link } from "react-router-dom";
export default function Header() {
  const style = {
    border: "1px solid #202021",
    "border-radius": "4px",
    padding: "5px",
    width: "1000px",
  };
  const style2 = { padding: "10px" };
  return (
    <>
      <div className="menu">
        <ul>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
