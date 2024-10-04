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
    if (response) navigate("/login");
    console.log(response);
  };

  const password = watch("password"); // Watch password for re-enter validation

  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="login-left">
        <div className="balance-widget">
          <h3>Current Balance</h3>
          <p>$24,359</p>
        </div>
        <div className="transaction-widget">
          <h4>New Transaction</h4>
          <p>
            or upload <span>.xls file</span>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <h2>Welcome!</h2>
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
              <span className="error">{errors.username.message}</span>
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
              <span className="error">{errors.email.message}</span>
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
              <span className="error">{errors.password.message}</span>
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
              <span className="error">{errors.confirmPassword.message}</span>
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
