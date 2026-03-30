import { adminLogin } from "../../api/auth.api.js";
import { useContext, useState } from "react";
import { Context } from "../../context/AuthContext.jsx";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const { url, setUser, setToken } = useContext(Context);
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const loginHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await adminLogin(data, url);
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Admin Logged in successfully");
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Invalid email or password");
      } else {
        toast.error("Server not responding");
      }
    }
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={loginHandler}>
        <h2 style={{ textAlign: 'center', marginBottom: '0', color: '#333' }}>Admin Login</h2>
        <input
          type="text"
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          placeholder="email"
          required
        />
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={onChangeHandler}
          placeholder="password"
          required
        />

        <button type="submit">Login</button>
        <p className="login-link">
          Create an admin account! <Link to="/admin/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
