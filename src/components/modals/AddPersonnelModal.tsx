import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import useFetchOrganization from "../../hooks/useFetchOrg";
import useFetchSites from "../../hooks/useFetchSites";
import useUpdateSite from "../../hooks/useUpdateSite";
import useUpdateOrganization from "../../hooks/useUpdateOrg";

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
  const { updateOrganization } = useUpdateOrganization();
  const [isLoading, setIsLoading] = useState(false);

  const filteredSites = sites?.filter(
    (site: any) => site.organizationId === organization?._id
  );

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const personnelData = {
      ...data,
      organizationId: organization?._id,
      role: "personnel",
    };

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://different-armadillo-940.convex.site/user-personnel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(personnelData),
        }
      );

      const responseData = await response.json();


      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        toast.success("Personnel added successfully!");
      }

      const personnelId = responseData.userId.userId;
      const siteId = data.siteId;

      await updateSite(siteId, {
        personnel: [personnelId],
      });

      await updateOrganization(organization?._id, {
        personnel: [personnelId],
      });

      onClose();
    } catch (error) {
      console.error("Failed to add personnel:", error);
      // toast.error("Failed to add personnel. Please try again.");
    } finally {
      setIsLoading(false);
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
          <h2 className="modal-header">Add Personnel</h2>
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
              {filteredSites?.map((site: any) => (
                <option key={site._id} value={site._id}>
                  {site
                    ? `${site.name} - ${site.address.city}`
                    : "No site available"}
                </option>
              ))}
            </select>
            {errors.siteId && <span>This field is required</span>}

            <label>4 Digit PIN:</label>
            <input
              type="number"
              {...register("pin", { required: true, min: 1000, max: 9999 })}
            />
            {errors.pin && errors.pin.type === "required" && (
              <span>This field is required</span>
            )}
            {errors.pin &&
              (errors.pin.type === "min" || errors.pin.type === "max") && (
                <span>PIN must be a 4-digit number</span>
              )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddPersonnelModal;
