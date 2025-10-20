import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto", 
        padding: "2rem",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        color: "#333",
      }}
    >
      <h1
        style={{
          color: "#329494",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        Privacy Policy & Disclaimer
      </h1>

      <p>
        Welcome to our Fitness Tracking App. Your privacy and safety are very
        important to us. Please read this carefully to understand how your data
        is handled and how you can use our services safely.
      </p>

      <h3 style={{ marginTop: "1.5rem" }}>1. Health and Safety Disclaimer</h3>
      <p>
        The workouts and exercises provided in this app are designed for general
        fitness purposes only. They are <b>not a replacement for professional
        medical advice</b>. If you have any medical or physical condition (such
        as heart disease, asthma, joint pain, or injury), please consult your
        doctor before attempting any workout.
      </p>
      <p>
        By using this app, you agree that you are performing exercises
        voluntarily and at your own risk. The app creators are not responsible
        for any injury, health issue, or discomfort that may result from using
        this application.
      </p>

      <div
        style={{
          background: "#e9f8f8",
          padding: "12px 16px",
          borderRadius: "8px",
          marginTop: "1rem",
          fontWeight: 500,
        }}
      >
        ⚠️ <b>Important:</b> If you have any pre-existing medical or physical
        condition, please avoid workouts that could worsen your condition and
        seek professional medical guidance before continuing.
      </div>

      <h3 style={{ marginTop: "1.5rem" }}>2. Data Privacy</h3>
      <p>
        We respect your privacy. Any information you share with us  such as
        your name, email, or fitness data  is used only to improve your
        experience within the app. We never sell or share your personal data
        with third parties.
      </p>

      <h3 style={{ marginTop: "1.5rem" }}>3. Usage Consent</h3>
      <p>
        By using our app, you consent to this Privacy Policy and agree to the
        collection and use of your information as described.
      </p>

      <h3 style={{ marginTop: "1.5rem" }}>4. Updates</h3>
      <p>
        This policy may be updated from time to time. We recommend checking this
        page regularly to stay informed of any changes.
      </p>

      <p style={{ marginTop: "2rem" }}>
        For any queries, please contact our support team through the Contact
        page.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
