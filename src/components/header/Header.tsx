import React from "react";
import "./styles.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useOrgStyles from "../../hooks/useOrgStyles";

interface HeaderProps {
  buttonName: string;
  onClick?: () => void;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isHeaderButton?: boolean;
  isVisitors?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  onStartDateChange?: (date: Date | null) => void;
  onEndDateChange?: (date: Date | null) => void;
  onDownloadClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  buttonName,
  onClick,
  onSearchChange,
  isHeaderButton = true,
  isVisitors = false,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onDownloadClick,
}) => {
  useOrgStyles();

  return (
    <div className="header">
      {/* Search container on the left */}
      <div className="search-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="search-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          onChange={onSearchChange}
          className="search-input"
        />
      </div>

      {/* Right-side controls */}
      <div className="right-controls">
        {/* Add button - Visible everywhere */}
        {isHeaderButton && (
          <button className="add-element" onClick={onClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            {buttonName}
          </button>
        )}

        {/* Visitors-specific controls for date filters and download */}
        {isVisitors && (
          <div className="visitors-controls">
            {/* Date range picker */}
            <div className="date-filter">
              <DatePicker
                selected={startDate}
                onChange={onStartDateChange}
                selectsStart
                //@ts-expect-error
                startDate={startDate}
                //@ts-expect-error
                endDate={endDate}
                placeholderText="Filter Start Date"
              />
              <DatePicker
                selected={endDate}
                onChange={onEndDateChange}
                selectsEnd
                //@ts-expect-error
                startDate={startDate}
                //@ts-expect-error
                endDate={endDate}
                placeholderText="Filter End Date"
              />
            </div>

            <button className="add-element" onClick={onDownloadClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                width="16"
                height="16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                />
              </svg>
              Download Visitors Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
