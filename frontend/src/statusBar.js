import {useEffect, useState} from "react";


export default function StatusBar(){
    const [status, setStatus] = useState('')

    useEffect(()=>{
        function tick(){
            {
            let url = 'http://'+process.env.REACT_APP_API_URL+'/api_status'
            fetch(url).then((data)=>data.json()).then((data)=>{
                setStatus(data['ok']?"OK":"Not Connected")
            })}
        }
        tick()
        setInterval(tick, 5000)
    })
    return (
        <div>
            API Status: {status}
        </div>
    )
}