import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Autocomplete,
    Box, Button, Divider,
    Drawer,
    Fab, IconButton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Cancel, ExpandMore} from "@mui/icons-material";
import Constants from "../../constants";
import {useEffect, useRef, useState} from "react";
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

let colours = Constants.colours;
const getPathParams = (request) => {
    const pathParams = new URL(request.url).pathname.split('/')
    return {
        roundId: Number(pathParams[2]),
        holeNumber: Number(pathParams[4])
    }
}
const getStrokeNumber = (golferStrokes) => {
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
    const [selectedGolfer, setSelectedGolfer] = useState({});
    const [selectedGolferClubs, setSelectedGolferClubs] = useState([]);
    const [selectedGolferClub, setSelectedGolferClub] = useState({});
    const [outcome, setOutcome] = useState('');
    const [distance, setDistance] = useState(holeDetails.white_distance);
    const [geoLocations, setGeoLocations] = useState([]);
    const [currGeolocation, setCurrGeolocation] = useState({});
    const [isTracking, setIsTracking] = useState(false);
    const [selectedGolferStrokes, setSelectedGolferStrokes] = useState([]);
    const selectTrackingIcon = () => {
        switch (outcome) {
            case "Green":
                return <GolfHole style={{fontSize: 40}} color={"success"}/>
            case "Penalty":
                return <Water style={{fontSize: 40}} color={"warning"}/>
            case "Pickup":
                return <ErrorIcon style={{fontSize: 40}} color={"error"}/>
            default:
                if (isTracking) {
                    return <GolfTee style={{fontSize: 40}} color={"info"}/>
                } else {
                    return <GPS style={{fontSize: 40}} color={"success"}/>
                }
        }
    }

    const handleSetSelectedGolfer = async (event, value) => {
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
        handleSetSelectedGolfer({}, {})
        setOutcome('')
        setSelectedGolferStrokes([])
    }, [holeNumber])

    const handleTrackingClick = async () => {
        if (isTracking) {
            setIsTracking(false);
            console.log("outcome", outcome)
            // send stroke data to server
            let stroke = await createStrokeLog({
                round_id: round.id,
                hole_id: holeDetails.id,
                golfer_id: selectedGolfer.id,
                stroke_number: getStrokeNumber(selectedGolferStrokes),
                club_id: selectedGolferClub.id,
                green: outcome === "Green",
                penalty: outcome === "Penalty",
                pickup: outcome === "Pickup",
                geoLocations
            })
            // update and clear other details
            setGeoLocations([]);
            setSelectedGolferStrokes([...selectedGolferStrokes, stroke]);
            setOutcome('');
        } else {
            // should always have a value to start, and resets geolocations to new array
            setGeoLocations([currGeolocation]);
            setIsTracking(true);
        }
    }

    const calculateDistance = () => {

    }
    const recommendClub = () => {

    }

    const updateCurrGeolocation = async () => {
        let geo = await getGeo();
        if (!(geo === null || geo === undefined || geo === {} || objCompare(geo, currGeolocation))) {
            console.log("updating geo", geo);
            if (isTracking) {
                setGeoLocations([...geoLocations, geo]);
            }
            setCurrGeolocation(geo);
        }
    }
    const [timeOnPage, setTimeOnPage] = useState(0);
    const intervalRef = useRef(); // Add a ref to store the interval id
    useEffect(() => {
        updateCurrGeolocation();
        intervalRef.current = setInterval(() => {
            setTimeOnPage((t) => t + 5);
        }, 5000);
        return () => clearInterval(intervalRef.current);
    }, [timeOnPage]);

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

                <Accordion sx={{backgroundColor: colours.background}}>
                    <AccordionSummary expandIcon={<ExpandMore color={"secondary"}/>}>
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            Tracking
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{selectedGolfer?.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction={"column"} spacing={2}>
                            <Stack sx={{width: '100%'}} direction={'row'} justifyContent={"left"}>
                                <Typography sx={{color: 'text.secondary' }}>{`Stroke Number: ${getStrokeNumber(selectedGolferStrokes)}`}</Typography>
                            </Stack>
                            <Autocomplete
                                key={holeNumber}
                                getOptionLabel={(option) => option?.name}
                                renderInput={(params) => <TextField {...params} label="Golfer" />}
                                options={golfers}
                                onChange={handleSetSelectedGolfer}/>
                            <Stack sx={{alignItems: 'center'}} alignItems='center' justifyContent='space-between' direction={"row"} spacing={2}>
                            <Autocomplete fullWidth
                                          key={holeNumber + 1}
                                          renderInput={(params) => <TextField  {...params} label="Select Club" />}
                                          getOptionLabel={(option) => option?.name || ''}
                                          options={selectedGolferClubs}
                                          onChange={(event, value) => setSelectedGolferClub(value)}
                            />
                            <Typography sx={{color: 'text.secondary' }}>OR</Typography>
                            <Autocomplete fullWidth
                                          renderInput={(params) => <TextField {...params} label="Select Event" />}
                                          options={['Green', 'Penalty', 'Pickup']}
                                          onChange={(event, value) => setOutcome(value)}
                            />
                        </Stack>
                            <Stack justifyContent={"space-between"} direction="row">
                                <Button>
                                    <Typography color={"error"}>CANCEL</Typography>
                                </Button>
                                <IconButton onClick={handleTrackingClick}>
                                    {selectTrackingIcon()}
                                </IconButton>
                            </Stack>
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{backgroundColor: colours.background}}>
                    <AccordionSummary expandIcon={<ExpandMore color={"secondary"}/>}>
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            {`Caddy`}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{selectedGolfer?.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack sx={{width: '70%', m:2}}
                               spacing={2}>
                            <Autocomplete
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} label="Golfer" />}
                                options={golfers}
                                onChange={handleSetSelectedGolfer}/>
                            <Typography sx={{color: 'text.secondary' }}>{`Distance: ${calculateDistance()}`}</Typography>
                            <Typography sx={{color: 'text.secondary' }}>{`Recommended Club: ${recommendClub()}`}</Typography>
                        </Stack>
                    </AccordionDetails>
                </Accordion>
                <Box align={'center'}>
                <Box sx={{width: '70%', backgroundColor: colours.background, borderRadius: 2}} border={2} align='left' >
                    <pre>{JSON.stringify(currGeolocation, null, 2) }</pre>
                </Box>
                </Box>
            </Stack>
        </Box>
    )
}