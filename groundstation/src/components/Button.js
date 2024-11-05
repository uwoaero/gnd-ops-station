// components/Button.js
const Button = ({ color, onClick, children }) => {
  const baseStyles = "px-4 py-2 rounded focus:outline-none focus:ring focus:ring-opacity-50";
  const colorStyles = {
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    green: "bg-green-500 text-white hover:bg-green-600",
    red: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button className={`${baseStyles} ${colorStyles[color]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
