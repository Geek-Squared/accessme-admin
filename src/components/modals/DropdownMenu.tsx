import React, { useEffect, useRef } from "react";

interface DropdownMenuProps {
  isOpen: boolean;
  itemId: string; // Generic identifier for the item
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  itemId,
  onEdit,
  onDelete,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="dropdown-menu">
      <button onClick={() => onEdit(itemId)} className="dropdown-item">
        Edit
      </button>
      <button onClick={() => onDelete(itemId)} className="dropdown-item">
        Delete
      </button>
    </div>
  );
};

export default DropdownMenu;
