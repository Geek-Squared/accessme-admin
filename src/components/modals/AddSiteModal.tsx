import { FC, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useFetchCurrentUser from "../../hooks/useFetchCurrentUser";
import useFetchOrganization from "../../hooks/useFetchOrg";
import useCreateSite from "../../hooks/useCreateSite";
import { mutate } from "swr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useEditSite from "../../hooks/useUpdateSite";
import { apiUrl } from "../../utils/apiUrl";
import useFetchSiteById from "../../hooks/useFetchSiteById";

interface IAddSiteModal {
  isOpen: boolean;
  onClose: () => void;
  siteData?: any; // Optional prop to hold the site data if editing
  siteId?: string; // Optional prop to determine if it's edit mode
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
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>();

  const { user } = useFetchCurrentUser();
  const { org } = useFetchOrganization();
  const { createSite } = useCreateSite();
  const { updateSite } = useEditSite(siteId);
  const {siteById} = useFetchSiteById(siteId);


  // Pre-fill form data if editing an existing site
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
        toast.success("Site Updated Successfully!");
      } else {
        response = await createSite(siteDataToSubmit);
        toast.success("Site Created Successfully!");
      }

      mutate(`${apiUrl}/organization`);
      mutate(`${apiUrl}/currentUser`);

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

            <label>Address Line One:</label>
            <input {...register("addressLineOne", { required: true })} />
            {errors.addressLineOne && <span>This field is required</span>}

            <label>Address Line Two:</label>
            <input {...register("addressLineTwo")} />

            <label>City:</label>
            <input {...register("city", { required: true })} />
            {errors.city && <span>This field is required</span>}

            <label>Province or State:</label>
            <input {...register("state", { required: true })} />
            {errors.state && <span>This field is required</span>}

            <label>Postal Code:</label>
            <input {...register("postalCode", { required: true })} />
            {errors.postalCode && <span>This field is required</span>}

            <label>Country:</label>
            <input {...register("country", { required: true })} />
            {errors.country && <span>This field is required</span>}

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
