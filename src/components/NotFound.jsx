import { useNavigate } from "react-router-dom";
import "../styles/NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="not-found-container">
      <div className="arcade">
        <div className="arcade-screen">
          <div className="arcade-text">
            <h1 className="error-code">404</h1>
            <p className="error-message">Oops! Page not found.</p>
            <p className="error-instruction">
              Insert coin to go back to the homepage.
            </p>
          </div>
        </div>
        <div className="arcade-buttons">
          <button className="arcade-button" onClick={handleGoHome}>
            Insert Coin
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
