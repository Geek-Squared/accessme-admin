import { useState, useEffect } from "react";
import useFetchSites from "../../hooks/useFetchSites";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import useFetchOrganization from "../../hooks/useFetchOrg";
import Table from "./Table";
import DropdownMenu from "../modals/DropdownMenu";
import ConfirmationModal from "../modals/ConfirmationModal";
import useDeleteSite from "../../hooks/useDeleteSite";
import AddCustomFieldsModal from "../modals/AddCustomFieldsModal";
import useFetchCurrentUser from "../../hooks/useFetchCurrentUser";
import useFetchCustomForms from "../../hooks/useFetchCustomForms";

const ConfigTable = () => {
  const { sites: fetchedSites, isError, isLoading } = useFetchSites();
  const {forms} = useFetchCustomForms();
  const { org } = useFetchOrganization();
  const { deleteSite } = useDeleteSite();
  const [sites, setSites] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, setEditingSiteId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [siteIdToDelete, setSiteIdToDelete] = useState<string | null>(null);
  // const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const {user} = useFetchCurrentUser()

  console.log('forms', forms)

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

  // const filteredSites = forms?.filter(
  //   (site: any) => site.organizationId === org[0]?.id
  // );

  const handleAddSite = () => {
    setEditingSiteId(null);
    setSelectedSite(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (siteId: string) => {
    const site = sites.find((site: any) => site.id === siteId);
    setSelectedSite(site);
    setIsModalOpen(true);
  };

  const confirmDelete = (siteId: string) => {
    setSiteIdToDelete(siteId);
    setIsConfirmationModalOpen(true);
  };

  const handleDelete = async () => {
    if (!siteIdToDelete) return;

    try {
      await deleteSite(siteIdToDelete);

      // Remove the deleted site from local state
      setSites((prevSites) =>
        prevSites?.filter((site) => site.id !== siteIdToDelete)
      );

      // Reset deletion state
      setSiteIdToDelete(null);
      setIsConfirmationModalOpen(false); // Close the confirmation modal
    } catch (error) {
      console.error("Error deleting site:", error);
    }
  };

  const toggleDropdown = (siteId: string) => {
    setDropdownVisible((prev) => (prev === siteId ? null : siteId));
  };

  const renderIcons = (site: any) => [
    <div className="actions-container" key={site.id}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 action-icon"
        width="25"
        height="25"
        onClick={() => toggleDropdown(site.id)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>

      <DropdownMenu
        key={`dropdown-${site.id}`}
        isOpen={dropdownVisible === site.id}
        itemId={site.id}
        onEdit={() => handleEdit(site.id)}
        onDelete={() => confirmDelete(site.id)}
        onClose={() => setDropdownVisible(null)}
      />
    </div>,
  ];

  return (
    <>
      <Table
        headers={["Category", "Site",  "Actions"]}
        data={forms}
        renderRow={(site) => (
          <>
            <td onClick={() => navigate(`visitors-log/${site.id}`)}>
              {site?.name}
            </td>
            <td>{site?.city}</td>
            <td>None</td>
          </>
        )}
        renderIcons={renderIcons}
        buttonName="Add Form"
        onButtonClick={handleAddSite}
        emptyStateMessage="No site available. To add a form, click the Add Form button."
        emptyStateImage="/sites.svg"
        itemsPerPage={10}
      />

      <AddCustomFieldsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        siteData={selectedSite}
        siteId={selectedSite?.id}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        message="Are you sure you want to delete this form?"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmationModalOpen(false)}
      />
    </>
  );
};

export default ConfigTable;
