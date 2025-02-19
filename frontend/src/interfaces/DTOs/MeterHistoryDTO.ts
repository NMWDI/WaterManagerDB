import { Well } from "../models";

export interface MeterHistoryDTO {
  id: number;
  history_type: string;
  activity_type: string;
  date: Date;
  history_item: any;
  location: Location;
  well?: Well;
}
