import { useEffect, useState } from 'react'
import { useAuthHeader } from 'react-auth-kit'

import { API_URL } from '../API_config.js'

// Return a query param string with empty fields removed
function formattedQueryParams(queryParams: any) {
    let queryParamString = '?';
    let params = {...queryParams}

    for (let param in params) {
        if (params[param] === '' || params[param] == null) {
            delete params[param]
        }
    }
    queryParamString += new URLSearchParams(params)
    return queryParamString
}

export function useApiGET<T>(route: string, initialValue: any, queryParams: any = null): [T, React.Dispatch<React.SetStateAction<T>>]{
    const [response, setResponse] = useState<T>(initialValue)

    const authHeader = useAuthHeader()
    const auth_headers = new Headers()
    auth_headers.set(
        "Authorization", authHeader()
    )

    // Re-fetch on updates to query params
    useEffect(() => {
        fetch(API_URL + route + formattedQueryParams(queryParams), { headers: auth_headers })
            .then(r => r.json())
            .then(data => setResponse(data))
    }, [queryParams])

    return [response, setResponse]
}

export function useApiPATCH<T>(route: string): [(T|null) | undefined, Function] {

    function patchCallback(object: any, params: any) {
        console.log("PATCHING: ", object)
        console.log("PARAMS: ", params)
        fetch(API_URL + route + formattedQueryParams(params), {
                method: 'PATCH',
                headers: auth_headers,
                body: JSON.stringify(object)
            })
            .then(r => r.json())
            .then(data => setResponse(data))
    }

    const [response, setResponse] = useState<T | null>(null)

    const authHeader = useAuthHeader()
    const auth_headers = new Headers()
    auth_headers.set(
        "Authorization", authHeader()
    )
    auth_headers.set(
        'Content-type', 'application/json'
    )
    // auth_headers.set(
    //     'method', 'PATCH'
    // )

    return [response, patchCallback]
}
