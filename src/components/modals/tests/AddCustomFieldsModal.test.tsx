//@ts-ignore
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { toast } from 'react-toastify';
import useCreateCustomForm from '../../../hooks/useCreateCustomForm';
import AddCustomFieldsModal from '../AddCustomFieldsModal';

// Mock the custom hook
jest.mock('../../hooks/useCreateCustomForm');
// Mock react-toastify
jest.mock('react-toastify');

describe('AddCustomFieldsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnFormCreated = jest.fn();
  const mockCreateCategory = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementation for the custom hook
    (useCreateCustomForm as jest.Mock).mockReturnValue({
      createCategory: mockCreateCategory,
      isLoading: false
    });
  });

  it('should not render when isOpen is false', () => {
    render(
      <AddCustomFieldsModal
        isOpen={false}
        onClose={mockOnClose}
        onFormCreated={mockOnFormCreated}
      />
    );
    
    expect(screen.queryByText('Add Form')).not.toBeInTheDocument();
  });

  it('should render the modal with initial field when isOpen is true', () => {
    render(
      <AddCustomFieldsModal
        isOpen={true}
        onClose={mockOnClose}
        onFormCreated={mockOnFormCreated}
      />
    );

    expect(screen.getByText('Add Form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Field Name')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('should add a new field when clicking Add Custom Field button', async () => {
    render(
      <AddCustomFieldsModal
        isOpen={true}
        onClose={mockOnClose}
        onFormCreated={mockOnFormCreated}
      />
    );

    const addButton = screen.getByText('+ Add Custom Field');
    await userEvent.click(addButton);

    const fieldInputs = screen.getAllByPlaceholderText('Field Name');
    expect(fieldInputs).toHaveLength(2);
  });

  it('should remove a field when clicking delete button', async () => {
    render(
      <AddCustomFieldsModal
        isOpen={true}
        onClose={mockOnClose}
        onFormCreated={mockOnFormCreated}
      />
    );

    // Add a new field first
    const addButton = screen.getByText('+ Add Custom Field');
    await userEvent.click(addButton);

    // Get all delete buttons and click the last one
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete field' });
    await userEvent.click(deleteButtons[deleteButtons.length - 1]);

    const fieldInputs = screen.getAllByPlaceholderText('Field Name');
    expect(fieldInputs).toHaveLength(1);
  });

  it('should show scanner checkbox only for ID number and driver\'s licence fields', async () => {
    render(
      <AddCustomFieldsModal
        isOpen={true}
        onClose={mockOnClose}
        onFormCreated={mockOnFormCreated}
      />
    );

    const typeSelect = screen.getByRole('combobox');

    // Initially scanner checkbox should not be visible
    expect(screen.queryByText('Enable Scanner')).not.toBeInTheDocument();

    // Change to ID NUMBER
    await userEvent.selectOptions(typeSelect, 'IDNUMBER');
    expect(screen.getByText('Enable Scanner')).toBeInTheDocument();

    // Change to DRIVERSLICENCE
    await userEvent.selectOptions(typeSelect, 'DRIVERSLICENCE');
    expect(screen.getByText('Enable Scanner')).toBeInTheDocument();

    // Change to TEXT
    await userEvent.selectOptions(typeSelect, 'TEXT');
    expect(screen.queryByText('Enable Scanner')).not.toBeInTheDocument();
  });

  it('should submit form data correctly', async () => {
    // const mockToastLoading = jest.fn();
    const mockToastUpdate = jest.fn();
    (toast.loading as jest.Mock).mockReturnValue('toast-id');
    (toast.update as jest.Mock).mockImplementation(mockToastUpdate);

    render(
      <AddCustomFieldsModal
        isOpen={true}
        onClose={mockOnClose}
        onFormCreated={mockOnFormCreated}
      />
    );

    // Fill in the form
    await userEvent.type(screen.getByPlaceholderText('e.g. Delivery'), 'Test Category');
    await userEvent.type(screen.getByPlaceholderText('Enter category description'), 'Test Description');
    await userEvent.type(screen.getByPlaceholderText('Field Name'), 'Test Field');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Add Form' });
    await userEvent.click(submitButton);

    // Verify the submission
    await waitFor(() => {
      expect(mockCreateCategory).toHaveBeenCalledWith({
        name: 'Test Category',
        description: 'Test Description',
        siteId: 1,
        fields: [
          expect.objectContaining({
            name: 'Test Field',
            type: 'TEXT',
            required: false,
            useScanner: false
          })
        ]
      });
    });

    // Verify success actions
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnFormCreated).toHaveBeenCalled();
    expect(mockToastUpdate).toHaveBeenCalledWith('toast-id', expect.objectContaining({
      type: 'success'
    }));
  });

  it('should handle submission errors', async () => {
    const error = new Error('Submission failed');
    mockCreateCategory.mockRejectedValueOnce(error);
    
    // const mockToastLoading = jest.fn();
    const mockToastUpdate = jest.fn();
    (toast.loading as jest.Mock).mockReturnValue('toast-id');
    (toast.update as jest.Mock).mockImplementation(mockToastUpdate);

    render(
      <AddCustomFieldsModal
        isOpen={true}
        onClose={mockOnClose}
        onFormCreated={mockOnFormCreated}
      />
    );

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Add Form' });
    await userEvent.click(submitButton);

    // Verify error handling
    await waitFor(() => {
      expect(mockToastUpdate).toHaveBeenCalledWith('toast-id', expect.objectContaining({
        type: 'error'
      }));
    });
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockOnFormCreated).not.toHaveBeenCalled();
  });
});