import React from "react";

import ex1 from "../../assets/ex1.jpg";
import ex2 from "../../assets/ex2.jpg";
import ex3 from "../../assets/ex3.jpg";
import ex4 from "../../assets/ex4.jpg";
import beforeImg from "../../assets/before.jpg";
import afterImg from "../../assets/after.jpg";
function About() {
  const heroImgStyle = { width: "300px", height: "200px", objectFit: "cover", borderRadius: "10px" };
  const featureImgStyle = { width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px" };
  const beforeAfterImgStyle = { width: "300px", height: "200px", objectFit: "cover", borderRadius: "10px" };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      
    {/* Hero Section */}
<section
  style={{
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "20px",
    marginBottom: "50px",
    justifyContent: "space-between",
  }}
>
  {/* Text */}
  <div style={{ flex: "1 1 400px", minWidth: "300px" }}>
    {/* Heading: English + Malayalam */}
    <h2 style={{ fontSize: "24px", color: "#2e7d32", marginBottom: "20px" }}>
      About Krishi Sakhi
      <br />
      കൃഷി സഹകാരിയെക്കുറിച്ച്
    </h2>

    {/* English Content */}
    <div style={{ marginBottom: "20px" }}>
      <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
        Your AI-powered personal farming companion for Kerala farmers.
      </p>
      <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
        Krishi Sakhi is an AI-driven personal farming assistant designed to support smallholder farmers in Kerala. 
        It provides personalized guidance based on your crops, soil type, irrigation, and local weather conditions. 
        Our goal is to empower farmers to make informed decisions, increase productivity, and reduce risks—all through a simple, bilingual interface.
      </p>
    </div>

    {/* Malayalam Content */}
    <div>
      <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
        കേരളത്തിലെ കർഷകർക്ക് വേണ്ടി നിങ്ങളുടെ എഐ അടിസ്ഥാനത്തിലുള്ള വ്യക്തിഗത കൃഷി സഹായി.
      </p>
      <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
        കൃഷി സഹകാരി കേരളത്തിലെ ചെറിയ കർഷകരെ പിന്തുണയ്ക്കുന്നതിനായി രൂപകൽപ്പന ചെയ്ത എഐ-അധിഷ്ഠിത വ്യക്തിഗത കൃഷി സഹായിയാണ്. 
        ഇത് നിങ്ങളുടെ വിളകൾ, മണ്ണിന്റെ തരം, വെള്ളസേചനം, പ്രാദേശിക കാലാവസ്ഥാ നില എന്നിവയുടെ അടിസ്ഥാനത്തിൽ വ്യക്തിഗത ഉപദേശം നൽകുന്നു. 
        നമ്മുടെ ലക്ഷ്യം കർഷകർക്ക് ബോധ്യമായ തീരുമാനങ്ങൾ എടുക്കാൻ, ഉത്പാദനക്ഷമത വർദ്ധിപ്പിക്കാൻ, അപകടങ്ങൾ കുറയ്ക്കാൻ സാധിക്കണമെന്നതാണ്—എല്ലാം ഒരു ലളിതമായ, ബൈലിംഗ്വൽ ഇന്റർഫേസിലൂടെ.
      </p>
    </div>
  </div>

  {/* Image */}
  <div style={{ flex: "1 1 300px", minWidth: "250px", textAlign: "center" }}>
    <img 
      src={ex1} 
      alt="Farmer with mobile" 
      style={{ width: "100%", maxWidth: "350px", height: "auto", borderRadius: "10px" }} 
    />
    {/* Caption removed */}
  </div>
</section>


      {/* Overview Section */}
      <section style={{ marginBottom: "50px" }}>
        <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333", marginBottom: "15px" }}>
          Krishi Sakhi is an AI-driven personal farming assistant designed to support smallholder farmers in Kerala. 
          It provides personalized guidance based on your crops, soil type, irrigation, and local weather conditions. 
          Our goal is to empower farmers to make informed decisions, increase productivity, and reduce risks—all through a simple, bilingual interface.
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333", marginBottom: "30px" }}>
          കൃഷി സഹകാരി കേരളത്തിലെ ചെറിയ കർഷകരെ പിന്തുണയ്ക്കുന്നതിനായി രൂപകൽപ്പന ചെയ്ത എഐ-അധിഷ്ഠിത വ്യക്തിഗത കൃഷി സഹായിയാണ്. 
          ഇത് നിങ്ങളുടെ വിളകൾ, മണ്ണിന്റെ തരം, വെള്ളസേചനം, പ്രാദേശിക കാലാവസ്ഥാ നില എന്നിവയുടെ അടിസ്ഥാനത്തിൽ വ്യക്തിഗത ഉപദേശം നൽകുന്നു. 
          നമ്മുടെ ലക്ഷ്യം കർഷകർക്ക് ബോധ്യമായ തീരുമാനങ്ങൾ എടുക്കാൻ, ഉത്പാദനക്ഷമത വർദ്ധിപ്പിക്കാൻ, അപകടങ്ങൾ കുറയ്ക്കാൻ സാധിക്കണമെന്നതാണ്—എല്ലാം ഒരു ലളിതമായ, ബൈലിംഗ്വൽ ഇന്റർഫേസിലൂടെ.
        </p>
      </section>

      {/* Features Section */}
      <section style={{ marginBottom: "50px" }}>
        <h3 style={{ fontSize: "22px", color: "#2e7d32", marginBottom: "20px" }}>
          Core Features / പ്രധാന സവിശേഷതകൾ
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ flex: "1 1 250px", textAlign: "center", border: "1px solid #ddd", borderRadius: "10px", padding: "15px" }}>
            <img src={ex2} alt="Farmer Profile" style={featureImgStyle} />
            <h4 style={{ marginBottom: "10px" }}>Farmer & Farm Profiling / കർഷക-ഫാം പ്രൊഫൈലിംഗ്</h4>
            <p style={{ marginBottom: "15px" }}>
              Capture details like location, crop, soil, and irrigation.
            </p>
            <p style={{ marginBottom: "0px" }}>
              സ്ഥാനം, വിള, മണ്ണ്, വെള്ളസേചനം എന്നിവ രേഖപ്പെടുത്തുക.
            </p>
          </div>
          <div style={{ flex: "1 1 250px", textAlign: "center", border: "1px solid #ddd", borderRadius: "10px", padding: "15px" }}>
            <img src={ex3} alt="Digital Diary" style={featureImgStyle} />
            <h4 style={{ marginBottom: "10px" }}>Digital Diary / ഡിജിറ്റൽ ഡയറി</h4>
            <p style={{ marginBottom: "15px" }}>
              Log daily activities like sowing, irrigation, and pest management.
            </p>
            <p style={{ marginBottom: "0px" }}>
              സെയിംഗ്, വെള്ളസേചനം, കീടനിയന്ത്രണം തുടങ്ങിയ ദിനചര്യ പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്തുക.
            </p>
          </div>
          <div style={{ flex: "1 1 250px", textAlign: "center", border: "1px solid #ddd", borderRadius: "10px", padding: "15px" }}>
            <img src={ex4} alt="AI Advisory" style={featureImgStyle} />
            <h4 style={{ marginBottom: "10px" }}>AI-Powered Advisory / എഐ-അധിഷ്ഠിത ഉപദേശം</h4>
            <p style={{ marginBottom: "15px" }}>
              Get context-aware recommendations for crops, weather, and pests.
            </p>
            <p style={{ marginBottom: "0px" }}>
              വിളകൾ, കാലാവസ്ഥ, കീടങ്ങൾ എന്നിവയുടെ അടിസ്ഥാനത്തിൽ അനുയോജ്യമായ ഉപദേശം ലഭിക്കുക.
            </p>
          </div>
        </div>
      </section>

      {/* Before & After Section */}
      <section style={{ textAlign: "center", marginBottom: "50px" }}>
        <h3 style={{ fontSize: "22px", color: "#2e7d32", marginBottom: "20px" }}>
          Before & After Using Krishi Sakhi / കൃഷി സഹകാരി ഉപയോഗിക്കുന്നതിന് മുമ്പും ശേഷവും
        </h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <img src={beforeImg} alt="Before Krishi Sakhi" style={beforeAfterImgStyle} />
            <p style={{ marginTop: "10px" }}>Before using Krishi Sakhi / മുമ്പ്</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <img src={afterImg} alt="After Krishi Sakhi" style={beforeAfterImgStyle} />
            <p style={{ marginTop: "10px" }}>After using Krishi Sakhi / ശേഷം</p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section style={{ marginBottom: "50px" }}>
        <h3 style={{ fontSize: "22px", color: "#2e7d32", marginBottom: "15px" }}>Our Impact / നമ്മുടെ സ്വാധീനം</h3>
        <ul style={{ listStyleType: "disc", paddingLeft: "20px", fontSize: "16px", lineHeight: "1.5", color: "#333", marginBottom: "15px" }}>
          <li>Empowers farmers with personalized, on-demand support.   കർഷകർക്ക് വ്യക്തിഗത, ആവശ്യാനുസരണം പിന്തുണ നൽകുന്നു.</li>
          <li>Bridges the knowledge gap for smallholder farmers.   ചെറിയ കർഷകർക്ക് വിജ്ഞാനതാൽപര്യം പാലിക്കുന്നു.</li>
          <li>Promotes sustainable farming practices.    സുസ്ഥിര കൃഷി രീതികളെ പ്രോത്സാഹിപ്പിക്കുന്നു.</li>
          <li>Acts as a digital companion throughout the crop cycle.    വിള ചക്രത്തിനിടയിലെ ഡിജിറ്റൽ കൂട്ടുകാരനായി പ്രവർത്തിക്കുന്നു.</li>
        </ul>
        <p style={{ fontWeight: "bold", color: "#1b5e20", fontSize: "18px" }}>
          Join Krishi Sakhi today and grow smarter with AI guidance!    ഇന്ന് കൃഷി സഹകാരിയിലേക്ക് ചേർന്നു എഐ ഉപദേശത്തോടെ ബുദ്ധിമുട്ടുകൾ കുറയ്ക്കുക!
        </p>
      </section>

    </div>
  );
}

export default About;

