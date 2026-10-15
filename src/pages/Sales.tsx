import { useState } from 'react';
import { useStore } from '../backend/store';
import { Search, Plus, Minus, Trash2, Printer, CreditCard, Banknote, User, Barcode, CheckCircle, ShoppingCart } from 'lucide-react';


interface CartItem {
  id: string;
  productId: string;
  name: string;
  code: string;
  price: number;
  cost: number;
  qty: number;
  serial: string;
  maxStock: number;
}

export default function Sales() {
  const { products, customers, services, refreshAll, saleInvoices } = useStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [discount, setDiscount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<string>('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal - discount;

  const filteredProducts = products.filter(p => 
    p.name.includes(searchTerm) || p.code.includes(searchTerm) || p.barcode.includes(searchTerm)
  ).slice(0, 12);

  const addToCart = (product: typeof products[0]) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.qty >= existing.maxStock) {
        alert('موجودی کافی نیست');
        return;
      }
      setCart(items => items.map(item =>
        item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        productId: product.id,
        name: product.name,
        code: product.code,
        price: product.salePrice,
        cost: product.avgCost,
        qty: 1,
        serial: '',
        maxStock: product.hasSerial ? 1 : 100,
      }]);
    }
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(items => items.map(item => {
      if (item.productId === productId) {
        const newQty = item.qty + delta;
        if (newQty < 1) return item;
        if (newQty > item.maxStock) {
          alert('موجودی کافی نیست');
          return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (productId: string) => {
    setCart(items => items.filter(item => item.productId !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('سبد خرید خالی است');
      return;
    }

    try {
      const saleItems = cart.map(item => ({
        id: `si_${Date.now()}_${Math.random().toString(36).substr(2,5)}`,
        productId: item.productId,
        quantity: item.qty,
        unitPrice: item.price,
        unitCost: item.cost,
        discount: 0,
        totalPrice: item.price * item.qty,
        totalCost: item.cost * item.qty,
        profit: (item.price - item.cost) * item.qty,
        serialNumbers: item.serial ? [item.serial] : [],
      }));

      const invoice = services.sales.createSale(
        selectedCustomer || null,
        saleItems,
        discount,
        paymentMethod === 'cash' ? total : 0,
        paymentMethod === 'cash' ? 'cash' : 'credit',
        'retail'
      );

      setLastInvoice(invoice.invoiceNumber);
      setShowCheckout(false);
      setShowSuccess(true);
      setCart([]);
      setDiscount(0);
      setSelectedCustomer('');
      refreshAll();

      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error: any) {
      alert(error.message || 'خطا در ثبت فروش');
    }
  };

  const recentSales = saleInvoices.slice(0, 4);

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle size={20} />
          <span className="font-medium">فاکتور {lastInvoice} با موفقیت ثبت شد</span>
        </div>
      )}

      {/* Products Panel */}
      <div className="flex-1 flex flex-col">
        {/* Search */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="جست‌وجوی کالا یا اسکن بارکد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-sm"
              autoFocus
            />
          </div>
          <button className="px-4 py-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2 text-sm text-slate-600">
            <Barcode size={18} />
            اسکن
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto flex-1 pb-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white rounded-xl border border-slate-200 p-3 hover:border-primary-300 hover:shadow-md transition-all text-right group"
            >
              <div className="text-3xl mb-2">
                {product.category === 'لپ‌تاپ' ? '💻' :
                 product.category === 'مانیتور' ? '🖥️' :
                 product.category === 'ذخیره‌سازی' ? '💾' :
                 product.category === 'شبکه' ? '📡' :
                 product.category === 'پرینتر' ? '🖨️' : '🔌'}
              </div>
              <p className="text-sm font-medium text-slate-700 group-hover:text-primary-700 line-clamp-1">{product.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-primary-600">{product.salePrice.toLocaleString()} ؋</span>
                <span className={`text-xs ${product.hasSerial ? 'text-blue-500' : 'text-slate-400'}`}>
                  {product.hasSerial ? 'سریال‌دار' : product.unit}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mt-2">
          <h4 className="text-sm font-bold text-slate-700 mb-3">فروش‌های اخیر</h4>
          <div className="flex gap-3 overflow-x-auto">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex-shrink-0 bg-slate-50 rounded-lg p-3 min-w-[200px] border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-slate-500">{sale.invoiceNumber}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sale.paymentMethod === 'cash' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {sale.paymentMethod === 'cash' ? 'نقدی' : 'اعتباری'}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-800 mt-1">{sale.totalAmount.toLocaleString()} ؋</p>
                <p className="text-xs text-slate-400 mt-1">{sale.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-96 bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">سبد فروش</h3>
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">{cart.length} قلم</span>
          </div>
          {/* Customer Selection */}
          <div className="mt-3 relative">
            <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">مشتری عمومی (بدون پرونده)</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">سبد خرید خالی است</p>
              <p className="text-xs mt-1">محصولات را از لیست انتخاب کنید</p>
            </div>
          ) : cart.map((item) => (
            <div key={item.productId} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{item.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{item.code}</p>
                </div>
                <button onClick={() => removeItem(item.productId)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.productId, -1)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-bold w-8 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.productId, 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                    <Plus size={12} />
                  </button>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">{(item.price * item.qty).toLocaleString()} ؋</p>
                  <p className="text-xs text-slate-400">هر عدد {item.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Footer */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          {/* Discount */}
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="تخفیف" 
              value={discount || ''}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
            />
            <span className="text-sm text-slate-500">؋</span>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>جمع کل</span>
              <span>{subtotal.toLocaleString()} ؋</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>تخفیف</span>
                <span className="text-red-500">- {discount.toLocaleString()} ؋</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-primary-600">{total.toLocaleString()} ؋</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${paymentMethod === 'cash' ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
            >
              <Banknote size={16} /> نقدی
            </button>
            <button
              onClick={() => setPaymentMethod('credit')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${paymentMethod === 'credit' ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
            >
              <CreditCard size={16} /> اعتباری
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => { setCart([]); setDiscount(0); }}
              className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> پاک‌کردن
            </button>
            <button 
              onClick={() => cart.length > 0 && setShowCheckout(true)}
              disabled={cart.length === 0}
              className="flex-[2] bg-gradient-to-l from-primary-600 to-primary-700 text-white py-3 rounded-xl text-sm font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer size={16} /> ثبت و چاپ فاکتور
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">تأیید نهایی فروش</h3>
              <p className="text-sm text-slate-500 mt-1">روش پرداخت: {paymentMethod === 'cash' ? 'نقدی' : 'اعتباری'}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">تعداد اقلام</span>
                  <span className="font-medium">{cart.length} قلم</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">جمع کل</span>
                  <span className="font-medium">{subtotal.toLocaleString()} ؋</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">تخفیف</span>
                    <span className="font-medium text-red-500">- {discount.toLocaleString()} ؋</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                  <span>مبلغ نهایی</span>
                  <span className="text-primary-600">{total.toLocaleString()} ؋</span>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-sm text-green-600">مبلغ دریافتی</p>
                  <p className="text-2xl font-bold text-green-700">{total.toLocaleString()} ؋</p>
                </div>
              )}

              {paymentMethod === 'credit' && (
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-sm text-amber-600">فروش اعتباری - مانده بدهی مشتری</p>
                  <p className="text-2xl font-bold text-amber-700">{total.toLocaleString()} ؋</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button onClick={() => setShowCheckout(false)} className="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">انصراف</button>
              <button onClick={handleCheckout} className="flex-[2] py-3 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                <CheckCircle size={16} /> تأیید و ثبت نهایی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
