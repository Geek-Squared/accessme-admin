import React, { useState } from "react";
import "./styles.scss";
import Header from "../header/Header";

interface TableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
  buttonName: string;
  onButtonClick?: () => void;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  emptyStateImage?: string;
  emptyStateMessage?: string;
  renderIcons?: (item: any) => React.ReactNode[];
  isHeader?: boolean;
  itemsPerPage?: number;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  renderRow,
  buttonName,
  onButtonClick,
  // onSearchChange,
  emptyStateImage,
  emptyStateMessage,
  renderIcons,
  isHeader = true,
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Handle sorting when clicking on headers
  const handleSort = (header: string) => {
    if (!header) return;
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig?.key === header) {
        // Toggle between ascending and descending
        return {
          key: header,
          direction: prevSortConfig.direction === "asc" ? "desc" : "asc",
        };
      } else {
        // Sort by the new header, default to ascending
        return { key: header, direction: "asc" };
      }
    });
  };

  // Function to compare values for sorting
  const compare = (a: any, b: any) => {
    const key = sortConfig?.key || "";
    if (a[key] < b[key]) return sortConfig?.direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return sortConfig?.direction === "asc" ? 1 : -1;
    return 0;
  };

  // Filter the data based on search term
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort the filtered data
  const sortedData = sortConfig ? filteredData.sort(compare) : filteredData;

  // Calculate total number of pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Determine the data to be displayed on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when a search is performed
  };

  return (
    <>
      <Header
        buttonName={buttonName}
        onClick={onButtonClick}
        onSearchChange={handleSearchChange}
        isHeaderButton={isHeader}
      />

      {sortedData.length === 0 ? (
        <div className="empty-state-container">
          {emptyStateImage && (
            <img
              src={emptyStateImage}
              alt="No data available"
              className="empty-state-image"
            />
          )}
          {emptyStateMessage && (
            <p className="empty-state-message">{emptyStateMessage}</p>
          )}
        </div>
      ) : (
        <>
          <table className="table-container">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} onClick={() => handleSort(header)}>
                    {header}
                    {/* Display sorting indicator */}
                    {sortConfig?.key === header && (
                      <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                  {renderRow(item)}
                  {renderIcons &&
                    renderIcons(item).map((icon, iconIndex) => (
                      <td key={iconIndex}>{icon}</td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`pagination-button ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Table;
