import { useField } from "formik";

interface TextAreaProps {
  name: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export const TextArea = ({
  name,
  label,
  placeholder,
  rows = 4,
  disabled = false,
  className = "",
}: TextAreaProps) => {
  const [field, meta] = useField(name);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        {...field}
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors resize-none ${
          meta.touched && meta.error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-600 focus:ring-purple-500 focus:border-purple-500"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {meta.touched && meta.error && (
        <p className="mt-1.5 text-sm text-red-400">{meta.error}</p>
      )}
    </div>
  );
};


