import { API_URL } from "./API_config";

export function makeAPIPath(tag){

    return API_URL+tag
}


export function fetchAPI(tag, callback){
    fetch(makeAPIPath(tag)).then((data)=>data.json()).then((data)=>callback(data))
}

