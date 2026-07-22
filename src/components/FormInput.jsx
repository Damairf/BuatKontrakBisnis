export default function FormInput({ label, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-gray-700 font-medium text-xs mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-500 transition-all"
      />
    </div>
  );
}
