import React, {useState} from "react";
import {Icon} from "@iconify/react/dist/iconify.js";
import {Link} from "react-router-dom";
import {ROUTES} from "../utils/constants.js";

const LANGUAGES = [
  {
    text: "English",
    code: "en",
  },
  {
    text: "ಕನ್ನಡ",
    code: "kn",
  }
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState(LANGUAGES[0].code);
  return sidebarOpen ? (
    <div id="sidebar">
      <div id="sidebar-header">
        <button id="sidebar-close" onClick={() => setSidebarOpen(false)}>
          <Icon icon="material-symbols:close" color="#FFFFFF" width="24" height="24" />
        </button>
        <div id="sidebar-title">
          BLR Public Transport
        </div>
      </div>
      <ul id="sidebar-menu">
        <li>
          Language<br />
          {
            LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`sidebar-lang ${language === l.code ? "selected" : ""}`}
              >
                {l.text}
              </button>
            ))
          }
        </li>
        {/* <li>
          <Link to={ROUTES.all_buses}>All BMTC bus routes</Link>
        </li> */}
        <li>
          <Link to={ROUTES.favourites}>Favourites</Link>
        </li>
        <li>
          <Link to={ROUTES.about}>About</Link>
        </li>
      </ul>

    </div>
  ) : (
    <div id="landing-header">
      {/* <button id="landing-hamburger" onClick={() => setSidebarOpen(true)}>
        <Icon icon="ic:round-menu" color="#2D2D2D" width="36" height="36" />
      </button> */}
      <h1>BMTC bus routes</h1>
    </div>
  );
};

export default Sidebar;
