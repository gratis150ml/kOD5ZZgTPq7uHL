import "./Logout.css";
export default function Logout() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <div className="app">
      <h1 onDoubleClick={handleLogout}>(ɔ◔‿◔)ɔ ♥</h1>
    </div>
  );
}
