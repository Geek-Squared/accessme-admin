import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "./styles.scss";
import useFetchOrganization from "../../hooks/useFetchOrg";
import useFetchSites from "../../hooks/useFetchSites";
import useUpdateSite from "../../hooks/useUpdateSite";

interface IAddPersonnelModal {
  isOpen: boolean;
  onClose: () => void;
}

interface IFormInput {
  username: string;
  phoneNumber: string;
  siteId: string;
  pin: number;
}

const AddPersonnelModal: FC<IAddPersonnelModal> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const { organization } = useFetchOrganization();
  const { sites } = useFetchSites();
  const { updateSite } = useUpdateSite();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const personnelData = {
      ...data,
      organizationId: organization?._id,
      role: "personnel",
    };

    try {
      // 1. Create the personnel profile
      const response = await fetch(
        "https://little-rabbit-67.convex.site/user-personnel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(personnelData),
        }
      );

      // 2. Parse the response
      const responseData = await response.json();
      console.log("response", responseData);

      // 3. Check if response is okay
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const personnelId = responseData.userId.userId;
      const siteId = data.siteId;

      await updateSite(siteId, {
        personnel: [personnelId], // Update site by appending personnel ID
      });

      // 5. Close the modal after successful submission
      onClose();
    } catch (error) {
      console.error("Failed to add personnel:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-icon" onClick={onClose}>
          &times;
        </button>
        <h2>Add Personnel</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Name:</label>
          <input {...register("username", { required: true })} />
          {errors.username && <span>This field is required</span>}

          <label>Phone Number:</label>
          <input {...register("phoneNumber", { required: true })} />
          {errors.phoneNumber && <span>This field is required</span>}

          <label>Site:</label>
          <select {...register("siteId", { required: true })}>
            <option value="">Select a site</option>
            {sites?.map((site: any) => (
              <option key={site._id} value={site._id}>
                {site.name} - {site.address.city}
              </option>
            ))}
          </select>
          {errors.siteId && <span>This field is required</span>}

          <label>PIN:</label>
          <input
            type="number" // Set the input type to 'number'
            {...register("pin", { required: true, min: 1000, max: 9999 })} // Validate PIN between 1000-9999
          />
          {errors.pin && errors.pin.type === "required" && (
            <span>This field is required</span>
          )}
          {errors.pin &&
            (errors.pin.type === "min" || errors.pin.type === "max") && (
              <span>PIN must be a 4-digit number</span>
            )}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddPersonnelModal;
