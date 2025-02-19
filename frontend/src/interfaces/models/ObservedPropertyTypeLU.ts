import { Unit } from "../models";

export interface ObservedPropertyTypeLU {
  id: number;
  name: string;
  description: string;
  context: string;

  units?: Unit[];
}
