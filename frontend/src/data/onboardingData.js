/**
 * Onboarding sequence data for the demo flow.
 *
 * Step types:
 *   - text            → AI text message (streamed word-by-word)
 *   - user_mimic      → Fake user question bubble (right-aligned)
 *   - thinking        → AI thinking indicator (pulsing dots)
 *   - skeleton        → Skeleton placeholder with progress wheel
 *   - table           → Real table data (replaces skeleton)
 *   - chart           → Real chart data (replaces skeleton)
 *   - feature_preview → Feature preview card
 *   - community_card  → Community CTA
 *   - email_capture   → Waitlist / email capture card
 *
 * `delay` is now RELATIVE (ms to wait BEFORE this step appears).
 * This makes it easier to reason about pacing.
 */
export const onboardingSequence = [
    // ─── Opening greeting ───
    {
        role: 'assistant',
        type: 'text',
        content: `**Xin chào! Tôi là Adecos AI**

Chào mừng bạn đến với Adecos - nền tảng tối ưu hóa hiệu suất Affiliate Marketing thông minh cho E-commerce.

Tôi ở đây để giúp bạn tìm ngách sản phẩm tiềm năng (Winning Products), tối ưu dòng tiền quảng cáo và tăng ROAS. Hãy cùng khám phá 3 tính năng cốt lõi nhé?`,
        delay: 500
    },

    // ─── Feature 1: User asks about affiliates ───
    {
        role: 'user',
        type: 'user_mimic',
        content: `Cho tôi xem top chương trình affiliate nước hoa tại US?`,
        delay: 1500
    },
    {
        role: 'assistant',
        type: 'thinking',
        content: '',
        delay: 400
    },
    {
        role: 'assistant',
        type: 'text',
        content: `**1. Nghiên cứu & Chấm điểm Chiến dịch (Market Intelligence)**
        
Tôi liên tục quét thị trường US để tìm các ngách sản phẩm (Niche) đang có nhu cầu cao và cạnh tranh thấp.

Ví dụ: Top 5 chương trình Affiliate Nước hoa (Fragrances) tiềm năng nhất tại US hiện nay:`,
        delay: 200
    },
    // Skeleton → Table reveal
    {
        role: 'assistant',
        type: 'skeleton',
        content: { variant: 'table', loadDuration: 2000 },
        delay: 600
    },
    {
        role: 'assistant',
        type: 'table',
        content: [
            {
                brand: 'Sephora',
                program_url: 'https://sephora.com',
                commission_percent: 5,
                commission_type: 'CPA',
                can_use_brand: true,
                traffic_3m: '45M',
                legitimacy_score: 9.9,
                marketing_notes: 'High conversion, Brand bidding allowed'
            },
            {
                brand: 'FragranceNet',
                program_url: 'https://fragrancenet.com',
                commission_percent: 10,
                commission_type: 'CPS',
                can_use_brand: true,
                traffic_3m: '12M',
                legitimacy_score: 9.5,
                marketing_notes: 'Discount focus, High volume'
            },
            {
                brand: 'Scentbird',
                program_url: 'https://scentbird.com',
                commission_percent: 8,
                commission_type: 'Subscription',
                can_use_brand: false,
                traffic_3m: '5.2M',
                legitimacy_score: 9.0,
                marketing_notes: 'Subscription model, LTV high'
            },
            {
                brand: 'Dossier',
                program_url: 'https://dossier.co',
                commission_percent: 15,
                commission_type: 'CPS',
                can_use_brand: true,
                traffic_3m: '3.8M',
                legitimacy_score: 8.8,
                marketing_notes: 'Dupe fragrances, TikTok trend'
            },
            {
                brand: 'Ulta Beauty',
                program_url: 'https://ulta.com',
                commission_percent: 4,
                commission_type: 'CPA',
                can_use_brand: true,
                traffic_3m: '38M',
                legitimacy_score: 9.8,
                marketing_notes: 'Loyalty program strong'
            },
            {
                brand: 'FragranceX',
                program_url: 'https://fragrancex.com',
                commission_percent: 12,
                commission_type: 'CPS',
                can_use_brand: true,
                traffic_3m: '8.5M',
                legitimacy_score: 9.2,
                marketing_notes: 'International shipping'
            },
            {
                brand: 'Macy\'s',
                program_url: 'https://macys.com',
                commission_percent: 6,
                commission_type: 'CPA',
                can_use_brand: false,
                traffic_3m: '18M',
                legitimacy_score: 9.6,
                marketing_notes: 'Seasonal sales spikes'
            },
            {
                brand: 'Nordstrom',
                program_url: 'https://nordstrom.com',
                commission_percent: 7,
                commission_type: 'CPA',
                can_use_brand: true,
                traffic_3m: '22M',
                legitimacy_score: 9.7,
                marketing_notes: 'Premium audience'
            },
            {
                brand: 'Saks Fifth Avenue',
                program_url: 'https://saksfifthavenue.com',
                commission_percent: 8,
                commission_type: 'CPA',
                can_use_brand: true,
                traffic_3m: '4.5M',
                legitimacy_score: 9.4,
                marketing_notes: 'Luxury niche'
            },
            {
                brand: 'MicroPerfumes',
                program_url: 'https://microperfumes.com',
                commission_percent: 10,
                commission_type: 'CPS',
                can_use_brand: true,
                traffic_3m: '1.2M',
                legitimacy_score: 8.5,
                marketing_notes: 'Sample sizes, Easy entry'
            }
        ],
        context: {
            description: "Dữ liệu realtime từ CJ, Impact & ShareASale."
        },
        delay: 2000  // replaces skeleton after its loadDuration
    },

    // ─── Feature 2: User asks about analytics ───
    {
        role: 'user',
        type: 'user_mimic',
        content: `CPC nước hoa biến động thế nào tuần qua?`,
        delay: 2000
    },
    {
        role: 'assistant',
        type: 'thinking',
        content: '',
        delay: 400
    },
    {
        role: 'assistant',
        type: 'text',
        content: `**2. Phân tích Dữ liệu tập trung (Data Analytics)**

Kết nối Google Ads & Dashboard bán hàng để xem báo cáo hiệu suất (ROAS/Profit) ngay trong khung chat.

**Biến động CPC trung bình (Niche Nước hoa - 7 ngày qua):**`,
        delay: 200
    },
    // Skeleton → Line Chart reveal
    {
        role: 'assistant',
        type: 'skeleton',
        content: { variant: 'chart', loadDuration: 1800 },
        delay: 600
    },
    {
        role: 'assistant',
        type: 'chart',
        content: {
            chartType: 'line',
            title: 'Xu hướng CPC Trung bình (7 ngày)',
            data: [
                { date: '29/01', cpc: 1.2 },
                { date: '30/01', cpc: 1.15 },
                { date: '31/01', cpc: 1.3 },
                { date: '01/02', cpc: 1.1 },
                { date: '02/02', cpc: 0.95 },
                { date: '03/02', cpc: 0.85 },
                { date: '04/02', cpc: 0.80 },
            ],
            config: {
                xAxis: 'date',
                series: [
                    { dataKey: 'cpc', name: 'CPC ($)', color: '#60A5FA' }
                ]
            }
        },
        delay: 1800
    },

    // ─── Feature 2b: Budget breakdown ───
    {
        role: 'assistant',
        type: 'text',
        content: `**Ngân sách theo thương hiệu (14 ngày qua):**`,
        delay: 1200
    },
    // Skeleton → Bar Chart reveal
    {
        role: 'assistant',
        type: 'skeleton',
        content: { variant: 'chart', loadDuration: 1500 },
        delay: 500
    },
    {
        role: 'assistant',
        type: 'chart',
        content: {
            chartType: 'bar',
            title: 'Chi tiêu QC - Top Brands',
            data: [
                { name: 'Sephora (Search)', cost: 4500 },
                { name: 'Dossier (Social)', cost: 2800 },
                { name: 'FragranceNet (Google)', cost: 3200 },
                { name: 'Ulta (Display)', cost: 1500 },
            ],
            config: {
                xAxis: 'name',
                series: [
                    { dataKey: 'cost', name: 'Cost ($)', color: '#2161eb' }
                ]
            }
        },
        delay: 1500
    },

    // ─── Coming Soon ───
    {
        role: 'assistant',
        type: 'text',
        content: `🚀 **Tính năng Sắp ra mắt (Coming Soon)**

Chúng tôi đang phát triển các công cụ mạnh mẽ để thay đổi cách bạn làm E-commerce Affiliate. Click vào các thẻ bên dưới để khám phá:`,
        delay: 2000
    },

    // Feature 3: Smart Shopping Ads
    {
        role: 'assistant',
        type: 'feature_preview',
        content: {
            featureName: "Tự động tối ưu chiến dịch",
            description: "Hệ thống AI tự động tối ưu Google Shopping Feed. Tự động điều chỉnh bid giá dựa trên biên lợi nhuận thực tế của từng sản phẩm.",
            benefits: [
                "Tự động fix lỗi Merchant Center",
                "Bid theo Real-time ROAS mục tiêu",
                "Phân tích đối thủ cạnh tranh (Spy Price)"
            ],
            ctaText: "Đăng ký Early Access",
            ctaUrl: "https://calendly.com/adecos-demo",
            autoRedirect: true
        },
        delay: 1500
    },

    // Feature 4: Chat with Data
    {
        role: 'assistant',
        type: 'feature_preview',
        content: {
            featureName: "Chat with Data",
            description: "Không cần tải xuống báo cáo CSV phức tạp. Chỉ cần hỏi Adecos AI bất kỳ câu hỏi nào về số liệu bán hàng của bạn.",
            benefits: [
                "Hỏi: 'Sản phẩm nào có ROAS cao nhất tuần này?'",
                "Phân tích xu hướng CPA theo giờ",
                "Dự báo doanh thu tháng tới"
            ],
            ctaText: "Đăng ký Early Access",
            ctaUrl: "https://adecos.io/early-access"
        },
        delay: 2000
    },

    // Community CTA
    {
        role: 'assistant',
        type: 'community_card',
        content: {},
        delay: 2000
    },

    // Connect Ads CTA
    {
        role: 'assistant',
        type: 'email_capture',
        content: {},
        delay: 2500
    },

    // ─── FINAL CONCLUSION: Bento Grid ───
    {
        role: 'assistant',
        type: 'bento_grid',
        content: {},
        delay: 2000
    }
];
