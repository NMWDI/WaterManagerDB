/*

A controlled chip select specific to notes. Used in the history details 
to enable the admin to select and remove notes associated with an activity.

*/

import React, { useState } from 'react'
import ChipSelect from '../ChipSelect'
import { NoteTypeLU } from '../../interfaces'
import { useGetNoteTypes } from '../../service/ApiServiceNew'
import { Controller } from 'react-hook-form'

export default function NotesChipSelect({control, errors, watch, setValue}: any) {
    const notesList = useGetNoteTypes()

    return (
        <Controller
            name="note_ids"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
                <ChipSelect
                    selected_values={field.value}
                    options={notesList.data?.map((note: NoteTypeLU) => ({id: note.id, name: note.note})) ?? []}
                    label="Notes"
                    onSelect={(selected) => {
                        field.onChange([...field.value, selected])
                    }}
                    onDelete={(delete_id) => {
                        field.onChange(field.value.filter((note: NoteTypeLU) => note.id !== delete_id))
                    }}
                />
            )}
        />
    )
}