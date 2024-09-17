// Basic component for selecting a register for a given meter type
//
import React from 'react'
//import { useGetMeterTypeList } from '../service/ApiServiceNew'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { MeterRegister } from '../interfaces'

//Interface for MeterRegisterSelect props
interface MeterRegisterSelectProps {
    selectedRegister: MeterRegister | undefined;
    setSelectedRegister: () => void;
    meterTypeID: number | undefined;
}

export default function MeterRegisterSelect({selectedRegister, setSelectedRegister, meterTypeID}: MeterRegisterSelectProps) {
    //const meterTypeList = useGetMeterTypeList()
    const meterRegisterList = ['dummy register 1', 'dummy register 2', 'dummy register 3']

    return (
        <FormControl size="small" fullWidth>
            <InputLabel>Meter Register</InputLabel>
            <Select
                //value={meterTypeList.isLoading ? 'loading' : selectedMeterTypeID ?? ''}
                value={ selectedRegister ?? '' }
                label="Meter Register"
                onChange={(event: any) => setSelectedRegister(event.target.value)}
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
