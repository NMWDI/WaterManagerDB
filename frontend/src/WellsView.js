import {Component} from "react";
import WellTable from "./WellTable";
import ReadingsTable from "./ReadingsTable";
import {Box} from "@mui/material";


class WellView extends Component{
    constructor(props) {
        super(props);
        this.state = {readings: []}
        this.handleRowSelect = this.handleRowSelect.bind(this)
    }

    handleRowSelect(row){
        let url = 'http://'+process.env.REACT_APP_API_URL+'/wellreadings/'+row.id
        fetch(url).then((data)=>data.json()).then((data) =>
        this.setState({readings: data})
        )
    }

    render(){
        return (<Box sx={{ height: 400, width: '100%' }}>
                   <h2>Wells</h2>
                    <WellTable onRowSelect={this.handleRowSelect}/>
                    <div>
                        <h2>Readings</h2>
                        <ReadingsTable readings={this.state.readings}/>
                    </div>
        </Box>)

    }
}

export default WellView;