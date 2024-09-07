import PropTypes from 'prop-types';

const Message = ({ variant, children }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success": // Fixed typo here
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className={`p-4 rounded ${getVariantClass()}`}>
      {children || "Default message"} {/* Provide a default message */}
    </div>
  );
};

// PropTypes validation
Message.propTypes = {
  variant: PropTypes.oneOf(['success', 'error', 'info']), // Define the valid variants
  children: PropTypes.node // Allows any React node as children
};

export default Message;
