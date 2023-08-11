import { useMutation, useQuery, useQueryClient } from 'react-query'
import { API_URL } from '../API_config.js'
import { useAuthHeader } from 'react-auth-kit'
import { ActivityTypeLU, MeterListDTO, MeterListQueryParams, NewWaterLevelMeasurement, ObservedPropertyTypeLU, Page, ST2WaterLevelMeasurement, User, WaterLevelQueryParams, WellMeasurementDTO } from '../interfaces.js'
import { useSnackbar } from 'notistack';

// Generate a query param string with empty and null fields removed
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

async function GETFetch(route: string, params: any, authHeader: string) {
    const headers = {
        "Authorization": authHeader
    }

    return fetch(API_URL + `/${route}` + formattedQueryParams(params), { headers: headers })
            .then(r => r.json())
}

async function GETST2Fetch(route: string) {
    interface ST2Response {
        "@iot.nextLink": string
        value: []
    }

    const queryParams = formattedQueryParams({
        $filter: 'year(phenomenonTime) gt 2021',
        $orderby: 'phenomenonTime asc'
    })

    const url = 'https://st2.newmexicowaterdata.org/FROST-Server/v1.1/'

    // The ST2 API returns data in chunks of 1000, get each chunk and return them all
    let valueList: ST2WaterLevelMeasurement[] = []
    let nextLink = url + route + queryParams
    let count = 0 // Ensure that it doesn't get stuck in an infinite loop, if somehow iot.nextLink is always defined
    do {
        const results: ST2Response = await fetch(nextLink).then(r => r.json())
        nextLink = results['@iot.nextLink']
        valueList.push(...results.value)
        count++
    }
    while (nextLink && count < 10)

    return valueList
}

async function POSTFetch(route: string, object: any, authHeader: string) {
    const headers = {
        "Authorization": authHeader,
        "Content-type": 'application/json'
    }

    return fetch(API_URL + `/${route}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(object)
    })
}

export function useGetMeterList(params: MeterListQueryParams) {
    const route = 'meters'
    const authHeader = useAuthHeader()
    return useQuery<Page<MeterListDTO>, Error>([route, params], () =>
        GETFetch(route, params, authHeader()),
        {keepPreviousData: true}
    )
}

export function useGetUserList() {
    const route = 'users'
    const authHeader = useAuthHeader()
    return useQuery<User[], Error>([route], () =>
        GETFetch(route, null, authHeader()),
        {keepPreviousData: true}
    )
}

export function useGetActivityTypeList() {
    const route = 'activity_types'
    const authHeader = useAuthHeader()
    return useQuery<ActivityTypeLU[], Error>([route, null], () =>
        GETFetch(route, null, authHeader()),
        {keepPreviousData: true}
    )
}

export function useGetWaterLevels(params: WaterLevelQueryParams) {
    const route = 'waterlevels'
    const authHeader = useAuthHeader()
    return useQuery<WellMeasurementDTO[], Error>([route, params], () =>
        GETFetch(route, params, authHeader())
    )
}

export function useGetPropertyTypes() {
    const route = 'observed_property_types'
    const authHeader = useAuthHeader()
    return useQuery<ObservedPropertyTypeLU[], Error>([route], () =>
        GETFetch(route, null, authHeader())
    )
}

export function useGetST2WaterLevels(datastreamID: number | undefined) {
    const route = `Datastreams(${datastreamID})/Observations`
    return useQuery<ST2WaterLevelMeasurement[], Error>([route, datastreamID], () =>
        GETST2Fetch(route),
        {enabled: !!datastreamID}
    )
}

export function useCreateWaterLevel() {
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const route = 'waterlevels'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (newWaterLevel: NewWaterLevelMeasurement) => {
            const response = await POSTFetch(route, newWaterLevel, authHeader())

            if (!response.ok) {
                if(response.status == 422) {
                    enqueueSnackbar('One or More Required Fields Not Entered!', {variant: 'error'})
                    throw Error("Incomplete form, check network logs for details")
                }
                else {
                    enqueueSnackbar('Unknown Error Occurred!', {variant: 'error'})
                    throw Error("Unknown Error: " + response.status)
                }
            }
            else {
                enqueueSnackbar('Successfully Created New Measurement!', {variant: 'success'})

                const responseJson = await response.json()

                queryClient.setQueryData([route, {well_id: responseJson["well_id"]}], (old: WellMeasurementDTO[] | undefined) => {return [...old ?? [], responseJson]})
                return responseJson
            }
        },
        retry: 0
    })
}