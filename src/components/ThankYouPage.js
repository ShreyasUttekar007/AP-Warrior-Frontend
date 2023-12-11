import React from "react";
import "../css/thankYouPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const ThankYouPage = () => {
  const whatsappGroupUrl = "https://chat.whatsapp.com/BsEeDUSl1kc4RiDfMTQgkX";

  const redirectToWhatsApp = () => {
    window.location.href = `https://wa.me/${whatsappGroupUrl}`;
  };

  return (
    <div className="main">
      <div className="thank-you-container">
        <h1>Thank you for your response!!</h1>
        <button onClick={redirectToWhatsApp}>
          <FontAwesomeIcon icon={faWhatsapp} className="whatsapp-icon" />
          Click here to join the WhatsApp Group
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
