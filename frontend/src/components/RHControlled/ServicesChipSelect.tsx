/*

A controlled chip select specific to services performed. Used in the history details 
to enable the admin to select and remove services associated with an activity.

*/

import React, { useState } from 'react'
import ChipSelect from '../ChipSelect'
import { ServiceTypeLU } from '../../interfaces'
import { useGetServiceTypes } from '../../service/ApiServiceNew'
import { Controller } from 'react-hook-form'

export default function ServicesChipSelect({name, control}: any) {
    const servicesList = useGetServiceTypes()

    return (
        <Controller
            name={name}
            control={control}
            //defaultValue={[]}
            render={({ field }) => {
                console.log(field)
                return (
                    <ChipSelect
                        selected_values={field.value?.map((service: ServiceTypeLU) => ({id: service.id, name: service.service_name})) ?? []}
                        options={servicesList.data?.map((service: ServiceTypeLU) => ({id: service.id, name: service.service_name})) ?? []}
                        label="Services"
                        onSelect={(selected_id) => {
                            console.log(selected_id)
                            field.onChange([...field.value, servicesList.data?.find((service: ServiceTypeLU) => service.id === selected_id)])
                        }}
                        onDelete={(delete_id) => {
                            field.onChange(field.value.filter((service: ServiceTypeLU) => service.id !== delete_id))
                        }}
                    />
                )}
           }
        />
    )
}