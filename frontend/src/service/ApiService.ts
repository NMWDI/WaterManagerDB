import { useEffect, useState, useRef } from 'react'
import { useAuthHeader } from 'react-auth-kit'

import { API_URL } from '../API_config.js'

export function useDidMountEffect(func: Function, dependencies: any) {
    const didMount = useRef(false)

    useEffect(() => {
        if (didMount.current) func()
        else didMount.current = true
    }, dependencies)
}

// Return a query param string with empty and null fields removed
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

// GET the specified resource of type T, updates the returned value when the passed queryParams are updated
// SetStateAction is returned so the frontend may update the resource visually
export function useApiGET<T>(route: string, initialValue: any, queryParams: any = null, dontFetchWithoutParams = false): [T, React.Dispatch<React.SetStateAction<T>>]{
    const [response, setResponse] = useState<T>(initialValue)
    const didMount = useRef(false)
    const authHeader = useAuthHeader()

    const auth_headers = {
        "Authorization": authHeader()
    }

    // Re-fetch on updates to query params (if the component has mounted, or the caller wants it anyways)
    useEffect(() => {
        if (queryParams == null && dontFetchWithoutParams) { return } // If an endpoint expects params, dont call it until they are defined
        if (didMount.current) {
            fetch(API_URL + route + formattedQueryParams(queryParams), { headers: auth_headers })
                .then(r => r.json())
                .then(data => setResponse(data))
        }
        else didMount.current = true
    }, [queryParams])

    return [response, setResponse]
}

export function useApiPATCH<T>(route: string): [T | null, Function] {

    // Response object from the patch request, expects that API returns patched obj on success
    const [response, setResponse] = useState<T | null>(null)

    const authHeader = useAuthHeader()
    const auth_headers = {
        "Authorization": authHeader(),
        'Content-type': 'application/json'
    }

    // Callback that the parent component will use to initiate the patch
    function patchCallback(object: any, params: any = null) {
        fetch(API_URL + route + formattedQueryParams(params), {
                method: 'PATCH',
                headers: auth_headers,
                body: JSON.stringify(object)
            })
            .then(r => r.json())
            .then(data => setResponse(data))
    }

    return [response, patchCallback]
}
