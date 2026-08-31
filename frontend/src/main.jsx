import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { StripeProvider } from "./contexts/StripeContext.jsx";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";
import { buildThemeCss } from "./theme/themes.js";

/**
 * Inject every theme's variables BEFORE React mounts.
 *
 * Generated from `src/theme/themes.js`, so there is no second copy of the
 * palette anywhere. Doing this synchronously means the first paint already has
 * the right colours — painting from an effect after mount flashes the default
 * theme for a frame, which is very visible when the stored theme is dark.
 */
const style = document.createElement("style");
style.id = "easyrent-theme";
style.textContent = buildThemeCss();
document.head.appendChild(style);

createRoot(document.getElementById("root")).render(
    <ThemeProvider>
        <StripeProvider>
            <App />
        </StripeProvider>
    </ThemeProvider>
);
