import { useEffect } from "react";
import useFetchOrganization from "./useFetchOrg";

const useOrgStyles = () => {
  const { organization } = useFetchOrganization();

  useEffect(() => {
    if (organization) {
      document.documentElement.style.setProperty(
        "--primary-color",
        organization.primaryColor || "#000"
      );
      document.documentElement.style.setProperty(
        "--secondary-color",
        organization.secondaryColor || "#fff"
      );
      document.documentElement.style.setProperty(
        "--button-bg-color",
        organization.primaryColor || "#000"
      );
      document.documentElement.style.setProperty(
        "--button-text-color",
        organization.secondaryColor || "#fff"
      );
    }
  }, [organization]);
};

export default useOrgStyles;
