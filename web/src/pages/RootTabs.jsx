import {AppBar, Box, Stack, Tab, Tabs, Toolbar} from "@mui/material";
import {useState} from "react";
import {login, logout} from "../data/httpClient";
import GolfTee from '@mui/icons-material/SportsGolfTwoTone';
import GolfCourse from '@mui/icons-material/GolfCourseTwoTone';
import Golfer from '@mui/icons-material/PermIdentityTwoTone';
import Stats from '@mui/icons-material/InsertChartTwoTone';
import Login from "./Login";
import RoundRouterBuilder from "../panels/round/RoundRouter";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                children
            )}
        </div>
    );
}
export default function RootTabs() {
    const [tabVal, setTabVal] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTabVal(newValue);
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const onLogin = async (password) => {
        try {
            await login(password);
            setIsLoggedIn(true);
        } catch (e) {
            setIsLoggedIn(false);

        }
    }
    const onLogout = async () => {
        await logout();
        setIsLoggedIn(false);
    }
    let auth = [isLoggedIn, {onLogout, onLogin, setIsLoggedIn}]

    const tabPanelData = [
        {label: "Start Round", icon: <GolfTee fontSize="large"/>, page: RoundRouterBuilder({auth})},
        {label: "Courses", icon: <GolfCourse fontSize="large"/>, page: <div/>},
        {label: "Golfers", icon: <Golfer fontSize="large"/>, page: <div/>},
        {label: "Stats", icon: <Stats fontSize="large"/>, page: <div/>}]

    const tabs = tabPanelData.map((panel, index) => (
        <Tab tabIndex={index + 1} icon={panel.icon} key={index + 1} sx={{minWidth: "fit-content", flex: 1}}/>))

    const panels = tabPanelData.map((panel, index) => (
        <CustomTabPanel value={tabVal} index={index} key={index}>
            {panel.page}
        </CustomTabPanel>))

    return (
        isLoggedIn?
            <Box sx={{display: 'flex',
                flex: 1,
                maxWidth: 380,
                justifyContent: 'center',
                flexWrap: 'wrap'}}>
                <AppBar position="static" sx={{flexGrow: 1}}>
                    <Toolbar>
                        <Tabs value={tabVal} onChange={handleTabChange} variant="scrollable" sx={{flexGrow:1, align: 'center'}}>
                            {tabs}
                        </Tabs>
                    </Toolbar>
                </AppBar>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    maxWidth: 380,
                }} align="center">
                    {panels}
                </Box>
            </Box>
            :
            <Login auth={auth}/>
    )
}