import { useState, useEffect } from "react";
import useFetchSites from "../../hooks/useFetchSites";
// import { useNavigate } from "react-router-dom";
import Table from "./Table";
import DropdownMenu from "../modals/DropdownMenu";
import ConfirmationModal from "../modals/ConfirmationModal";
import useDeleteSite from "../../hooks/useDeleteSite";
import AddCustomFieldsModal from "../modals/AddCustomFieldsModal";
import useFetchCustomForms from "../../hooks/useFetchCustomForms";
import "./styles.scss";

const ConfigTable = () => {
  const { sites: fetchedSites, isError, isLoading } = useFetchSites();
  const { forms: fetchedForms, refreshForms } = useFetchCustomForms();
  const { deleteSite } = useDeleteSite();
  const [sites, setSites] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<any>(null);

  const [formDropdownVisible, setFormDropdownVisible] = useState<string | null>(
    null
  );
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [siteIdToDelete, setSiteIdToDelete] = useState<string | null>(null);

  // const navigate = useNavigate();

  useEffect(() => {
    if (fetchedSites) {
      setSites(fetchedSites);
    }
  }, [fetchedSites]);

  useEffect(() => {
    if (fetchedForms) {
      setForms(fetchedForms);
    }
  }, [fetchedForms]);

  useEffect(() => {
    if (isModalOpen) {
      setFormDropdownVisible(null);
    }
  }, [isModalOpen]);

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;

  if (!Array.isArray(sites) || !Array.isArray(forms)) {
    return <p>No Data Available.</p>;
  }

  const filteredForms = forms.map((form: any) => {
    const site = sites.find((site: any) => site.id === form.siteId);
    return {
      ...form,
      siteName: site ? site.name : "Unknown Site",
    };
  });

  const handleAddSite = () => {
    setSelectedSite(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormCreated = () => {
    refreshForms();
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
        prevSites?.filter((site) => site.id !== siteIdToDelete)
      );
      setSiteIdToDelete(null);
      setIsConfirmationModalOpen(false);
    } catch (error) {
      console.error("Error deleting site:", error);
    }
  };

  const toggleFormDropdown = (formId: string) => {
    setFormDropdownVisible((prev) => (prev === formId ? null : formId));
  };

  const renderFormIcons = (form: any) => (
    <div className="actions-container" key={form.id}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 action-icon"
        width="25"
        height="25"
        onClick={() => toggleFormDropdown(form.id)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>

      <DropdownMenu
        key={`dropdown-form-${form.id}`}
        isOpen={formDropdownVisible === form.id}
        itemId={form.id}
        onEdit={() => handleEdit(form.siteId)}
        onDelete={() => confirmDelete(form.siteId)}
        onClose={() => setFormDropdownVisible(null)}
      />
    </div>
  );

  return (
    <>
      <Table
        headers={["Form Name", "Site", "Actions"]}
        data={filteredForms}
        renderRow={(form) => (
          <>
            <td>{form?.name}</td>
            <td>
              {form?.siteName}
            </td>
            <td>{renderFormIcons(form)}</td>
          </>
        )}
        buttonName="Add Form"
        onButtonClick={handleAddSite}
        emptyStateMessage="No forms available. To add a form, click the Add Form button."
        emptyStateImage="/forms.svg"
        itemsPerPage={10}
      />

      <AddCustomFieldsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        siteData={selectedSite}
        siteId={selectedSite?.id}
        onFormCreated={handleFormCreated}
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

export default ConfigTable;