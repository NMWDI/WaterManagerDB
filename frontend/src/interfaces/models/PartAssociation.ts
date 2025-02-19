import { Part } from "../models";

export interface PartAssociation {
  id: number;
  meter_type_id: number;
  part_id: number;
  commonly_used: boolean;
  part?: Part;
}
