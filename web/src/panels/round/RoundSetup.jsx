import {
    Accordion, AccordionDetails, AccordionSummary, Autocomplete,
    Box, Button, Divider,
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
import {getCourses} from "../../data/courses";
import {getGolfers} from "../../data/golfers";
import {useLoaderData, useNavigate} from "react-router-dom";
import {createRound, getRounds} from "../../data/rounds";

let colours = Constants.colours;

export async function loader() {
    let courses = await getCourses();
    let golfers = await getGolfers();
    return {courses, golfers};
}

export default function RoundSetup(props) {
    let {courses, golfers} = useLoaderData();
    const navigate = useNavigate();
    const [course, setCourse] = useState(courses[0]);
    const [selectedGolfers, setSelectedGolfers] = useState([]);
    const [matchType, setMatchType] = useState("");
    const [matchTypes, setMatchTypes] = useState(["Match Play", "Stroke Play", "Skins", "Best Ball", "Scramble", "Alternate Shot", "Stableford", "Nassau", "Wolf", "Ryder Cup", "Other"]);
    const [isBeefNight, setIsBeefNight] = useState(false);

    const getLastRoundId = async () => {
        let rounds = await getRounds();
        let roundIds = rounds?.map(r => r.id);
        return Math.max(...roundIds);
    }

    const handleSubmit = async () => {
        // create round
        let round = await createRound({
            "course_id": course.id,
            "golfers": selectedGolfers.map(g => {return {golfer_id: g.id}}),
        })
        // navigate to new round
        navigate(`/rounds/${round.id}/holes/1`)
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
                   useFlexGap
                   spacing={2}>
                <Box align="left">
                    <Typography variant="h4">Play Round</Typography>
                </Box>
                <FormControl fullWidth>
                    <InputLabel id="course-select-label">Select Course</InputLabel>
                    <Select id = "course-select" labelId="course-select-label" label="Select Course"
                    value={course.name} onChange={(event) => setCourse(event.target.value)}>
                        {courses.map((c, index) => <MenuItem sx={{justifyContent: 'center'}} key={index} value={c.name}>{c.name}</MenuItem>)}
                    </Select>
                </FormControl>

                <Accordion sx={{backgroundColor: colours.background}}>
                    <AccordionSummary expandIcon={<ExpandMore color={"secondary"}/>}>
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            {selectedGolfers.length} Golfers
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{selectedGolfers.map(g => g.name).join(", ")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Autocomplete
                            multiple
                            getOptionLabel={(option) => option.name}
                            filterSelectedOptions
                            renderInput={(params) => <TextField {...params} label="Golfers" />}
                            options={golfers}
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
                    <IconButton onClick={handleSubmit} onSubmit={handleSubmit}>
                        <GolfTee style={{fontSize: 50}} color={"success"}/>
                    </IconButton>
                </Stack>
                <Divider>OR</Divider>
                <Stack justifyContent={"left"} direction="row">
                    <Button onClick={async () => navigate(`/rounds/${await getLastRoundId()}/holes/1`)}>
                        <Typography color={"primary"}>RESUME LAST ROUND</Typography>
                    </Button>
                </Stack>
            </Stack>
        </Box>
    )
}