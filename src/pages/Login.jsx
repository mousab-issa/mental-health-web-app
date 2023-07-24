import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { loginUser } from "../redux/reducers/auth.slice";
import TextInput from "../components/TextInput";
import toast from "react-hot-toast";

function Login() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { handleSubmit, control } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success("User Logged successfully");

      console.log("Hello");
      navigate("/appointments");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <TextInput
            name="email"
            control={control}
            placeholder="Enter your email"
            rules={{ required: "Email is required" }}
          />

          <TextInput
            name="password"
            control={control}
            type="password"
            placeholder="Enter your password"
            rules={{ required: "Password is required" }}
          />
          <button type="submit" className="btn form-btn">
            sign in
          </button>
        </form>

        <p>
          Not a user?{" "}
          <NavLink className="login-link" to={"/register"}>
            Register
          </NavLink>
        </p>
      </div>
    </section>
  );
}

export default Login;
