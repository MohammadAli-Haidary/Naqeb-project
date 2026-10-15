import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, Barcode } from 'lucide-react';

const categories = ['لپ‌تاپ', 'دسکتاپ', 'مانیتور', 'لوازم جانبی', 'قطعات', 'شبکه', 'ذخیره‌سازی', 'پرینتر'];
const brands = ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Samsung', 'LG', 'Logitech', 'Microsoft'];

const initialProducts = [
  { id: 1, name: 'لپ‌تاپ Dell Latitude 5540', code: 'LP-001', category: 'لپ‌تاپ', brand: 'Dell', model: 'Latitude 5540', barcode: '8901234567890', price: 55000, cost: 42000, stock: 8, serial: true, status: 'active' },
  { id: 2, name: 'مانیتور Samsung 27"', code: 'MN-012', category: 'مانیتور', brand: 'Samsung', model: 'S27R650', barcode: '8901234567891', price: 18000, cost: 13500, stock: 5, serial: true, status: 'active' },
  { id: 3, name: 'موس بی‌سیم Logitech M185', code: 'AC-045', category: 'لوازم جانبی', brand: 'Logitech', model: 'M185', barcode: '8901234567892', price: 450, cost: 280, stock: 45, serial: false, status: 'active' },
  { id: 4, name: 'کیبورد Microsoft Wired', code: 'AC-046', category: 'لوازم جانبی', brand: 'Microsoft', model: 'Wired 600', barcode: '8901234567893', price: 650, cost: 400, stock: 30, serial: false, status: 'active' },
  { id: 5, name: 'SSD Kingston 512GB', code: 'ST-023', category: 'ذخیره‌سازی', brand: 'Kingston', model: 'A400 512GB', barcode: '8901234567894', price: 3200, cost: 2400, stock: 15, serial: false, status: 'active' },
  { id: 6, name: 'لپ‌تاپ HP ProBook 450 G10', code: 'LP-002', category: 'لپ‌تاپ', brand: 'HP', model: 'ProBook 450 G10', barcode: '8901234567895', price: 48000, cost: 36000, stock: 3, serial: true, status: 'active' },
  { id: 7, name: 'کابل HDMI 2 متر', code: 'AC-078', category: 'لوازم جانبی', brand: 'Generic', model: 'HDMI 2.0', barcode: '8901234567896', price: 250, cost: 120, stock: 60, serial: false, status: 'active' },
  { id: 8, name: 'لپ‌تاپ Lenovo ThinkPad E14', code: 'LP-003', category: 'لپ‌تاپ', brand: 'Lenovo', model: 'ThinkPad E14', barcode: '8901234567897', price: 42000, cost: 32000, stock: 6, serial: true, status: 'active' },
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.includes(searchTerm) || p.code.includes(searchTerm) || p.barcode.includes(searchTerm) || p.brand.includes(searchTerm);
    const matchesCategory = selectedCategory === 'همه' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="جست‌وجو بر اساس نام، کد، بارکد یا برند..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="همه">همه دسته‌ها</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus size={18} />
          محصول جدید
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{products.length}</p>
              <p className="text-xs text-slate-500">کل محصولات</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Barcode size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{products.filter(p => p.serial).length}</p>
              <p className="text-xs text-slate-500">دارای سریال</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Filter size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{categories.length}</p>
              <p className="text-xs text-slate-500">دسته‌بندی</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{products.filter(p => p.stock <= 5).length}</p>
              <p className="text-xs text-slate-500">کم‌موجود</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">کد</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">نام محصول</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">دسته</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">برند</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">قیمت فروش</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">بهای خرید</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">موجودی</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">سریال</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-slate-600">{product.code}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{product.barcode}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{product.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{product.brand}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{product.price.toLocaleString()} ؋</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{product.cost.toLocaleString()} ؋</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {product.serial ? (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">بله</span>
                    ) : (
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">خیر</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => { setEditingProduct(product); setShowForm(true); }}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
          <p className="text-sm text-slate-500">نمایش {filteredProducts.length} از {products.length} محصول</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm rounded-lg bg-primary-600 text-white">۱</button>
            <button className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100 text-slate-600">۲</button>
            <button className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100 text-slate-600">۳</button>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editingProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <span className="text-xl">&times;</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">نام محصول *</label>
                  <input type="text" defaultValue={editingProduct?.name} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="نام محصول" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">کد داخلی</label>
                  <input type="text" defaultValue={editingProduct?.code} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="کد داخلی" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">دسته‌بندی *</label>
                  <select defaultValue={editingProduct?.category} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">انتخاب کنید</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">برند</label>
                  <select defaultValue={editingProduct?.brand} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">انتخاب کنید</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">مدل</label>
                  <input type="text" defaultValue={editingProduct?.model} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="مدل" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">بارکد</label>
                  <input type="text" defaultValue={editingProduct?.barcode} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="بارکد" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">قیمت فروش (؋) *</label>
                  <input type="number" defaultValue={editingProduct?.price} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="۰" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">بهای خرید (؋) *</label>
                  <input type="number" defaultValue={editingProduct?.cost} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="۰" />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={editingProduct?.serial} className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-slate-700">دارای شماره سریال</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">توضیحات فنی</label>
                <textarea rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="توضیحات اضافی..."></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">انصراف</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md">
                {editingProduct ? 'ذخیره تغییرات' : 'ثبت محصول'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
