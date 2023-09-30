import React from "react";
import {Outlet, useNavigate, useParams, useSearchParams, useSubmit} from "react-router-dom";
import Burger from '@mui/icons-material/LunchDiningTwoTone';
import Forwards from '@mui/icons-material/RedoTwoTone';
import Backwards from '@mui/icons-material/UndoTwoTone';
import Caddy from '@mui/icons-material/PsychologyAltTwoTone';
import FinishRound from '@mui/icons-material/CheckCircleTwoTone';
import {Backdrop, Box, SpeedDial, SpeedDialAction} from "@mui/material";


export default function RootRoundSpeedDial({auth}) {
    const submit = useSubmit();
    const navigate = useNavigate();
    const {round_id, hole_id} = useParams();
    const holeNum = parseInt(hole_id);
    const nextHoleNum = (holeNum === 18)? 1 : holeNum + 1;
    const lastHoleNum = (holeNum === 1)? 18 : holeNum - 1;
    const [searchParams, setSearchParams] = useSearchParams();
    // useAuth
    const [isLoggedIn, {onLogout, onLogin, setIsLoggedIn}] = auth;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const actions = [
        {icon: <Backwards color={"warning"} fontSize="large"/>, name: 'Last Hole', click: () => {handleClose(); navigate(`/rounds/${round_id}/holes/${lastHoleNum}`)}},
        {icon: <Forwards color={"success"} fontSize="large"/>, name: 'Next Hole', click: () => {handleClose(); navigate(`/rounds/${round_id}/holes/${nextHoleNum}`)}},
        {icon: <Caddy color={"info"} fontSize="large"/>, name: 'Caddy', click: () => {handleClose();}},
        {icon: <FinishRound color={"success"} fontSize="large"/>, name: 'Finish', click: () => {handleClose(); navigate('../../../../');}},
    ];

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: 380
        }}>
            <Box className="outlet">
                <Outlet/>
            </Box>
            <Backdrop open={open}/>
            <SpeedDial
                ariaLabel="Round Nav SpeedDial"
                sx={{position: 'Absolute', bottom: 16, right: 16}}
                icon={<Burger/>}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={action.click}
                    />
                ))}
            </SpeedDial>
        </Box>

    );
}
