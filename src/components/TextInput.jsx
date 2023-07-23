import { Controller } from "react-hook-form";
import toast from "react-hot-toast";

function TextInput({ name, control, placeholder, rules, type = "text" }) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div>
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="form-input w-full"
          />
          {error && (
            <span className="text-red-400 text-xs">{error.message}</span>
          )}
        </div>
      )}
    />
  );
}

export default TextInput;
