import "../styles/About.css";

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-content">
        <h2 className="about-title">Our Statement</h2>
        <h3 className="about-subtitle">To the Hikikomori (Homebody’s):</h3>
        <p className="about-text">
          Although the term carries a negative connotation in its origin, this
          is for the ones that would prefer to stay home but also have something
          to show for it when factors determine otherwise.
        </p>
        <div className="about-slogan">
          <p>We got that, we do that, we are that.</p>
        </div>
      </div>
    </section>
  );
};

export default About;
