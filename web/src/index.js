import ReactDOM from 'react-dom/client';
import React from "react";
import './index.css';
import Constants from "./constants";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import RootTabs from "./pages/RootTabs";

let colours = Constants.colours;
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: colours.aqua,
        },
        secondary: {
            main: colours.purple,
        },
        background: {
            default: colours.window,
        },
        foreground: {
            main: colours.foreground,
        },
        text: {
            primary: colours.foreground,
            secondary: colours.comment,
        },
        info: {
            main: colours.blue,
        },
        success: {
            main: colours.green,
        },
        warning: {
            main: colours.yellow,
        },
        error: {
            main: colours.red,
        }
    },
    typography: {
        fontFamily: "Menlo, monospace",
        fontSize: 12,
        fontWeightRegular: 540,
        fontWeightMedium: 400,
        fontWeightBold: 600,
        fontWeightLight: 300,
    }
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
            }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <RootTabs/>
            </ThemeProvider>
        </div>
    </React.StrictMode>
);