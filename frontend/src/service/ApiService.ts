import { useEffect, useState, useRef } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { API_URL } from '../API_config.js'
import { convertToObject } from 'typescript'

export function useDidMountEffect(func: Function, dependencies: any) {
    const didMount = useRef(false)

    useEffect(() => {
        if (didMount.current) func()
        else didMount.current = true
    }, dependencies)
}

// Return a query param string with empty and null fields removed
function formattedQueryParams(queryParams: any) {
    if (!queryParams) return ''
    let queryParamString = '?';
    let params = {...queryParams}

    for (let param in params) {
        if (params[param] === '' || params[param] == undefined) {
            delete params[param]
        }
    }
    queryParamString += new URLSearchParams(params)
    return queryParamString
}

// GET the specified resource of type T, updates the returned value when the passed queryParams are updated
// SetStateAction is returned so the frontend may update the resource visually
export function useApiGET<T>(route: string, initialValue: any, queryParams: any = undefined, dontFetchWithoutParams = false, dontAppendApiURL = false): [T, React.Dispatch<React.SetStateAction<T>>]{
    const [response, setResponse] = useState<T>(initialValue)
    const didMount = useRef(false)
    const authHeader = useAuthHeader()

    console.log('In UseApiGET')
    console.log('Route: ' + route)
    console.log('Query Params: ' + queryParams)
    console.log(dontFetchWithoutParams)

    const auth_headers = {
        "Authorization": authHeader()
    }

    // Re-fetch on updates to query params (if the component has mounted, or the caller wants it anyways)
    useEffect(() => {
        if (didMount.current) {
            if (queryParams == undefined && dontFetchWithoutParams) { return } // If an endpoint expects params, dont call it until they are defined
            const fetchURL = dontAppendApiURL ? route : API_URL + route
            fetch(fetchURL  + formattedQueryParams(queryParams), { headers: auth_headers })
                .then(r => r.json())
                .then(data => setResponse(data))
        }
        else didMount.current = true
    }, [queryParams, route])

    return [response, setResponse]
}

export function useApiPOST<T>(route: string): [T | Error | undefined, number | undefined, Function] {

    // Response object from the post request, expects that API returns created object of type T on success
    const [data, setData] = useState<T | Error>()
    const [code, setCode] = useState<number>()

    const authHeader = useAuthHeader()
    const auth_headers = {
        "Authorization": authHeader(),
        'Content-type': 'application/json'
    }

    // Callback that the parent component will use to initiate the post
    function postCallback(object: any, params: any = null) {
        try {
            setCode(undefined) // Updates to response code (undefined -> number) should trigger effects
            const result = fetch(API_URL + route + formattedQueryParams(params), {
                    method: 'POST',
                    headers: auth_headers,
                    body: JSON.stringify(object)
                })

            result.then(r => r.json()).then(data => setData(data))
            result.then(r => setCode(r.status))
            result.catch(err => {setData(err); setCode(400)})
        }
        catch (err: any) {
            setCode(400)
            setData(err)
        }
    }

    return [data, code, postCallback]
}

// Ideally this should function like the post
export function useApiPATCH<T>(route: string): [T | Error | null, Function] {

    // Response object from the patch request, expects that API returns patched obj on success
    const [response, setResponse] = useState<T | Error | null>(null)

    const authHeader = useAuthHeader()
    const auth_headers = {
        "Authorization": authHeader(),
        'Content-type': 'application/json'
    }

    // Callback that the parent component will use to initiate the patch
    function patchCallback(object: any, params: any = null) {
        try {
            fetch(API_URL + route + formattedQueryParams(params), {
                    method: 'PATCH',
                    headers: auth_headers,
                    body: JSON.stringify(object)
                })
                .then(r => r.json())
                .then(data => setResponse(data))
                .catch(err => setResponse(err))
        }
        catch (err: any) {
            setResponse(err)
        }
    }

    return [response, patchCallback]
}
