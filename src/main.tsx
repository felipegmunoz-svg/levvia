// build v3 – clean logs + force deploy
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";
import { migrateLegacyStorage } from "./lib/migrateLegacyStorage";

migrateLegacyStorage();

// Register service worker for PWA
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(<App />);
