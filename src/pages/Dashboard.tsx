import { TrendingUp, TrendingDown, Package, DollarSign, Users, AlertTriangle, Wrench, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const salesData = [
  { name: 'شنبه', فروش: 45000, خرید: 32000 },
  { name: 'یکشنبه', فروش: 52000, خرید: 28000 },
  { name: 'دوشنبه', فروش: 38000, خرید: 41000 },
  { name: 'سه‌شنبه', فروش: 61000, خرید: 35000 },
  { name: 'چهارشنبه', فروش: 55000, خرید: 29000 },
  { name: 'پنجشنبه', فروش: 72000, خرید: 45000 },
  { name: 'جمعه', فروش: 48000, خرید: 22000 },
];

const categoryData = [
  { name: 'لپ‌تاپ', value: 35, color: '#3b82f6' },
  { name: 'لوازم جانبی', value: 25, color: '#10b981' },
  { name: 'قطعات', value: 20, color: '#f59e0b' },
  { name: 'مانیتور', value: 12, color: '#8b5cf6' },
  { name: 'سایر', value: 8, color: '#ef4444' },
];

const monthlyData = [
  { name: 'حمل', sales: 320000 },
  { name: 'ثور', sales: 450000 },
  { name: 'جوزا', sales: 380000 },
  { name: 'سرطان', sales: 520000 },
  { name: 'اسد', sales: 480000 },
  { name: 'سنبله', sales: 610000 },
  { name: 'میزان', sales: 550000 },
];

const recentTransactions = [
  { id: 1, type: 'sale', description: 'فروش لپ‌تاپ Dell Latitude', amount: 45000, time: '۱۰:۳۰' },
  { id: 2, type: 'purchase', description: 'خرید موس لاجیتک (۲۰ عدد)', amount: 12000, time: '۰۹:۱۵' },
  { id: 3, type: 'payment', description: 'دریافت از احمد شاه', amount: 25000, time: '۰۸:۴۵' },
  { id: 4, type: 'expense', description: 'مصرف برق ماهانه', amount: 3500, time: '۰۸:۰۰' },
  { id: 5, type: 'sale', description: 'فروش SSD 512GB', amount: 8500, time: '۰۷:۳۰' },
];

const lowStockItems = [
  { name: 'لپ‌تاپ HP ProBook 450', current: 2, min: 5 },
  { name: 'مانیتور Samsung 24"', current: 1, min: 3 },
  { name: 'کیبورد بی‌سیم', current: 3, min: 10 },
  { name: 'کابل HDMI 2m', current: 4, min: 15 },
];

const openRepairs = [
  { id: 'REP-0045', customer: 'محمد عارف', device: 'لپ‌تاپ ASUS', status: 'در حال تعمیر', days: 3 },
  { id: 'REP-0044', customer: 'فاطمه نوری', device: 'کمپیوتر دسکتاپ', status: 'تشخیص عیب', days: 1 },
  { id: 'REP-0043', customer: 'عبدالله احمدی', device: 'لپ‌تاپ Lenovo', status: 'تعمیر تکمیل', days: 5 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="فروش امروز"
          value="۱۲۸,۵۰۰ ؋"
          change="+۱۲٪"
          trend="up"
          icon={<ShoppingCart size={24} />}
          color="primary"
        />
        <StatCard
          title="دریافت امروز"
          value="۹۵,۲۰۰ ؋"
          change="+۸٪"
          trend="up"
          icon={<DollarSign size={24} />}
          color="green"
        />
        <StatCard
          title="بدهی‌های سررسید"
          value="۲۴۵,۰۰۰ ؋"
          change="۳ فاکتور"
          trend="down"
          icon={<AlertTriangle size={24} />}
          color="red"
        />
        <StatCard
          title="موجودی صندوق"
          value="۳۵۶,۸۰۰ ؋"
          change="آفلاین"
          trend="neutral"
          icon={<Package size={24} />}
          color="gold"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">فروش و خرید هفتگی</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600">
              <option>این هفته</option>
              <option>هفته گذشته</option>
              <option>ماه جاری</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                formatter={(value: number) => [`${value.toLocaleString()} ؋`]}
              />
              <Bar dataKey="فروش" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="خرید" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">سهم دسته‌بندی‌ها</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}٪`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-medium text-slate-800">{item.value}٪</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">معاملات اخیر</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">مشاهده همه</button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.type === 'sale' ? 'bg-green-100 text-green-600' :
                    tx.type === 'purchase' ? 'bg-blue-100 text-blue-600' :
                    tx.type === 'payment' ? 'bg-purple-100 text-purple-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {tx.type === 'sale' ? <TrendingUp size={18} /> :
                     tx.type === 'purchase' ? <ShoppingCart size={18} /> :
                     tx.type === 'payment' ? <DollarSign size={18} /> :
                     <TrendingDown size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{tx.description}</p>
                    <p className="text-xs text-slate-400">{tx.time}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${
                  tx.type === 'sale' || tx.type === 'payment' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'sale' || tx.type === 'payment' ? '+' : '-'}{tx.amount.toLocaleString()} ؋
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">کالاهای کم‌موجود</h3>
            <AlertTriangle size={20} className="text-amber-500" />
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                <p className="text-sm font-medium text-slate-700 mb-1">{item.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">حداقل: {item.min}</span>
                  <span className="text-xs font-bold text-red-600">موجودی: {item.current}</span>
                </div>
                <div className="mt-2 w-full bg-amber-200 rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(item.current / item.min) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">روند فروش ماهانه</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                formatter={(value: number) => [`${value.toLocaleString()} ؋`]}
              />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Open Repairs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">سفارش‌های تعمیر باز</h3>
            <Wrench size={20} className="text-primary-500" />
          </div>
          <div className="space-y-3">
            {openRepairs.map((repair) => (
              <div key={repair.id} className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{repair.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    repair.status === 'تعمیر تکمیل' ? 'bg-green-100 text-green-700' :
                    repair.status === 'در حال تعمیر' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{repair.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{repair.customer}</p>
                    <p className="text-xs text-slate-400">{repair.device}</p>
                  </div>
                  <span className="text-xs text-slate-500">{repair.days} روز</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: 'primary' | 'green' | 'red' | 'gold';
}

function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 border-primary-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    gold: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  const iconBg = {
    primary: 'bg-primary-100 text-primary-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    gold: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-400'}`}>
            {change}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
