import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className,
  containerClassName,
  ...props
}: InputProps) => {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-foreground/70 ml-1">
          {label}
        </label>
      )}
      <div className="relative group/input">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within/input:text-primary-500 transition-colors">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-background border-2 border-border rounded-2xl px-4 py-3 text-base transition-all duration-300 outline-none",
            "focus:border-primary-500 focus:shadow-lg focus:shadow-primary-500/10",
            "placeholder:text-foreground/30",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-foreground/5",
            leftIcon && "pl-12",
            rightIcon && "pr-12",
            error && "border-red-500 focus:border-red-500 focus:shadow-red-500/10",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within/input:text-primary-500 transition-colors">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500 ml-1 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};
