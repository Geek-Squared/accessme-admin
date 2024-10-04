import { useForm } from "react-hook-form";
import useLogin from "../../hooks/useLoginUser";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, data, isLoading, isError } = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (formData: { email: string; password: string }) => {
    const response = await login(formData.email, formData.password);
    if (response) navigate("/register-org");
    console.log(response);
  };

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
        <h2>Welcome back!</h2>
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
                {typeof errors.password?.message === "string"
                  ? errors.password.message
                  : null}
              </p>
            )}
          </div>
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        {isError && <p className="error">Error logging in</p>}
        {data && <p className="success">Login successful</p>}
        <p className="signup">
          Don't you have an account? <a href="/sign-up">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
