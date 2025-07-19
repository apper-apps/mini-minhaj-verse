import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className,
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white shadow-lg hover:shadow-xl",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl",
    colored: "bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg hover:shadow-xl border border-primary-200"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;