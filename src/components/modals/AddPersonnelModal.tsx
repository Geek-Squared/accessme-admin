import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchOrganization from "../../hooks/useFetchOrg";
import useFetchSites from "../../hooks/useFetchSites";
import { apiUrl } from "../../utils/apiUrl";
import "./custom.scss";

interface IAddPersonnelModal {
  isOpen: boolean;
  onClose: () => void;
  onFormCreated?: () => void;
}

interface IFormInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  siteId: string;
  pin: number;
}

const AddPersonnelModal: FC<IAddPersonnelModal> = ({
  isOpen,
  onClose,
  onFormCreated,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const { org } = useFetchOrganization();
  const { sites } = useFetchSites();
  const [isLoading, setIsLoading] = useState(false);

  const filteredSites = sites?.filter(
    (site: any) => site.organizationId === org[0]?.id
  );

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const loadingToast = toast.loading("Adding Personnel...", {
      position: "top-right",
    });

    const personnelData = {
      ...data,
      firstName: data.firstName,
      lastName: data.lastName,
      organizationId: org?.[0]?.id,
      sitesId: parseInt(data.siteId, 10),
      role: "PERSONNEL",
    };

    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personnelData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      toast.update(loadingToast, {
        render: "Personnel created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      onClose();
      if (onFormCreated) {
        onFormCreated();
      }
    } catch (error) {
      console.error("Failed to add personnel:", error);
      toast.update(loadingToast, {
        render: "Failed to add personnel. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="custom-modal-overlay" onClick={onClose}>
        <div
          className="custom-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="custom-close-icon" onClick={onClose}>
            &times;
          </button>
          <h2 className="custom-modal-header">Add Personnel</h2>
          <div className="custom-scrollable-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="custom-form-group">
                <label>First Name</label>
                <input
                  className="custom-input"
                  {...register("firstName", { required: true })}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">
                    This field is required
                  </span>
                )}
              </div>

              <div className="custom-form-group">
                <label>Last Name</label>
                <input
                  className="custom-input"
                  {...register("lastName", { required: true })}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">
                    This field is required
                  </span>
                )}
              </div>

              <div className="custom-form-group">
                <label>Phone Number</label>
                <input
                  className="custom-input"
                  {...register("phoneNumber", { required: true })}
                  placeholder="Enter phone number"
                />
                {errors.phoneNumber && (
                  <span className="text-red-500 text-sm">
                    This field is required
                  </span>
                )}
              </div>

              <div className="custom-form-group">
                <label>Site</label>
                <select
                  className="custom-select"
                  {...register("siteId", { required: true })}
                >
                  <option value="">Select a site</option>
                  {filteredSites?.map((site: any) => (
                    <option key={site.id} value={site.id}>
                      {site
                        ? `${site.name} - ${site.city}`
                        : "No site available"}
                    </option>
                  ))}
                </select>
                {errors.siteId && (
                  <span className="text-red-500 text-sm">
                    Please select a site
                  </span>
                )}
              </div>

              <div className="custom-form-group">
                <label>4 Digit PIN</label>
                <input
                  type="number"
                  className="custom-input"
                  {...register("pin", { required: true, min: 1000, max: 9999 })}
                  placeholder="Enter 4-digit PIN"
                />
                {errors.pin && errors.pin.type === "required" && (
                  <span className="text-red-500 text-sm">PIN is required</span>
                )}
                {errors.pin &&
                  (errors.pin.type === "min" || errors.pin.type === "max") && (
                    <span className="text-red-500 text-sm">
                      PIN must be a 4-digit number
                    </span>
                  )}
              </div>

              <button
                type="submit"
                className="custom-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Add Personnel"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddPersonnelModal;
