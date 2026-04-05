import { useState, useRef, useEffect } from "react";
import { IconDash, IconTxn, IconInsight } from "../ui/Icons.jsx";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", Icon: IconDash },
  { id: "transactions", label: "Transactions", Icon: IconTxn },
  { id: "insights", label: "Insights", Icon: IconInsight },
];

const ROLES = [
  {
    value: "admin",
    label: "Admin",
    hint: "Can add, edit & delete transactions",
  },
  { value: "viewer", label: "Viewer", hint: "Read-only access to all data" },
];

function RoleDropdown({ role, setRole }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = ROLES.find((r) => r.value === role);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 10px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--bg3)",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 12.5,
          fontWeight: 500,
          color: "var(--text)",
          transition: "all .15s",
          outline: "none",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span>{current.label}</span>
        </span>

        <svg
          width={12}
          height={12}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text3)"
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .2s",
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
            overflow: "hidden",
            zIndex: 100,
            animation: "slideUp .15s ease-out",
          }}
        >
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => {
                setRole(r.value);
                setOpen(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background:
                  role === r.value ? "var(--primary-light)" : "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: role === r.value ? 600 : 400,
                color: role === r.value ? "var(--primary)" : "var(--text)",
                textAlign: "left",
                transition: "background .12s",
              }}
              onMouseEnter={(e) => {
                if (role !== r.value)
                  e.currentTarget.style.background = "var(--bg3)";
              }}
              onMouseLeave={(e) => {
                if (role !== r.value)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: 15 }}>{r.emoji}</span>
              <div>
                <p style={{ lineHeight: 1.2 }}>{r.label}</p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text3)",
                    marginTop: 2,
                    fontWeight: 400,
                  }}
                >
                  {r.hint}
                </p>
              </div>
              {role === r.value && (
                <svg
                  width={13}
                  height={13}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  style={{ marginLeft: "auto", flexShrink: 0 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ page, setPage, role, setRole }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <svg
            width={58}
            height={58}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>

            <rect width="64" height="64" rx="16" fill="url(#bgGrad)" />

            <circle cx="32" cy="32" r="18" fill="url(#grad)" opacity="0.10" />

            <rect x="18" y="30" width="6" height="12" rx="3" fill="#34d399" />
            <rect x="28" y="24" width="6" height="18" rx="3" fill="#60a5fa" />
            <rect x="38" y="20" width="6" height="22" rx="3" fill="#fb7185" />

            <path
              d="M24 42 Q32 48 40 42"
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="brand-name">FinSight</p>
        <p className="brand-sub">Personal Finance Tracker</p>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-label">Menu</p>
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? "active" : ""}`}
            onClick={() => setPage(id)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="role-label">Role (Demo)</p>
        <RoleDropdown role={role} setRole={setRole} />
      </div>
    </aside>
  );
}
