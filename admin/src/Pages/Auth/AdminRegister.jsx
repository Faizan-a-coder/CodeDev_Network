import "./Register.css";
import { adminRegister } from "../../api/auth.api";
import { useState, useContext } from "react";
import { Context } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminRegister() {
  const { url } = useContext(Context);
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const registerHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await adminRegister(data, url);

      if (response.data.success) {
        toast.success("Admin Account created successfully");
        navigate("/admin/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="register">
      <form onSubmit={registerHandler} className="register-form">
        <h2 style={{ textAlign: 'center', marginBottom: '0', color: '#333' }}>Admin Register</h2>
        <input
          type="text"
          name="username"
          onChange={onChangeHandler}
          value={data.username}
          className="username"
          placeholder="Username"
          required
        />

        <input
          type="email"
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          className="email"
          placeholder="Email"
          required
        />

        <input
          type="password"
          name="password"
          onChange={onChangeHandler}
          value={data.password}
          className="password"
          placeholder="Password"
          required
        />

        <button type="submit">Create Admin Account</button>

        <p className="login-link">
          Already have an admin account? <Link to="/admin/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
