import {useEffect, useState} from "react";


export default function StatusBar(){
    const [status, setStatus] = useState('OK')

    const tick = async ()=>{
        let url = 'http://'+process.env.REACT_APP_API_URL+'/api_status'
        fetch(url).then((data)=>data.json()).then((data)=>{
                console.log(data['ok'])
                setStatus(data['ok']?'OK':'Not Connected')
            })
    }
    useEffect(()=>{
        tick()
        setInterval(tick, 5000)
    })
    return (
        <div>
            API Status: <span style={{color: status === "OK" ? "green" : "red"}}> <b>{status}</b> </span>
        </div>
    )
}