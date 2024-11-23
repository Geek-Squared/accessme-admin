import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import useFetchCurrentUser from "../../hooks/useFetchCurrentUser";
import useUpdateUser from "../../hooks/useUpdateUser"; // Import the mutation hook
import { apiUrl } from "../../utils/apiUrl";

interface IFormInput {
  name: string;
  addressLineOne: string;
  addressLineTwo?: string;
  postalCode?: string;
  city: string;
  country: string;
  logoUrl?: FileList | string;
  primaryColor?: string;
  secondaryColor?: string;
}

const Loader = () => {
  return <div className="loader"></div>;
};

const RegisterOrganization: FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [primaryColor, setPrimaryColor] = useState();
  const [secondaryColor, setSecondaryColor] = useState();
  const { user } = useFetchCurrentUser();
  const { updateUser } = useUpdateUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
  
    const token = localStorage.getItem("token");
  
    const response = await fetch(`${apiUrl}/organization/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
  
    // Check if the response is JSON, otherwise assume it's a plain URL
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data.url;
    } else {
      // If response is plain text, use it directly as the URL
      const textData = await response.text();
      return textData;
    }
  };
  

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsSubmitting(true);
    console.log('form-data', data)
    try {
      let logoUrl = "";

      if (
        data.logoUrl &&
        data.logoUrl instanceof FileList &&
        data.logoUrl.length > 0
      ) {
        const file = data.logoUrl[0];
        logoUrl = await uploadFile(file);
      }

      await submitData({ ...data, logoUrl });
    } catch (error) {
      console.error("Error uploading logo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrimaryColorChange = (e: any) => {
    setPrimaryColor(e.target.value);
  };
  const handleSecondaryColorChange = (e: any) => {
    setSecondaryColor(e.target.value);
  };
  console.log("primaryColor", typeof primaryColor, secondaryColor);

  // Submit organization data to the API and update user organizationId
  const submitData = async (data: IFormInput & { logoUrl?: string }) => {
    const organizationData = {
      name: data.name,
      logoUrl: data.logoUrl,
      primaryColor: primaryColor,
      secondaryColor: data.secondaryColor,
      createdBy: user.id,
      addressLineOne: data.addressLineOne,
      addressLineTwo: data.addressLineTwo,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      users: [user.id],
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/organization`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        throw new Error("Failed to create organization");
      }
      console.log("responseOrg", response);
      const { organizationId } = await response.json();
      console.log("organizationId", organizationId);
      // console.log("Organization created successfully:", organizationId);

      // // Update the current user with the organizationId
      await updateUser(user.id, {
        organizationId: organizationId?.id,
      });

      // Navigate to the home page after successful update
      navigate("/");
    } catch (error) {
      console.error("Failed to create organization and update user:", error);
    }
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src="/sign-in.svg"
          alt="Sign in illustration"
          className="login-image"
        />
        <p className="description-text">
          Please log in to your account to manage and control access permissions
          securely and efficiently.
        </p>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <h2>Create Your Organization</h2>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              <div className="input-group">
                <label>Name:</label>
                <input
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <span>{errors.name.message}</span>}
              </div>
              <div className="input-group">
                <label>Address Line One:</label>
                <input
                  {...register("addressLineOne", {
                    required: "Address Line One is required",
                  })}
                />
                {errors.addressLineOne && (
                  <span>{errors.addressLineOne.message}</span>
                )}
              </div>
              <div className="input-group">
                <label>Address Line Two:</label>
                <input {...register("addressLineTwo")} />
              </div>
              <div className="input-group">
                <label>Postal Code:</label>
                <input
                  {...register("postalCode", {
                    required: "Postal Code is required",
                  })}
                />
              </div>
              <div className="input-group">
                <label>City:</label>
                <input
                  {...register("city", { required: "City is required" })}
                />
                {errors.city && <span>{errors.city.message}</span>}
              </div>
              <div className="input-group">
                <label>Country:</label>
                <input
                  {...register("country", { required: "Country is required" })}
                />
                {errors.country && <span>{errors.country.message}</span>}
              </div>
              <button type="button" className="login-btn" onClick={nextStep}>
                Next
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="input-group">
                <label>Logo URL:</label>
                <input type="file" {...register("logoUrl")} />
              </div>
              <div className="input-group">
                <label>Primary Color:</label>
                <input
                  type="color"
                  {...register("primaryColor")}
                  onChange={handlePrimaryColorChange}
                />
                <span>You have selected {primaryColor}</span>
              </div>
              <div className="input-group">
                <label>Secondary Color:</label>
                <input
                  type="color"
                  {...register("secondaryColor")}
                  onChange={handleSecondaryColorChange}
                />
                <span>You have selected {primaryColor}</span>
              </div>
              <div className="multistep-buttons">
                <button type="button" className="login-btn" onClick={prevStep}>
                  Previous
                </button>
                <button
                  type="submit"
                  className="login-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader /> : "Create Organization"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterOrganization;
