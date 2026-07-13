export class MetaAdsMock {
  async updateAdSetBudget(adSetId: string, budget: number): Promise<any> {
    return {
      success: true,
      adSetId,
      updatedBudget: budget,
      timestamp: new Date().toISOString(),
    };
  }

  async getAdSetPerformance(adSetId: string): Promise<any> {
    return {
      adSetId,
      cpa: 15.5,
      ctr: 0.024,
      impressions: 12000,
    };
  }
}
