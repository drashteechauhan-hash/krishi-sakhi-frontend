import React from "react";
import VideoPopup from "../../components/VideoPopup/VideoPopup";
import { useLanguage } from "../../context/LanguageContext";
import SchemeFeed from "../../components/SchemeFeed/SchemeFeed";

const schemeVideo = "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486726/schemes_qqtyw3.mp4";

const SCHEMES_DATA = {
  agriculture: [
    { nameKey: "agri_infra",       link: "https://agriinfra.dac.gov.in/" },
    { nameKey: "pm_kisan",         link: "https://pmkisan.gov.in/" },
    { nameKey: "atma",             link: "https://extensionreforms.da.gov.in/DashBoard_Statusatma.aspx" },
    { nameKey: "agmarknet",        link: "https://agmarknet.gov.in/PriceAndArrivals/arrivals1.aspx" },
    { nameKey: "midh",             link: "https://midh.gov.in/" },
    { nameKey: "pesticide",        link: "#" },
    { nameKey: "plant_quarantine", link: "https://pqms.cgg.gov.in/pqms-angular/home" },
    { nameKey: "dbt",              link: "https://www.dbtdacfw.gov.in/" },
    { nameKey: "pmksy",            link: "https://pmksy.gov.in/mis/frmDashboard.aspx" },
    { nameKey: "kisan_call",       link: "https://mkisan.gov.in/Home/KCCDashboard" },
    { nameKey: "mkisan",           link: "https://mkisan.gov.in/" },
    { nameKey: "jaivik",           link: "http://pgsindia-ncof.gov.in/home.aspx" },
    { nameKey: "enam",             link: "https://enam.gov.in/web/" },
    { nameKey: "soil_health",      link: "https://soilhealth.dac.gov.in/home" },
    { nameKey: "pmfby",            link: "https://pmfby.gov.in/ext/rpt/ssfr_17" },
  ],
  welfare: [
    { nameKey: "dispute",           link: "#" },
    { nameKey: "farming_agreement", link: "#" },
    { nameKey: "guidelines",        link: "#" },
  ],
};

function SchemeRow({ nameKey, link, index }) {
  const { t } = useLanguage();
  const name = t(`scheme_${nameKey}_name`);
  const desc = t(`scheme_${nameKey}_desc`);

  return (
    <tr className={index % 2 === 0 ? "row-even" : "row-odd"}>
      <td className="scheme-name-cell">
        <span className="scheme-dot" />
        {name}
      </td>
      <td className="scheme-desc-cell">{desc}</td>
      <td className="scheme-link-cell">
        {link !== "#" ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="scheme-link">
            {t("schemes_visit")}
          </a>
        ) : (
          <span className="scheme-na">{t("schemes_na")}</span>
        )}
      </td>
    </tr>
  );
}

