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
      <h2 className="contact-title">Contact Us</h2>

      <div className="contact-container arcade">
        {formSubmitted ? (
          <div className="confirmation-message arcade">
            <p>Your message has been submitted successfully!</p>
            <button onClick={() => setFormSubmitted(false)} className="arcade">
              <RiArrowGoBackLine className="arcade-icon" /> Back to the form
            </button>
          </div>
        ) : (
          <div className="form-container arcade">
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="form-name" value="contact" />
              <p>
                <label htmlFor="name" className="arcade-label">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  autoComplete="name"
                  className="arcade-input"
                />
              </p>
              <p>
                <label htmlFor="email" className="arcade-label">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  autoComplete="email"
                  className="arcade-input"
                />
              </p>

              <p>
                <label htmlFor="message" className="arcade-label">
                  Message:
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  className="arcade-input"
                ></textarea>
              </p>
              <p>
                <button type="submit" className="btn">
                  Submit
                </button>
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
