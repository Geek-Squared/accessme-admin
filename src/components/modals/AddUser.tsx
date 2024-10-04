import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
    //   organizationId: "jx71rxts1ynzd8ns7gahdjn8v571kxat",
    //   createdBy: "js7e7jwja597avjmq9pjrh6vf571jm5t",
    };

    try {
      const response = await fetch(
        "https://little-rabbit-67.convex.site/user",
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
      }

      console.log("User added successfully:", await response.json());
      onClose();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-icon" onClick={onClose}>
          &times;
        </button>
        <h2>Add User</h2>
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
            <option value="personnel">Personnel</option>
          </select>
          {errors.role && <span>This field is required</span>}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
