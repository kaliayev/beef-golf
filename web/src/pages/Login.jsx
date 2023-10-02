import Typography from "@mui/material/Typography";
import {Box, IconButton, Stack} from "@mui/material";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Check";
import Burger from '@mui/icons-material/LunchDiningTwoTone';
import Golf from '@mui/icons-material/SportsGolfTwoTone';
import {useState} from "react";

export default function Login({auth}) {
    let [isLoggedIn, {onLogin, setIsLoggedIn}] = auth;
    const [password, setPassword] = useState("");
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            onLogin(password);
        }
    }
    const codeToMessage = (code) => {
        //let code = Number(searchParams.get("code"));
        switch (code) {
            case 401:

                return "Invalid Authentication";
            case 403:

                return "Failed Login";
            case 500:
                return "Server error";
            default:
                return null;
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            '& > :not(style)': {
                m: 2,
                maxWidth: 380,
                minWidth: 380,
                minHeight: 400,
            },
        }} align="center">
            <Stack spacing={2} sx={{width: '80%', flexWrap: 'wrap', marginTop: '20px', marginBottom: '20px', alignItems: 'center'}}>
                <Stack spacing={2} direction={"row"} sx={{alignItems: 'center'}}>
                    <Burger style={{fontSize: 40}}/>
                    <Typography variant="h4"> {`BeefGolf`} </Typography>
                    <Burger style={{fontSize: 40}}/>
                </Stack>
                <Stack spacing={2}>
                    <TextField variant={"outlined"} label={"Password"} type={"password"}
                               onChange={e=> setPassword(e.target.value)}
                               onKeyUp={handleEnter}
                               autoFocus={true}
                               error={!!codeToMessage(401)}
                               helperText={codeToMessage(401)}/>
                    <Box align="right">
                        <IconButton sx={{width: '33%'}}
                                    onClick={() => onLogin(password)}
                                    onSubmit={() => onLogin(password)}>
                            <Golf style={{fontSize: 50}} color={"success"}/>
                        </IconButton>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    )
}