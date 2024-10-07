import useSignUp from "../../hooks/useSignup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const { signup, isLoading, isError } = useSignUp();

  const onSubmit = async (formData: {
    email: string;
    password: string;
    username: string;
    role: string;
  }) => {
    const response = await signup(
      formData.username,
      formData.email,
      formData.password,
      "admin"
    );
    if (response) navigate("/login?from=signup");

    console.log(response);
  };

  const password = watch("password");

  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="login-left">
        <img
          src="/sign-in.svg"
          alt="Sign in illustration"
          className="login-image"
        />
        <p className="description-text"></p>
      </div>
      {/* Right Side */}
      <div className="login-right">
        <h2>Welcome!</h2>
        {/* @ts-ignore */}
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div className="input-group">
            <label htmlFor="username">Full Name</label>
            <input
              type="text"
              id="username"
              placeholder="John Doe"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <span className="error">
                {typeof errors.username?.message === "string"
                  ? errors.username.message
                  : null}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="john.doe@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <span className="error">
                {typeof errors.email?.message === "string"
                  ? errors.email.message
                  : null}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="At least 8 characters"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
            {errors.password && (
              <span className="error">
                {typeof errors.password?.message === "string"
                  ? errors.password.message
                  : null}
              </span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Re-enter Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Re-enter your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className="error">
                {typeof errors.confirmPassword?.message === "string"
                  ? errors.confirmPassword.message
                  : null}
              </span>
            )}
          </div>

          {isError && (
            <span className="error">Sign-up failed. Please try again.</span>
          )}

          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="login">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
