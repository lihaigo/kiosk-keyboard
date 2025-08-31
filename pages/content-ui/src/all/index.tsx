import { initAppWithShadow } from "@extension/shared";
import App from "@src/all/App";
import inlineCss from "../../dist/all/index.css?inline";

initAppWithShadow({ id: "kiosk-keyboard-root", app: <App />, inlineCss });
