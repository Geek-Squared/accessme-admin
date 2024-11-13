import { useEffect } from "react";
import useFetchOrganization from "./useFetchOrg";

const useOrgStyles = () => {
  const { org } = useFetchOrganization();
console.log('org', org)
  useEffect(() => {
    if (org) {
      document.documentElement.style.setProperty(
        "--primary-color",
        org[0].primaryColor
      );
      document.documentElement.style.setProperty(
        "--secondary-color",
        org[0].secondaryColor || "#fff"
      );
      document.documentElement.style.setProperty(
        "--button-bg-color",
        org[0].primaryColor
      );
      document.documentElement.style.setProperty(
        "--button-text-color",
        org[0].secondaryColor || "#fff"
      );
    }
  }, [org]);
};

export default useOrgStyles;
