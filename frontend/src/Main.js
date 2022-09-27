import {Component} from "react";
import WellTable from "./WellTable";
import ReadingsTable from "./ReadingsTable";



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
        return (<div>
            <div>
            <h2>Wells</h2>
            <WellTable onRowSelect={this.handleRowSelect}/>
            </div>
            <div>
                <h2>Readings</h2>
                <ReadingsTable readings={this.state.readings}/>
            </div>
        </div>)

    }
}

export default WellView;