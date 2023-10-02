import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Alert, Autocomplete,
    Box, Button, Divider,
    Drawer,
    Fab, IconButton, Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Cancel, ExpandMore} from "@mui/icons-material";
import Constants from "../../constants";
import {Fragment, useEffect, useRef, useState} from "react";
import Caddy from '@mui/icons-material/PsychologyAltTwoTone';
import Water from '@mui/icons-material/PoolTwoTone';
import GolfHole from '@mui/icons-material/GolfCourseTwoTone';
import GolfTee from '@mui/icons-material/SportsGolfTwoTone';
import GPS from '@mui/icons-material/GpsFixedTwoTone';
import ErrorIcon from '@mui/icons-material/ErrorTwoTone';
import {getGeo} from "../../data/geo";
import {getCourse} from "../../data/courses";
import {getRound} from "../../data/rounds";
import {useLoaderData, useNavigate} from "react-router-dom";
import {objCompare} from "./utils";
import {createStrokeLog, getGolferStrokes} from "../../data/strokeLog";
import ShotTracker from "./components/ShotTracker";

let colours = Constants.colours;
const getPathParams = (request) => {
    const pathParams = new URL(request.url).pathname.split('/')
    return {
        roundId: Number(pathParams[2]),
        holeNumber: Number(pathParams[4])
    }
}
export const getStrokeNumber = (golferStrokes) => {
    let strokeNumbers = golferStrokes.map(gs => gs.stroke_number);
    if (strokeNumbers.length === 0) {
        return 1;
    } else {
        return Math.max(...strokeNumbers) + 1;
    }
}
export async function loader({request}) {
    const {roundId, holeNumber} = getPathParams(request);
    const round = await getRound(roundId);
    return {round, holeNumber};
}
export default function HoleEdit(props) {
    const {round, holeNumber} = useLoaderData();
    const golfers = round.scoreCard.map(s => s.golfer)
    const holeDetails = round.course.hole[holeNumber -1];
    const [selectedGolfer, setSelectedGolfer] = useState(golfers[0]);
    const [selectedGolferClubs, setSelectedGolferClubs] = useState(selectedGolfer?.golferClub || []);
    const [selectedGolferClub, setSelectedGolferClub] = useState(selectedGolferClubs[-1]?.club || {});
    const [selectedGolferStrokes, setSelectedGolferStrokes] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // "error", "warning", "info", "success"
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };
    const snackbarAction = (<Fragment>
        <Button color="secondary" size="small" onClick={handleSnackbarClose}/>
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
        >
            <Cancel fontSize="small" />
        </IconButton>
    </Fragment>)


    const handleSetSelectedGolfer = async (event) => {
        let value = event?.target?.value;
        setSelectedGolfer(value)
        setSelectedGolferClubs(value?.golferClub?.map(gc => gc.club) || [])
        setSelectedGolferClub((value?.golferClub?.length)? value.golferClub[-1]?.club: {})
        if (!!value?.id) {
            let golferStrokes = await getGolferStrokes(round.id, value.id, holeNumber);
            setSelectedGolferStrokes(golferStrokes);
        } else {
            setSelectedGolferStrokes([]);
        }
    }
    useEffect(() => {
        handleSetSelectedGolfer({})
        setSelectedGolferStrokes([])
    }, [holeNumber])

    const golferRow = (golfer, index) => {
        return (
            <Stack spacing={2} key={index}>
                <Divider><Typography>{`${golfer} (${'+' + index})`}</Typography></Divider>
                <Stack direction={"row"} spacing={2} sx={{alignItems: 'center'}}>
                    <TextField inputProps={{min: 0, style: { textAlign: 'center', fontSize: 15 }}} style={{fontSize: 15}} label={"Score"} variant={"outlined"} type={"number"} defaultValue={holeDetails.par}/>
                    <TextField inputProps={{min: 0, style: { textAlign: 'center', fontSize: 15 }}} label={"Putts"} variant={"outlined"} type={"number"} defaultValue={2}/>
                    <TextField inputProps={{min: 0, style: { textAlign: 'center', fontSize: 15 }}} label={"Penalties"} variant={"outlined"} type={"number"} defaultValue={0}/>
                </Stack>
                <Stack direction={"row"} spacing={2} sx={{alignItems: 'center'}}>
                    <Typography sx={{color: 'text.secondary' }}>{`Net: ${holeDetails.par}`}</Typography>
                    <Typography sx={{color: 'text.secondary' }}>{`Gross: ${holeDetails.par}`}</Typography>
                    <Typography sx={{color: 'text.secondary' }}>{`Match: ${holeDetails.par}`}</Typography>
                </Stack>
            </Stack>
        )
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
            flexWrap: 'wrap',
            '& > :not(style)': {
                minHeight: 300,
                minWidth: 370,
                maxWidth: 370
            },
        }} align="center">
            <Stack sx={{width: '100%', flexWrap: 'wrap', marginTop: '20px', marginBottom: '20px'}}
                   spacing={2}>
                <Box align="left">
                    <Typography variant="h4">{`Hole ${holeNumber}`}</Typography>
                    <Typography sx={{color: 'text.secondary'}} variant="h6">{holeDetails.name}</Typography>
                </Box>
                <Accordion sx={{backgroundColor: colours.background}}>
                    <AccordionSummary expandIcon={<ExpandMore color={"secondary"}/>}>
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            Details
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{`Par ${holeDetails.par}, ${holeDetails.white_distance} Yards`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box align={"left"}>
                            <Typography sx={{ color: 'text.secondary' }}>{`Handicap: ${holeDetails.handicap}`}</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>{`Description: ${holeDetails.description}`}</Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{backgroundColor: colours.background}}>
                    <AccordionSummary expandIcon={<ExpandMore color={"secondary"}/>}>
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            {`Golfers`}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{golfers.map(g => g.name).join(', ')}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Stack direction={"column"} spacing={2}>
                            {golfers.map((golfer, index) => golferRow(golfer.name, index))}
                        </Stack>
                    </AccordionDetails>
                </Accordion>
                <ShotTracker round={round} holeDetails={holeDetails}
                             setSnackbarMessage={setSnackbarMessage} setSnackbarSeverity={setSnackbarSeverity} setSnackbarOpen={setSnackbarOpen}
                             golfers={golfers} selectedGolfer={selectedGolfer} handleSetSelectedGolfer={handleSetSelectedGolfer}
                             selectedGolferStrokes={selectedGolferStrokes} setSelectedGolferStrokes={setSelectedGolferStrokes}
                             selectedGolferClubs={selectedGolferClubs} selectedGolferClub={selectedGolferClub} setSelectedGolferClub={setSelectedGolferClub}/>
            </Stack>



            <Snackbar
                open={snackbarOpen}
                action={snackbarAction}
                onClose={handleSnackbarClose}
                autoHideDuration={5000}>
                <Alert severity={snackbarSeverity} sx={{width: '100%'}} onClose={handleSnackbarClose}> {snackbarMessage} </Alert>
            </Snackbar>
        </Box>
    )
}