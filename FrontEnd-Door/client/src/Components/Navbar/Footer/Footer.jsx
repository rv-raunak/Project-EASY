import React from "react";

const Footer = () => {
  return (
    <footer
      className="pt-8 pb-6 border-t"
      style={{ backgroundColor: "#f3f4e6", borderColor: "#d1d4b4" }}
    >
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Essential Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: "#565a31" }}>
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                className="w-full text-left py-2 px-3 rounded-md flex items-center transition-colors hover:bg-opacity-20"
                style={{
                  color: "#565a31",
                  backgroundColor: "rgba(210, 212, 145, 0.1)",
                  hover: { backgroundColor: "rgba(210, 212, 145, 0.2)" },
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ color: "#818649" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Reminder
              </button>
              <button
                className="w-full text-left py-2 px-3 rounded-md flex items-center transition-colors hover:bg-opacity-20"
                style={{
                  color: "#565a31",
                  backgroundColor: "rgba(210, 212, 145, 0.1)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ color: "#818649" }}
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                Log Health Data
              </button>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: "#565a31" }}>
              Navigate
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="py-1 flex items-center transition-colors"
                  style={{ color: "#565a31" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style={{ color: "#818649" }}
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="py-1 flex items-center transition-colors"
                  style={{ color: "#565a31" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style={{ color: "#818649" }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reminders
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="py-1 flex items-center transition-colors"
                  style={{ color: "#565a31" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style={{ color: "#818649" }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Help
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium" style={{ color: "#565a31" }}>
              Emergency
            </h3>
            <button
              className="w-full py-2 px-3 rounded-md flex items-center justify-center transition-colors"
              style={{ backgroundColor: "#6b703d", color: "#ffffff" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Emergency Call
            </button>
            <p className="text-sm" style={{ color: "#818649" }}>
              24/7 support available
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="pt-4 border-t text-center text-sm"
          style={{ borderColor: "#d1d4b4", color: "#818649" }}
        >
          <p>© {new Date().getFullYear()} HealthTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
