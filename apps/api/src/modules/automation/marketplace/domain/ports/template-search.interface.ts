export interface SearchFilters {
  category?: string;
  provider?: string;
  rating?: number;
  tags?: string[];
  visibility?: string;
}

export interface ITemplateSearch {
  search(query: string, filters?: SearchFilters): Promise<any[]>;
}
