export interface AnalyticsItem {
  _id: string | null;
  count: number;
}

export type AnalyticsResponse = AnalyticsItem[];
