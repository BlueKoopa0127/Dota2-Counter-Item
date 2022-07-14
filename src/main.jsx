import { createRoot } from "react-dom/client";
import App from "./App";
import { ChartTest } from "./Chart";
import { ModelTest } from "./Model";

//createRoot(document.querySelector("#content")).render(<App />);
//createRoot(document.querySelector("#content")).render(<ChartTest />);
createRoot(document.querySelector("#content")).render(<ModelTest />);
