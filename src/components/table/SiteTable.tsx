import { useState } from "react";
import useFetchSites from "../../hooks/useFetchSites";
import AddSiteModal from "../modals/AddSiteModal";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

const SiteTable = () => {
  const { sites, isError, isLoading } = useFetchSites();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;

  if (!Array.isArray(sites)) {
    return <p>No Sites Available.</p>;
  }

  console.table(sites);

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
    <div>
      <button className="add-element" onClick={handleAddSite}>
        Add Site
      </button>
      <table className="table-container">
        <thead>
          <tr>
            <th>Site Name</th>
            <th>Location</th>
            <th>Personnel On Duty</th>
          </tr>
        </thead>
        <tbody>
          {sites?.map((site: any) => (
            <tr key={site._id} onClick={() => handleRowClick(site._id)}>
              <td>{site?.name}</td>
              <td>{site?.address.city}</td>
              <td>Bruce</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddSiteModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default SiteTable;
