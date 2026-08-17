'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Package, Plus, Search, Edit3, Trash2, PauseCircle, PlayCircle, X, Check } from 'lucide-react';
import { ProductData } from '@/lib/data/products';
import { createProduct, updateProduct, deleteProduct, toggleProductStatus } from '@/lib/actions/products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    sku: '',
    nameEn: '',
    nameAr: '',
    price: '',
    categorySlug: '',
    descriptionEn: '',
    descriptionAr: '',
    imageUrl: '',
    inStock: true,
    isNewArrival: false,
    isFeatured: false,
    isTopSeller: false,
  });

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.products) {
        const mapped = prodData.products.map((p: any) => ({
          ...p,
          id: p._id || p.id,
        }));
        setProducts(mapped);
      }

      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.categories) {
        setCategories(catData.categories);
        if (catData.categories.length > 0 && !formData.categorySlug) {
          setFormData((prev) => ({ ...prev, categorySlug: catData.categories[0].slug }));
        }
      }
    } catch (err) {
      console.error('Failed to load admin dashboard products:', err);
    }
    setLoading(false);
  }, [formData.categorySlug]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const filteredProducts = products.filter((p) => {
    if (selectedCat && p.categorySlug !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.en.toLowerCase().includes(q) ||
        p.name.ar.includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleStatus = async (id: string) => {
    const res = await toggleProductStatus(id);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPaused: res.isPaused } : p))
      );
    } else {
      alert(res.error || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(res.error || 'Failed to delete product');
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      sku: `ALF-NEW-${Math.floor(100 + Math.random() * 900)}`,
      nameEn: '',
      nameAr: '',
      price: '10.00',
      categorySlug: categories[0]?.slug || 'hair-care-product',
      descriptionEn: '',
      descriptionAr: '',
      imageUrl: '', // default empty for dashboard config
      inStock: true,
      isNewArrival: true,
      isFeatured: false,
      isTopSeller: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductData) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      nameEn: product.name.en,
      nameAr: product.name.ar,
      price: product.price.toString(),
      categorySlug: product.categorySlug,
      descriptionEn: product.description.en,
      descriptionAr: product.description.ar,
      imageUrl: product.images[0] || '',
      inStock: product.inStock,
      isNewArrival: product.isNewArrival || false,
      isFeatured: product.isFeatured || false,
      isTopSeller: product.isTopSeller || false,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      sku: formData.sku,
      name: { en: formData.nameEn, ar: formData.nameAr },
      slug: editingProduct ? editingProduct.slug : formData.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
      description: { en: formData.descriptionEn, ar: formData.descriptionAr },
      usage: { en: formData.descriptionEn, ar: formData.descriptionAr }, // mirror usage for now
      price: parseFloat(formData.price) || 10.0,
      categorySlug: formData.categorySlug,
      images: formData.imageUrl ? [formData.imageUrl] : [],
      inStock: formData.inStock,
      stockQuantity: editingProduct ? editingProduct.stockQuantity : 50,
      isNewArrival: formData.isNewArrival,
      isFeatured: formData.isFeatured,
      isTopSeller: formData.isTopSeller,
    };

    if (editingProduct) {
      const res = await updateProduct(editingProduct.id, payload);
      if (res.success) {
        loadAllData();
      } else {
        alert(res.error || 'Failed to update product');
      }
    } else {
      const res = await createProduct(payload);
      if (res.success) {
        loadAllData();
      } else {
        alert(res.error || 'Failed to create product');
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Products CRUD Management</h1>
            <p className="text-xs text-gray-500">Create, edit, pause, and delete Al Fayasel products</p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full px-3.5 py-2 ps-9 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name.en}
              </option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Product</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (JOD)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 relative bg-gray-100 rounded-lg overflow-hidden border shrink-0">
                        <Image src={product.images[0]} alt={product.name.en} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1">{product.name.en}</h4>
                        <span className="text-gray-400 text-[11px] font-arabic line-clamp-1">{product.name.ar}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-gray-600">{product.sku}</td>

                    <td className="p-4 text-gray-600">{product.categoryName.en}</td>

                    <td className="p-4 font-bold text-brand-600">{product.price.toFixed(2)}</td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          product.isPaused
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}
                      >
                        {product.isPaused ? (
                          <>
                            <PauseCircle className="w-3 h-3" />
                            <span>Paused</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-4 text-end space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-1.5 text-gray-600 hover:text-brand-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      {/* Modal Form for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-extrabold text-base text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">رمز المنتج الفريد (SKU) *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <p className="text-[9px] text-gray-400 mt-0.5">رمز خاص بكل منتج (يتم توليده تلقائياً ويمكنك تعديله)</p>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">السعر بالدينار الأردني (Price JOD) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="مثال: 5.50"
                  />
                  <p className="text-[9px] text-gray-400 mt-0.5">اكتب السعر بالدينار (مثال: 4.00 أو 12.50)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">اسم المنتج بالإنجليزية (English Name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Example: Be Clean Gel"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">اسم المنتج بالعربية (Arabic Name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-arabic"
                    placeholder="مثال: بي كلين معقم جيل"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">القسم التابع له المنتج (Category) *</label>
                <select
                  value={formData.categorySlug}
                  onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-black"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name.ar} ({c.name.en})
                    </option>
                  ))}
                </select>
                <p className="text-[9px] text-gray-400 mt-0.5">اختر القسم الذي ينتمي إليه هذا المنتج ليظهر فيه بالمتجر</p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">رابط صورة المنتج (Image URL) *</label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-mono text-[10px]"
                  placeholder="/images/uploads/product-image.jpg"
                />
                <p className="text-[9px] text-gray-400 mt-0.5">مسار أو رابط صورة المنتج بالموقع (مثال: `/images/uploads/your-image.jpg`)</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">شرح المنتج بالإنجليزية (Description EN)</label>
                  <textarea
                    rows={3}
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="English description details..."
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">شرح المنتج بالعربية (Description AR)</label>
                  <textarea
                    rows={3}
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-arabic"
                    placeholder="تفاصيل وشرح المنتج بالعربية للزبائن..."
                  />
                </div>
              </div>

              {/* Tab Visibility Flags */}
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-150 space-y-2 my-2">
                <span className="font-bold text-gray-700 block mb-1 text-[10px] uppercase tracking-wider">عرض المنتج في الصفحة الرئيسية (Home Showcase):</span>
                <div className="flex flex-wrap gap-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span>جديدنا (New Arrivals)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span>مميز (Featured)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isTopSeller}
                      onChange={(e) => setFormData({ ...formData, isTopSeller: e.target.checked })}
                      className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span>الاكثر مبيعاً (Top Sellers)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-colors"
                >
                  إلغاء (Cancel)
                </button>
                <button
                  type="submit"
                  className="bg-[#0066b2] hover:bg-[#005594] text-white font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-md"
                >
                  {editingProduct ? 'حفظ التعديلات (Save Product)' : 'إنشاء المنتج (Create Product)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
