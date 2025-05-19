// src/components/ui/card.tsx
import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={
        "bg-white shadow-md rounded border border-gray-200 " + (className ?? "")
      }
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={"p-4 " + (className ?? "")}>
      {children}
    </div>
  );
};
