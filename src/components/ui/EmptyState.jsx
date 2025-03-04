// src/components/ui/EmptyState.jsx
import { Link } from "react-router-dom";
import Button from "./Button";

const EmptyState = ({
  title,
  description,
  icon,
  actionText,
  actionLink,
  actionClick,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      {...props}
    >
      {icon && (
        <div className="text-gray-400 dark:text-gray-500 mb-4">{icon}</div>
      )}
      {title && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      {actionText && actionLink && (
        <Button href={actionLink} variant="primary" size="md">
          {actionText}
        </Button>
      )}
      {actionText && actionClick && (
        <Button onClick={actionClick} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
