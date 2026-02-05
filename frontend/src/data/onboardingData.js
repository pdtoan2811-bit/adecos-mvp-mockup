export const onboardingSequence = [
    {
        role: 'assistant',
        type: 'text',
        content: `**Xin chào! Tôi là Adecos AI**

Chào mừng bạn đến với Adecos - nền tảng tối ưu hóa hiệu suất Affiliate Marketing thông minh. 

Tôi ở đây để giúp bạn tìm ngách tiềm năng, tối ưu quảng cáo và tăng doanh thu. Hãy cùng khám phá 3 tính năng cốt lõi nhé?`,
        delay: 500
    },
    // Feature 1: Research & Scoring (Mock Crypto Data)
    {
        role: 'assistant',
        type: 'text',
        content: `**1. Nghiên cứu & Chấm điểm Dự án (Money Flow)**

Tôi liên tục quét thị trường để tìm các dự án Crypto/Finance tiềm năng nhất.

Ví dụ: Top 5 dự án Crypto đang có dòng tiền mạnh trong 24h qua:`,
        delay: 2000
    },
    {
        role: 'assistant',
        type: 'table',
        content: [
            {
                brand: 'Binance',
                program_url: 'https://binance.com',
                commission_percent: 40,
                commission_type: 'Lifetime',
                can_use_brand: true,
                traffic_3m: '85M',
                legitimacy_score: 9.8,
                marketing_notes: 'High volume, localized support'
            },
            {
                brand: 'Bybit',
                program_url: 'https://bybit.com',
                commission_percent: 30,
                commission_type: 'CPA + RevShare',
                can_use_brand: true,
                traffic_3m: '22M',
                legitimacy_score: 9.5,
                marketing_notes: 'Strong derivatives market'
            },
            {
                brand: 'OKX',
                program_url: 'https://okx.com',
                commission_percent: 35,
                commission_type: 'RevShare',
                can_use_brand: false,
                traffic_3m: '18M',
                legitimacy_score: 9.2,
                marketing_notes: 'Web3 focus'
            },
            {
                brand: 'BingX',
                program_url: 'https://bingx.com',
                commission_percent: 45,
                commission_type: 'High CPA',
                can_use_brand: true,
                traffic_3m: '12M',
                legitimacy_score: 8.9,
                marketing_notes: 'Copy trading niche'
            },
            {
                brand: 'Mexc',
                program_url: 'https://mexc.com',
                commission_percent: 50,
                commission_type: 'RevShare',
                can_use_brand: true,
                traffic_3m: '9.5M',
                legitimacy_score: 8.5,
                marketing_notes: 'Gem hunting niche'
            },
            {
                brand: 'KuCoin',
                program_url: 'https://kucoin.com',
                commission_percent: 40,
                commission_type: 'RevShare',
                can_use_brand: true,
                traffic_3m: '8M',
                legitimacy_score: 8.8,
                marketing_notes: 'Altcoin focus'
            },
            {
                brand: 'Gate.io',
                program_url: 'https://gate.io',
                commission_percent: 45,
                commission_type: 'RevShare range',
                can_use_brand: false,
                traffic_3m: '7.2M',
                legitimacy_score: 8.4,
                marketing_notes: 'New listing pumps'
            },
            {
                brand: 'Bitget',
                program_url: 'https://bitget.com',
                commission_percent: 50,
                commission_type: 'RevShare',
                can_use_brand: true,
                traffic_3m: '15M',
                legitimacy_score: 9.0,
                marketing_notes: 'Copy trading leader'
            },
            {
                brand: 'Huobi (HTX)',
                program_url: 'https://htx.com',
                commission_percent: 30,
                commission_type: 'Spot Rebate',
                can_use_brand: true,
                traffic_3m: '5M',
                legitimacy_score: 8.1,
                marketing_notes: 'Asian market usage'
            },
            {
                brand: 'Coinbase',
                program_url: 'https://coinbase.com',
                commission_percent: 50,
                commission_type: 'CPA (First trade)',
                can_use_brand: false,
                traffic_3m: '45M',
                legitimacy_score: 9.9,
                marketing_notes: 'US Compliance safe'
            }
        ],
        context: {
            description: "Dữ liệu được cập nhật realtime."
        },
        delay: 4000
    },
    // Feature 2: Analytics (Charts)
    {
        role: 'assistant',
        type: 'text',
        content: `**2. Phân tích Dữ liệu tập trung (Data Analytics)**

Kết nối Ads Account và xem báo cáo hiệu suất ngay trong khung chat. Không cần switch tab.

**Hiệu suất CPC (7 ngày qua):**`,
        delay: 8000
    },
    {
        role: 'assistant',
        type: 'chart',
        content: {
            chartType: 'line',
            title: 'Xu hướng CPC Trung bình (7 ngày)',
            data: [
                { date: '29/01', cpc: 2500 },
                { date: '30/01', cpc: 2450 },
                { date: '31/01', cpc: 2600 },
                { date: '01/02', cpc: 2300 },
                { date: '02/02', cpc: 2100 }, // optimization effect
                { date: '03/02', cpc: 1950 },
                { date: '04/02', cpc: 1800 },
            ],
            config: {
                xAxis: 'date',
                series: [
                    { dataKey: 'cpc', name: 'CPC (₫)', color: '#60A5FA' }
                ]
            }
        },
        delay: 10000
    },
    {
        role: 'assistant',
        type: 'text',
        content: `**Chi phí theo chiến dịch (14 ngày qua):**`,
        delay: 13000
    },
    {
        role: 'assistant',
        type: 'chart',
        content: {
            chartType: 'bar',
            title: 'Chi phí QC - Top Campaigns',
            data: [
                { name: 'Camp A (Search)', cost: 15000000 },
                { name: 'Camp B (Display)', cost: 8500000 },
                { name: 'Camp C (Video)', cost: 12000000 },
                { name: 'Camp D (Retarget)', cost: 4500000 },
            ],
            config: {
                xAxis: 'name',
                series: [
                    { dataKey: 'cost', name: 'Chi phí (₫)', color: '#F472B6' }
                ]
            }
        },
        delay: 15000
    },
    // Coming Soon Divider
    {
        role: 'assistant',
        type: 'text',
        content: `🚀 **Tính năng Sắp ra mắt (Coming Soon)**

Chúng tôi đang phát triển các công cụ mạnh mẽ để thay đổi cách bạn làm Affiliate. Click vào các thẻ bên dưới để khám phá:`,
        delay: 18000
    },

    // Feature 3: Affiliate Ads Autopilot (Feature Preview - Static)
    {
        role: 'assistant',
        type: 'feature_preview',
        content: {
            featureName: "Affiliate Ads Autopilot",
            description: "Hệ thống AI chuyên dụng cho Google Ads Affiliate. Tự động loại trừ Click ảo, tối ưu EPC và scale keyword 'Win' theo thời gian thực.",
            benefits: [
                "Tự động exclude 'Trash Placements' (Apps, Games)",
                "Bid theo ROI thực tế (Real-time EPC tracking)",
                "Phát hiện Bot Traffic và hoàn tiền Google"
            ],
            ctaText: "Đăng ký Early Access",
            ctaUrl: "https://calendly.com/adecos-demo",
            autoRedirect: true
        },
        delay: 20000
    },

    // Feature 4: Chat with Data (Feature Preview)
    {
        role: 'assistant',
        type: 'feature_preview',
        content: {
            featureName: "Chat with Data",
            description: "Không cần tải xuống báo cáo Excel phức tạp. Chỉ cần hỏi Adecos AI bất kỳ câu hỏi nào về số liệu của bạn.",
            benefits: [
                "Hỏi: 'Ads nào đang ra lãi nhiều nhất hôm nay?'",
                "Phân tích xu hướng CPA trong 30 ngày",
                "So sánh hiệu suất giữa các nền tảng"
            ],
            ctaText: "Đăng ký Early Access",
            ctaUrl: "https://adecos.io/early-access"
        },
        delay: 23000
    },

    // Community CTA
    {
        role: 'assistant',
        type: 'community_card',
        content: {},
        delay: 26000
    },

    // Connect Ads CTA
    {
        role: 'assistant',
        type: 'email_capture',
        content: {},
        delay: 29000
    }
];
