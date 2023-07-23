import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import TextInput from "../components/TextInput";
import { registerUser } from "../redux/reducers/auth.slice";
import CloudinaryUpload from "../utils/cloudinaryUpload";
import { toast } from "react-hot-toast";

const schema = yup.object().shape({
  firstname: yup
    .string()
    .min(3, "First name must be at least 3 characters long")
    .required("First name is required"),
  lastname: yup
    .string()
    .min(3, "Last name must be at least 3 characters long")
    .required("Last name is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters long")
    .required("Password is required"),
  confpassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Confirm password is required"),
});

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { status } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    if (data.profile_pic) {
      try {
        const fileUrl = await CloudinaryUpload(data.profile_pic, "image");

        await toast.promise(
          dispatch(registerUser({ ...data, pic: fileUrl })),
          {
            loading: "Registering...",
            success: (res) => {
              navigate("/login");
              return "Login successfully";
            },
            error: "Unable to login user",
          },
          { style: { minWidth: "250px" } }
        );
      } catch (err) {
        setError("profile_pic", {
          type: "manual",
          message: err.message,
        });
      }
    } else {
      setError("profile_pic", {
        type: "manual",
        message: "Profile picture is required",
      });
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <TextInput
            control={control}
            name="firstname"
            placeholder="Enter your first name"
            rules={{ required: true }}
          />

          <TextInput
            control={control}
            name="lastname"
            placeholder="Enter your last name"
            rules={{ required: true }}
          />

          <TextInput
            control={control}
            name="email"
            placeholder="Enter your email"
            rules={{ required: true }}
          />

          <Controller
            name="profile_pic"
            control={control}
            defaultValue={[]}
            render={(props) => {
              return (
                <input
                  type="file"
                  onChange={(event) => {
                    return props.field.onChange(event.target.files[0]);
                  }}
                />
              );
            }}
          />

          {errors?.profile_pic && (
            <span className="text-red-400 text-xs">
              {errors.profile_pic.message}
            </span>
          )}

          <TextInput
            control={control}
            name="password"
            placeholder="Enter your password"
            rules={{ required: true }}
            type="password"
          />

          <TextInput
            control={control}
            name="confpassword"
            placeholder="Confirm your password"
            rules={{ required: true }}
            type="password"
          />

          <button
            type="submit"
            className="btn form-btn"
            disabled={status === "loading"}
          >
            sign up
          </button>
        </form>
        <p>
          Already a user?{" "}
          <NavLink className="login-link" to={"/login"}>
            Log in
          </NavLink>
        </p>
      </div>
    </section>
  );
}

export default Register;
