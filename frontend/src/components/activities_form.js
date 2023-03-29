//An Activities Form component

import { useState } from "react";
import { Box, Button, Divider, TextField, MenuItem } from "@mui/material";
//import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useAuthHeader } from 'react-auth-kit';
import { API_URL } from "../API_config.js"

let observation_count = 0  //Counters for adding new observation and part ids
let part_count = 0

function ObservationInput(props){
    //A small component that is the observation input
    //Making this a component facilitates adding new inputs
    //props:
    //  id = unique value to ensure input has unique ID
    //  input_vals = timestamp:, value:, observed_property_id:, unit_id: 
    //  observed_properties and units --> see props for form
    function handleDateChange(event){
        props.onChange({id: props.id, timestamp: event.target.value})
    }

    function handleValueChange(event){
        props.onChange({id: props.id, value: event.target.value})
    }

    function handleTypeChange(event){
        props.onChange({id: props.id, observed_property_id: event.target.value})
    }
    
    function handleUnitChange(event){
        props.onChange({id: props.id, unit_id: event.target.value})
    }

    return (
        <Box sx={{ display: "flex" }}>
            <TextField 
                required
                id={ props.id + '_date' }
                type="datetime-local"
                label="Date/Time"
                variant="outlined"
                margin="normal"
                sx = {{ m:1 }}
                value={ props.timestamp }
                InputLabelProps={{
                    shrink: true
                }}
                onChange={ handleDateChange }
            />
            <TextField 
                required
                id={ props.id + '_value'}
                label="Value"
                type="number"
                step="any"
                variant="outlined"
                margin="normal"
                sx = {{ m:1 }}
                value={ props.value }
                onChange={ handleValueChange }
            />
            <TextField 
                required
                id={props.id + '_type'}
                name="obs_type"
                label="Reading Type"
                variant="outlined"
                select
                sx = {{ m:1, width:200 }}
                value={ props.observed_property_id}
                onChange={ handleTypeChange }
            >
                { props.observed_properties.map((obstype) => (
                        <MenuItem key={obstype.property_id} value={obstype.property_id}>
                            {obstype.name}
                        </MenuItem>
                    ))}
            </TextField>
            <TextField 
                required
                id={props.id + '_units'}
                name="obs_unit"
                label="Units"
                variant="outlined"
                select
                sx = {{ m:1, width:200 }}
                value={ props.unit_id }
                onChange={ handleUnitChange }
            >
                { props.units.map((unittype) => (
                        <MenuItem key={unittype.unit_id} value={unittype.unit_id}>
                            {unittype.name}
                        </MenuItem>
                    ))}
            </TextField>
        </Box>
    )

}

function PartInput(props){
    //A small component that is the observation input
    //Making this a component facilitates adding new inputs
    //props:
    //  input_id: unique id for each input created
    //  part_id: database part_id 
    //  count: number of parts used
    //  parts_list: list of parts for select [{part_id: , part_type: , part_number: }]
    //  onChange: handler in parent component
    function handleTypeChange(event){
        props.onChange({id: props.input_id, part_id: event.target.value})
    }
    
    function handleCountChange(event){
        props.onChange({id: props.input_id, count: event.target.value})
    }

    return(
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField 
                id={ "part_type_" + props.input_id }
                name="part_type"
                label="Part Type"
                variant="outlined"
                select
                required
                sx = {{ m:1, width:200 }}
                value={ props.part_id }
                onChange={ handleTypeChange }
            >
                { props.parts_list.map((parttype) => (
                        <MenuItem key={parttype.part_id} value={parttype.part_id}>
                            { parttype.part_type + ' - ' + parttype.part_number }
                        </MenuItem>
                    ))}
            </TextField>
            <TextField 
                id="part_quantitiy"
                label="Part Quantity"
                variant="outlined"
                margin="normal"
                sx = {{ m:1 }}
                required
                type="number"
                InputProps={{ inputProps: { step: 1, min: 0 } }}
                value={ props.count }
                onChange={ handleCountChange }
            />
        </Box>
    )
    

}

