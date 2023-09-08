import { useMutation, useQuery, useQueryClient } from 'react-query'
import { API_URL } from '../API_config.js'
import { useAuthHeader } from 'react-auth-kit'
import { useSnackbar } from 'notistack';
import {
    ActivityForm,
    ActivityTypeLU,
    MeterListDTO,
    MeterListQueryParams,
    MeterTypeLU,
    NewWellMeasurement,
    NoteTypeLU,
    ObservedPropertyTypeLU,
    Page,
    ST2Measurement,
    ST2Response,
    ServiceTypeLU,
    User,
    WaterLevelQueryParams,
    WellMeasurementDTO,
    Well,
    WellSearchQueryParams,
    WellDetailsQueryParams,
    MeterDetailsQueryParams,
    MeterDetails,
    MeterPartParams,
    PartAssociation,
    MeterMapDTO,
    MeterHistoryDTO,
    Part,
    PartTypeLU,
    UserRole
} from '../interfaces.js'

// Date display util
export function toGMT6String(date: Date) {
    const dateString = (date.getMonth() + 1) + '/' + (date.getDate() + 1) + '/' + date.getFullYear() + ' ';

    date.setHours(date.getHours() - 5)
    const timeString = date.toLocaleTimeString('en-US', {timeZone: "America/Denver", hour: 'numeric', minute: 'numeric', hour12: true})

    return dateString + timeString
}

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

async function GETFetch(route: string, params: any, authHeader: string, requireParams = false) {
    if (!params && requireParams) return
    const headers = {
        "Authorization": authHeader
    }

    return fetch(API_URL + `/${route}` + formattedQueryParams(params), { headers: headers })
            .then(r => r.json())
}

async function GETFetch2(route: string, params: any, authHeader: string, requireParams = false) {
    if (!params && requireParams) return
    const headers = {
        "Authorization": authHeader
    }

    return fetch(API_URL + `/${route}` + formattedQueryParams(params), { headers: headers })
}

