/*

A controlled chip select specific to notes. Used in the history details 
to enable the admin to select and remove notes associated with an activity.

*/

import React, { useState } from 'react'
import ChipSelect from '../ChipSelect'
import { NoteTypeLU } from '../../interfaces'
import { useGetNoteTypes } from '../../service/ApiServiceNew'
import { Controller } from 'react-hook-form'

export default function NotesChipSelect({name, control, errors, watch, setValue}: any) {
    const notesList = useGetNoteTypes()

    return (
        <Controller
            name={name}
            control={control}
            //defaultValue={[]}
            render={({ field }) => {
                console.log(field)
                return (
                    <ChipSelect
                        selected_values={field.value?.map((note: NoteTypeLU) => ({id: note.id, name: note.note})) ?? []}
                        options={notesList.data?.map((note: NoteTypeLU) => ({id: note.id, name: note.note})) ?? []}
                        label="Notes"
                        onSelect={(selected_id) => {
                            console.log(selected_id)
                            field.onChange([...field.value, notesList.data?.find((note: NoteTypeLU) => note.id === selected_id)])
                        }}
                        onDelete={(delete_id) => {
                            field.onChange(field.value.filter((note: NoteTypeLU) => note.id !== delete_id))
                        }}
                    />
                )}
           }
        />
    )
}