import { useMutation, useQuery, useQueryClient } from 'react-query'
import { API_URL } from '../API_config.js'
import { useAuthHeader } from 'react-auth-kit'
import { MeterListDTO, MeterListQueryParams, NewWaterLevelMeasurement, Page, ST2WaterLevelMeasurements, ST2WaterLevelQueryParams, WaterLevelQueryParams, WellMeasurementDTO } from '../interfaces.js'
import { useSnackbar } from 'notistack';

// Generate a query param string with empty and null fields removed
function formattedQueryParams(queryParams: any) {
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

// Generate a GET fetch function with auth headers given route + params
async function GETFetch(route: string, params: any, authHeader: string, prefixAPIUrl: boolean = true) {
    const headers = {
        "Authorization": authHeader
    }

    const fullUrl = (prefixAPIUrl ? API_URL + '/' : '') + route
    return fetch(fullUrl  + formattedQueryParams(params), { headers: headers })
            .then(r => r.json())
}

// Generate a POST fetch function with auth headers given route + params
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

export function useGetWaterLevels(params: WaterLevelQueryParams) {
    const route = 'waterlevels'
    const authHeader = useAuthHeader()
    return useQuery<WellMeasurementDTO[], Error>([route, params], () =>
        GETFetch(route, params, authHeader())
    )
}

export function useGetST2WaterLevels(params: ST2WaterLevelQueryParams | undefined) {
    const route = `https://st2.newmexicowaterdata.org/FROST-Server/v1.1/Datastreams(${params?.datastreamID})/Observations`
    const authHeader = useAuthHeader()
    return useQuery<ST2WaterLevelMeasurements, Error>([route, params], () =>
        GETFetch(route, {$filter: params?.$filter, $orderby: params?.$orderby}, authHeader(), false),
        {enabled: !!params?.datastreamID}
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
                console.log("SUCCESSFUL POST")

                const responseJson = await response.json()

                queryClient.setQueryData([route, {well_id: responseJson["well_id"]}], (old: WellMeasurementDTO[] | undefined) => {return [...old ?? [], responseJson]})
                return responseJson
            }
        },
        retry: 0
    })
}