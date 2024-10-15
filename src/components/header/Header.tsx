import React from "react";
import "./styles.scss";
import useOrgStyles from "../../hooks/useOrgStyles";

interface HeaderProps {
  buttonName: string;
  onClick?: () => void;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isHeaderButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  buttonName,
  onClick,
  onSearchChange,
  isHeaderButton = true,
}) => {

  useOrgStyles()

  return (
    <div className="header">
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
    </div>
  );
};

export default Header;
