import React, { useState } from "react";

const FloatingField = ({
  label,
  value,
  onChange,
  required,
  icon,
  type = "text", 
  textarea = false, 
  select = false,
  options = [],
  rows = 4,
  floatAlways = false,
}) => {
  const [focused, setFocused] = useState(false);

  const selectedOption = select ? options.find((o) => String(o.value) === String(value)) : null;
  const hasIcon = Boolean(icon || selectedOption?.icon);

  const sharedClasses = `
    peer w-full ${hasIcon ? "pl-10" : "pl-3"} pt-5 pb-2
    border border-gray-800 rounded-xl text-gray-900
    placeholder-transparent
    ${type === "datetime-local" ? "hide-calendar-icon": ""}
  `;

  const labelUp = focused || Boolean(value) || floatAlways;

  const emptyDatetimeStyle = 
  type === "datetime-local" && !value && !focused
    ? {color: "transparent",WebkitTextFillColor: "transparent"}
    : undefined;

  return (
    <div className="relative w-full">
      {hasIcon && (
        <span className="absolute left-3 top-5">
          <img src={selectedOption?.icon || icon} alt="" className="w-5 h-5 rounded-sm object-cover" />
        </span>
      )}

      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          rows={rows}
          className={`${sharedClasses} resize-none`}
          placeholder=" "
          style = {emptyDatetimeStyle}
        />
      ) : select ? (
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className={`${sharedClasses} appearance-none`}
          style={emptyDatetimeStyle}
        >
          <option value="" disabled>
            
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className={sharedClasses}
          placeholder=" "
          style={emptyDatetimeStyle}
        />
      )}

      <label
        className={`absolute ${hasIcon ? "left-10" : "left-3"} transition-all duration-200 text-gray-500 pointer-events-none px-1 bg-gray-100
          ${labelUp ? "-top-2 text-md" : "top-4 text-base"}`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingField;
