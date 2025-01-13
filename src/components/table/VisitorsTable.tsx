import useFetchVisitors from "../../hooks/useFetchVisitors";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Table from "../table/Table";
import FieldModal from "../modals/FieldModal";

const VisitorsTable = () => {
  const { visitors, isError, isLoading } = useFetchVisitors();
  const { siteId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);

  // Helper function to format date-time
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString();
    } catch (e) {
      return dateStr;
    }
  };

  // Helper function to identify entry time fields
  const getEntryTimeValue = (renderedFields: Record<string, any>) => {
    const entryPatterns = [
      /entry\s*time/i,
      /time\s*in/i,
      /check\s*in/i,
      /arrival/i,
      /ingreso/i,
    ];

    for (const [key, value] of Object.entries(renderedFields)) {
      if (entryPatterns.some((pattern) => pattern.test(key))) {
        return formatDateTime(value);
      }
    }
    return "N/A";
  };

  // Helper function to identify exit time fields
  const getExitTimeValue = (renderedFields: Record<string, any>) => {
    const exitPatterns = [
      /exit\s*time/i,
      /time\s*out/i,
      /check\s*out/i,
      /departure/i,
      /salida/i,
    ];

    for (const [key, value] of Object.entries(renderedFields)) {
      if (exitPatterns.some((pattern) => pattern.test(key))) {
        return formatDateTime(value);
      }
    }
    return "N/A";
  };

  const handleViewDetails = (visitor: any) => {
    setSelectedVisitor(visitor);
  };

  const handleCloseModal = () => {
    setSelectedVisitor(null);
  };

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;

  if (!Array.isArray(visitors)) {
    return <p>No visitors available.</p>;
  }

  const categories = visitors
    .map((visitor) => visitor.category)
    .filter(
      (category, index, self) =>
        category &&
        self.indexOf(category) === index &&
        //@ts-ignore
        category.siteId === parseInt(siteId)
    );

  const filteredVisitors = selectedCategory
    ? visitors.filter(
        (visitor) =>
          visitor.category?.id === selectedCategory?.id &&
          //@ts-ignore
          visitor.category?.siteId === parseInt(siteId)
      )
    : [];

  // Get all rendered field headers except entry/exit times
  const getCustomHeaders = () => {
    if (!filteredVisitors.length) return [];
    const firstVisitor = filteredVisitors[0];
    return Object.keys(firstVisitor.renderedFields).filter((header) => {
      const headerLower = header.toLowerCase();
      return (
        !headerLower.includes("time") &&
        !headerLower.includes("entry") &&
        !headerLower.includes("exit")
      );
    });
  };

  // Combine all headers
  const customHeaders = getCustomHeaders();
  const standardHeaders = ["Entry Time", "Exit Time", "onSite", "Action"];
  const allHeaders = [...customHeaders, ...standardHeaders];

  return (
    <div>
      {!selectedCategory && (
        <Table
          headers={["Category Name", "Description", "Action"]}
          data={categories}
          renderRow={(category) => (
            <>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => setSelectedCategory(category)}>
                  View Visitors
                </button>
              </td>
            </>
          )}
          emptyStateMessage="No categories available for this site."
          itemsPerPage={10}
          buttonName={""}
          isHeader={false}
        />
      )}

      {selectedCategory && (
        <div>
          <Table
            headers={allHeaders}
            data={filteredVisitors}
            renderRow={(visitor) => (
              <>
                {customHeaders.map((header) => (
                  <td key={header}>
                    {visitor.renderedFields[header] || "N/A"}
                  </td>
                ))}
                <td>{getEntryTimeValue(visitor.renderedFields)}</td>
                <td>{getExitTimeValue(visitor.renderedFields)}</td>
                <td>{visitor.onSite ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => handleViewDetails(visitor)}>
                    View Details
                  </button>
                </td>
              </>
            )}
            emptyStateMessage="No visitors available for this category."
            itemsPerPage={10}
            buttonName={""}
            isHeader={false}
          />
        </div>
      )}

      <FieldModal
        isOpen={!!selectedVisitor}
        onClose={handleCloseModal}
        title="Visitor Details"
      >
        {selectedVisitor && (
          <div>
            <h3>Visitor Details</h3>
            <ul>
              {Object.entries(selectedVisitor.renderedFields).map(
                ([key, value]: any) => (
                  <li key={key}>
                    <strong>{key}:</strong>{" "}
                    {key.toLowerCase().includes("time")
                      ? formatDateTime(value)
                      : value}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </FieldModal>
    </div>
  );
};

export default VisitorsTable;
