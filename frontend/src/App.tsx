import { useState } from "react";

import "./App.css";

import { LeadList } from "./features/leads/LeadList";
import { ScoringAdmin } from "./features/scoring/ScoringAdmin";

function App() {
  const [showAdmin, setShowAdmin] =
    useState(false);

  const [refreshKey, setRefreshKey] =
    useState(0);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>CRM</h1>
          <span>Leads comerciales</span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="admin-button"
            onClick={() =>
              setShowAdmin(true)
            }
          >
            Configurar scoring
          </button>

          <div className="current-user">
            Agente 01
          </div>
        </div>
      </header>

      <main className="content">
        <LeadList key={refreshKey} />
      </main>

      {showAdmin && (
        <ScoringAdmin
          onClose={() =>
            setShowAdmin(false)
          }
          onSaved={async () => {
            setRefreshKey(
              (current) => current + 1
            );
          }}
        />
      )}
    </div>
  );
}

export default App;