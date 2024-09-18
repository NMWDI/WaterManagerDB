// Basic component for selecting a register for a given meter type
//
import React, { useEffect, useState } from 'react'
import { useGetMeterRegisterList } from '../service/ApiServiceNew'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { MeterRegister, MeterType } from '../interfaces'

//Interface for MeterRegisterSelect props
interface MeterRegisterSelectProps {
    selectedRegister: MeterRegister | undefined;
    setSelectedRegister: (register: MeterRegister) => void;
    meterType: MeterType | undefined;
}

export default function MeterRegisterSelect({selectedRegister, setSelectedRegister, meterType}: MeterRegisterSelectProps) {
    const meterRegisterList = useGetMeterRegisterList()
    const [filteredRegisterList, setFilteredRegisterList] = useState<MeterRegister[] | undefined>([])

    //Filter the register list based on the meter type
    useEffect(() => {
        if (meterType) {
            console.log(meterType)
            setFilteredRegisterList(meterRegisterList.data?.filter((register: MeterRegister) => register.meter_size == meterType.size))
        } else {
            setFilteredRegisterList(meterRegisterList.data)
        }
    }, [meterType, meterRegisterList.data])
    

    return (
        <FormControl size="small" fullWidth>
            <InputLabel>Meter Register</InputLabel>
            <Select
                value={meterRegisterList.isLoading ? 'loading' : selectedRegister ?? ''}
                label="Meter Register"
                onChange={(event: any) => setSelectedRegister(event.target.value)}
            >
                {filteredRegisterList?.map((register: MeterRegister) => {
                    return <MenuItem key={register.id} value={register.id}>{register.dial_units + ' - '  + register.totalizer_units + ', ' + register.ratio}</MenuItem>
                })}

                {meterRegisterList.isLoading && <MenuItem value={'loading'} hidden>Loading...</MenuItem>}
            </Select>
        </FormControl>
    )
}
