export interface GroupReport {
  id: string
  totalDiscovered: number
  totalSaved: number
  categoryDistribution: Record<string, number>
  countryDistribution: Record<string, number>
  languageDistribution: Record<string, number>
}
