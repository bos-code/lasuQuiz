import { useField } from "formik";

interface CheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox = ({
  name,
  label,
  disabled = false,
  className = "",
}: CheckboxProps) => {
  const [field, meta] = useField({ name, type: "checkbox" });

  return (
    <div className={`mb-4 ${className}`}>
      <label className="flex items-center cursor-pointer">
        <input
          {...field}
          type="checkbox"
          disabled={disabled}
          className={`w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        <span className="ml-3 text-sm text-gray-300">{label}</span>
      </label>
      {meta.touched && meta.error && (
        <p className="mt-1.5 text-sm text-red-400">{meta.error}</p>
      )}
    </div>
  );
};


