import { InputHTMLAttributes, forwardRef } from "react";
import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, ...props }, ref) => {
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input ref={ref} id={id} className="field-input" {...props} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
});
Input.displayName = "Input";
