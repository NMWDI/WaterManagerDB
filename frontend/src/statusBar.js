import {useEffect, useState} from "react";

import makeAPIPath from './util'

export default function StatusBar(){
    const [status, setStatus] = useState('OK')

    const tick = async ()=>{
        fetch(makeAPIPath('/api_status')).then((data)=>data.json()).then((data)=>{
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