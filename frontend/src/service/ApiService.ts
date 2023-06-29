import { useEffect, useState } from 'react'
import { useAuthHeader } from 'react-auth-kit'

import { API_URL } from '../API_config.js'

export const useApiGET = (route: string, initialValue: any) => {
    const [response, setResponse] = useState(initialValue)

    const authHeader = useAuthHeader()
    const auth_headers = new Headers()
    auth_headers.set(
        "Authorization", authHeader()
    )

    useEffect(() => {
        fetch(API_URL + route, { headers: auth_headers })
            .then(r => r.json())
            .then(data => setResponse(data))
    }, [route])

    return response
}
