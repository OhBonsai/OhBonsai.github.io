import React from 'react'
import ReactDOM from 'react-dom/client'
import Portfolio2023 from './me31.jsx'
import './index.css'
// import studio from "@theatre/studio";
// import extension from "@theatre/r3f/dist/extension"


if (import.meta.env.DEV) {
    // studio.initialize()
    // studio.extend(extension)
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Portfolio2023 />
    </React.StrictMode>,
)
