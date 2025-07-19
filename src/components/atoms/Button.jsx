import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-lg hover:shadow-xl hover:scale-105 border-0",
    secondary: "bg-gradient-to-r from-secondary-400 to-secondary-500 text-white shadow-lg hover:shadow-xl hover:scale-105 border-0",
    accent: "bg-gradient-to-r from-accent-400 to-accent-500 text-white shadow-lg hover:shadow-xl hover:scale-105 border-0",
    outline: "border-2 border-primary-400 text-primary-400 bg-transparent hover:bg-primary-50 hover:scale-105",
    ghost: "text-primary-400 bg-transparent hover:bg-primary-50 hover:scale-105 border-0"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
    xl: "px-10 py-5 text-xl rounded-2xl"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;