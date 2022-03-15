import { useState, useEffect } from "react";
import "./Dashboard.css";
export default function Dashboard() {
  const is_logged = localStorage.getItem("logged");
  if (!is_logged) {
    window.location.href = "/login";
  }
  const rftoken = localStorage.getItem("refresh_token");
  const token = localStorage.getItem("token");
  return (
    <div className="fasgg">
      <h1>Dashboard</h1>
      <h2>Text: </h2>
      <textarea className="form-control" required></textarea>
    </div>
  );
}