export default function MeterActivitiesForm(props){
    //
    //Form for entering meter maintenance and repair information
    //props:
    //  activities: list of activity types {activity_id, name}
    //  observed_properties: list of observed properties {property_id, name}
    //  part_types: list of part types
    //  units: list of units {unit_id, name}

    const authHeader = useAuthHeader()

    //State variables
    const [ activity_datetime, setActivityDate ] = useState(
        {
            date_val:'',
            start_time:'',
            end_time:''
        }
    )
    const [ activity, setActivity ] = useState(
        {
            activity_id:'',
            description:''
        }
    )
    const [ meter, setMeter ] = useState(
        {
            id:null,
            serial_number:'',
            contact:'',
            contact_id:'',
            latitude:'',
            longitude:'',
            trss:'',
            ra_number:'',
            ose_tag:'',
            well_distance:'',
            notes:''
        }
    )
    const [ observations, setObservations ] = useState([])
    const [ parts, setParts ] = useState([])

    //Callbacks
    function handleMeterChange(event){
        //Update meter state when interacting with various inputs
        //Meter input and installation inputs
        setMeter({...meter, [event.target.id]: event.target.value})
    }

    function handleMeterSelect(event){
        //Should execute when meter SN field is "blurred"
        //Clicking away from the input is essentially "selecting it"

        //Exit if meter data is empty string
        if(meter.serial_number == ''){
            setMeter(
                {
                    id:null,
                    serial_number:'',
                    organization:'',
                    latitude:'',
                    longitude:'',
                    trss:'',
                    ra_number:'',
                    ose_tag:'',
                    notes:''
                }
            )
            return
        }

        //Get meter data
        let auth_headers = new Headers()
        auth_headers.set(
            "Authorization", authHeader()
        )
        let url = new URL(API_URL+'/meters')
        url.searchParams.set("meter_sn",event.target.value)
        fetch(url,{ headers: auth_headers })
            .then(r => r.json()).then(loadInstallData)
    }

    function loadInstallData(data){
        //Sets inputs in installation section with meter information
        if(data.length > 0){
            //Set any null values to ''
            let datavals = data[0]
            for(let p in datavals){
                if(datavals[p] === null){
                    datavals[p] = ''
                }
            }
            setMeter(datavals)
        }else{
            console.log('Meter not found')
        }
    }

    function handleActivityChange(event){
        //Handle selection of a particular activity and description update
        //Note - selecting activity generates a different event from updating description
        if(event.target.id == 'description'){
            setActivity({...activity, [event.target.id]: event.target.value})
        }else{
            setActivity({...activity, activity_id: event.target.value})
        }
    }

    function handleDateTimeSelect(event){
        let newval = {}
        newval[event.target.id] = event.target.value
        setActivityDate({...activity_datetime, ...newval})
    }

    function handleObservationChange(input_val){
        //Update observation
        setObservations(observations.map(obs => {
            if(obs.id == input_val.id){
                return {
                    ...obs,
                    ...input_val
                }
            }else{
                return obs
            }
        }))
    }

    function handlePartChange(input_val){
        //Update parts
        setParts(parts.map(prt => {
            if(prt.id == input_val.id){
                return {
                    ...prt,
                    ...input_val
                }
            }else{
                return prt
            }
        }))
    }

    function addObservation(event){
        //Add a new observation to the observations section
        observation_count++
        setObservations(
            [
                ...observations,
                {
                    id: 'obs_' + observation_count,
                    timestamp:'',
                    value:'',
                    observed_property_id:'',
                    unit_id:''
                }
            ]
        )
    }

    function addPart(event){
        //Add a new part to parts used section
        part_count++
        setParts(
            [
                ...parts,
                {
                    id: part_count,
                    part_id: '',
                    count: ''
                }
            ])
    }

    function handleSubmit(event){
        //Activities form submission
        event.preventDefault()

        //Determine datetimes
        let start_datetime = activity_datetime.date_val + 'T' + activity_datetime.start_time
        let end_datetime = activity_datetime.date_val + 'T' + activity_datetime.end_time
        
        //Create Maintenance object
        let maintenance = {
            meter_id: meter.id,
            activity:{
                timestamp_start: start_datetime,
                timestamp_end: end_datetime,
                activity_id: activity.activity_id,
                notes: activity.description,
                technician_id: 1
            }
        }

        //Installation data
        //Update all on deployment (activity id = 1)
        //Delete all on remove (activity id = 2)
        //Update well distance and notes for other activities
        let installation = {
            well_distance: meter.well_distance == '' ? null : meter.well_distance,
            notes: meter.notes == '' ? null : meter.notes
        }
        if(activity.activity_id == '1'){
            installation = {
                contact_id: meter.contact ? null : meter.contact,
                ra_number: meter.ra_number ? null : meter.ra_number,
                well_distance: meter.well_distance ? null : meter.well_distance,
                tag: meter.ose_tag ? null : meter.ose_tag,
                latitude: meter.latitude ? null : meter.latitude,
                longitude: meter.longitude ? null : meter.longitude,
                trss: meter.trss ? null : meter.trss,
                notes: meter.notes ? null : meter.notes
            }
        }
        if(activity.activity_id == '2'){
            installation = {
                contact_id: null,
                ra_number: null,
                well_distance: null,
                tag: null,
                latitude: null,
                longitude: null,
                trss: null,
                notes: null
            }
        }

        maintenance['installation_update'] = installation

        //Collect observations
        if(observations.length > 0){
            maintenance['observations'] = observations
        }

        //Collect parts
        if(parts.length > 0){
            maintenance['parts'] = parts
        }

        console.log(JSON.stringify(maintenance))

        //Send maintenance data to backend
        let post_headers = new Headers()
        post_headers.set("Authorization", authHeader())
        post_headers.append("Content-Type","application/json")

        fetch(
            `${API_URL}/meter_maintenance`,
            {
                method: 'POST',
                headers: post_headers,
                body: JSON.stringify(maintenance)
            }
        )
        .then(r => r.json()).then(data => console.log(data))
        
    }

    return(
        <Box>
            <form id="activity_form" onSubmit={handleSubmit}>
                {/*----- Meter SN, reading, datetime ----*/}
                <Box component="section" sx={{ flexWrap: 'wrap', maxWidth: 800 }}>
                    <TextField 
                        required
                        id="serial_number"
                        label="Meter"
                        variant="outlined"
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.serial_number }
                        onChange={handleMeterChange}
                        onBlur={handleMeterSelect}
                    />
                    <TextField
                        required
                        id="activity_id"
                        label="Activities"
                        select
                        name="activity_id"
                        sx = {{ m:1, width:250 }}
                        value={ activity.activity_id }
                        onChange={handleActivityChange}
                    >
                        { props.activities.map((act) => (
                            <MenuItem key={act.activity_id} value={act.activity_id}>
                                {act.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        required 
                        id="date_val"
                        variant="outlined"
                        sx = {{ m:1 }}
                        type="date"
                        value={ activity_datetime.date_val }
                        onChange= { handleDateTimeSelect }
                    />
                     <TextField 
                        required
                        id="start_time"
                        label="Start Time"
                        variant="outlined"
                        sx = {{ m:1 }}
                        type="time"
                        value={ activity_datetime.start_time }
                        onChange= { handleDateTimeSelect }
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                     <TextField 
                        required
                        id="end_time"
                        label="End Time"
                        variant="outlined"
                        sx = {{ m:1 }}
                        type="time"
                        value={ activity_datetime.end_time }
                        onChange= { handleDateTimeSelect }
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <Divider variant='middle'/>
                </Box>

                {/*----- Meter Installation Details ----*/}
                <Box component="section" sx={{ flexWrap: 'wrap', maxWidth: 800 }}>
                    <h4>Installation:</h4>
                    <TextField 
                        id="contact"
                        label="Contact"
                        variant={ activity.activity_id == "1" ? "outlined":"filled" }
                        disabled={ activity.activity_id !="1" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.organization }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="latitude"
                        label="Latitude"
                        variant={ activity.activity_id == "1" ? "outlined":"filled" }
                        disabled={ activity.activity_id !="1" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.latitude }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="longitude"
                        label="Longitude"
                        variant={ activity.activity_id == "1" ? "outlined":"filled" }
                        disabled={ activity.activity_id !="1" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.longitude }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="trss"
                        label="TRSS"
                        variant={ activity.activity_id == "1" ? "outlined":"filled" }
                        disabled={ activity.activity_id !="1" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.trss }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="ra_number"
                        label="RA Number"
                        variant={ activity.activity_id == "1" ? "outlined":"filled" }
                        disabled={ activity.activity_id !="1" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.ra_number }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="ose_tag"
                        label="OSE Tag"
                        variant={ activity.activity_id == "1" ? "outlined":"filled" }
                        disabled={ activity.activity_id !="1" }
                        margin="normal"
                        sx = {{ m:1 }}
                        value={ meter.ose_tag }
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="well_distance"
                        label="Well Distance"
                        variant={ activity.activity_id != "2" ? "outlined":"filled" }
                        disabled={ activity.activity_id =="2" }
                        value={ meter.well_distance }
                        margin="normal"
                        sx = {{ m:1 }}
                        onChange={handleMeterChange}
                    />
                    <TextField 
                        id="propeller"
                        label="Propeller Type"
                        variant="outlined"
                        margin="normal"
                        sx = {{ m:1 }}
                    />
                    <TextField 
                        id="notes"
                        label="Notes"
                        variant={ activity.activity_id != "2" ? "outlined":"filled" }
                        disabled={ activity.activity_id =="2" }
                        margin="normal"
                        value={ meter.notes }
                        sx = {{ m:1 }}
                        multiline
                        rows={2}
                        fullWidth
                        onChange={handleMeterChange}
                    />
                    
                </Box>

                {/*-----------  Observations ----------*/}
                <Box component="section">
                    <h4>Observations:</h4>
                    { observations.map((obs) => (
                        <ObservationInput
                            key={obs.id}
                            id={obs.id}
                            timestamp = {obs.timestamp}
                            value = {obs.value}
                            observed_property_id = {obs.observed_property_id}
                            unit_id = {obs.unit_id}
                            observed_properties = { props.observed_properties }
                            units = { props.units }
                            onChange = { handleObservationChange }
                        />
                    )) }
                    
                    <Button
                        variant="outlined"
                        sx={{ m:1 }}
                        onClick={ addObservation }
                    >
                        Add
                    </Button>
                    
                    <Divider variant='middle'/>
                </Box>
                
                {/*----- Meter Maintenance/Repairs ----*/}
                <Box component="section">
                    <h4>Maintenance/Repair:</h4>
                    <TextField 
                        id="description"
                        label="Description"
                        variant="outlined"
                        margin="normal"
                        sx = {{ m:1, width: 600}}
                        multiline
                        rows={3}
                        value={ activity.description }
                        onChange={ handleActivityChange }
                    />

                    <h5>Parts Used:</h5>
                    { parts.map((part) => (
                        <PartInput
                            key={part.id}
                            input_id={part.id}
                            part_id={part.part_id}
                            count={part.count}
                            parts_list={props.part_types}
                            onChange={ handlePartChange }
                        />
                    )) }
                    
                    <Button
                        variant="outlined"
                        sx={{ m:1 }}
                        onClick={ addPart }
                    >
                        Add
                    </Button>

                    <Divider variant='middle'/>
                </Box>
                
                <Box sx={{ mt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                    >Submit</Button>
                </Box>
                
            </form>
       </Box>
    )
}