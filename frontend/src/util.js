export function makeAPIPath(tag){

    return process.env.REACT_APP_API_URL+tag
}


export function fetchAPI(tag, callback){
    fetch(makeAPIPath(tag)).then((data)=>data.json()).then((data)=>callback(data))
}

