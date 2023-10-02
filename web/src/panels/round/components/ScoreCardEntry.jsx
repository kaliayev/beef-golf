import {Accordion, AccordionDetails, AccordionSummary, Button, Divider, IconButton, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {ExpandMore} from "@mui/icons-material";
import GolfHole from '@mui/icons-material/GolfCourseTwoTone';
import Constants from "../../../constants";
import {useState} from "react";
let colours = Constants.colours;

export default function ScoreCardEntry(props) {
    const {golfers, holeDetails, round, setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity} = props;
    const [scoreCardHoles, setScoreCardHoles] = useState(golfers.map(g => {return {golfer_id: g.id, hole_id: holeDetails.id, round_id: round.id, strokes: holeDetails.par, putts: 2, penalties: 0}}));

    const submitScoreCardHole = async (scoreCardHole) => {
        console.log("scoreCardHole", scoreCardHole)
        // check if scoreCardHole exists
        // if exists, update
        // else create
        // alternatively,just add an upsert route that can handle both?
    }
    const handleSubmitHoleScores = async () => {
        console.log("scoreCard", round.scoreCard)
        let schPs = scoreCardHoles.map(sch => submitScoreCardHole(sch));
        await Promise.all(schPs);
        setSnackbarMessage("Hole scores submitted");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
    }

    const handleResetHoleScores = () => {
        setScoreCardHoles(golfers.map(g => {return {golfer_id: g.id, hole_id: holeDetails.id, round_id: round.id, strokes: holeDetails.par, putts: 2, penalties: 0}}));
    }

    const handleUpdateSchState = (index, key, value) => {
        console.log(`update ${key} for ${index}`, value)
        let newSch = {...scoreCardHoles[index], [key]: parseInt(value)};
        let newSchs = [...scoreCardHoles];
        newSchs[index] = newSch;
        setScoreCardHoles(newSchs);
    }

    const golferRow = (golfer, index) => {
        return (
            <Stack spacing={2} key={index}>
                <Divider><Typography>{`${golfer} (${'+' + index})`}</Typography></Divider>
                <Stack direction={"row"} spacing={2} sx={{alignItems: 'center'}}>
                    <TextField inputProps={{min: 0, style: { textAlign: 'center', fontSize: 15 }}}
                               style={{fontSize: 15}} label={"Score"} variant={"outlined"} type={"number"}
                               onChange={(e) => handleUpdateSchState(index, 'strokes', e.target.value)}
                               value={scoreCardHoles[index]?.strokes}/>
                    <TextField inputProps={{min: 0, style: { textAlign: 'center', fontSize: 15 }}}
                               label={"Putts"} variant={"outlined"} type={"number"}
                               onChange={(e) => handleUpdateSchState(index, 'putts', e.target.value)}
                               value={scoreCardHoles[index]?.putts}/>
                    <TextField inputProps={{min: 0, style: { textAlign: 'center', fontSize: 15 }}}
                               label={"Penalties"} variant={"outlined"} type={"number"}
                               onChange={(e) => handleUpdateSchState(index, 'penalties', e.target.value)}
                               value={scoreCardHoles[index]?.penalties}/>
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
                    <Divider/>
                    <Stack direction={"row"} spacing={2} justifyContent="space-between">
                        <Button onClick={handleResetHoleScores}>
                            <Typography color={"error"}>CLEAR</Typography>
                        </Button>
                        <IconButton onClick={handleSubmitHoleScores}>
                            <GolfHole style={{fontSize: 40}} color={"success"}/>
                        </IconButton>
                    </Stack>
                </Stack>
            </AccordionDetails>
        </Accordion>
    )
}