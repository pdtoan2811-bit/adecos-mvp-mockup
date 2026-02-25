import { Search, Zap, BarChart2, Users, ShoppingBag, LayoutTemplate } from 'lucide-react';

export const bentoTiles = [
    {
        id: 'research',
        title: 'Nghiên cứu Thị trường',
        subtitle: 'Market Intelligence',
        description: 'Phân tích sâu về thị trường, đối thủ & Winning Products.',
        icon: <Search className="w-full h-full" />,
        color: 'blue',
        status: 'available',
        priority: 'primary',
        className: 'md:col-span-2 md:row-span-1',
        ctaText: 'Bắt đầu ngay',
        ctaAction: 'immersive_input',
        highlights: ['Winning Products', 'Competitor Spy']
    },
    {
        id: 'connect-ads',
        title: 'Kết nối Tài khoản QC',
        subtitle: 'Connect Ad Accounts',
        description: 'Tích hợp Google, FB & TikTok Ads',
        icon: <LayoutTemplate className="w-full h-full" />,
        color: 'rose',
        status: 'available',
        priority: 'primary',
        className: 'md:col-span-1 md:row-span-1',
        ctaText: 'Kết nối ngay',
        ctaNavigate: '/ads',
        highlights: ['Google Ads', 'Facebook', 'TikTok']
    },
    {
        id: 'smart-shopping',
        title: 'Tự động tối ưu chiến dịch',
        subtitle: 'Auto-Optimization',
        description: 'Tự động tối ưu Feed & Bid giá theo ROAS.',
        icon: <ShoppingBag className="w-full h-full" />,
        color: 'purple',
        status: 'coming_soon',
        priority: 'secondary',
        className: 'md:col-span-1 md:row-span-1',
        ctaText: 'Đăng ký',
        ctaUrl: '#',
        highlights: ['Profit Bidding']
    },
    {
        id: 'chat-data',
        title: 'Chat với Data',
        subtitle: 'Data Analyst Agent',
        description: 'Hỏi đáp với dữ liệu, doanh thu với AI.',
        icon: <BarChart2 className="w-full h-full" />,
        color: 'emerald',
        status: 'coming_soon',
        priority: 'secondary',
        className: 'md:col-span-1 md:row-span-1',
        ctaText: 'Tìm hiểu',
        ctaUrl: '#',
        highlights: ['Natural Language']
    },
    {
        id: 'community',
        title: 'Cộng đồng Adecos',
        subtitle: 'Affiliate Community',
        description: 'Kết nối với ADECOS team và các chuyên gia trong affiliate MMO.',
        icon: <Users className="w-full h-full" />,
        color: 'orange',
        status: 'available',
        priority: 'secondary',
        className: 'md:col-span-1 md:row-span-1',
        actions: [
            { text: 'Facebook', url: '#' },
            { text: 'Zalo', url: '#' }
        ],
        highlights: ['Networking']
    }
];



