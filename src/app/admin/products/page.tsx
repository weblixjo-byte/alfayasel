'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Package, Plus, Search, Edit3, Trash2, PauseCircle, PlayCircle, X, Check, Layers, AlertCircle } from 'lucide-react';
import { ProductData } from '@/lib/data/products';
import { createProduct, updateProduct, deleteProduct, toggleProductStatus } from '@/lib/actions/products';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface AdminVariationForm {
  id: string;
  sku: string;
  nameAr: string;
  nameEn: string;
  price: string;
  originalPrice: string;
  stockQuantity: string;
  inStock: boolean;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl: string;
}

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
  });

  const [variationsList, setVariationsList] = useState<AdminVariationForm[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?admin=true');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
    setLoading(false);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
        if (data.categories.length > 0 && !formData.categorySlug) {
          setFormData((prev) => ({ ...prev, categorySlug: data.categories[0].slug }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, [formData.categorySlug]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      sku: 'ALF-' + Math.floor(10000 + Math.random() * 90000),
      nameEn: '',
      nameAr: '',
      price: '',
      categorySlug: categories[0]?.slug || 'medical-cosmetics',
      descriptionEn: '',
      descriptionAr: '',
      imageUrl: '',
    });
    setVariationsList([]);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleOpenEditModal = (product: ProductData) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku || '',
      nameEn: product.name.en || '',
      nameAr: product.name.ar || '',
      price: product.price ? product.price.toString() : '',
      categorySlug: product.categorySlug || categories[0]?.slug || 'medical-cosmetics',
      descriptionEn: product.description?.en || '',
      descriptionAr: product.description?.ar || '',
      imageUrl: product.images && product.images[0] ? product.images[0] : '',
    });

    if (product.variations && product.variations.length > 0) {
      setVariationsList(
        product.variations.map((v, idx) => ({
          id: 'var_' + Date.now() + '_' + idx,
          sku: v.sku || (product.sku + '-' + (idx + 1)),
          nameAr: v.name?.ar || '',
          nameEn: v.name?.en || '',
          price: v.price ? v.price.toString() : '',
          originalPrice: v.originalPrice ? v.originalPrice.toString() : '',
          stockQuantity: (v.stockQuantity !== undefined ? v.stockQuantity : 50).toString(),
          inStock: v.inStock !== false,
          descriptionAr: v.description?.ar || '',
          descriptionEn: v.description?.en || '',
          imageUrl: v.images && v.images[0] ? v.images[0] : '',
        }))
      );
    } else {
      setVariationsList([]);
    }

    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleAddVariation = () => {
    const nextIdx = variationsList.length + 1;
    setVariationsList([
      ...variationsList,
      {
        id: 'var_' + Date.now(),
        sku: (formData.sku || 'SKU') + '-' + nextIdx,
        nameAr: '',
        nameEn: '',
        price: formData.price || '0',
        originalPrice: '',
        stockQuantity: '50',
        inStock: true,
        descriptionAr: '',
        descriptionEn: '',
        imageUrl: formData.imageUrl || '',
      },
    ]);
  };

  const handleRemoveVariation = (idx: number) => {
    setVariationsList(variationsList.filter((_, i) => i !== idx));
  };

  const handleUpdateVariation = (idx: number, field: keyof AdminVariationForm, value: any) => {
    const updated = [...variationsList];
    updated[idx] = { ...updated[idx], [field]: value };
    setVariationsList(updated);
  };

  const handleToggleStatus = async (id: string) => {
    const res = await toggleProductStatus(id);
    if (res.success) {
      setProducts(products.map((p) => (p.id === id ? { ...p, isPaused: !p.isPaused } : p)));
    } else {
      alert('حدث خطأ أثناء تغيير حالة المنتج');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت تأكد من رغبتك في حذف هذا المنتج بشكل نهائي؟')) return;
    const res = await deleteProduct(id);
    if (res.success) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert('حدث خطأ أثناء حذف المنتج');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setFeedback(null);

    const formattedVariations = variationsList.map((v) => ({
      sku: v.sku,
      price: parseFloat(v.price) || 0,
      originalPrice: v.originalPrice ? parseFloat(v.originalPrice) : undefined,
      images: v.imageUrl ? [v.imageUrl] : [],
      attributes: {},
      inStock: v.inStock,
      stockQuantity: parseInt(v.stockQuantity) || 50,
      name: { en: v.nameEn, ar: v.nameAr },
      description: { en: v.descriptionEn, ar: v.descriptionAr },
    }));

    const payload = {
      sku: formData.sku,
      slug: editingProduct?.slug || formData.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') || ('product-' + Date.now()),
      name: { en: formData.nameEn, ar: formData.nameAr },
      description: { en: formData.descriptionEn, ar: formData.descriptionAr },
      usage: { en: '', ar: '' },
      price: parseFloat(formData.price) || 0,
      categorySlug: formData.categorySlug,
      categoryName: {
        en: categories.find((c) => c.slug === formData.categorySlug)?.name?.en || formData.categorySlug,
        ar: categories.find((c) => c.slug === formData.categorySlug)?.name?.ar || formData.categorySlug,
      },
      images: formData.imageUrl ? [formData.imageUrl] : [],
      inStock: true,
      stockQuantity: 50,
      isNewArrival: false,
      isFeatured: false,
      isTopSeller: false,
      variations: formattedVariations,
    };

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, payload);
    } else {
      result = await createProduct(payload);
    }

    setSubmitLoading(false);
    if (result.success) {
      setFeedback({ type: 'success', message: editingProduct ? 'تم تحديث المنتج بنجاح!' : 'تم إضافة المنتج بنجاح!' });
      setTimeout(() => {
        setIsModalOpen(false);
        fetchProducts();
      }, 1000);
    } else {
      setFeedback({ type: 'error', message: result.error || 'حدث خطأ أثناء حفظ البيانات' });
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = !selectedCat || p.categorySlug === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">إدارة المنتجات (Products)</h1>
          <p className="text-xs text-gray-500 mt-1">المنتجات التي تظهر في المتجر الإلكتروني وإدارتها ورصد المخزون والـ SEO</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="bg-[#0066b2] hover:bg-[#005594] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة منتج جديد (Add Product)</span>
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث باسم المنتج أو رمز SKU..."
            className="w-full px-3.5 py-2 ps-9 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">جاري تحميل المنتجات...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">
            لا يوجد منتجات مسجلة حالياً. اضغط على زر إضافة منتج جديد للبدء!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">المنتج (PRODUCT)</th>
                  <th className="p-4">الرمز (SKU)</th>
                  <th className="p-4">القسم (CATEGORY)</th>
                  <th className="p-4">الأحجام (VARIATIONS)</th>
                  <th className="p-4">السعر (JOD)</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-end">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 relative bg-gray-100 rounded-lg overflow-hidden border shrink-0">
                        {product.images && product.images[0] ? (
                          <Image src={product.images[0]} alt={product.name.en || 'Product'} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">No Image</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1">{product.name.ar}</h4>
                        <span className="text-gray-400 text-[11px] line-clamp-1">{product.name.en}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-gray-600">{product.sku}</td>

                    <td className="p-4 text-gray-600">{product.categoryName?.ar || product.categorySlug}</td>

                    <td className="p-4">
                      {product.variations && product.variations.length > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <Layers className="w-3 h-3" />
                          {product.variations.length} أحجام / خيارات مضافة
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">حجم رئيسي واحد</span>
                      )}
                    </td>

                    <td className="p-4 font-bold text-brand-600">{product.price.toFixed(2)} د.أ</td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ' + (
                          product.isPaused
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        )}
                      >
                        {product.isPaused ? (
                          <>
                            <PauseCircle className="w-3 h-3" />
                            <span>متوقف (Paused)</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3 h-3" />
                            <span>نشط (Active)</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-4 text-end space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-1.5 text-gray-600 hover:text-brand-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="تعديل المنتج"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  {editingProduct ? 'تعديل بيانات المنتج والأحجام' : 'إضافة منتج جديد مع الأحجام'}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">أدخل البيانات الأساسية والأحجام المتوفرة والأسعار</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Row 1: SKU & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">رمز المنتج الفريد (SKU) *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black font-mono"
                  />
                  
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">السعر الرئيسي بالدينار الأردني (Price JOD) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="مثال: 5.50"
                  />
                  
                </div>
              </div>

              {/* Row 2: Names AR & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">اسم المنتج بالعربية (Arabic Name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-arabic"
                    placeholder="مثال: بي كلين المعقم"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">اسم المنتج بالإنجليزية (English Name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Example: Be Clean Sanitizer Gel"
                  />
                </div>
              </div>

              {/* Row 3: Category & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                </div>

                <div>
                  <ImageUploader
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    label="صورة المنتج الرئيسية (Main Image)"
                    helperText="اختر صورة المنتج من الجهاز أو رابطها (JPG, PNG, WebP)"
                    aspectRatio="square"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Descriptions AR & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">الوصف العام بالعربية (Main Description AR)</label>
                  <textarea
                    rows={3}
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-arabic leading-relaxed"
                    placeholder="تفاصيل وشرح المنتج العام بالعربية للزبائن..."
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">الوصف العام بالإنجليزية (Main Description EN)</label>
                  <textarea
                    rows={3}
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black leading-relaxed"
                    placeholder="English general description details..."
                  />
                </div>
              </div>

              {/* SECTION: PRODUCT VARIATIONS & SIZES */}
              <div className="border-2 border-blue-100 bg-blue-50/40 rounded-2xl p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-[#0066b2] text-xs flex items-center gap-1.5">
                      <span>🏷️</span> خيارات وأحجام المنتج (Product Variations & Sizes)
                    </h4>
                    
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariation}
                    className="bg-[#0066b2] hover:bg-[#005594] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة حجم / خيار جديد
                  </button>
                </div>

                {variationsList.length === 0 ? (
                  <div className="text-center py-4 bg-white/70 rounded-xl border border-dashed border-gray-300 text-gray-500 text-[11px]">
                    المنتج حالياً بحجم وسعر واحد فقط. اضغط على زر <strong className="text-blue-700">&quot;إضافة حجم / خيار جديد&quot;</strong> إذا كان للمنتج أحجام متعددة.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {variationsList.map((variant, vIdx) => (
                      <div key={variant.id} className="bg-white border border-blue-200/80 rounded-2xl p-3.5 shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="font-extrabold text-xs text-[#0066b2] flex items-center gap-1">
                            <span>📦</span> الخيار #{vIdx + 1}: {variant.nameAr || variant.nameEn || 'حجم جديد'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariation(vIdx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> حذف الخيار
                          </button>
                        </div>

                        {/* Variant Row 1: Names & SKU */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">الاسم / الحجم بالعربية *</label>
                            <input
                              type="text"
                              required
                              value={variant.nameAr}
                              onChange={(e) => handleUpdateVariation(vIdx, 'nameAr', e.target.value)}
                              placeholder="مثال: 500 مل أو 1 لتر أو غالون 5 لتر"
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-arabic"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">الاسم / الحجم بالإنجليزية *</label>
                            <input
                              type="text"
                              required
                              value={variant.nameEn}
                              onChange={(e) => handleUpdateVariation(vIdx, 'nameEn', e.target.value)}
                              placeholder="e.g. 500ml or 1 Liter or 5L Gallon"
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">رمز الخيار الفريد (SKU) *</label>
                            <input
                              type="text"
                              required
                              value={variant.sku}
                              onChange={(e) => handleUpdateVariation(vIdx, 'sku', e.target.value)}
                              className="w-full px-2.5 py-1.5 border rounded-lg font-mono text-xs bg-gray-50"
                              placeholder="مثال: ALF-101-500ML"
                            />
                          </div>
                        </div>

                        {/* Variant Row 2: Prices & Image */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">سعر هذا الحجم (JOD) *</label>
                            <input
                              type="number"
                              step="0.05"
                              required
                              value={variant.price}
                              onChange={(e) => handleUpdateVariation(vIdx, 'price', e.target.value)}
                              placeholder="مثال: 7.50"
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">السعر قبل الخصم (اختياري)</label>
                            <input
                              type="number"
                              step="0.05"
                              value={variant.originalPrice}
                              onChange={(e) => handleUpdateVariation(vIdx, 'originalPrice', e.target.value)}
                              placeholder="مثال: 9.00"
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">صورة هذا الحجم المخصصة</label>
                            <ImageUploader
                              value={variant.imageUrl}
                              onChange={(url) => handleUpdateVariation(vIdx, 'imageUrl', url)}
                              label=""
                              helperText="اختياري (لو ترك فارغ سيأخذ صورة المنتج الرئيسية)"
                              aspectRatio="square"
                            />
                          </div>
                        </div>

                        {/* Variant Row 3: Descriptions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">وصف هذا الحجم (عربي)</label>
                            <input
                              type="text"
                              value={variant.descriptionAr}
                              onChange={(e) => handleUpdateVariation(vIdx, 'descriptionAr', e.target.value)}
                              placeholder="وصف خاص بهذا الحجم إن وجد..."
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-arabic"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">وصف هذا الحجم (إنجليزي)</label>
                            <input
                              type="text"
                              value={variant.descriptionEn}
                              onChange={(e) => handleUpdateVariation(vIdx, 'descriptionEn', e.target.value)}
                              placeholder="English variant description..."
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Feedback Message */}
              {feedback && (
                <div
                  className={'p-3 rounded-xl text-xs font-bold flex items-center gap-2 ' + (
                    feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  )}
                >
                  {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-[#0066b2] hover:bg-[#005594] text-white font-bold px-6 py-2 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitLoading ? (
                    'جاري الحفظ...'
                  ) : editingProduct ? (
                    <>
                      <Check className="w-4 h-4" /> حفظ التعديلات
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> إضافة المنتج
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
