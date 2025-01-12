import { FC } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCreateCustomForm from "../../hooks/useCreateCustomForm";
import "./custom.scss";

interface IAddSiteModal {
  isOpen: boolean;
  onClose: () => void;
  siteData?: any;
  siteId?: string;
  onFormCreated?: () => void;
}

interface FormValues {
  name: string;
  description: string;
  fields: {
    name: string;
    type: string;
    required: boolean;
    useScanner: boolean;
    test: string;
  }[];
}

const AddCustomFieldsModal: FC<IAddSiteModal> = ({
  isOpen,
  onClose,
  siteId,
  onFormCreated,
}) => {
  const { control, register, handleSubmit, reset, watch, setValue } =
    useForm<FormValues>({
      defaultValues: {
        name: "",
        description: "",
        fields: [
          { name: "", type: "TEXT", required: false, useScanner: false, test: "111" },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const { createCategory, isLoading } = useCreateCustomForm();

  const onSubmit = async (data: FormValues) => {
    // Show loading toast
    const loadingToast = toast.loading("Creating form...", {
      position: "top-right",
    });

    try {
      await createCategory({
        name: data.name,
        description: data.description,
        siteId: 1,
        fields: data.fields,
      });
      
      // Update loading toast to success
      toast.update(loadingToast, {
        render: "Form created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      
      reset();
      onClose();
      if (onFormCreated) {
        onFormCreated();
      }
    } catch (error) {
      console.error("Error creating category:", error);
      
      // Update loading toast to error
      toast.update(loadingToast, {
        render: "Failed to create form. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="custom-modal-overlay" onClick={onClose}>
        <div
          className="custom-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="custom-close-icon" onClick={onClose}>
            &times;
          </button>
          <h2 className="custom-modal-header">
            {siteId ? "Edit Form" : "Add Form"}
          </h2>
          <div className="custom-scrollable-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="custom-form-group">
                <label>Category Name</label>
                <input
                  className="custom-input"
                  {...register("name", {
                    required: "Category name is required",
                  })}
                  placeholder="e.g. Delivery"
                />
              </div>
              <div className="custom-form-group">
                <label>Category Description</label>
                <textarea
                  className="custom-textarea"
                  {...register("description")}
                  placeholder="Enter category description"
                />
              </div>
              <div className="custom-form-group">
                <label>Category Fields</label>
                {fields.map((field, index) => {
                  const fieldType = watch(`fields.${index}.type`);
                  return (
                    <div className="custom-dynamic-field" key={field.id}>
                      <input
                        className="custom-input"
                        {...register(`fields.${index}.name`, {
                          required: "Field name is required",
                        })}
                        placeholder="Field Name"
                      />
                      <select
                        className="custom-select"
                        {...register(`fields.${index}.type`)}
                      >
                        {[
                          { label: "Text", value: "TEXT" },
                          { label: "Number", value: "NUMBER" },
                          { label: "Date", value: "DATE" },
                          { label: "Yes/No", value: "BOOLEAN" },
                          { label: "Phone Number", value: "PHONE" },
                          { label: "Email Address", value: "EMAIL" },
                          { label: "ID Number", value: "IDNUMBER" },
                          {
                            label: "Driver's Licence",
                            value: "DRIVERSLICENCE",
                          },
                        ].map(({ label, value }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <label>
                        <input
                          type="checkbox"
                          {...register(`fields.${index}.required`)}
                        />
                        Required
                      </label>
                      {(fieldType === "IDNUMBER" ||
                        fieldType === "DRIVERSLICENCE") && (
                        <label>
                          <input
                            type="checkbox"
                            {...register(`fields.${index}.useScanner`)}
                            onChange={(e) =>
                              setValue(
                                `fields.${index}.useScanner`,
                                e.target.checked
                              )
                            }
                          />
                          Enable Scanner
                        </label>
                      )}
                      <Trash2
                        className="custom-delete-icon"
                        onClick={() => remove(index)}
                        role="button"
                        aria-label="Delete field"
                      />
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="custom-add-field-btn"
                  onClick={() =>
                    append({
                      name: "",
                      type: "TEXT",
                      required: false,
                      useScanner: false,
                      test: "11222"
                    })
                  }
                >
                  + Add Custom Field
                </button>
              </div>
              <button
                type="submit"
                className="custom-submit-btn"
                disabled={isLoading}
              >
                {isLoading
                  ? "Submitting..."
                  : siteId
                    ? "Save Changes"
                    : "Add Form"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddCustomFieldsModal;