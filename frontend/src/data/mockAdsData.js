/**
 * Mock Google Ads data for Oct 1 - Dec 31, 2026
 * All costs in VND
 */

const generateDailyData = (startDate, endDate, baseMetrics) => {
    const data = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];

        // Add some randomness to make it realistic
        const variance = 0.7 + Math.random() * 0.6; // 70% to 130% of base

        data.push({
            date: dateStr,
            clicks: Math.floor(baseMetrics.clicks * variance),
            impressions: Math.floor(baseMetrics.impressions * variance),
            cost: Math.floor(baseMetrics.cost * variance),
            conversions: Math.floor(baseMetrics.conversions * variance),
            revenue: Math.floor(baseMetrics.revenue * variance),
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
};

export const mockCampaigns = [
    {
        id: 'camp_001',
        name: 'Forex Exness - General',
        program: 'Exness',
        keywords: ['forex vietnam', 'forex trading', 'exness review'],
        dailyData: generateDailyData('2026-10-01', '2026-12-31', {
            clicks: 450,
            impressions: 12000,
            cost: 1350000, // 3000 VND/click average
            conversions: 15,
            revenue: 4200000,
        })
    },
    {
        id: 'camp_002',
        name: 'Crypto Binance - Brand',
        program: 'Binance',
        keywords: ['binance vietnam', 'crypto exchange', 'mua bitcoin'],
        dailyData: generateDailyData('2026-10-01', '2026-12-31', {
            clicks: 320,
            impressions: 9500,
            cost: 960000, // 3000 VND/click
            conversions: 12,
            revenue: 3600000,
        })
    },
    {
        id: 'camp_003',
        name: 'Beauty Sephora - High Intent',
        program: 'Sephora',
        keywords: ['sephora vietnam', 'mỹ phẩm chính hãng', 'beauty products'],
        dailyData: generateDailyData('2026-10-01', '2026-12-31', {
            clicks: 280,
            impressions: 7200,
            cost: 1120000, // 4000 VND/click (higher CPC for beauty)
            conversions: 18,
            revenue: 2880000,
        })
    },
    {
        id: 'camp_004',
        name: 'Gaming Razer - Accessories',
        program: 'Razer',
        keywords: ['razer vietnam', 'gaming gear', 'chuột gaming'],
        dailyData: generateDailyData('2026-10-15', '2026-12-31', {
            clicks: 180,
            impressions: 5500,
            cost: 720000, // 4000 VND/click
            conversions: 8,
            revenue: 1600000,
        })
    },
    {
        id: 'camp_005',
        name: 'Forex XM Trading - Broad',
        program: 'XM',
        keywords: ['xm trading', 'forex broker vietnam', 'trade forex'],
        dailyData: generateDailyData('2026-11-01', '2026-12-31', {
            clicks: 220,
            impressions: 6800,
            cost: 880000, // 4000 VND/click
            conversions: 10,
            revenue: 3200000,
        })
    },
];

// Helper function to get all unique programs
export const getPrograms = () => {
    return [...new Set(mockCampaigns.map(c => c.program))];
};

// Helper function to get all unique keywords
export const getKeywords = () => {
    const keywords = new Set();
    mockCampaigns.forEach(campaign => {
        campaign.keywords.forEach(kw => keywords.add(kw));
    });
    return Array.from(keywords);
};

// Function to aggregate data by date range and grouping
export const aggregateData = (campaigns, groupBy = 'day', startDate = null, endDate = null) => {
    let allData = [];

    // Flatten all daily data from selected campaigns
    campaigns.forEach(campaign => {
        campaign.dailyData.forEach(day => {
            allData.push({ ...day, campaign: campaign.name, program: campaign.program });
        });
    });

    // Filter by date range if provided
    if (startDate) {
        allData = allData.filter(d => d.date >= startDate);
    }
    if (endDate) {
        allData = allData.filter(d => d.date <= endDate);
    }

    // Group data
    if (groupBy === 'day') {
        // Already daily, just aggregate by date
        const grouped = {};
        allData.forEach(d => {
            if (!grouped[d.date]) {
                grouped[d.date] = {
                    date: d.date,
                    clicks: 0,
                    impressions: 0,
                    cost: 0,
                    conversions: 0,
                    revenue: 0,
                };
            }
            grouped[d.date].clicks += d.clicks;
            grouped[d.date].impressions += d.impressions;
            grouped[d.date].cost += d.cost;
            grouped[d.date].conversions += d.conversions;
            grouped[d.date].revenue += d.revenue;
        });
        return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
    } else if (groupBy === 'week') {
        // Group by week
        const grouped = {};
        allData.forEach(d => {
            const date = new Date(d.date);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!grouped[weekKey]) {
                grouped[weekKey] = {
                    date: weekKey,
                    clicks: 0,
                    impressions: 0,
                    cost: 0,
                    conversions: 0,
                    revenue: 0,
                };
            }
            grouped[weekKey].clicks += d.clicks;
            grouped[weekKey].impressions += d.impressions;
            grouped[weekKey].cost += d.cost;
            grouped[weekKey].conversions += d.conversions;
            grouped[weekKey].revenue += d.revenue;
        });
        return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
    } else if (groupBy === 'month') {
        // Group by month
        const grouped = {};
        allData.forEach(d => {
            const monthKey = d.date.substring(0, 7); // YYYY-MM

            if (!grouped[monthKey]) {
                grouped[monthKey] = {
                    date: monthKey + '-01',
                    clicks: 0,
                    impressions: 0,
                    cost: 0,
                    conversions: 0,
                    revenue: 0,
                };
            }
            grouped[monthKey].clicks += d.clicks;
            grouped[monthKey].impressions += d.impressions;
            grouped[monthKey].cost += d.cost;
            grouped[monthKey].conversions += d.conversions;
            grouped[monthKey].revenue += d.revenue;
        });
        return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
    }

    return allData;
};
