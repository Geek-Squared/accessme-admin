import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";

interface IAddUserModal {
  isOpen: boolean;
  onClose: () => void;
}

interface IFormInput {
  username: string;
  email: string;
  role: string;
}

const AddUserModal: FC<IAddUserModal> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const userData = {
      username: data.username,
      email: data.email,
      role: data.role,
    };

    try {
      const response = await fetch(
        "https://different-armadillo-940.convex.site/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        toast.success("User added successfully!");
      }

      console.log("User added successfully:", await response.json());
      onClose();
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error("Failed to add user. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-icon" onClick={onClose}>
            &times;
          </button>
          <h2 className="modal-header">Add User</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Username:</label>
            <input {...register("username", { required: true })} />
            {errors.username && <span>This field is required</span>}

            <label>Email:</label>
            <input {...register("email", { required: true })} />
            {errors.email && <span>This field is required</span>}

            <label>Role:</label>
            <select {...register("role", { required: true })}>
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="personnel">User</option>
            </select>
            {errors.role && <span>This field is required</span>}

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddUserModal;
