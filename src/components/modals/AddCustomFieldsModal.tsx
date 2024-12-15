import { FC } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import useCreateCustomForm from "../../hooks/useCreateCustomForm";

// Props interface for the modal
interface IAddSiteModal {
  isOpen: boolean;
  onClose: () => void;
  siteData?: any;
  siteId?: string;
}

interface FormValues {
  name: string;
  description: string;
  fields: {
    name: string;
    type: string;
    required: boolean;
  }[];
}

const AddCustomFieldsModal: FC<IAddSiteModal> = ({
  isOpen,
  onClose,
  siteId,
}) => {
  const { control, register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      fields: [{ name: "", type: "TEXT", required: false }], 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const { createCategory, isLoading } = useCreateCustomForm();

  const onSubmit = async (data: FormValues) => {
    try {
      await createCategory({
        name: data.name,
        description: data.description,
        siteId: 1,
        fields: data.fields,
      });
      toast.success("Category created successfully!");
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button className="close-icon" onClick={onClose}>
            &times;
          </button>

          {/* Modal Header */}
          <h2 className="modal-header">{siteId ? "Edit Form" : "Add Form"}</h2>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Category Name */}
            <div className="form-group">
              <label>Category Name</label>
              <input
                {...register("name", { required: "Category name is required" })}
                placeholder="e.g. Delivery"
              />
            </div>

            {/* Category Description */}
            <div className="form-group">
              <label>Category Description</label>
              <textarea
                {...register("description")}
                placeholder="Enter category description"
              />
            </div>

            {/* Dynamic Fields */}
            <div className="form-group">
              <label>Category Fields</label>
              {fields.map((field, index) => (
                <div className="dynamic-field" key={field.id}>
                  {/* Field Name */}
                  <input
                    {...register(`fields.${index}.name`, {
                      required: "Field name is required",
                    })}
                    placeholder="Field Name"
                  />

                  {/* Field Type */}
                  <select {...register(`fields.${index}.type`)}>
                    {[
                      { label: "Text", value: "TEXT" },
                      { label: "Number", value: "NUMBER" },
                      { label: "Date", value: "DATE" },
                      { label: "Yes/No", value: "BOOLEAN" },
                      { label: "Phone Number", value: "PHONE" },
                      { label: "Email Address", value: "EMAIL" },
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

                  <button
                    type="button"
                    className="remove-field-btn"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Add Field Button */}
              <button
                type="button"
                className="add-field-btn"
                onClick={() =>
                  append({ name: "", type: "TEXT", required: false })
                }
              >
                + Add Custom Field
              </button>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Submitting..." : siteId ? "Save Changes" : "Add Site"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddCustomFieldsModal;
