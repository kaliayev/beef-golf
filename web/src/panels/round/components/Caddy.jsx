import {Accordion, AccordionDetails, AccordionSummary, Autocomplete, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {ExpandMore} from "@mui/icons-material";
import TextField from "@mui/material/TextField";

export default function Caddy(props) {
    const {golfers, selectedGolfer, handleSetSelectedGolfer, setSelectedGolfer, currGeolocation} = props;
    return (<Accordion sx={{backgroundColor: colours.background}}>
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
                <Typography sx={{color: 'text.secondary' }}>{`Distance: ${null}`}</Typography>
                <Typography sx={{color: 'text.secondary' }}>{`Recommended Club: ${undefined}`}</Typography>
            </Stack>
        </AccordionDetails>
    </Accordion>)
}
