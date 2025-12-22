// components/Spinner.jsx
import "./spinner.css";

const Spinner = ({ text = "Loading..." }) => {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
};

export default Spinner;
