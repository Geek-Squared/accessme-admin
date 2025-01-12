import { FC, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useFetchOrganization from "../../hooks/useFetchOrg";
import useCreateSite from "../../hooks/useCreateSite";
import { mutate } from "swr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useEditSite from "../../hooks/useUpdateSite";
import { apiUrl } from "../../utils/apiUrl";
import "./custom.scss"

interface IAddSiteModal {
  isOpen: boolean;
  onClose: () => void;
  siteData?: any;
  siteId?: string;
  onFormCreated?: () => void;
}

interface IFormInput {
  name: string;
  addressLineOne: string;
  addressLineTwo: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  personnel: any;
}

const AddSiteModal: FC<IAddSiteModal> = ({
  isOpen,
  onClose,
  siteData,
  siteId,
  onFormCreated,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>();

  const { org } = useFetchOrganization();
  const { createSite } = useCreateSite();
  const { updateSite } = useEditSite(siteId);

  useEffect(() => {
    if (siteId && siteData) {
      setValue("name", siteData.name);
      setValue("addressLineOne", siteData.addressLineOne);
      setValue("addressLineTwo", siteData.addressLineTwo);
      setValue("city", siteData.city);
      setValue("state", siteData.state);
      setValue("postalCode", siteData.postalCode);
      setValue("country", siteData.country);
      setValue("personnel", siteData.personnel);
    }
  }, [siteId, siteData, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const loadingToast = toast.loading(
      siteId ? "Updating site..." : "Creating site...",
      {
        position: "top-right",
      }
    );

    const siteDataToSubmit = {
      name: data.name,
      organizationId: org[0].id,
      addressLineOne: data.addressLineOne,
      addressLineTwo: data.addressLineTwo,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      personnel: data.personnel,
      slug: data.name,
    };

    try {
      let response;
      if (siteId) {
        response = await updateSite(siteDataToSubmit);
        await mutate(`${apiUrl}/sites`);
        toast.update(loadingToast, {
          render: "Site updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        response = await createSite(siteDataToSubmit);
        await mutate(`${apiUrl}/sites`);
        toast.update(loadingToast, {
          render: "Site created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      }

      mutate(`${apiUrl}/organization`);
      mutate(`${apiUrl}/currentUser`);

      onClose();
      if (onFormCreated) {
        onFormCreated();
      }
    } catch (error) {
      console.error("Failed to submit site:", error);
      toast.update(loadingToast, {
        render: "Failed to submit site. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="custom-modal-overlay" onClick={onClose}>
        <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="custom-close-icon" onClick={onClose}>
            &times;
          </button>
          <h2 className="custom-modal-header">{siteId ? "Edit Site" : "Add Site"}</h2>
          <div className="custom-scrollable-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="custom-form-group">
                <label>Name</label>
                <input
                  className="custom-input"
                  {...register("name", { required: true })}
                  placeholder="Site Name"
                />
                {errors.name && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div className="custom-form-group">
                <label>Address Line One</label>
                <input
                  className="custom-input"
                  {...register("addressLineOne", { required: true })}
                  placeholder="Address Line 1"
                />
                {errors.addressLineOne && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div className="custom-form-group">
                <label>Address Line Two</label>
                <input
                  className="custom-input"
                  {...register("addressLineTwo")}
                  placeholder="Address Line 2 (Optional)"
                />
              </div>

              <div className="custom-form-group">
                <label>City</label>
                <input
                  className="custom-input"
                  {...register("city", { required: true })}
                  placeholder="City"
                />
                {errors.city && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div className="custom-form-group">
                <label>Province or State</label>
                <input
                  className="custom-input"
                  {...register("state", { required: true })}
                  placeholder="Province/State"
                />
                {errors.state && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div className="custom-form-group">
                <label>Postal Code</label>
                <input
                  className="custom-input"
                  {...register("postalCode", { required: true })}
                  placeholder="Postal Code"
                />
                {errors.postalCode && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div className="custom-form-group">
                <label>Country</label>
                <input
                  className="custom-input"
                  {...register("country", { required: true })}
                  placeholder="Country"
                />
                {errors.country && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <button
                type="submit"
                className="custom-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : (siteId ? "Save Changes" : "Add Site")}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddSiteModal;