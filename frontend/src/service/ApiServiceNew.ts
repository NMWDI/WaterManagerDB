import { useMutation, useQuery, useQueryClient } from 'react-query'
import { API_URL } from '../API_config.js'
import { useAuthHeader, useSignOut } from 'react-auth-kit'
import { enqueueSnackbar, useSnackbar } from 'notistack';
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
    WellMergeParams,
    WellMeasurementDTO,
    Well,
    WellListQueryParams,
    WellDetailsQueryParams,
    MeterDetailsQueryParams,
    MeterDetails,
    MeterPartParams,
    MeterMapDTO,
    MeterHistoryDTO,
    Part,
    PartTypeLU,
    UserRole,
    SecurityScope,
    UpdatedUserPassword,
    WellUseLU,
    SubmitWellCreate,
    SubmitWellUpdate,
    Meter,
    MeterStatus,
    PatchObservationSubmit
} from '../interfaces.js'
import { useNavigate } from 'react-router-dom';
import { parseJsonText } from 'typescript';

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

// Fetch function that handles incoming errors from the response. Used as the queryFn in useQuery hooks
async function GETFetch(route: string, params: any, authHeader: string, signOut: Function, navigate: Function) {
    const headers = { "Authorization": authHeader }
    const response = await fetch(API_URL + `/${route}` + formattedQueryParams(params), { headers: headers })

    if (!response.ok) {

        // If backend indicates that user's token is expired, log them out and notify
        if (response.status == 440 && localStorage.getItem('loggedIn') ) {
            localStorage.removeItem('loggedIn')
            navigate("/")
            signOut()
            enqueueSnackbar('Your session has expired, please login again.', {variant: 'error'})
        }
        throw new Error(response.status.toString())
    }

    return response.json()
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

export function useGetUseTypes() {
    const route = 'use_types'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<WellUseLU[], Error>([route], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
        {keepPreviousData: true}
    )
}

export function useGetMeterList(params: MeterListQueryParams | undefined) {
    const route = 'meters'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<Page<MeterListDTO>, Error>([route, params], () =>
        GETFetch(route, params, authHeader(), signOut, navigate),
    )
}

export function useGetMeterLocations(searchstring: string | undefined) {
    const route = 'meters_locations'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<MeterMapDTO[], Error>([route, searchstring], () =>
        GETFetch(route, {search_string: searchstring}, authHeader(), signOut, navigate),
    )
}

export function useGetMeterTypeList() {
    const route = 'meter_types'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<MeterTypeLU[], Error>([route], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
    )
}

export function useGetMeterStatusTypeList() {
    const route = 'meter_status_types'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<MeterStatus[], Error>([route], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
    )
}

export function useGetNoteTypes() {
    const route = 'note_types'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<NoteTypeLU[], Error>([route], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
    )
}

export function useGetMeterHistory(params: MeterDetailsQueryParams) {
    const route = 'meter_history'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<MeterHistoryDTO[], Error>([route, params], () =>
        GETFetch(route, params, authHeader(), signOut, navigate),
        {enabled: params?.meter_id != undefined}
    )
}

export function useGetSecurityScopes() {
    const route = 'security_scopes'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<SecurityScope[], Error>([route], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
    )
}

export function useGetRoles() {
    const route = 'roles'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<UserRole[], Error>([route], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
    )
}

export function useGetUserAdminList() {
    const route = 'usersadmin'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<User[], Error>([route], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
    )
}

export function useGetUserList() {
    const route = 'users'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<User[], Error>([route], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
    )
}

export function useGetActivityTypeList() {
    const route = 'activity_types'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<ActivityTypeLU[], Error>([route, null], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
    )
}

export function useGetServiceTypes() {
    const route = 'service_types'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<ServiceTypeLU[], Error>([route, null], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
    )
}

export function useGetWaterLevels(params: WaterLevelQueryParams) {
    const route = 'waterlevels'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<WellMeasurementDTO[], Error>([route, params], () =>
        GETFetch(route, params, authHeader(), signOut, navigate),
    )
}

export function useGetChloridesLevels(params: WaterLevelQueryParams) {
    const route = 'chlorides'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<WellMeasurementDTO[], Error>([route, params], () =>
        GETFetch(route, params, authHeader(), signOut, navigate),
    )
}

export function useGetPropertyTypes() {
    const route = 'observed_property_types'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<ObservedPropertyTypeLU[], Error>([route], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
    )
}

export function useGetWells(params: WellListQueryParams | undefined) {
    const route = 'wells'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<Page<Well>, Error>([route, params], () =>
        GETFetch(route, params, authHeader(), signOut, navigate),
        {keepPreviousData: true}
    )
}

export function useGetWell(params: WellDetailsQueryParams | undefined) {
    const route = 'well'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<Well, Error>([route, params], () =>
        GETFetch(route, params, authHeader(), signOut, navigate),
        {
            keepPreviousData: true,
            enabled: params?.well_id != undefined
        }
    )
}

export function useGetMeter(params: MeterDetailsQueryParams | undefined) {
    const route = 'meter'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<MeterDetails, Error>([route, params], () =>
        GETFetch(route, params, authHeader(), signOut, navigate),
        {
            keepPreviousData: true,
            enabled: params?.meter_id != undefined
        }
    )
}

export function useGetPartTypeList() {
    const route = 'part_types'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<PartTypeLU[], Error>([route], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
        {
            keepPreviousData: true,
        }
    )
}

export function useGetParts() {
    const route = 'parts'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<Part[], Error>([route], () =>
        GETFetch(route, null, authHeader(), signOut, navigate),
        {
            keepPreviousData: true,
        }
    )
}

export function useGetPart(params: {part_id: number} | undefined) {
    const route = 'part'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<Part, Error>([route, params], () =>
        GETFetch(route, params, authHeader(), signOut, navigate),
        {
            keepPreviousData: true,
            enabled: params?.part_id != undefined
        }
    )
}

export function useGetMeterPartsList(params: MeterPartParams | undefined) {
    const route = 'meter_parts'
    const authHeader = useAuthHeader()
    const navigate = useNavigate()
    const signOut = useSignOut()

    return useQuery<Part[], Error>([route, params], () =>
        GETFetch(route, params, authHeader(), signOut, navigate),
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

export function useCreateUser(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const route = 'users'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (user: User) => {
            const response = await POSTFetch(route, user, authHeader())

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
                queryClient.setQueryData(['usersadmin'], (old: User[] | undefined) => {
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

export function useUpdateUser(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'users'
    const authHeader = useAuthHeader()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updatedUser: User) => {
            const response = await PATCHFetch(route, updatedUser, authHeader())

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

                // Update the user on the users list
                queryClient.setQueryData(['usersadmin'], (old: User[] | undefined) => {
                    if (old != undefined) {
                        let newUsersList = [...old]
                        const userIndex = old?.findIndex(user => user.id === responseJson["id"])

                        if (userIndex != undefined && userIndex != -1) {
                            newUsersList[userIndex] = responseJson
                        }

                        return newUsersList
                    }
                    return []
                })
                return responseJson
            }
        },
        retry: 0
    })
}

export function useCreateWell(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'wells'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (new_well: SubmitWellCreate) => {
            const response = await POSTFetch(route, new_well, authHeader())

            if (!response.ok) {
                if(response.status == 422) {
                    enqueueSnackbar('One or More Required Fields Not Entered!', {variant: 'error'})
                    throw Error("Incomplete form, check network logs for details")
                }
                if(response.status == 409) {
                    enqueueSnackbar('Cannot use existing RA number', {variant: 'error'})
                    throw Error("RA number already in database")
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

export function useCreateRole(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const route = 'roles'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (new_role: UserRole) => {
            const response = await POSTFetch(route, new_role, authHeader())

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
                queryClient.setQueryData(['roles'], (old: UserRole[] | undefined) => {
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

export function useUpdateWell(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'wells'
    const authHeader = useAuthHeader()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updatedWell: SubmitWellUpdate) => {
            const response = await PATCHFetch(route, updatedWell, authHeader())

            if (!response.ok) {
                if(response.status == 422) {
                    enqueueSnackbar('One or More Required Fields Not Entered!', {variant: 'error'})
                    throw Error("Incomplete form, check network logs for details")
                }
                if(response.status == 409) {
                    enqueueSnackbar('Cannot use existing RA number', {variant: 'error'})
                    throw Error("RA number already in database")
                }
                else {
                    enqueueSnackbar('Unknown Error Occurred!', {variant: 'error'})
                    throw Error("Unknown Error: " + response.status)
                }
            }
            else {
                onSuccess()
                const responseJson = await response.json()

                // Since query data will be based on params, iterate through all possible queries of this route
                const wellsQueries = queryClient.getQueryCache().findAll('wells')

                wellsQueries.forEach((query: any) => {
                    queryClient.setQueryData(query.queryKey, (old: Page<Well> | undefined) => {
                        if (old != undefined) {
                            let newPage = JSON.parse(JSON.stringify(old)) // Deep copy so we can edit

                            // If well found on the old query data, update it
                            const wellIndex = old.items.findIndex((well: Well) => well.id == responseJson["id"])
                            if (wellIndex != undefined && wellIndex != -1) {
                                newPage.items[wellIndex] = responseJson
                            }
                            return newPage
                        }
                        return {items: [], total: 0, limit: 0, offset: 0} // Empty page if no old data
                    })
                })
                return responseJson
            }
        },
        retry: 0
    })
}

export function useUpdateRole(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'roles'
    const authHeader = useAuthHeader()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updatedRole: UserRole) => {
            const response = await PATCHFetch(route, updatedRole, authHeader())

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
                queryClient.setQueryData(['roles'], (old: UserRole[] | undefined) => {
                    if (old != undefined) {
                        let newRoles = [...old]
                        const roleIndex = old?.findIndex(role => role.id === responseJson["id"])

                        if (roleIndex != undefined && roleIndex != -1) {
                            newRoles[roleIndex] = responseJson
                        }

                        return newRoles
                    }
                    return []
                })
                return responseJson
            }
        },
        retry: 0
    })
}

export function useUpdateUserPassword(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'users/update_password'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (updatedUserPassword: UpdatedUserPassword) => {
            const response = await POSTFetch(route, updatedUserPassword, authHeader())

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
                if(response.status == 409) {
                    //There could be a couple reasons for this... out of order activity or duplicate activity
                    let errorText = await response.text()
                    enqueueSnackbar(JSON.parse(errorText).detail, {variant: 'error'})
                    throw Error(errorText)
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

export function useCreateMeter(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'meters'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (meter: Meter) => {
            const response = await POSTFetch(route, meter, authHeader())

            if (!response.ok) {
                if(response.status == 422) {
                    enqueueSnackbar('One or More Required Fields Not Entered!', {variant: 'error'})
                    throw Error("Incomplete form, check network logs for details")
                }
                if(response.status == 409) {
                    enqueueSnackbar('Cannot use existing serial number!', {variant: 'error'})
                    throw Error("Meter serial number already in database")
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
            console.log(part)
            const response = await PATCHFetch(route, part, authHeader())

            if (!response.ok) {
                if(response.status == 422) {
                    enqueueSnackbar('One or More Required Fields Not Entered!', {variant: 'error'})
                    throw Error("Incomplete form, check network logs for details")
                }
                if(response.status == 409) {
                    enqueueSnackbar('Cannot use existing serial number!', {variant: 'error'})
                    throw Error("Part serial number already in database")
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
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (meterDetails: Meter) => {
            const response = await PATCHFetch(route, meterDetails, authHeader())

            if (!response.ok) {
                if(response.status == 422) {
                    enqueueSnackbar('One or More Required Fields Not Entered!', {variant: 'error'})
                    throw Error("Incomplete form, check network logs for details")
                }
                if(response.status == 409) {
                    enqueueSnackbar('Cannot use existing serial number!', {variant: 'error'})
                    throw Error("Meter serial number already in database")
                }
                else {
                    enqueueSnackbar('Unknown Error Occurred!', {variant: 'error'})
                    throw Error("Unknown Error: " + response.status)
                }
            }
            else {
                onSuccess()

                const responseJson = await response.json()

                // Since query data will be based on params, iterate through all possible queries of this route
                const meterQueries = queryClient.getQueryCache().findAll('meters')

                meterQueries.forEach((query: any) => {
                    queryClient.setQueryData(query.queryKey, (old: Page<Meter> | undefined) => {
                        if (old != undefined) {
                            let newPage = JSON.parse(JSON.stringify(old)) // Deep copy so we can edit

                            // If well found on the old query data, update it
                            const meterIndex = old.items.findIndex((meter: Meter) => meter.id == responseJson["id"])
                            if (meterIndex != undefined && meterIndex != -1) {
                                newPage.items[meterIndex] = responseJson
                            }
                            return newPage
                        }
                        return {items: [], total: 0, limit: 0, offset: 0} // Empty page if no old data
                    })
                })
                return responseJson
            }
        },
        retry: 0
    })
}

export function useUpdateObservation(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'observations'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (observation: PatchObservationSubmit) => {
            const response = await PATCHFetch(route, observation, authHeader())

            if (!response.ok) {
                if(response.status == 422) {
                    enqueueSnackbar('One or More Required Fields Not Entered!', {variant: 'error'})
                    throw Error("Incomplete form, check network logs for details")
                }
                if(response.status == 409) {
                    enqueueSnackbar('Cannot use existing serial number!', {variant: 'error'})
                    throw Error("Observation serial number already in database")
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
                //Due to the way the form gets generated for a new part, I need to populate part_type_id manually here
                part.part_type_id = part.part_type?.id
                console.log(part)
                const response = await POSTFetch(route, part, authHeader())

                if (!response.ok) {
                    if(response.status == 422) {
                        enqueueSnackbar('One or More Required Fields Not Entered!', {variant: 'error'})
                        throw Error("Incomplete form, check network logs for details")
                    }
                    if(response.status == 409) {
                        enqueueSnackbar('Cannot use existing serial number!', {variant: 'error'})
                        throw Error("Part serial number already in database")
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

export function useMergeWells(onSuccess: Function) {
    const { enqueueSnackbar } = useSnackbar()
    const route = 'merge_wells'
    const authHeader = useAuthHeader()

    return useMutation({
        mutationFn: async (mergeWells: WellMergeParams) => {
            console.log(mergeWells)
            const response = await POSTFetch(route, mergeWells, authHeader())

            if (!response.ok) {
                if(response.status == 422) {
                    enqueueSnackbar('Testing remove??!', {variant: 'error'})
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