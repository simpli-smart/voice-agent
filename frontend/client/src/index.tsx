import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

//@ts-ignore - fontsource-variable/geist is not typed
import "@fontsource-variable/geist";
//@ts-ignore - fontsource-variable/geist is not typed
import "@fontsource-variable/geist-mono";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
