import { useState, useEffect } from "react";
import useFetchSites from "../../hooks/useFetchSites";
import AddSiteModal from "../modals/AddSiteModal";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import useFetchOrganization from "../../hooks/useFetchOrg";
import Table from "../table/Table";
import DropdownMenu from "../modals/DropdownMenu";
import ConfirmationModal from "../modals/ConfirmationModal"; // Importing the new ConfirmationModal

const SiteTable = () => {
  const { sites: fetchedSites, isError, isLoading } = useFetchSites();
  const { organization } = useFetchOrganization();
  const [sites, setSites] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, setEditingSiteId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // State for confirmation modal
  const [siteIdToDelete, setSiteIdToDelete] = useState<string | null>(null); // Track site to be deleted
  // const [searchTerm, setSearchTerm] = useState(""); // Track search term
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchedSites) {
      setSites(fetchedSites);
    }
  }, [fetchedSites]);

  useEffect(() => {
    if (isModalOpen) {
      setDropdownVisible(null);
    }
  }, [isModalOpen]);

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;

  if (!Array.isArray(sites)) {
    return <p>No Sites Available.</p>;
  }

  const filteredSites = sites.filter(
    (site: any) => site.organizationId === organization?._id
  );

  const handleAddSite = () => {
    setEditingSiteId(null);
    setSelectedSite(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (siteId: string) => {
    const site = sites.find((site: any) => site._id === siteId);
    setSelectedSite(site);
    setIsModalOpen(true);
  };

  const confirmDelete = (siteId: string) => {
    setSiteIdToDelete(siteId);
    setIsConfirmationModalOpen(true); // Open the confirmation modal
  };

  const handleDelete = async () => {
    if (!siteIdToDelete) return;
    try {
      const response = await fetch(
        `https://different-armadillo-940.convex.site/site?id=${siteIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete site.");
      }

      console.log(`Site deleted successfully: ${siteIdToDelete}`);

      // Update local state to remove the deleted site from the UI
      const updatedSites = sites.filter(
        (site: any) => site._id !== siteIdToDelete
      );
      setSites(updatedSites);

      setDropdownVisible(null);
      setIsConfirmationModalOpen(false); // Close the confirmation modal
      setSiteIdToDelete(null); // Reset the state
    } catch (error) {
      console.error("Error deleting site:", error);
    }
  };

  const toggleDropdown = (siteId: string) => {
    setDropdownVisible((prev) => (prev === siteId ? null : siteId));
  };

  const renderIcons = (site: any) => [
    <div className="actions-container" key={site._id}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 action-icon"
        width="25"
        height="25"
        onClick={() => toggleDropdown(site._id)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>

      <DropdownMenu
        isOpen={dropdownVisible === site._id}
        itemId={site._id}
        onEdit={handleEdit}
        onDelete={() => confirmDelete(site._id)} // Trigger confirmation modal
        onClose={() => setDropdownVisible(null)}
      />
    </div>,
  ];

  return (
    <>
      <Table
        headers={["Site Name", "Location", "Personnel On Duty", "Actions"]}
        data={filteredSites}
        renderRow={(site) => (
          <>
            <td onClick={() => navigate(`visitors-log/${site._id}`)}>
              {site?.name}
            </td>
            <td>{site?.address.city}</td>
            <td>None</td>
          </>
        )}
        renderIcons={renderIcons}
        buttonName="Add Site"
        onButtonClick={handleAddSite}
        emptyStateMessage="No site available. To add a site, click the Add Site button."
        emptyStateImage="/sites.svg"
        itemsPerPage={10}
      />

      <AddSiteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        siteData={selectedSite}
        siteId={selectedSite?._id}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        message="Are you sure you want to delete this site?"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmationModalOpen(false)}
      />
    </>
  );
};

export default SiteTable;
