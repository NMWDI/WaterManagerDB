import { SortDirection } from "../enums";

export interface MeterListQuery {
  search_string: string;
  sort_by: MeterListSortBy;
  sort_direction: SortDirection;
  limit: number;
  offset: number;
}
