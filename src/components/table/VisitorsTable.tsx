import useFetchVisitors from "../../hooks/useFetchVisitors";
import { useState } from "react";
import Table from "../table/Table";
import FieldModal from "../modals/FieldModal";

const VisitorsTable = () => {
  const { visitors, isError, isLoading } = useFetchVisitors();

  // State to track selected category and selected visitor
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);

  // Open modal with visitor details
  const handleViewDetails = (visitor: any) => {
    setSelectedVisitor(visitor);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedVisitor(null);
  };

  if (isError) console.log(`error: ${isError}`);
  if (isLoading) return <p>Loading...</p>;

  if (!Array.isArray(visitors)) {
    return <p>No visitors available.</p>;
  }

  // Extract unique categories
  const categories = visitors
    .map((visitor) => visitor.category)
    .filter(
      (category, index, self) => category && self.indexOf(category) === index
    );

  // Filter visitors by selected category
  const filteredVisitors = selectedCategory
    ? visitors.filter(
        (visitor) => visitor.category?.id === selectedCategory?.id
      )
    : [];

  // Dynamic headers for visitors' details
  const dynamicHeaders = visitors[0]?.renderedFields
    ? Object.keys(visitors[0].renderedFields)
    : [];
  const additionalHeaders = ["onSite", "categoryId", "userId"];
  const allHeaders = [...dynamicHeaders, ...additionalHeaders, "Action"];

  return (
    <div>
      {/* Display categories table if no category is selected */}
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
          emptyStateMessage="No categories available."
          itemsPerPage={10}
          buttonName={""}
          isHeader={false}
        />
      )}

      {/* Display visitors table for the selected category */}
      {selectedCategory && (
        <div>
          <Table
            headers={allHeaders}
            data={filteredVisitors}
            renderRow={(visitor) => (
              <>
                {allHeaders.slice(0, -1).map((header) => (
                  <td key={header}>
                    {header in visitor.renderedFields
                      ? visitor.renderedFields[header]
                      : visitor[header] ?? "N/A"}
                  </td>
                ))}
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
            <h3>Rendered Fields</h3>
            <ul>
              {Object.entries(selectedVisitor.renderedFields).map(
                ([key, value]: any) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
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
