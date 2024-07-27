import React, { useState } from "react";
import "../styles/Contact.css";
import { RiArrowGoBackLine } from "react-icons/ri";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => setFormSubmitted(true))
      .catch((error) => alert(error));
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {formSubmitted ? (
          <div className="confirmation-message">
            <p>Your message has been submitted successfully!</p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="arcade-button"
            >
              <RiArrowGoBackLine className="arcade-icon" /> Back to the Form
            </button>
          </div>
        ) : (
          <form
            name="contact"
            method="POST"
            netlify-honeypot="bot-field"
            data-netlify="true"
            onSubmit={handleSubmit}
            className="contact-form"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Don’t fill this out if you’re human: <input name="bot-field" />
              </label>
            </p>
            <label className="form-label">
              Name:
              <input type="text" name="name" required />
            </label>
            <label className="form-label">
              Email:
              <input type="email" name="email" required />
            </label>
            <label className="form-label">
              Message:
              <textarea name="message" required></textarea>
            </label>
            <button type="submit" className="arcade-button">
              Submit
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
