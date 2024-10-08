import { useState } from "react";
import "../styles/Contact.css";
import { RiArrowGoBackLine } from "react-icons/ri";
import SectionTitle from "./SectionTitle";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <section className="contact-section">
      <SectionTitle title="Contact" />
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
            onSubmit={() => setFormSubmitted(true)}
            className="contact-form"
          >
            {/* Hidden form field for Netlify */}
            <input type="hidden" name="form-name" value="contact" />

            {/* Honeypot field to prevent spam */}
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
              Company (Optional):
              <input type="text" name="company" />
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
