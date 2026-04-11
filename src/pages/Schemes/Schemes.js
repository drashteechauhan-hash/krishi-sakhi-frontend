import React from "react";
import "./Schemes.css";



function Schemes() {
  const agricultureSchemes = [
    {
      name: "Agriculture Infrastructure Fund",
      description:
        "Provides medium-long term debt financing for projects related to post-harvest management and community farming assets (like warehouses, cold storage, grading/sorting units). Helps reduce post-harvest losses and improve farmer incomes.",
      link: "https://agriinfra.dac.gov.in/",
    },
    {
      name: "PM-Kisan Samman Nidhi",
      description:
        "Direct income support scheme where small and marginal farmers get ₹6,000 per year in three equal installments directly into their bank accounts to ensure financial stability.",
      link: "https://pmkisan.gov.in/",
    },
    {
      name: "ATMA",
      description:
        "Aims to strengthen agricultural extension services at district level. Provides training, exposure visits, demonstrations, and farmer advisory services to promote modern practices.",
      link: "https://extensionreforms.da.gov.in/DashBoard_Statusatma.aspx",
    },
    {
      name: "AGMARKNET",
      description:
        "A nationwide agricultural marketing information network. Provides farmers with daily data on arrivals and prices of commodities across wholesale markets, helping them make better selling decisions.",
      link: "https://agmarknet.gov.in/PriceAndArrivals/arrivals1.aspx",
    },
    {
      name: "Horticulture (MIDH)",
      description:
        "Promotes holistic development of horticulture (fruits, vegetables, flowers, spices, plantation crops). Supports production, post-harvest management, processing, and marketing infrastructure.",
      link: "https://midh.gov.in/",
    },
    {
      name: "Online Pesticide Registration",
      description:
        "A portal for manufacturers/importers to register pesticides legally. Ensures only safe, approved pesticides enter the market for farmer use.",
      link: "#",
    },
    {
      name: "Plant Quarantine Clearance",
      description:
        "An online system to regulate the import/export of plants, seeds, and agricultural products. Prevents entry/spread of pests and diseases while promoting safe trade.",
      link: "https://pqms.cgg.gov.in/pqms-angular/home",
    },
    {
      name: "DBT in Agriculture",
      description:
        "Ensures subsidies (for seeds, fertilizers, equipment) and benefits reach farmers directly into their Aadhaar-linked bank accounts, cutting leakages and delays.",
      link: "https://www.dbtdacfw.gov.in/",
    },
    {
      name: "Pradhanmantri Krishi Sinchayee Yojana",
      description:
        "Focuses on “Har Khet Ko Pani” (water for every field). Promotes efficient irrigation, micro-irrigation (drip/sprinkler), water-use efficiency, and watershed development.",
      link: "https://pmksy.gov.in/mis/frmDashboard.aspx",
    },
    {
      name: "Kisan Call Center",
      description:
        "Farmers can dial 1800-180-1551 (toll-free) to get advice from agri experts in their local language on crops, pests, weather, and schemes.",
      link: "https://mkisan.gov.in/Home/KCCDashboard",
    },
    {
      name: "MKisan",
      description:
        "A mobile-based platform that sends SMS/IVR advisories to farmers about weather, market prices, best practices, and scheme updates in their regional languages.",
      link: "https://mkisan.gov.in/",
    },
    {
      name: "Jaivik Kheti",
      description:
        "An online portal for organic farming. Farmers can sell organic produce, get certification, training, and connect with buyers interested in chemical-free products.",
      link: "http://pgsindia-ncof.gov.in/home.aspx",
    },
    {
      name: "e-Nam",
      description:
        "A pan-India electronic trading portal integrating APMC markets. Enables farmers to sell their produce online, ensuring fair and transparent prices with nationwide buyers.",
      link: "https://enam.gov.in/web/",
    },
    {
      name: "Soil Health Card",
      description:
        "Provides farmers with soil test reports that indicate nutrient status and recommendations. Helps in balanced use of fertilizers, improving soil fertility and reducing costs.",
      link: "https://soilhealth.dac.gov.in/home",
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana",
      description:
        "A crop insurance scheme. Farmers pay a low premium (2% for Kharif, 1.5% for Rabi, 5% for horticultural/commercial crops), and insurance companies cover crop losses due to natural calamities, pests, and diseases.",
      link: "https://pmfby.gov.in/ext/rpt/ssfr_17",
    },
  ];

  const welfareSchemes = [
    {
      name: "Dispute Resolution Rules Gazette notification",
      description:
        "These rules laid out how disputes under farm agreements would be settled. They required setting up a conciliation board first, and if that failed, the matter went to the Sub-Divisional Magistrate for quick resolution, with an option to appeal before an Appellate Authority. The aim was to provide a fast, local, low-cost system instead of lengthy court cases.",
      link: "#",
    },
    {
      name: "Farming Agreement Final Act",
      description:
        "This Act created a framework for contract farming. Farmers could sign written agreements with buyers (companies, exporters, retailers) before sowing, ensuring a guaranteed or pre-decided price and clear terms on quality, quantity, and services. Land could not be sold or mortgaged as part of the agreement. It was meant to give farmers price assurance and access to modern services.",
      link: "#",
    },
    {
      name: "Guidelines farm services Act, 2020",
      description:
        "These were instructions for implementing the above Act. They explained how agreements should be written (in local language, simple terms), what details must be included (price, quality, services, risks), and how responsibilities of farmers and buyers should be shared. They also emphasized fairness, transparency, and clarity in farm contracts.",
      link: "#",
    },
  ];

  return (
    <div className="schemes-container">
      <h1>🌾 Government Schemes for Farmers</h1>

      {/* Agriculture Schemes Table */}
      <h2>Central Govt. Schemes for Agriculture</h2>
      <table>
        <thead>
          <tr>
            <th>Scheme Name</th>
            <th>Description</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {agricultureSchemes.map((scheme, index) => (
            <tr key={index}>
              <td>{scheme.name}</td>
              <td>{scheme.description}</td>
              <td>
                {scheme.link !== "#" ? (
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                    Visit
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Farmer Welfare Schemes Table */}
      <h2>Central Govt. Schemes for Farmer’s Welfare</h2>
      <table>
        <thead>
          <tr>
            <th>Scheme Name</th>
            <th>Description</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {welfareSchemes.map((scheme, index) => (
            <tr key={index}>
              <td>{scheme.name}</td>
              <td>{scheme.description}</td>
              <td>
                {scheme.link !== "#" ? (
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                    Visit
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Schemes;
