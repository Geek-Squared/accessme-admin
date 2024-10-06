import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useFetchCurrentUser from "../../hooks/useFetchCurrentUser";
import useFetchOrganization from "../../hooks/useFetchOrg";
import "./styles.scss";
import useUpdateOrganization from "../../hooks/useUpdateOrg";

interface IAddSiteModal {
  isOpen: boolean;
  onClose: () => void;
}

interface IFormInput {
  name: string;
  createdBy: string;
  street: string;
  city: string;
}

const AddSiteModal: FC<IAddSiteModal> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const { currentUser } = useFetchCurrentUser();
  const { organization } = useFetchOrganization();
  const { updateOrganization } = useUpdateOrganization();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const siteData = {
      name: data.name,
      organizationId: organization?._id,
      createdBy: currentUser?._id,
      address: {
        street: data.street,
        city: data.city,
      },
    };

    try {
      const response = await fetch(
        "https://different-armadillo-940.convex.site/site",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(siteData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      const siteId = responseData?.siteId;

      await updateOrganization(organization?._id, {
        sites: [siteId],
      });
      onClose();
    } catch (error) {
      console.error("Failed to add Site:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-icon" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-header">Add Site</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Name:</label>
          <input {...register("name", { required: true })} />
          {errors.name && <span>This field is required</span>}

          <label>Street:</label>
          <input {...register("street", { required: true })} />
          {errors.street && <span>This field is required</span>}

          <label>City:</label>
          <input {...register("city", { required: true })} />
          {errors.city && <span>This field is required</span>}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddSiteModal;