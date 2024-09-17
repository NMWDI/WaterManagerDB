// Basic component for selecting a register for a given meter type
//
import React from 'react'
//import { useGetMeterTypeList } from '../service/ApiServiceNew'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
//import { MeterTypeLU } from '../interfaces'

//Interface for MeterRegisterSelect props
interface MeterRegisterSelectProps {
    selectedRegisterTypeID: number | undefined;
    setSelectedRegisterTypeID: (id: number) => void;
    meterTypeID: number | undefined;
}

export default function MeterRegisterSelect({selectedRegisterTypeID, setSelectedRegisterTypeID, meterTypeID}: MeterRegisterSelectProps) {
    //const meterTypeList = useGetMeterTypeList()
    const meterRegisterList = ['dummy register 1', 'dummy register 2', 'dummy register 3']

    return (
        <FormControl size="small" fullWidth>
            <InputLabel>Meter Register</InputLabel>
            <Select
                //value={meterTypeList.isLoading ? 'loading' : selectedMeterTypeID ?? ''}
                value={ selectedRegisterTypeID ?? '' }
                label="Meter Register"
                onChange={(event: any) => setSelectedRegisterTypeID(event.target.value)}
            >
                {meterRegisterList.map((register: string, index: number) => {
                    return <MenuItem key={index} value={index}>{register}</MenuItem>
                })}
                {/* {meterTypeList.data?.map((meterType: MeterTypeLU) => {
                    return <MenuItem key={meterType.id} value={meterType.id}>{meterType.brand + ' - '  + meterType.model}</MenuItem>
                })}

                {meterTypeList.isLoading && <MenuItem value={'loading'} hidden>Loading...</MenuItem>} */}
            </Select>
        </FormControl>
    )
}
