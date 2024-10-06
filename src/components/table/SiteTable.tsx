import { useState } from "react";
import useFetchSites from "../../hooks/useFetchSites";
import AddSiteModal from "../modals/AddSiteModal";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import useFetchOrganization from "../../hooks/useFetchOrg";
import Table from "../table/Table";

const SiteTable = () => {
  const { sites, isError, isLoading } = useFetchSites();
  const { organization } = useFetchOrganization();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;

  if (!Array.isArray(sites)) {
    return <p>No Sites Available.</p>;
  }

  console.log("sitesPersonnl", sites);

  const filteredSites = sites.filter(
    (site: any) => site.organizationId === organization?._id
  );

  const handleAddSite = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRowClick = (siteId: string) => {
    navigate(`visitors-log/${siteId}`);
  };

  return (
    <>
      <Table
        headers={["Site Name", "Location", "Personnel On Duty"]}
        data={filteredSites}
        renderRow={(site) => (
          <>
            <td onClick={() => handleRowClick(site._id)}>{site?.name}</td>
            <td>{site?.address.city}</td>
            <td>Bruce</td>
          </>
        )}
        buttonName="Add Site"
        onButtonClick={handleAddSite}
      />
      <AddSiteModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SiteTable;