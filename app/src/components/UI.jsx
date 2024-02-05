import { useRef } from "react";
import { useChat } from "../hooks/useChat";
import "./UI.css";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };
  if (hidden) {
    return null;
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          flexDirection: "column",
          pointerEvents: "none",
        }}
      >
        <div class="box" style={{ position: "relative" }}>
          <div class="lightbar"></div>
          <div class="topLayer"></div>
          <h1 class="title">Team GSN AI Virtual GF</h1>
        </div>
        
        <div
          style={{
            // width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            style={{
              pointerEvents: "auto",
              backgroundColor: "#f88379",
              ":hover": { backgroundColor: "#fc6c85", color: "#fff" },
              padding: "1rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ width: "1.5rem", height: "1.5rem" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ width: "1.5rem", height: "1.5rem" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => {
              const body = document.querySelector("body");
              if (body.classList.contains("greenScreen")) {
                body.classList.remove("greenScreen");
              } else {
                body.classList.add("greenScreen");
              }
            }}
            style={{
              pointerEvents: "auto",
              backgroundColor: "#f88379",
              padding: "1rem",
              color: "white",
              borderRadius: "0.5rem",
              cursor: "pointer", 
              pointerEvents: "auto",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              <path
                strokeLinecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            pointerEvents: "auto",
            maxWidth: "640px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <input
            style={{
              width: "100%",
              placeholder: { color: "text-gray-800", fontStyle: "italic" },
              padding: "1rem",
              borderRadius: "0.375rem",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(8px)",
            }}
            placeholder="Type a message..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            disabled={loading || message}
            onClick={sendMessage}
            style={{
              backgroundColor: "#f88379",
              color: "white",
              padding: "1rem",
              paddingLeft: "2.5rem", // Increased padding on left and right sides
              paddingRight: "2.5rem",
              fontWeight: "600",
              textTransform: "uppercase",
              cursor: "pointer", // Add pointer cursor
              pointerEvents: "auto",
              borderRadius: "0.375rem",
              ...(loading || message
                ? { cursor: "not-allowed", opacity: "0.3" }
                : {}), // Dynamic styles based on conditions
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};
