'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash, X, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories';

interface CategoryData {
  _id: string;
  slug: string;
  name: { en: string; ar: string };
  description?: { en: string; ar: string };
  parentSlug?: string;
  order: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  const [formData, setFormData] = useState({
    slug: '',
    nameEn: '',
    nameAr: '',
    descEn: '',
    descAr: '',
    parentSlug: '',
    order: 0,
  });

  const [error, setError] = useState('');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [success, setSuccess] = useState('');

  // Fetch categories on mount
  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Set form data when editing
  const handleEdit = (cat: CategoryData) => {
    setEditingCategory(cat);
    setFormData({
      slug: cat.slug,
      nameEn: cat.name.en,
      nameAr: cat.name.ar,
      descEn: cat.description?.en || '',
      descAr: cat.description?.ar || '',
      parentSlug: cat.parentSlug || '',
      order: cat.order || 0,
    });
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      slug: '',
      nameEn: '',
      nameAr: '',
      descEn: '',
      descAr: '',
      parentSlug: '',
      order: categories.length + 1,
    });
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    const res = await deleteCategory(id);
    if (res.success) {
      setSuccess('Category deleted successfully!');
      fetchCategories();
    } else {
      setError(res.error || 'Failed to delete category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.slug.trim() || !formData.nameEn.trim() || !formData.nameAr.trim()) {
      setError('Please fill in slug and both bilingual names');
      return;
    }

    const payload = {
      slug: formData.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      name: {
        en: formData.nameEn.trim(),
        ar: formData.nameAr.trim(),
      },
      description: {
        en: formData.descEn.trim(),
        ar: formData.descAr.trim(),
      },
      parentSlug: formData.parentSlug || undefined,
      order: 0,
      };

    if (editingCategory) {
      const res = await updateCategory(editingCategory._id, payload);
      if (res.success) {
        setSuccess('Category updated successfully!');
        setIsModalOpen(false);
        fetchCategories();
      } else {
        setError(res.error || 'Failed to update category');
      }
    } else {
      const res = await createCategory(payload);
      if (res.success) {
        setSuccess('Category created successfully!');
        setIsModalOpen(false);
        fetchCategories();
      } else {
        setError(res.error || 'Failed to create category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Categories & Subcategories</h1>
          <p className="text-xs text-gray-500 mt-1">Manage parent-child catalog groupings</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-black text-white hover:bg-gray-800 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Notifications */}
      {error && <div className="p-3.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg border border-red-200">{error}</div>}
      {success && <div className="p-3.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200">{success}</div>}

      {/* List Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">Loading categories catalog...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">No categories found. Start by adding one!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Category Name (AR / EN)</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Parent Category</th>
                                    <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {categories.map((cat) => {
                  const parent = categories.find((c) => c.slug === cat.parentSlug);
                  return (
                    <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-gray-900">{cat.name.ar}</div>
                          <div className="text-gray-400">{cat.name.en}</div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-gray-500">{cat.slug}</td>
                      <td className="p-4">
                        {parent ? (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
                            {parent.name.ar} ({parent.slug})
                          </span>
                        ) : (
                          <span className="text-gray-300 font-normal">— Primary Parent</span>
                        )}
                      </td>
                                            <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-lg shadow-xl overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-sm text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">الاسم بالعربية (Arabic Name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="مثال: العناية بالبشرة"
                  />
                  
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">الاسم بالإنجليزي (English Name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        nameEn: val,
                        slug: editingCategory
                          ? formData.slug
                          : val.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
                      });
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Example: Skin Care"
                  />
                  
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">الرابط الفريد (Slug) *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-black font-mono"
                  placeholder="skin-care-product"
                  disabled={!!editingCategory}
                />
                
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">القسم الرئيسي (Parent Category)</label>
                  <select
                    value={formData.parentSlug}
                    onChange={(e) => setFormData({ ...formData, parentSlug: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  >
                    <option value="">-- بدون (هذا قسم رئيسي) --</option>
                    {categories
                      .filter((c) => c._id !== editingCategory?._id && !c.parentSlug)
                      .map((c) => (
                        <option key={c._id} value={c.slug}>
                          {c.name.ar} ({c.name.en})
                        </option>
                      ))}
                  </select>
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">شرح القسم بالعربية (Arabic Description)</label>
                  <textarea
                    value={formData.descAr}
                    onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-black h-20 resize-none"
                    placeholder="وصف القسم بالتفصيل..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">شرح القسم بالإنجليزي (English Description)</label>
                  <textarea
                    value={formData.descEn}
                    onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-black h-20 resize-none"
                    placeholder="English description..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-150 text-gray-700 hover:bg-gray-200 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                >
                  إلغاء (Cancel)
                </button>
                <button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
                >
                  {editingCategory ? 'حفظ التعديلات (Save Changes)' : 'إنشاء القسم (Create Category)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
