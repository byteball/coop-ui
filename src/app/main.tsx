import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import client from "#/shared/api/obyte";
import { initClarity } from "#/shared/analytics";
import { bootstrap } from "./bootstrap";
import "./styles.css";

// Remove head tags emitted by the prerender plugin (or by coop-og's HTML
// proxy on /user/:address) so TanStack Router's <HeadContent /> owns them
// at runtime without duplicates. Both producers mark their tags with
// `data-prerender` — same ownership contract react-helmet uses with `data-rh`.
document.head.querySelectorAll("[data-prerender]").forEach((el) => el.remove());

// No-op unless VITE_CLARITY_PROJECT_ID is set.
initClarity();

client.onConnect(bootstrap);

const router = getRouter();

const rootElement = document.getElementById("app")!;

ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
