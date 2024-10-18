import { FC, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useFetchCurrentUser from "../../hooks/useFetchCurrentUser";
import useFetchOrganization from "../../hooks/useFetchOrg";
import useUpdateOrganization from "../../hooks/useUpdateOrg";
import { mutate } from "swr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IAddSiteModal {
  isOpen: boolean;
  onClose: () => void;
  siteData?: any; // Optional prop to hold the site data if editing
  siteId?: string; // Optional prop to determine if it's edit mode
}

interface IFormInput {
  name: string;
  createdBy: string;
  street: string;
  city: string;
}

const AddSiteModal: FC<IAddSiteModal> = ({
  isOpen,
  onClose,
  siteData,
  siteId,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>();

  const { currentUser } = useFetchCurrentUser();
  const { organization } = useFetchOrganization();
  const { updateOrganization } = useUpdateOrganization();

  useEffect(() => {
    if (siteId && siteData) {
      setValue("name", siteData.name);
      setValue("street", siteData.address.street);
      setValue("city", siteData.address.city);
    }
  }, [siteId, siteData, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const siteDataToSubmit = {
      name: data.name,
      organizationId: organization?._id,
      createdBy: currentUser?._id,
      address: {
        street: data.street,
        city: data.city,
      },
    };

    try {
      let response;

      if (siteId) {
        response = await fetch(
          `https://different-armadillo-940.convex.site/site?id=${siteId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(siteDataToSubmit),
          }
        );
      } else {
        response = await fetch(
          "https://different-armadillo-940.convex.site/site",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(siteDataToSubmit),
          }
        );
      }

      if (response.ok) {
        toast.success("Site Created Successfully!");
      } else {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      const newSiteId = responseData?.siteId;

      if (!newSiteId) {
        throw new Error("Failed to get siteId");
      }

      await updateOrganization(organization?._id, {
        sites: [newSiteId],
      });

      // Trigger revalidation of SWR data for organization and current user
      mutate("https://different-armadillo-940.convex.site/organization");
      mutate("https://different-armadillo-940.convex.site/currentUser");

      onClose();
    } catch (error) {
      console.error("Failed to submit site:", error);
      toast.error("Failed to submit site. Please try again.");
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
          <h2 className="modal-header">{siteId ? "Edit Site" : "Add Site"}</h2>
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

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddSiteModal;
