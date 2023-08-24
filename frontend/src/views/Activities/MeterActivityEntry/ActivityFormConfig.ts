import * as Yup from "yup"
import { ActivityForm, ActivityFormControl, MeterDetails, MeterListDTO, Well } from '../../../interfaces.d'
import Dayjs from "dayjs"

// Validation
export const ActivityResolverSchema: Yup.ObjectSchema<ActivityFormControl> = Yup.object().shape({

    activity_details: Yup.object().shape({
        selected_meter: Yup.object().shape({
            id: Yup.number().required(),
            serial_number: Yup.string().required()
        }).required("Please Select A Meter"),

        activity_type: Yup.object().shape({
            id: Yup.number().required("Please Select An Activity"),
            name: Yup.string(),
            permission: Yup.string(),
            description: Yup.string()
        }).required("Please Select An Activity"),

        user: Yup.object().shape({
            id: Yup.number().required("Please Select A User"),
            full_name: Yup.string()
        }).required("Please Select a User"),

        date: Yup.date().required('Please Select a Date'),
        start_time: Yup.date().required('Please Select a Start Time'),
        end_time: Yup.date().required('Please Select an End Time')

    }).required(),

    current_installation: Yup.object().shape({
        meter: Yup.object().shape({
            id: Yup.number(),
            serial_number: Yup.string(),
            contact_name: Yup.string(),
            contact_phone: Yup.string(),
            old_contact_name: Yup.string(),
            old_contact_phone: Yup.string(),
            ra_number: Yup.string(),
            tag: Yup.string(),
            well_distance_ft: Yup.string(),
            notes: Yup.string(),
            meter_type_id: Yup.number(),
            well_id: Yup.number(),

            well: Yup.mixed(),
            parts_associated: Yup.mixed(),
            status: Yup.mixed()
        }),

        well: Yup.object().shape({
            id: Yup.number(),
            name: Yup.string(),
            location_id: Yup.number(),
            ra_number: Yup.string(),
            osepod: Yup.string(),
            well_distance_ft: Yup.number(),
            location: Yup.mixed()
        })
    })

}).required()

export function getDefaultForm(initialMeter: Partial<MeterListDTO> | null) {
    const defaultForm: ActivityFormControl = {
        activity_details: {
            selected_meter: initialMeter,
            activity_type: null,
            user: null,
            date: Dayjs(),
            start_time: Dayjs(),
            end_time: Dayjs()
        },
        current_installation: {
            meter: null,
            well: null
        }
    }

    return defaultForm
}