function Schemes() {
  const { t } = useLanguage();

  return (
    <><SchemeFeed />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .sc-page {
          font-family: 'DM Sans', Arial, sans-serif;
          color: #2c2c2a;
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .sc-header { margin-bottom: 40px; }
        .sc-eyebrow {
          font-size: 10px; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; color: #3b6d11; margin-bottom: 10px;
        }
        .sc-title {
          font-size: clamp(1.7rem, 4vw, 2.4rem); font-weight: 700;
          color: #173404; line-height: 1.15; margin: 0 0 10px;
        }
        .sc-subtitle {
          font-size: 15px; color: #5f5e5a; line-height: 1.6;
          max-width: 560px; margin: 0;
        }

        .sc-video-wrap {
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
          align-items: center; background: #eaf3de; border: 1px solid #c0dd97;
          border-radius: 16px; padding: 24px; margin-bottom: 52px;
        }
        @media(max-width: 680px) { .sc-video-wrap { grid-template-columns: 1fr; } }
        .sc-video-wrap video { width: 100%; border-radius: 10px; display: block; background: #000; }
        .sc-video-info h3 { font-size: 1.1rem; font-weight: 700; color: #173404; margin: 0 0 8px; }
        .sc-video-info p { font-size: 13.5px; color: #3b6d11; margin: 0 0 16px; }
        .sc-video-badge {
          display: inline-block; background: #97c459; color: #173404;
          font-size: 11px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; padding: 5px 14px; border-radius: 20px;
        }

        .sc-section-head { margin-bottom: 20px; }
        .sc-section-title {
          font-size: 1.15rem; font-weight: 700; color: #173404;
          margin: 0 0 4px; display: flex; align-items: center; gap: 10px;
        }
        .sc-section-title::before {
          content: ''; display: inline-block; width: 4px; height: 20px;
          background: #639922; border-radius: 2px; flex-shrink: 0;
        }
        .sc-section-sub { font-size: 13px; color: #888780; padding-left: 14px; margin: 0; }

        .sc-table-wrap {
          border: 1px solid #c0dd97; border-radius: 14px;
          overflow: hidden; margin-bottom: 48px;
        }
        .sc-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .sc-table thead tr { background: #eaf3de; }
        .sc-table th {
          padding: 13px 16px; text-align: left; font-size: 10px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase; color: #3b6d11;
          border-bottom: 1px solid #c0dd97;
        }
        .sc-table th:last-child { text-align: center; }
        .row-even { background: #fff; }
        .row-odd  { background: #f7faf0; }
        .sc-table tr:not(:last-child) td { border-bottom: 1px solid #eaf3de; }
        .sc-table tr:hover td { background: #eaf3de; transition: background 0.15s; }
        .scheme-name-cell {
          padding: 14px 16px; font-weight: 600; color: #27500a;
          display: flex; align-items: flex-start; gap: 10px; min-width: 180px;
        }
        .scheme-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #639922; flex-shrink: 0; margin-top: 6px;
        }
        .scheme-desc-cell { padding: 14px 16px; color: #5f5e5a; line-height: 1.55; }
        .scheme-link-cell { padding: 14px 16px; text-align: center; white-space: nowrap; }
        .scheme-link {
          display: inline-block; padding: 6px 16px; background: #eaf3de;
          border: 1px solid #97c459; border-radius: 8px; color: #27500a;
          font-size: 12px; font-weight: 700; text-decoration: none;
          transition: background 0.18s, transform 0.18s;
        }
        .scheme-link:hover { background: #97c459; color: #173404; transform: translateY(-1px); }
        .scheme-na { color: #b4b2a9; font-size: 14px; }

        @media(max-width: 640px) {
          .sc-table, .sc-table thead, .sc-table tbody,
          .sc-table th, .sc-table td, .sc-table tr { display: block; }
          .sc-table thead { display: none; }
          .sc-table tr { padding: 12px 16px; border-bottom: 1px solid #eaf3de; }
          .scheme-name-cell, .scheme-desc-cell, .scheme-link-cell {
            padding: 4px 0; min-width: unset; text-align: left;
          }
          .scheme-link-cell { text-align: left; }
        }
      `}</style>

      <div className="sc-page">
        <VideoPopup />

        <div className="sc-header">
          <div className="sc-eyebrow">{t("schemes_eyebrow")}</div>
          <h1 className="sc-title">{t("schemes_title")}</h1>
          <p className="sc-subtitle">{t("schemes_subtitle")}</p>
        </div>

        <div className="sc-video-wrap">
          <video controls>
            <source src={schemeVideo} type="video/mp4" />
          </video>
          <div className="sc-video-info">
            <h3>{t("schemes_video_title")}</h3>
            <p>{t("schemes_video_sub")}</p>
            <span className="sc-video-badge">🎬 Watch Now</span>
          </div>
        </div>

        <div className="sc-section-head">
          <h2 className="sc-section-title">{t("schemes_agri_head")}</h2>
          <p className="sc-section-sub">{t("schemes_agri_sub")}</p>
        </div>
        <div className="sc-table-wrap">
          <table className="sc-table">
            <thead>
              <tr>
                <th>{t("schemes_col_scheme")}</th>
                <th>{t("schemes_col_desc")}</th>
                <th>{t("schemes_col_link")}</th>
              </tr>
            </thead>
            <tbody>
              {SCHEMES_DATA.agriculture.map((s, i) => (
                <SchemeRow key={s.nameKey} nameKey={s.nameKey} link={s.link} index={i} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="sc-section-head">
          <h2 className="sc-section-title">{t("schemes_welfare_head")}</h2>
          <p className="sc-section-sub">{t("schemes_welfare_sub")}</p>
        </div>
        <div className="sc-table-wrap">
          <table className="sc-table">
            <thead>
              <tr>
                <th>{t("schemes_col_scheme")}</th>
                <th>{t("schemes_col_desc")}</th>
                <th>{t("schemes_col_link")}</th>
              </tr>
            </thead>
            <tbody>
              {SCHEMES_DATA.welfare.map((s, i) => (
                <SchemeRow key={s.nameKey} nameKey={s.nameKey} link={s.link} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Schemes;