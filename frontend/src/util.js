import {config} from "../Constants";

export function makeAPIPath(tag){

    return config.url.API_URL+tag
}


export function fetchAPI(tag, callback){
    fetch(makeAPIPath(tag)).then((data)=>data.json()).then((data)=>callback(data))
}

