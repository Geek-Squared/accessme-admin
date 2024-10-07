import { useState } from "react";
import { useForm } from "react-hook-form";
import useLogin from "../../hooks/useLoginUser";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles.scss";

const Loader = () => {
  return <div className="loader"></div>;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, data, isError } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (formData: { email: string; password: string }) => {
    setIsSubmitting(true);
    try {
      const response = await login(formData.email, formData.password);
      if (response) {
        const params = new URLSearchParams(location.search);
        const fromSignup = params.get("from") === "signup";
        navigate(fromSignup ? "/register-org" : "/");
      }
      console.log(response);
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src="/sign-in.svg"
          alt="Sign in illustration"
          className="login-image"
        />
        <p className="description-text">
          Please log in to your account to manage and control access permissions
          securely and efficiently.
        </p>
      </div>

      <div className="login-right">
        <h2>Welcome Back!</h2>
       {/* @ts-ignore */}
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="error">
                {" "}
                {typeof errors.email?.message === "string"
                  ? errors.email.message
                  : null}
              </p>
            )}
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="At least 8 characters"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="error">
                {" "}
                {typeof errors.password?.message === "string"
                  ? errors.password.message
                  : null}
              </p>
            )}
          </div>
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? <Loader /> : "Login"}
          </button>
        </form>
        {isError && <p className="error">Error logging in</p>}
        {data && <p className="success">Login successful</p>}
        <p className="signup">
          Don't have an account? <a href="/sign-up">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
