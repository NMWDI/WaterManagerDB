import { Unit } from "../models";

export interface MeterRegister {
  id: number;
  brand: string;
  meter_size: number;
  ratio?: string;
  number_of_digits?: number;
  decimal_digits?: number;
  dial_units: Unit;
  totalizer_units: Unit;
  multiplier?: number;
}