// Fetches from the NM API's ST2 subdomain (data that relates to water levels)
async function GETST2Fetch(route: string) {
    const queryParams = formattedQueryParams({
        $filter: 'year(phenomenonTime) gt 2021',
        $orderby: 'phenomenonTime asc'
    })

    const url = `https://st2.newmexicowaterdata.org/FROST-Server/v1.1/`

    // The ST2 API returns data in chunks of 1000, get each chunk and return them all
    let valueList: ST2Measurement[] = []
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

// Fetches from the NM API's nmenv subdomain (data that relates to chlorides) | Not used but leaving for now
async function GETNMEnvFetch(route: string) {
    const url = `https://nmenv.newmexicowaterdata.org/FROST-Server/v1.1/`

    // The API returns data in chunks of 1000, get each chunk and return them all
    let valueList: ST2Measurement[] = []
    let nextLink = url + route
    let count = 0 // Ensure that it doesn't get stuck in an infinite loop, if somehow iot.nextLink is always defined
    do {
        const results: ST2Response = await fetch(nextLink).then(r => r.json())
        nextLink = results['@iot.nextLink']
        valueList.push(...results.value)
        count++
    }
    while (nextLink && count < 10)

    // Extract the float value from the measurement string
    const extractFloatPattern = /-?\d+(\.\d+)?/;
    for (let value of valueList) {
        const match = value.result.toString().match(extractFloatPattern);
        const floatString = match ? match[0] : '0'
        value.result = parseFloat(floatString)
    }

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

async function PATCHFetch(route: string, object: any, authHeader: string) {
    const headers = {
        "Authorization": authHeader,
        "Content-type": 'application/json'
    }

    return fetch(API_URL + `/${route}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(object)
    })
}

export function useGetMeterList(params: MeterListQueryParams | undefined) {
    const route = 'meters'
    const authHeader = useAuthHeader()
    return useQuery<Page<MeterListDTO>, Error>([route, params], () =>
        GETFetch(route, params, authHeader()),
        {keepPreviousData: true}
    )
}

export function useGetMeterLocations() {
    const route = 'meters_locations'
    const authHeader = useAuthHeader()
    return useQuery<MeterMapDTO[], Error>([route], () =>
        GETFetch(route, null, authHeader()),
    )
}

export function useGetMeterTypeList() {
    const route = 'meter_types'
    const authHeader = useAuthHeader()
    return useQuery<MeterTypeLU[], Error>([route], () =>
        GETFetch(route, null, authHeader()),
    )
}

export function useGetNoteTypes() {
    const route = 'note_types'
    const authHeader = useAuthHeader()
    return useQuery<NoteTypeLU[], Error>([route], () =>
        GETFetch(route, null, authHeader()),
    )
}

export function useGetMeterHistory(params: MeterDetailsQueryParams) {
    const route = 'meter_history'
    const authHeader = useAuthHeader()
    return useQuery<MeterHistoryDTO[], Error>([route, params], () =>
        GETFetch(route, params, authHeader()),
        {enabled: params?.meter_id != undefined}
    )
}

export function useGetRoles() {
    const route = 'roles'
    const authHeader = useAuthHeader()
    return useQuery<UserRole[], Error>([route], () =>
        GETFetch(route, null, authHeader()),
    )
}

export function useGetUserAdminList() {
    const route = 'usersadmin'
    const authHeader = useAuthHeader()
    return useQuery<User[], Error>([route], () =>
        GETFetch(route, null, authHeader()),
    )
}

export function useGetUserList() {
    const route = 'users'
    const authHeader = useAuthHeader()
    return useQuery<User[], Error>([route], () =>
        GETFetch(route, null, authHeader()),
    )
}

export function useGetActivityTypeList() {
    const route = 'activity_types'
    const authHeader = useAuthHeader()
    return useQuery<ActivityTypeLU[], Error>([route, null], () =>
        GETFetch(route, null, authHeader()),
    )
}

export function useGetServiceTypes() {
    const route = 'service_types'
    const authHeader = useAuthHeader()
    return useQuery<ServiceTypeLU[], Error>([route, null], () =>
        GETFetch(route, null, authHeader()),
    )
}

export function useGetWaterLevels(params: WaterLevelQueryParams) {
    const route = 'waterlevels'
    const authHeader = useAuthHeader()
    return useQuery<WellMeasurementDTO[], Error>([route, params], () =>
        GETFetch(route, params, authHeader())
    )
}

export function useGetChloridesLevels(params: WaterLevelQueryParams) {
    const route = 'chlorides'
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

export function useGetWells(params: WellSearchQueryParams | undefined) {
    const route = 'wells'
    const authHeader = useAuthHeader()
    return useQuery<Page<Well>, Error>([route, params], () =>
        GETFetch(route, params, authHeader()),
        {keepPreviousData: true}
    )
}

export function useGetWell(params: WellDetailsQueryParams | undefined) {
    const route = 'well'
    const authHeader = useAuthHeader()
    return useQuery<Well, Error>([route, params], async() =>
        {
            const response = await GETFetch2(route, params, authHeader(), true)
            if (!response?.ok) {return null }
            return response?.json() ?? null
        },
        {
            keepPreviousData: true,
            retry: 0,
            enabled: params?.well_id != undefined
        }
    )
}

export function useGetMeter(params: MeterDetailsQueryParams | undefined) {
    const route = 'meter'
    const authHeader = useAuthHeader()
    return useQuery<MeterDetails, Error>([route, params], () =>
        GETFetch(route, params, authHeader()),
        {
            keepPreviousData: true,
            enabled: params?.meter_id != undefined
        }
    )
}

export function useGetPartTypeList() {
    const route = 'part_types'
    const authHeader = useAuthHeader()
    return useQuery<PartTypeLU[], Error>([route], () =>
        GETFetch(route, null, authHeader()),
        {
            keepPreviousData: true,
        }
    )
}

export function useGetParts() {
    const route = 'parts'
    const authHeader = useAuthHeader()
    return useQuery<Part[], Error>([route], () =>
        GETFetch(route, null, authHeader()),
        {
            keepPreviousData: true,
        }
    )
}

export function useGetPart(params: {part_id: number} | undefined) {
    const route = 'part'
    const authHeader = useAuthHeader()
    return useQuery<Part, Error>([route, params], () =>
        GETFetch(route, params, authHeader()),
        {
            keepPreviousData: true,
            enabled: params?.part_id != undefined
        }
    )
}

export function useGetMeterPartsList(params: MeterPartParams | undefined) {
    const route = 'meter_parts'
    const authHeader = useAuthHeader()
    return useQuery<Part[], Error>([route, params], () =>
        GETFetch(route, params, authHeader()),
        {
            enabled: params?.meter_id != undefined
        }
    )
}

export function useGetST2WaterLevels(datastreamID: number | undefined) {
    const route = `Datastreams(${datastreamID})/Observations`
    return useQuery<ST2Measurement[], Error>([route, datastreamID], () =>
        GETST2Fetch(route),
        {enabled: !!datastreamID}
    )
}

export function useCreateActivity(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'activities'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (activityForm: ActivityForm) => {
            const response = await POSTFetch(route, activityForm, authHeader())

            // This responsibility will eventually move to callsite when special error codes arent relied on
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
                onSuccess()

                const responseJson = await response.json()
                return responseJson
            }
        },
        retry: 0
    })
}

export function useUpdateMeterType(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'meter_types'
    const authHeader = useAuthHeader()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (meterType: Partial<MeterTypeLU>) => {
            const response = await PATCHFetch(route, meterType, authHeader())

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
                onSuccess()

                const responseJson = await response.json()

                // Update the part on the parts list
                queryClient.setQueryData(['meter_types'], (old: MeterTypeLU[] | undefined) => {
                    if (old != undefined) {
                        let newMeterTypesList = [...old]
                        const typeIndex = old?.findIndex(type => type.id === responseJson["id"])

                        if (typeIndex != undefined && typeIndex != -1) {
                            newMeterTypesList[typeIndex] = responseJson
                        }

                        return newMeterTypesList
                    }
                    return []
                })
                return responseJson
            }
        },
        retry: 0
    })
}

export function useCreateMeterType(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const route = 'meter_types'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (meter_type: MeterTypeLU) => {
            const response = await POSTFetch(route, meter_type, authHeader())

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
                onSuccess()

                const responseJson = await response.json()
                queryClient.setQueryData(['meter_types'], (old: MeterTypeLU[] | undefined) => {
                    if (old != undefined) {
                        return [...old, responseJson]
                    }
                    return []
                })
                return responseJson
            }
        },
        retry: 0
    })
}

export function useUpdatePart(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'part'
    const authHeader = useAuthHeader()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (part: Partial<Part>) => {
            const response = await PATCHFetch(route, part, authHeader())

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
                onSuccess()

                const responseJson = await response.json()

                // Update the part on the parts list
                queryClient.setQueryData(['parts'], (old: Part[] | undefined) => {
                    if (old != undefined) {
                        let newPartsList = [...old]
                        const partIndex = old?.findIndex(part => part.id === responseJson["id"])

                        if (partIndex != undefined && partIndex != -1) {
                            newPartsList[partIndex] = responseJson
                        }

                        return newPartsList
                    }
                    return []
                })
                return responseJson
            }
        },
        retry: 0
    })
}

export function useUpdateMeter(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'meter'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (meterDetails: Partial<MeterDetails>) => {
            const response = await PATCHFetch(route, meterDetails, authHeader())

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
                onSuccess()

                const responseJson = await response.json()
                return responseJson
            }
        },
        retry: 0
    })
}

export function useCreatePart(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const route = 'parts'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (part: Part) => {
            try {
                const response = await POSTFetch(route, part, authHeader())

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
                    onSuccess()

                    const responseJson = await response.json()
                    queryClient.setQueryData(['parts'], (old: Part[] | undefined) => {
                        if (old != undefined) {
                            return [...old, responseJson]
                        }
                        return []
                    })
                    return responseJson
                }
            }
            catch {
                enqueueSnackbar('An Error Occurred, Please Ensure the Part Number is Unique', {variant: 'error'})
                throw Error("Server side error while creating a part, likely due to a non-unique part number.")
            }
        },
        retry: 0
    })
}

export function useCreateChlorideMeasurement() {
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const route = 'chlorides'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (newChlorideMeasurement: NewWellMeasurement) => {
            const response = await POSTFetch(route, newChlorideMeasurement, authHeader())

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

export function useCreateWaterLevel() {
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const route = 'waterlevels'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (newWaterLevel: NewWellMeasurement) => {
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
