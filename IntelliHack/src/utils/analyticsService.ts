interface AnalyticsData {
  revenue: number;
  leads: number;
  conversions: number;
  timestamp: string;
}

const generateMockData = (days: number): AnalyticsData[] => {
  const data: AnalyticsData[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      revenue: Math.floor(Math.random() * 10000) + 5000,
      leads: Math.floor(Math.random() * 50) + 20,
      conversions: Math.floor(Math.random() * 20) + 5,
      timestamp: date.toISOString(),
    });
  }

  return data;
};

export const getAnalytics = async (timeframe: '7d' | '30d' | '90d' | '1y'): Promise<AnalyticsData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const days = timeframe === '7d' ? 7 :
               timeframe === '30d' ? 30 :
               timeframe === '90d' ? 90 : 365;

  return generateMockData(days);
};

export const exportAnalytics = async (data: AnalyticsData[]): Promise<Blob> => {
  const csvContent = [
    ['Date', 'Revenue', 'Leads', 'Conversions'],
    ...data.map(row => [
      new Date(row.timestamp).toLocaleDateString(),
      row.revenue,
      row.leads,
      row.conversions
    ])
  ].map(row => row.join(',')).join('\n');

  return new Blob([csvContent], { type: 'text/csv' });
};