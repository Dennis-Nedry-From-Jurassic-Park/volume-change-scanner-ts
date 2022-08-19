import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '../src/app';


const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(<App />);


// import React from "react";
// import ReactDOM from "react-dom";
// import { App } from "./App";

// ReactDOM.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>,
//     document.getElementById("root")
// );