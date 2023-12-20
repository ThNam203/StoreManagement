import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { set } from "date-fns";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showBorderOnFocus?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          props.showBorderOnFocus === undefined || props.showBorderOnFocus
            ? "focus-visible:ring-[1px] focus-visible:ring-[#00b4d8]"
            : "focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };
    return (
      <div className={cn("relative flex flex-row items-center", className)}>
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-offset-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
          ref={ref}
          {...props}
        />
        {showPassword ? (
          <Eye
            className="absolute right-4 h-5 w-5 cursor-pointer text-gray-400"
            onClick={togglePasswordVisibility}
          />
        ) : (
          <EyeOff
            className="absolute right-4 h-5 w-5 cursor-pointer text-gray-400"
            onClick={togglePasswordVisibility}
          />
        )}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
