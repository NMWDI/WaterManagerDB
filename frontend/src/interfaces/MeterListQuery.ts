import { SortDirection, MeterSortByField } from "../enums";

export interface MeterListQuery {
  search_string: string;
  sort_by: MeterSortByField;
  sort_direction: SortDirection;
  limit: number;
  offset: number;
}
