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
  onEditRows?: (selectedRows: any[]) => void;
  isVisitors?: boolean;  // New prop for visitor-specific logic
  onDownloadClick?: (filteredData: any[]) => void;  // Pass filtered data
  startDate?: Date | null;  // Date range state
  endDate?: Date | null;
  onStartDateChange?: (date: Date | null) => void;
  onEndDateChange?: (date: Date | null) => void;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  renderRow,
  buttonName,
  onButtonClick,
  emptyStateImage,
  emptyStateMessage,
  renderIcons,
  isHeader = true,
  itemsPerPage = 5,
  isVisitors = false, // Default to false
  onDownloadClick,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleSort = (header: string) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig?.key === header) {
        return { key: header, direction: prevSortConfig.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key: header, direction: "asc" };
      }
    });
  };

  const compare = (a: any, b: any) => {
    const key = sortConfig?.key || "";
    if (a[key] < b[key]) return sortConfig?.direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return sortConfig?.direction === "asc" ? 1 : -1;
    return 0;
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = sortConfig ? filteredData.sort(compare) : filteredData;
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <Header
        buttonName={buttonName}
        onClick={onButtonClick}
        onSearchChange={handleSearchChange}
        isHeaderButton={isHeader}
        isVisitors={isVisitors}  // Pass the isVisitors prop
        startDate={startDate}     // Pass the start date
        endDate={endDate}         // Pass the end date
        onStartDateChange={onStartDateChange}   // Handle start date change
        onEndDateChange={onEndDateChange}       // Handle end date change
        onDownloadClick={() => onDownloadClick?.(filteredData)}  // Pass filtered data
      />

      {sortedData.length === 0 ? (
        <div className="empty-state-container">
          {emptyStateImage && <img src={emptyStateImage} alt="No data available" className="empty-state-image" />}
          {emptyStateMessage && <p className="empty-state-message">{emptyStateMessage}</p>}
        </div>
      ) : (
        <>
          <table className="table-container">
            <thead>
              <tr>
                <th>
                  {/* <input
                    type="checkbox"
                    onChange={(e) => {
                      const allSelected = e.target.checked;
                      setSelectedRows(
                        allSelected ? new Set(currentData.map((_, idx) => idx)) : new Set()
                      );
                    }}
                  /> */}
                </th>
                {headers.map((header, index) => (
                  <th key={index} onClick={() => handleSort(header)}>
                    {header}
                    {sortConfig?.key === header && <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(index)}
                      onChange={() => setSelectedRows(prev => new Set(prev).add(index))}
                    />
                  </td>
                  {renderRow(item)}
                  {renderIcons && renderIcons(item).map((icon, iconIndex) => <td key={iconIndex}>{icon}</td>)}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-button">
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Table;