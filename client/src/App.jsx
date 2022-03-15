import "./App.css";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Logout from "./Logout";
import Profile from "./Profile";
import Home from "./Home";
import Header from "./Header";
import { render } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
