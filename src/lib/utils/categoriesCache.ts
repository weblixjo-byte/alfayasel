import { INITIAL_CATEGORIES, CategoryData } from '@/lib/data/products';

let inMemoryCategories: CategoryData[] | null = null;
let pendingPromise: Promise<CategoryData[]> | null = null;

export async function getCachedCategories(): Promise<CategoryData[]> {
  if (inMemoryCategories) {
    return inMemoryCategories;
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('alfayasel_categories_cache');
      if (stored) {
        inMemoryCategories = JSON.parse(stored);
        return inMemoryCategories!;
      }
    } catch {
      // Ignore sessionStorage read errors
    }
  }

  if (pendingPromise) {
    return pendingPromise;
  }

  pendingPromise = fetch('/api/categories')
    .then((res) => res.json())
    .then((data) => {
      if (data.categories && data.categories.length > 0) {
        const raw = data.categories;
        const parents = raw.filter((c: any) => !c.parentSlug);
        const subcats = raw.filter((c: any) => c.parentSlug);

        const formatted: CategoryData[] = parents.map((p: any) => ({
          id: p._id,
          name: p.name,
          slug: p.slug,
          description: p.description || { en: '', ar: '' },
          icon: p.icon || 'Package',
          image: p.image || '/images/categories/default.png',
          subcategories: subcats
            .filter((s: any) => s.parentSlug === p.slug)
            .map((s: any) => ({
              id: s._id,
              name: s.name,
              slug: s.slug,
              description: s.description || { en: '', ar: '' },
            })),
        }));

        inMemoryCategories = formatted;
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem('alfayasel_categories_cache', JSON.stringify(formatted));
          } catch {
            // Ignore sessionStorage write errors
          }
        }
        return formatted;
      }
      return INITIAL_CATEGORIES;
    })
    .catch(() => INITIAL_CATEGORIES)
    .finally(() => {
      pendingPromise = null;
    });

  return pendingPromise;
}
