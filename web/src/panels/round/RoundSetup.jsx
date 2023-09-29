import {
    Accordion, AccordionDetails, AccordionSummary, Autocomplete,
    Box,
    FormControl, FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem, Radio,
    Select,
    Stack, Switch, TextField,
    Typography
} from "@mui/material";
import {useState} from "react";
import GolfTee from '@mui/icons-material/SportsGolfTwoTone';
import Constants from "../../constants";
import {ExpandMore} from "@mui/icons-material";

let colours = Constants.colours;

export default function RoundSetup(props) {
    const [courses, setCourses] = useState(["Fredericton Golf Club", "Kingswood Golf Club", "Mactaquac Golf Club"]);
    const [course, setCourse] = useState("Fredericton Golf Club");
    const [allGolfers, setAllGolfers] = useState(["Kaliayev", "Bish", "Noah", "Jimmy"]);
    const [selectedGolfers, setSelectedGolfers] = useState([]);
    const [matchType, setMatchType] = useState("");
    const [matchTypes, setMatchTypes] = useState(["Match Play", "Stroke Play", "Skins", "Best Ball", "Scramble", "Alternate Shot", "Stableford", "Nassau", "Wolf", "Ryder Cup", "Other"]);
    const [isBeefNight, setIsBeefNight] = useState(false);

    // TODO: add useEffect to get courses from database

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
                   useFlexGap
                   spacing={2}>
                <Box align="left">
                    <Typography variant="h4">Play Round</Typography>
                </Box>
                <FormControl fullWidth>
                    <InputLabel id="course-select-label">Select Course</InputLabel>
                    <Select id = "course-select" labelId="course-select-label" label="Select Course"
                    value={course} onChange={(event) => setCourse(event.target.value)}>
                        {courses.map((c, index) => <MenuItem sx={{justifyContent: 'center'}} key={index} value={c}>{c}</MenuItem>)}
                    </Select>
                </FormControl>

                <Accordion sx={{backgroundColor: colours.background}}>
                    <AccordionSummary expandIcon={<ExpandMore color={"secondary"}/>}>
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            {selectedGolfers.length} Golfers
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{selectedGolfers.join(", ")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Autocomplete
                            multiple
                            getOptionLabel={(option) => option}
                            filterSelectedOptions
                            renderInput={(params) => <TextField {...params} label="Golfers" />}
                            options={allGolfers}
                            onChange={(event, value) => setSelectedGolfers(value)}/>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{backgroundColor: colours.background}}>
                    <AccordionSummary expandIcon={<ExpandMore color={"secondary"}/>}>
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            Match Setup
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{(!!matchType)? `Match Type: ${matchType}, Beef Night: ${isBeefNight}`: ''}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Autocomplete
                            filterSelectedOptions
                            renderInput={(params) => <TextField {...params} label="Match Type" />}
                            options={matchTypes}
                            onChange={(event, value) => setMatchType(value)}/>
                        <FormControlLabel control={<Switch />} label="Beef Night" onChange={(event) => setIsBeefNight(event.target.checked)}/>

                    </AccordionDetails>
                </Accordion>

                <Stack justifyContent={"right"} direction="row">
                    <IconButton><GolfTee style={{fontSize: 50}} color={"success"}/></IconButton>
                </Stack>
            </Stack>
        </Box>
    )
}