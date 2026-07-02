import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import UserContext from "./context/UserContext.jsx";
import CaptainContext from "./context/CapatainContext.jsx";
import SocketProvider from "./context/SocketContext.jsx";
import "maplibre-gl/dist/maplibre-gl.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CaptainContext>
      <UserContext>
        <SocketProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SocketProvider>
      </UserContext>
    </CaptainContext>
  </StrictMode>,
);
