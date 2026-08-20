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
    inStock: true,
    isNewArrival: false,
    isFeatured: false,
    isTopSeller: false,
  });

  // Variations list state
  const [variationsList, setVariationsList] = useState<AdminVariationForm[]>([]);

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
    if (confirm('Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø±ØºØ¨ØªÙƒ ÙÙŠ Ø­Ø°Ù Ù‡Ø°Ø§ Ø§Ù„Ù…Ù†ØªØ¬ Ù†Ù‡Ø§Ø¦ÙŠØ§Ù‹ØŸ')) {
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
    const initialSku = `ALF-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      sku: initialSku,
      nameEn: '',
      nameAr: '',
      price: '10.00',
      categorySlug: categories[0]?.slug || 'hair-care-product',
      descriptionEn: '',
      descriptionAr: '',
      imageUrl: '',
      inStock: true,
      isNewArrival: true,
      isFeatured: false,
      isTopSeller: false,
    });
    setVariationsList([]);
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

    if (product.variations && product.variations.length > 0) {
      setVariationsList(
        product.variations.map((v: any) => ({
          id: Math.random().toString(),
          sku: v.sku || '',
          nameAr: v.name?.ar || '',
          nameEn: v.name?.en || '',
          price: v.price?.toString() || '',
          originalPrice: v.originalPrice ? v.originalPrice.toString() : '',
          stockQuantity: (v.stockQuantity || 50).toString(),
          inStock: v.inStock !== false,
          descriptionAr: v.description?.ar || '',
          descriptionEn: v.description?.en || '',
          imageUrl: v.images && v.images.length > 0 ? v.images[0] : '',
        }))
      );
    } else {
      setVariationsList([]);
    }

    setIsModalOpen(true);
  };

  // Variations handlers
  const handleAddVariation = () => {
    const newIdx = variationsList.length + 1;
    const baseSku = formData.sku.trim() || 'ALF';
    setVariationsList([
      ...variationsList,
      {
        id: Math.random().toString(),
        sku: `${baseSku}-VAR-${newIdx}`,
        nameAr: '',
        nameEn: '',
        price: formData.price || '10.00',
        originalPrice: '',
        stockQuantity: '50',
        inStock: true,
        descriptionAr: '',
        descriptionEn: '',
        imageUrl: '',
      },
    ]);
  };

  const handleUpdateVariation = (index: number, field: keyof AdminVariationForm, value: any) => {
    setVariationsList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveVariation = (index: number) => {
    setVariationsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map variations
    const mappedVariations = variationsList
      .filter((v) => v.nameAr.trim() || v.nameEn.trim() || v.sku.trim())
      .map((v) => ({
        sku: v.sku.trim() || `${formData.sku}-${(v.nameEn || 'var').toLowerCase().replace(/\s+/g, '-')}`,
        name: {
          en: v.nameEn.trim() || v.nameAr.trim(),
          ar: v.nameAr.trim() || v.nameEn.trim(),
        },
        price: parseFloat(v.price) || parseFloat(formData.price) || 0,
        originalPrice: v.originalPrice ? parseFloat(v.originalPrice) : undefined,
        description: {
          en: v.descriptionEn.trim(),
          ar: v.descriptionAr.trim(),
        },
        images: v.imageUrl.trim() ? [v.imageUrl.trim()] : [],
        inStock: v.inStock,
        stockQuantity: parseInt(v.stockQuantity) || 50,
      }));

    const payload: any = {
      sku: formData.sku,
      name: { en: formData.nameEn, ar: formData.nameAr },
      slug: editingProduct
        ? editingProduct.slug
        : formData.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
      description: { en: formData.descriptionEn, ar: formData.descriptionAr },
      usage: { en: formData.descriptionEn, ar: formData.descriptionAr },
      price: parseFloat(formData.price) || 10.0,
      categorySlug: formData.categorySlug,
      images: formData.imageUrl ? [formData.imageUrl] : [],
      inStock: formData.inStock,
      stockQuantity: editingProduct ? editingProduct.stockQuantity : 50,
      isNewArrival: formData.isNewArrival,
      isFeatured: formData.isFeatured,
      isTopSeller: formData.isTopSeller,
      variations: mappedVariations,
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
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª (Products)</h1>
          <p className="text-xs text-gray-500 mt-1">Ø¥Ø¶Ø§ÙØ©ØŒ ØªØ¹Ø¯ÙŠÙ„ØŒ Ø­Ø°ÙØŒ ÙˆØ¥Ø¯Ø§Ø±Ø© Ø£Ø­Ø¬Ø§Ù… ÙˆØ®ÙŠØ§Ø±Ø§Øª Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª ÙˆØ§Ù„Ù€ SEO</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="bg-[#0066b2] hover:bg-[#005594] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬ Ø¬Ø¯ÙŠØ¯ (Add Product)</span>
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
            placeholder="Ø§Ù„Ø¨Ø­Ø« Ø¨Ø§Ø³Ù… Ø§Ù„Ù…Ù†ØªØ¬ Ø£Ùˆ Ø±Ù…Ø² SKU..."
            className="w-full px-3.5 py-2 ps-9 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">Ø¬Ø§Ø±ÙŠ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">
            Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù†ØªØ¬Ø§Øª Ù…Ø³Ø¬Ù„Ø© Ø­Ø§Ù„ÙŠØ§Ù‹. Ø§Ø¶ØºØ· Ø¹Ù„Ù‰ Ø²Ø± Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬ Ø¬Ø¯ÙŠØ¯ Ù„Ù„Ø¨Ø¯Ø¡!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Ø§Ù„Ù…Ù†ØªØ¬ (Product)</th>
                  <th className="p-4">Ø§Ù„Ø±Ù…Ø² (SKU)</th>
                  <th className="p-4">Ø§Ù„Ù‚Ø³Ù… (Category)</th>
                  <th className="p-4">Ø§Ù„Ø£Ø­Ø¬Ø§Ù… (Variations)</th>
                  <th className="p-4">Ø§Ù„Ø³Ø¹Ø± (JOD)</th>
                  <th className="p-4">Ø§Ù„Ø­Ø§Ù„Ø©</th>
                  <th className="p-4 text-end">Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª</th>
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
                          {product.variations.length} Ø£Ø­Ø¬Ø§Ù… / Ø®ÙŠØ§Ø±Ø§Øª
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Ø­Ø¬Ù… Ø±Ø¦ÙŠØ³ÙŠ ÙˆØ§Ø­Ø¯</span>
                      )}
                    </td>

                    <td className="p-4 font-bold text-brand-600">{product.price.toFixed(2)} Ø¯.Ø£</td>

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
                            <span>Ù…ÙˆÙ‚Ù (Paused)</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3 h-3" />
                            <span>Ù†Ø´Ø· (Active)</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-4 text-end space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-1.5 text-gray-600 hover:text-brand-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ù…Ù†ØªØ¬"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Ø­Ø°Ù Ø§Ù„Ù…Ù†ØªØ¬"
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
                  {editingProduct ? 'ØªØ¹Ø¯ÙŠÙ„ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ù†ØªØ¬ ÙˆØ§Ù„Ø£Ø­Ø¬Ø§Ù…' : 'Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬ Ø¬Ø¯ÙŠØ¯ Ù…Ø¹ Ø§Ù„Ø£Ø­Ø¬Ø§Ù…'}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Ø£Ø¯Ø®Ù„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© ÙˆØ§Ù„Ø£Ø­Ø¬Ø§Ù… Ø§Ù„Ù…ØªÙˆÙØ±Ø© ÙˆØ§Ù„Ø£Ø³Ø¹Ø§Ø±</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Row 1: SKU & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ø±Ù…Ø² Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„ÙØ±ÙŠØ¯ (SKU) *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black font-mono"
                  />
                  <p className="text-[9px] text-gray-400 mt-0.5">Ø±Ù…Ø² ÙØ±ÙŠØ¯ Ù„ÙƒÙ„ Ù…Ù†ØªØ¬ Ù„Ø±Ø¨Ø·Ù‡ Ø¨Ø§Ù„Ù€ SEO ÙˆØ§Ù„Ø·Ù„Ø¨Ø§Øª</p>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ø§Ù„Ø³Ø¹Ø± Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ Ø¨Ø§Ù„Ø¯ÙŠÙ†Ø§Ø± Ø§Ù„Ø£Ø±Ø¯Ù†ÙŠ (Price JOD) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Ù…Ø«Ø§Ù„: 5.50"
                  />
                  <p className="text-[9px] text-gray-400 mt-0.5">Ø§Ù„Ø³Ø¹Ø± Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠ Ù„Ù„Ù…Ù†ØªØ¬ Ø¨Ø§Ù„Ø¯ÙŠÙ†Ø§Ø± Ø§Ù„Ø£Ø±Ø¯Ù†ÙŠ</p>
                </div>
              </div>

              {/* Row 2: Names AR & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ø§Ø³Ù… Ø§Ù„Ù…Ù†ØªØ¬ Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© (Arabic Name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-arabic"
                    placeholder="Ù…Ø«Ø§Ù„: Ø¨ÙŠ ÙƒÙ„ÙŠÙ† Ø¬Ù„ Ù…Ø¹Ù‚Ù…"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ø§Ø³Ù… Ø§Ù„Ù…Ù†ØªØ¬ Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© (English Name) *</label>
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
                  <label className="font-bold text-gray-700 block mb-1">Ø§Ù„Ù‚Ø³Ù… Ø§Ù„ØªØ§Ø¨Ø¹ Ù„Ù‡ Ø§Ù„Ù…Ù†ØªØ¬ (Category) *</label>
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
                    label="ØµÙˆØ±Ø© Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© (Main Image)"
                    helperText="Ø§Ø®ØªØ± ØµÙˆØ±Ø© Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ù† Ø¬Ù‡Ø§Ø²Ùƒ Ø£Ùˆ Ù…ÙˆØ¨Ø§ÙŠÙ„Ùƒ (JPG, PNG, WebP)"
                    aspectRatio="square"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Descriptions AR & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ø§Ù„ÙˆØµÙ Ø§Ù„Ø¹Ø§Ù… Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© (Main Description AR)</label>
                  <textarea
                    rows={3}
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black font-arabic leading-relaxed"
                    placeholder="ØªÙØ§ØµÙŠÙ„ ÙˆØ´Ø±Ø­ Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„Ø¹Ø§Ù… Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ù„Ù„Ø²Ø¨Ø§Ø¦Ù†..."
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ø§Ù„ÙˆØµÙ Ø§Ù„Ø¹Ø§Ù… Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© (Main Description EN)</label>
                  <textarea
                    rows={3}
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-black leading-relaxed"
                    placeholder="English general description details..."
                  />
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SECTION: PRODUCT VARIATIONS & SIZES                   */}
              {/* ---------------------------------------------------- */}
              <div className="border-2 border-blue-100 bg-blue-50/40 rounded-2xl p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5">
                      <span>ðŸ§´</span> Ø®ÙŠØ§Ø±Ø§Øª ÙˆØ£Ø­Ø¬Ø§Ù… Ø§Ù„Ù…Ù†ØªØ¬ (Product Variations & Sizes)
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Ø£Ø¶Ù Ø£Ø­Ø¬Ø§Ù… Ù…Ø®ØªÙ„ÙØ© Ù„Ù†ÙØ³ Ø§Ù„Ù…Ù†ØªØ¬ (Ù…Ø«Ø§Ù„: 500 Ù…Ù„ØŒ 1 Ù„ØªØ±ØŒ 5 Ù„ØªØ±) Ù…Ø¹ Ø³Ø¹Ø± Ù…Ø®ØµØµ ÙˆÙˆØµÙ Ù…Ø³ØªÙ‚Ù„ Ù„ÙƒÙ„ Ø­Ø¬Ù…
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariation}
                    className="bg-[#0066b2] hover:bg-[#005594] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ø¥Ø¶Ø§ÙØ© Ø­Ø¬Ù… / Ø®ÙŠØ§Ø± Ø¬Ø¯ÙŠØ¯
                  </button>
                </div>

                {variationsList.length === 0 ? (
                  <div className="text-center py-4 bg-white/70 rounded-xl border border-dashed border-gray-300 text-gray-500 text-[11px]">
                    Ø§Ù„Ù…Ù†ØªØ¬ Ø­Ø§Ù„ÙŠØ§Ù‹ Ø¨Ø­Ø¬Ù… ÙˆØ³Ø¹Ø± ÙˆØ§Ø­Ø¯ ÙÙ‚Ø·. Ø§Ø¶ØºØ· Ø¹Ù„Ù‰ Ø²Ø± <strong className="text-blue-700">&quot;Ø¥Ø¶Ø§ÙØ© Ø­Ø¬Ù… / Ø®ÙŠØ§Ø± Ø¬Ø¯ÙŠØ¯&quot;</strong> Ø¥Ø°Ø§ ÙƒØ§Ù† Ù„Ù„Ù…Ù†ØªØ¬ Ø£Ø­Ø¬Ø§Ù… Ù…ØªØ¹Ø¯Ø¯Ø©.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {variationsList.map((variant, vIdx) => (
                      <div key={variant.id} className="bg-white border border-blue-200/80 rounded-2xl p-3.5 shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="font-extrabold text-xs text-[#0066b2] flex items-center gap-1">
                            <span>ðŸ“¦</span> Ø§Ù„Ø®ÙŠØ§Ø± #{vIdx + 1}: {variant.nameAr || variant.nameEn || 'Ø­Ø¬Ù… Ø¬Ø¯ÙŠØ¯'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariation(vIdx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Ø­Ø°Ù Ø§Ù„Ø®ÙŠØ§Ø±
                          </button>
                        </div>

                        {/* Variant Row 1: Names & SKU */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">Ø§Ù„Ø§Ø³Ù… / Ø§Ù„Ø­Ø¬Ù… Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© *</label>
                            <input
                              type="text"
                              required
                              value={variant.nameAr}
                              onChange={(e) => handleUpdateVariation(vIdx, 'nameAr', e.target.value)}
                              placeholder="Ù…Ø«Ø§Ù„: 500 Ù…Ù„ Ø£Ùˆ 1 Ù„ØªØ± Ø£Ùˆ Ø¬Ø§Ù„ÙˆÙ† 5 Ù„ØªØ±"
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-arabic"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">Ø§Ù„Ø§Ø³Ù… / Ø§Ù„Ø­Ø¬Ù… Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© *</label>
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
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">Ø±Ù…Ø² Ø§Ù„Ø®ÙŠØ§Ø± Ø§Ù„ÙØ±ÙŠØ¯ (SKU) *</label>
                            <input
                              type="text"
                              required
                              value={variant.sku}
                              onChange={(e) => handleUpdateVariation(vIdx, 'sku', e.target.value)}
                              className="w-full px-2.5 py-1.5 border rounded-lg font-mono text-xs bg-gray-50"
                              placeholder="Ù…Ø«Ø§Ù„: ALF-101-500ML"
                            />
                          </div>
                        </div>

                        {/* Variant Row 2: Prices & Image */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">Ø³Ø¹Ø± Ù‡Ø°Ø§ Ø§Ù„Ø­Ø¬Ù… (JOD) *</label>
                            <input
                              type="number"
                              step="0.05"
                              required
                              value={variant.price}
                              onChange={(e) => handleUpdateVariation(vIdx, 'price', e.target.value)}
                              placeholder="5.50"
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">Ø§Ù„Ø³Ø¹Ø± Ù‚Ø¨Ù„ Ø§Ù„Ø®ØµÙ… (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)</label>
                            <input
                              type="number"
                              step="0.05"
                              value={variant.originalPrice}
                              onChange={(e) => handleUpdateVariation(vIdx, 'originalPrice', e.target.value)}
                              placeholder="7.00"
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <ImageUploader
                              value={variant.imageUrl}
                              onChange={(url) => handleUpdateVariation(vIdx, 'imageUrl', url)}
                              label="ØµÙˆØ±Ø© Ø®Ø§ØµØ© Ø¨Ø§Ù„Ø­Ø¬Ù… (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)"
                              helperText="Ø§ØªØ±ÙƒÙ‡Ø§ ÙØ§Ø±ØºØ© Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„ØµÙˆØ±Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©"
                              aspectRatio="square"
                            />
                          </div>
                        </div>

                        {/* Variant Row 3: Custom Descriptions per Variation */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">
                              ÙˆØµÙ Ø®Ø§Øµ Ø¨Ù‡Ø°Ø§ Ø§Ù„Ø­Ø¬Ù… Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)
                            </label>
                            <textarea
                              rows={2}
                              value={variant.descriptionAr}
                              onChange={(e) => handleUpdateVariation(vIdx, 'descriptionAr', e.target.value)}
                              placeholder="ÙˆØµÙ ØªÙØµÙŠÙ„ÙŠ Ø®Ø§Øµ Ø¨Ù‡Ø°Ø§ Ø§Ù„Ø­Ø¬Ù…... (Ø¥Ø°Ø§ ØªØ±ÙƒØªÙ‡ ÙØ§Ø±ØºØ§Ù‹ Ø³ÙŠØªÙ… Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„ÙˆØµÙ Ø§Ù„Ø¹Ø§Ù…)"
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-arabic leading-relaxed"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block mb-0.5 text-[10px]">
                              ÙˆØµÙ Ø®Ø§Øµ Ø¨Ù‡Ø°Ø§ Ø§Ù„Ø­Ø¬Ù… Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)
                            </label>
                            <textarea
                              rows={2}
                              value={variant.descriptionEn}
                              onChange={(e) => handleUpdateVariation(vIdx, 'descriptionEn', e.target.value)}
                              placeholder="Custom description for this size... (fallback to main description if empty)"
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tab Visibility Flags */}
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-2 my-2">
                <span className="font-bold text-gray-700 block mb-1 text-[10px] uppercase tracking-wider">
                  Ø¹Ø±Ø¶ Ø§Ù„Ù…Ù†ØªØ¬ ÙÙŠ Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© (Home Showcase):
                </span>
                <div className="flex flex-wrap gap-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span>Ø¬Ø¯ÙŠØ¯Ù†Ø§ (New Arrivals)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span>Ù…Ù…ÙŠØ² (Featured)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isTopSeller}
                      onChange={(e) => setFormData({ ...formData, isTopSeller: e.target.checked })}
                      className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span>Ø§Ù„Ø§ÙƒØ«Ø± Ù…Ø¨ÙŠØ¹Ø§Ù‹ (Top Sellers)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-colors"
                >
                  Ø¥Ù„ØºØ§Ø¡ (Cancel)
                </button>
                <button
                  type="submit"
                  className="bg-[#0066b2] hover:bg-[#005594] text-white font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-md"
                >
                  {editingProduct ? 'Ø­ÙØ¸ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª (Save Product)' : 'Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ù…Ù†ØªØ¬ (Create Product)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

