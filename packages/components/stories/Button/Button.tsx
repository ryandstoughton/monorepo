import React from "react";

import "./button.css";

type ButtonProps = {
  primary: boolean;
  size: "small" | "medium" | "large";
  label: string;
  onClick: () => void;
  className?: string;
  backgroundColor?: string;
};

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = "medium",
  label,
  className,
  backgroundColor,
  ...props
}: ButtonProps) => {
  const mode = primary ? "button--primary" : "button--secondary";
  return (
    <button
      type="button"
      className={["button", `button--${size}`, mode, className].join(" ")}
      style={backgroundColor ? { backgroundColor } : {}}
      {...props}
    >
      {label}
    </button>
  );
};
