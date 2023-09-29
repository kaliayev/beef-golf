import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Autocomplete,
    Box, Divider,
    Drawer,
    Fab, IconButton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Cancel, ExpandMore} from "@mui/icons-material";
import Constants from "../../constants";
import {useState} from "react";
import Caddy from '@mui/icons-material/PsychologyAltTwoTone';
import Water from '@mui/icons-material/PoolTwoTone';
import GolfHole from '@mui/icons-material/GolfCourseTwoTone';
import GolfTee from '@mui/icons-material/SportsGolfTwoTone';
import ErrorIcon from '@mui/icons-material/ErrorTwoTone';
import {getGeo} from "../../data/geo";

let colours = Constants.colours;

export default function HoleEdit(props) {
    const holeNumber = 1; // TODO: this comes from loader
    const playedHoles = []; // TODO: this comes from loader
    const golfers = ['Kaliayev', 'Bish']; // TODO: this comes from loader
    const holeDetails = {name: "Magnetic Hollow", par: 4, handicap: 1, distance: 300, description: "A whole bunch of madeup nonsense"}; // TODO: this comes from loader

    const [caddyOpen, setCaddyOpen] = useState(false);
    const [selectedGolfer, setSelectedGolfer] = useState("Kaliayev");
    const [selectedGolferClubs, setSelectedGolferClubs] = useState(["Driver", "3 Wood", "5 Wood", "3 Iron", "4 Iron", "5 Iron", "6 Iron", "7 Iron", "8 Iron", "9 Iron", "Pitching Wedge", "Sand Wedge", "Lob Wedge", "Putter"]);
    const [selectedGolferClub, setSelectedGolferClub] = useState("Driver");
    const [outcome, setOutcome] = useState('');
    const [distance, setDistance] = useState(holeDetails.distance);
    const [strokeNumber, setStrokeNumber] = useState(1);

    const selectTrackingIcon = () => {
        switch (outcome) {
            case "Make":
                return <GolfHole style={{fontSize: 40}} color={"success"}/>
            case "Penalty":
                return <Water style={{fontSize: 40}} color={"warning"}/>
            case "Max Score":
                return <ErrorIcon style={{fontSize: 40}} color={"error"}/>
            default:
                return <GolfTee style={{fontSize: 40}}/>
        }
    }
    const calculateDistance = () => {
        getGeo()
    }
    const recommendClub = () => {

    }

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
                        <Typography sx={{ color: 'text.secondary' }}>{`Par ${holeDetails.par}, ${holeDetails.distance} Yards`}</Typography>
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
                        <Typography sx={{ color: 'text.secondary' }}>{golfers.join(', ')}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Stack direction={"column"} spacing={2}>
                            {golfers.map((golfer, index) => golferRow(golfer, index))}
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{backgroundColor: colours.background}}>
                    <AccordionSummary expandIcon={<ExpandMore color={"secondary"}/>}>
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            Tracking
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{selectedGolfer}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction={"column"} spacing={2}>
                            <Stack sx={{width: '100%'}} direction={'row'} justifyContent={"left"}>
                                <Typography sx={{color: 'text.secondary' }}>{`Stroke Number: ${strokeNumber}`}</Typography>
                            </Stack>
                        <Stack sx={{alignItems: 'center'}} alignItems='center' justifyContent='space-between' direction={"row"} spacing={2}>
                            <Autocomplete fullWidth
                                          renderInput={(params) => <TextField  {...params} label="Select Club" />}
                                          options={selectedGolferClubs}
                                          onChange={(event, value) => setSelectedGolferClub(value)}
                            />
                            <Typography sx={{color: 'text.secondary' }}>OR</Typography>
                            <Autocomplete fullWidth
                                          renderInput={(params) => <TextField {...params} label="Select Event" />}
                                          options={['Make', 'Penalty', 'Max Score']}
                                          onChange={(event, value) => setOutcome(value)}
                            />
                        </Stack>
                            <Stack justifyContent={"space-between"} direction="row">
                                <IconButton> <Cancel color={"error"} style={{fontSize: 40}}/></IconButton>
                                <IconButton>{selectTrackingIcon()}</IconButton>
                            </Stack>
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                <Box align="right">
                    <Fab color="primary"
                         sx={{}}
                         onClick={e => setCaddyOpen(true)}>
                        <Caddy style={{fontSize: 40}} />
                    </Fab>
                </Box>
                <Drawer anchor={"bottom"} open={caddyOpen} onSelect={(event) => setCaddyOpen(true)} onClose={e => setCaddyOpen(false)}>
                    <Stack sx={{width: '70%', m:2}}
                         spacing={2}>
                        <Autocomplete
                            renderInput={(params) => <TextField {...params} label="Golfer" />}
                            options={golfers}
                            onChange={(event, value) => setSelectedGolfer(value)}/>
                        <Typography sx={{color: 'text.secondary' }}>{`Distance: ${calculateDistance()}`}</Typography>
                        <Typography sx={{color: 'text.secondary' }}>{`Recommended Club: ${recommendClub()}`}</Typography>
                    </Stack>
                </Drawer>
            </Stack>
        </Box>
    )
}