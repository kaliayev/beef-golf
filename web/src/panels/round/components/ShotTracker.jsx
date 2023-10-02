import {
    Accordion, AccordionDetails, AccordionSummary, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {getStrokeNumber} from "../HoleEdit";
import Constants from "../../../constants";
import {useEffect, useRef, useState} from "react";
import {createStrokeLog, deleteStrokeLog} from "../../../data/strokeLog";
import {objCompare, sleep, sortArrayByPropDesc} from "../utils";
import {getGeo} from "../../../data/geo";
import LoadingIcon from '@mui/icons-material/HourglassTopTwoTone';
import GPS from "@mui/icons-material/GpsFixedTwoTone";
import dayjs from "dayjs";
import Water from "@mui/icons-material/PoolTwoTone";

let colours = Constants.colours;

export default function ShotTracker(props) {
    const {
        round,
        holeDetails,
        golfers,
        selectedGolfer,
        handleSetSelectedGolfer,
        selectedGolferStrokes,
        setSelectedGolferStrokes,
        selectedGolferClubs,
        selectedGolferClub,
        setSelectedGolferClub,
        setSnackbarOpen,
        setSnackbarMessage,
        setSnackbarSeverity
    } = props;
    const [geoLocationsBuffer, setGeoLocationsBuffer] = useState([]);
    const [currGeolocation, setCurrGeolocation] = useState({});
    const [isTracking, setIsTracking] = useState(false);

    const updateCurrGeolocation = async () => {
        let geo = await getGeo();
        if (!(geo === null || geo === undefined || geo === {} || objCompare(geo, currGeolocation))) {
            if (isTracking) {
                setGeoLocationsBuffer([...geoLocationsBuffer, geo]);
            }
            setCurrGeolocation(geo);
            return geo;
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
    }, [timeOnPage, isTracking]);

    const geoLoop = async () => {
        let timeout = dayjs().add(15, 'second');
        let longTimeout = dayjs().add(30, 'second');
        let localBuf = [currGeolocation];

        while ((localBuf.length < 3 && dayjs().isBefore(timeout)) || (localBuf.length < 2 && dayjs().isBefore(longTimeout))) {
            setSnackbarMessage(`${localBuf.length} samples taken, ${dayjs(timeout).diff(dayjs(), 'second')} seconds remaining`);
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
            await sleep(2500);
            let geo = await updateCurrGeolocation();
            if (geo !== null && geo !== undefined) {
                localBuf.push(geo);
            }
        }

        setIsTracking(false);
        // send stroke data to server
        try {
            let stroke = await createStrokeLog({
                round_id: round.id,
                hole_id: holeDetails.id,
                golfer_id: selectedGolfer.id,
                stroke_number: getStrokeNumber(selectedGolferStrokes),
                club_id: selectedGolferClub.id,
                geoLocations: localBuf
            })
            setSnackbarMessage(`Stroke Saved: ${localBuf.length} Geolocations`);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            // update and clear other details
            setSelectedGolferStrokes([...selectedGolferStrokes, stroke]);
        } catch (e) {
            setSnackbarMessage("Error Saving Stroke Log");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    }
    const handleTrackingClick = async () => {
        setIsTracking(true)
        geoLoop()
    }

    const handlePenaltyStroke = async () => {
        try {
            let stroke = await createStrokeLog({
                round_id: round.id,
                hole_id: holeDetails.id,
                golfer_id: selectedGolfer.id,
                stroke_number: getStrokeNumber(selectedGolferStrokes),
                club_id: selectedGolferClub.id,
                penalty: true,
                geoLocations: []
            })
            setSnackbarMessage(`Penalty Stroke Saved`);
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
            // update and clear other details
            setSelectedGolferStrokes([...selectedGolferStrokes, stroke]);
        } catch (e) {
            setSnackbarMessage("Error Saving Stroke Log");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    }

    const handleDeleteLastStroke = async () => {
        if (getStrokeNumber(selectedGolferStrokes) === 1) {
            setSnackbarMessage('No Strokes to Delete');
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
        } else {
            try {
                let delete_res = await deleteStrokeLog(round.id, selectedGolfer.id, holeDetails.id, getStrokeNumber(selectedGolferStrokes) - 1);
                if (delete_res) {
                    setSelectedGolferStrokes(selectedGolferStrokes.slice(0, -1));
                    setSnackbarMessage(`Stroke Deleted`);
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                }
            } catch (e) {
                setSnackbarMessage("Error Deleting Stroke Log");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        }
    }

    const selectTrackingIcon = () => {
        if (isTracking) {
            return <LoadingIcon style={{fontSize: 40}} color={"warning"}/>
        } else {
            return <GPS style={{fontSize: 40}} color={"success"}/>
        }
    }

    return (<Accordion sx={{backgroundColor: colours.background}}>
        <AccordionSummary expandIcon={<ExpandMore color={"secondary"}/>}>
            <Typography sx={{width: '33%', flexShrink: 0}}>
                Tracking
            </Typography>
            <Typography sx={{color: 'text.secondary'}}>{selectedGolfer?.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Stack direction={"column"} spacing={2}>
                <Stack sx={{width: '100%'}} direction={'row'} justifyContent={"left"}>
                    <Typography
                        sx={{color: 'text.secondary'}}>{`Stroke Number: ${getStrokeNumber(selectedGolferStrokes)}`}</Typography>
                </Stack>
                <FormControl fullWidth>
                    <InputLabel>Golfer</InputLabel>
                    <Select key={holeDetails.id}
                            value={selectedGolfer}
                            onChange={handleSetSelectedGolfer}
                            label={"Golfer"}>
                        {golfers.map(golfer => <MenuItem key={golfer.id} value={golfer}>{golfer.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Club</InputLabel>
                    <Select key={holeDetails.id}
                            value={selectedGolferClub || ''}
                            onChange={(e) => setSelectedGolferClub(e.target.value)}
                            label={"Club"}>
                        {sortArrayByPropDesc(selectedGolferClubs, 'id').map(club => <MenuItem key={club.id} value={club}>{club.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <Stack justifyContent={"space-between"} direction="row">
                    <Button onClick={handleDeleteLastStroke}>
                        <Typography color={"error"}>UNDO</Typography>
                    </Button>
                    <IconButton onClick={handlePenaltyStroke}>
                        <Water style={{fontSize: 40}} color={"warning"}/>
                    </IconButton>
                    <IconButton onClick={handleTrackingClick}>
                        {selectTrackingIcon()}
                    </IconButton>
                </Stack>
            </Stack>
        </AccordionDetails>
    </Accordion>)
}