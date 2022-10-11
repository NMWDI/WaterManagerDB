import {useEffect, useState} from "react";

import {fetchAPI, makeAPIPath} from './util'

export default function StatusBar(){
    const [status, setStatus] = useState('OK')

    const tick = async ()=>{
        fetchAPI('/api_status', (data)=>{setStatus(data['ok']?'OK':'Not Connected')})

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