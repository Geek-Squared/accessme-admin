import { useState, useEffect } from "react";
import useFetchSites from "../../hooks/useFetchSites";
import AddSiteModal from "../modals/AddSiteModal";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import useFetchOrganization from "../../hooks/useFetchOrg";
import Table from "../table/Table";
import DropdownMenu from "../modals/DropdownMenu";
import ConfirmationModal from "../modals/ConfirmationModal";
import useDeleteSite from "../../hooks/useDeleteSite";

const SiteTable = () => {
  const {
    sites: fetchedSites,
    isError,
    isLoading: isSitesLoading,
    refreshSites,
  } = useFetchSites();
  
  const { org, isLoading: isOrgLoading } = useFetchOrganization();
  const { deleteSite } = useDeleteSite();
  const [sites, setSites] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, setEditingSiteId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [siteIdToDelete, setSiteIdToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log('sites', sites)

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

  // Handle loading states
  if (isSitesLoading || isOrgLoading) {
    return <p>Loading...</p>;
  }

  // Handle error state
  if (isError) {
    return <p>Error loading sites. Please try again later.</p>;
  }

  // Handle case where sites data is not in expected format
  if (!Array.isArray(sites)) {
    return <p>No Sites Available.</p>;
  }

  // Handle case where org data is not available
  if (!org || !Array.isArray(org) || org.length === 0) {
    return <p>Organization data not available. Please try again later.</p>;
  }

  const filteredSites = sites.filter((site: any) => {
    return site.organizationId === org[0]?.id;
  });

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
      setSites((prevSites) =>
        prevSites.filter((site) => site.id !== siteIdToDelete)
      );
      setSiteIdToDelete(null);
      setIsConfirmationModalOpen(false);
    } catch (error) {
      console.error("Error deleting site:", error);
    }
  };

  const handleSiteCreated = () => {
    refreshSites();
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
        headers={["Site Name", "Location", "Personnel On Duty", "Actions"]}
        data={filteredSites}
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
        siteId={selectedSite?.id}
        onFormCreated={handleSiteCreated}
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