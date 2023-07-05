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

export function useApiGET<T>(route: string, initialValue: any, queryParams: any = null) {
    const [response, setResponse] = useState<T>(initialValue)

    const authHeader = useAuthHeader()
    const auth_headers = new Headers()
    auth_headers.set(
        "Authorization", authHeader()
    )

    // Re-fetch on updates to query params or route
    useEffect(() => {
        fetch(API_URL + route + formattedQueryParams(queryParams), { headers: auth_headers })
            .then(r => r.json())
            .then(data => setResponse(data))
    }, [route, queryParams])

    return response
}
