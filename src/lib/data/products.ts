export interface LocalizedText {
  en: string;
  ar: string;
}

export interface SubCategory {
  slug: string;
  name: LocalizedText;
}

export interface CategoryData {
  slug: string;
  name: LocalizedText;
  icon?: string;
  subcategories: SubCategory[];
}

export interface VariationData {
  sku: string;
  price: number;
  originalPrice?: number;
  images: string[];
  attributes: Record<string, string>;
  inStock: boolean;
  stockQuantity: number;
  name?: LocalizedText;
}

export interface ProductData {
  id: string;
  sku: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  usage: LocalizedText;
  price: number;
  originalPrice?: number;
  categorySlug: string;
  categoryName: LocalizedText;
  subCategorySlug?: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isTopSeller?: boolean;
  isPaused?: boolean;
  rating: number;
  reviewCount: number;
  variations?: VariationData[];
}

export const INITIAL_CATEGORIES: CategoryData[] = [
  {
    slug: 'hair-care-product',
    name: { en: 'Hair care product', ar: 'منتجات العناية بالشعر' },
    subcategories: [
      { slug: 'tricho-cream', name: { en: 'Tricho cream', ar: 'ترايكو كريم' } },
      { slug: 'activita-os-hair-oil', name: { en: "Activita o's hair oil", ar: 'زيت أكتيفيتا أوز للشعر' } },
      { slug: 'alfatar-shampoo', name: { en: 'Alfatar shampoo', ar: 'الفاتار شامبو' } },
      { slug: 'alfatar-shampoo-conditioner', name: { en: 'Alfatar shampoo & conditioner', ar: 'الفاتار شامبو وبلسم' } },
    ],
  },
  {
    slug: 'skin-care-product',
    name: { en: 'Skin care product', ar: 'منتجات العناية بالبشرة' },
    subcategories: [
      { slug: 'clean-face-cleansing-cream', name: { en: 'Clean face cleansing cream', ar: 'كلين فيس كريم تنظيف البشرة' } },
      { slug: 'clean-face-acne-cream', name: { en: 'Clean face acne cream', ar: 'كلين فيس كريم لعلاج حب الشباب' } },
      { slug: 'ss4-cream', name: { en: 'SS4 Cream', ar: 'إس إس 4 كريم' } },
      { slug: 'urelol-lotion', name: { en: 'Urelol lotion', ar: 'يوريلول لوشن' } },
      { slug: 'urelol-cream', name: { en: 'Urelol cream', ar: 'يوريلول كريم' } },
      { slug: 'emulene-cream-jar', name: { en: 'Emulene cream jar', ar: 'إيمولين كريم مرطبان' } },
      { slug: 'emulene-cream-tube', name: { en: 'Emulene cream tube', ar: 'إيمولين كريم تيوب' } },
      { slug: 'alfarep', name: { en: 'Alfarep', ar: 'الفاريب بخاخ حشرات' } },
      { slug: 'argentum', name: { en: 'Argentum', ar: 'أرجينتوم' } },
      { slug: 'vaginal-douche', name: { en: 'Vaginal douche', ar: 'دوش مهبلي' } },
    ],
  },
  {
    slug: 'cutell-family',
    name: { en: 'Cutell family', ar: 'عائلة كيوتيل' },
    subcategories: [
      { slug: 'cutell-hand-cream', name: { en: 'Cutell hand cream', ar: 'كيوتيل كريم اليدين' } },
      { slug: 'cutell-foot-cream', name: { en: 'Cutell foot cream', ar: 'كيوتيل كريم القدمين' } },
      { slug: 'cutell-excessive-dryness', name: { en: 'Cutell excessive dryness cream', ar: 'كيوتيل كريم الجفاف الشديد' } },
      { slug: 'cutell-whitening', name: { en: 'Cutell whitening cream', ar: 'كيوتيل كريم التبييض' } },
      { slug: 'cutell-sunblock-50', name: { en: 'Cutell sunblock 50+', ar: 'كيوتيل واقي شمس 50+' } },
      { slug: 'cutell-sunblock-35', name: { en: 'Cutell sunblock 35+', ar: 'كيوتيل واقي شمس 35+' } },
      { slug: 'cutell-muscle-cream', name: { en: 'Cutell muscle cream', ar: 'كيوتيل كريم العضلات' } },
    ],
  },
  {
    slug: 'mums-and-babies',
    name: { en: 'Mums and babies', ar: 'الأم والطفل' },
    subcategories: [
      { slug: 'stretch-marks-cream', name: { en: 'Stretch marks cream', ar: 'كريم علامات التمدد' } },
      { slug: 'nappy-rash-cream', name: { en: 'Nappy rash cream', ar: 'كريم تسلخات الحفاض' } },
      { slug: 'nipple-cream', name: { en: 'Nipple cream', ar: 'كريم تشققات الحلمة' } },
    ],
  },
  {
    slug: 'personal-lubricant',
    name: { en: 'Personal lubricant', ar: 'المزلقات الشخصية' },
    subcategories: [
      { slug: 'cutell-personal-lubricant', name: { en: 'Cutell personal lubricant', ar: 'كيوتيل مزلق شخصي' } },
    ],
  },
  {
    slug: 'be-clean-products',
    name: { en: 'Be clean products', ar: 'منتجات التطهير والنظافة' },
    subcategories: [
      { slug: 'be-clean-hand-sanitizer', name: { en: 'Be clean hand sanitizer', ar: 'بي كلين مطهر اليدين' } },
      { slug: 'be-clean-surface-disinfectant', name: { en: 'Be clean surface disinfectant', ar: 'بي كلين مطهر الاسطح' } },
    ],
  },
  {
    slug: 'paramedical-product',
    name: { en: 'paramedical product', ar: 'المنتجات الطبية المساندة' },
    subcategories: [
      { slug: 'instrument-sterilizer', name: { en: 'Instrument sterilizer solution', ar: 'محلول تعقيم الأدوات' } },
    ],
  },
  {
    slug: 'ultra-sound-gel',
    name: { en: 'Ultra sound gel', ar: 'جل الألتراساوند' },
    subcategories: [
      { slug: 'blue-scan-ultrasound-gel', name: { en: 'Blue scan ultra sound gel', ar: 'بلو سكان جل الألتراساوند' } },
    ],
  },
];

export const INITIAL_PRODUCTS: ProductData[] = [
  {
    id: 'tricho-cream',
    sku: 'ALF-HC-001',
    slug: 'tricho-cream',
    name: {
      en: 'Tricho Cream',
      ar: 'ترايكو كريم لمكافحة تساقط الشعر',
    },
    description: {
      en: 'Hair loss is one of the most popular hair problems for everyone. Tricho Cream contains active complex nutrients that stop hair loss, maintain hair follicles, and rebuild strong hair strands.',
      ar: 'تساقط الشعر من أكثر مشاكل الشعر شيوعاً. يحتوي ترايكو كريم على تركيبة مغذية متطورة تعمل على إيقاف تساقط الشعر، حماية البصيلات وإعادة بناء الشعر القوي والحيوي.',
    },
    usage: {
      en: 'Apply a suitable amount to dry or towel-dried scalp twice daily. Massage gently with fingertips.',
      ar: 'يوضع مقدار كافٍ على فروة الرأس الجافة أو الرطبة مرتين يومياً، مع التدليك اللطيف بأطراف الأصابع.',
    },
    price: 15.60,
    originalPrice: 18.00,
    categorySlug: 'hair-care-product',
    categoryName: { en: 'Hair care product', ar: 'منتجات العناية بالشعر' },
    subCategorySlug: 'tricho-cream',
    images: ['/images/slider-3-600x472.jpg'],
    inStock: true,
    stockQuantity: 45,
    isNewArrival: true,
    isFeatured: true,
    isTopSeller: true,
    rating: 4.9,
    reviewCount: 28,
  },
  {
    id: 'activita-os-hair-oil',
    sku: 'ALF-HC-002',
    slug: 'activita-os-hair-oil',
    name: {
      en: "Activita O'S Hair Oil",
      ar: 'زيت أكتيفيتا أوز للشعر',
    },
    description: {
      en: "Activita O'S is a natural herbal hair oil enriched with vital botanical oils to nourish, strengthen, and impart natural radiance to dull hair.",
      ar: 'أكتيفيتا أوز هو زيت شعر طبيعي غني بالمستخلصات الزيتية الطبيعية لترطيب وتقوية الشعر ومنحه اللمعان والحيوية.',
    },
    usage: {
      en: 'Apply to hair roots and lengths 30 minutes before washing, or use a few drops as a daily leave-in serum.',
      ar: 'يوضع على جذور وأطراف الشعر قبل الغسيل بـ 30 دقيقة، أو تُستخدم قطرات قليلة منه كبديل للسيروم اليومي.',
    },
    price: 3.40,
    categorySlug: 'hair-care-product',
    categoryName: { en: 'Hair care product', ar: 'منتجات العناية بالشعر' },
    subCategorySlug: 'activita-os-hair-oil',
    images: ['/images/slider-1-600x472.jpg'],
    inStock: true,
    stockQuantity: 100,
    isNewArrival: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 19,
  },
  {
    id: 'alfatar-shampoo',
    sku: 'ALF-HC-003',
    slug: 'alfatar-shampoo',
    name: {
      en: 'Alfatar Shampoo (1% Pine Tar)',
      ar: 'الفاتار شامبو ضد القشرة (1% قطران شجر الصنوبر)',
    },
    description: {
      en: 'Specialized antidandruff shampoo formulated with 1% Pine Tar to effectively relieve severe dandruff, scalp itching, and psoriasis symptoms.',
      ar: 'شامبو طبي متخصص لمكافحة القشرة يحتوي على 1% قطران شجر الصنوبر الطبيعي لتهدئة حكة الفروة والقضاء على القشرة المستعصية.',
    },
    usage: {
      en: 'Apply to wet scalp, lather well, leave on for 3 minutes, then rinse thoroughly. Use 2-3 times weekly.',
      ar: 'يوضع على شعر رطب، يُدلك حتى تظهر الرغوة، يترك لـ 3 دقائق ثم يشطف جيداً. يستخدم 2-3 مرات أسبوعياً.',
    },
    price: 4.80,
    categorySlug: 'hair-care-product',
    categoryName: { en: 'Hair care product', ar: 'منتجات العناية بالشعر' },
    subCategorySlug: 'alfatar-shampoo',
    images: ['/images/slider-600x472.jpg'],
    inStock: true,
    stockQuantity: 60,
    isNewArrival: false,
    isFeatured: true,
    isTopSeller: true,
    rating: 4.9,
    reviewCount: 34,
  },
  {
    id: 'alfatar-shampoo-conditioner',
    sku: 'ALF-HC-004',
    slug: 'alfatar-shampoo-conditioner',
    name: {
      en: 'Alfatar Shampoo & Conditioner Set',
      ar: 'طقم الفاتار شامبو + بلسم',
    },
    description: {
      en: 'Complete therapeutic care bundle featuring Alfatar Antidandruff Shampoo and its hydrating Conditioner for silky, flake-free hair.',
      ar: 'مجموعة العناية المتكاملة من الفاتار شامبو ضد القشرة مع البلسم المرطب لضمان نظافة الفروة ونعومة الشعر.',
    },
    usage: {
      en: 'Wash with Alfatar Shampoo first, rinse, then apply Alfatar Conditioner to hair lengths for 2 minutes.',
      ar: 'يُغسل الشعر بالشامبو أولاً ثم يُشطف، ثم يوضع البلسم على أطراف الشعر لمدة دقيقتين ويشطف بالماء.',
    },
    price: 8.65,
    originalPrice: 10.50,
    categorySlug: 'hair-care-product',
    categoryName: { en: 'Hair care product', ar: 'منتجات العناية بالشعر' },
    subCategorySlug: 'alfatar-shampoo-conditioner',
    images: ['/images/slider-1-600x472.jpg'],
    inStock: true,
    stockQuantity: 30,
    isNewArrival: true,
    isTopSeller: true,
    rating: 5.0,
    reviewCount: 42,
  },
  {
    id: 'clean-face-cleansing-cream',
    sku: 'ALF-SC-001',
    slug: 'clean-face-cleansing-cream',
    name: {
      en: 'Clean Face Cleansing Cream',
      ar: 'كلين فيس كريم تنظيف البشرة',
    },
    description: {
      en: 'Deep pore facial cleansing cream designed to effectively remove makeup, excess oil, and impurities without stripping natural skin moisture.',
      ar: 'كريم منظف عميق لمسام الوجه يعمل على إزالة المكياج والشوائب والدهون الزائدة بفاعلية وبدون جفاف البشرة.',
    },
    usage: {
      en: 'Massage gently onto wet face in circular motions, then rinse with lukewarm water or wipe off with a soft tissue.',
      ar: 'يُدلك بحركات دائرية على الوجه الرطب ثم يُشطف بالماء الفاتر أو يُكفكف بمنديل ناعم.',
    },
    price: 11.10,
    categorySlug: 'skin-care-product',
    categoryName: { en: 'Skin care product', ar: 'منتجات العناية بالبشرة' },
    subCategorySlug: 'clean-face-cleansing-cream',
    images: ['/images/slider-1-600x472.jpg'],
    inStock: true,
    stockQuantity: 80,
    isNewArrival: false,
    isFeatured: true,
    isTopSeller: true,
    rating: 4.8,
    reviewCount: 51,
  },
  {
    id: 'clean-face-acne-cream',
    sku: 'ALF-SC-002',
    slug: 'clean-face-acne-cream',
    name: {
      en: 'Clean Face Acne Cream',
      ar: 'كلين فيس كريم لعلاج حب الشباب',
    },
    description: {
      en: 'Targeted anti-acne treatment that reduces breakouts, clears blackheads, calms inflammation, and regulates sebum production.',
      ar: 'كريم متطور لمقاومة حب الشباب والزيوان، يقلل الالتهابات وينظم إفراز الدهون ليمنحك بشرة صافية ومشرقة.',
    },
    usage: {
      en: 'Apply a thin layer to clean skin directly over affected areas once or twice daily.',
      ar: 'توضع طبقة رقيقة على البشرة النظيفة فوق المناطق المصابة بحب الشباب مرتين يومياً.',
    },
    price: 12.00,
    categorySlug: 'skin-care-product',
    categoryName: { en: 'Skin care product', ar: 'منتجات العناية بالبشرة' },
    subCategorySlug: 'clean-face-acne-cream',
    images: ['/images/slider-600x472.jpg'],
    inStock: true,
    stockQuantity: 40,
    isNewArrival: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 37,
  },
  {
    id: 'ss4-cream',
    sku: 'ALF-SC-003',
    slug: 'ss4-cream',
    name: {
      en: 'SS4 Cream (Simple Cream B.P.)',
      ar: 'إس إس 4 كريم مرطب عميق للبشرة الجافة',
    },
    description: {
      en: 'High-performance moisturizing emollient cream formulated for severe skin dryness, eczema, and flaky skin barrier recovery.',
      ar: 'كريم مرطب طبي متطور مخصص لحالات الجفاف الشديد والأكزيما لإعادة ترميم واستعادة حواجز البشرة الجافة والمتشققة.',
    },
    usage: {
      en: 'Apply liberally to affected dry skin areas as often as needed.',
      ar: 'يُدهن بوفرة على المناطق الجافة من الجلد حسب الحاجة وعند الشعور بالجفاف.',
    },
    price: 11.60,
    categorySlug: 'skin-care-product',
    categoryName: { en: 'Skin care product', ar: 'منتجات العناية بالبشرة' },
    subCategorySlug: 'ss4-cream',
    images: ['/images/slider-3-600x472.jpg'],
    inStock: true,
    stockQuantity: 75,
    isNewArrival: false,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 22,
  },
  {
    id: 'urelol-lotion-10',
    sku: 'ALF-SC-004',
    slug: 'urelol-lotion-10',
    name: {
      en: 'Urelol Lotion 10% Urea',
      ar: 'يوريلول لوشن 10% يوريا',
    },
    description: {
      en: 'Medical moisturizing lotion containing 1% to 10% Urea to smooth extremely dry, rough, and scaly skin across the body.',
      ar: 'لوشن طبي غني باليوريا 10% لترطيب وتنعيم البشرة شديدة الجفاف والمتقشرة في جميع مناطق الجسم.',
    },
    usage: {
      en: 'Apply to clean skin after showering or whenever skin feels dry.',
      ar: 'يدلك على البشرة النظيفة بعد الاستحمام أو عند الحاجة للترطيب الفائق.',
    },
    price: 9.50,
    categorySlug: 'skin-care-product',
    categoryName: { en: 'Skin care product', ar: 'منتجات العناية بالبشرة' },
    subCategorySlug: 'urelol-lotion',
    images: ['/images/slider-1-600x472.jpg'],
    inStock: true,
    stockQuantity: 50,
    isNewArrival: false,
    isFeatured: true,
    isTopSeller: true,
    rating: 4.8,
    reviewCount: 30,
  },
  {
    id: 'urelol-cream-10',
    sku: 'ALF-SC-005',
    slug: 'urelol-cream-10',
    name: {
      en: 'Urelol Cream 10% Urea',
      ar: 'يوريلول كريم 10% يوريا',
    },
    description: {
      en: 'Concentrated urea cream for targeted treatment of cracked heels, elbows, and dry skin plaques.',
      ar: 'كريم مركز باليوريا لعلاج تشققات القدمين والأكواع ومناطق الجفاف الشديد بفاعلية وسرعة.',
    },
    usage: {
      en: 'Rub gently into cracked or hardened skin areas twice daily.',
      ar: 'يُفرك بلطف على الكعبين أو الأكواع الجافة مرتين يومياً.',
    },
    price: 8.20,
    categorySlug: 'skin-care-product',
    categoryName: { en: 'Skin care product', ar: 'منتجات العناية بالبشرة' },
    subCategorySlug: 'urelol-cream',
    images: ['/images/slider-600x472.jpg'],
    inStock: true,
    stockQuantity: 65,
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 16,
  },
  {
    id: 'emulene-cream-tube',
    sku: 'ALF-SC-006',
    slug: 'emulene-cream-tube',
    name: {
      en: 'Emulene Cream 3 (Par Very Dry Skin)',
      ar: 'إيمولين 3 كريم للبشرة شديدة الجفاف',
    },
    description: {
      en: 'Specialized barrier repair moisturizing cream for dry, sensitive, and compromised skin conditions.',
      ar: 'كريم إيمولين 3 المخصص للترطيب الفائق للبشرة الحساسة والشديدة الجفاف، يعيد الحماية والرطوبة الطبيعية للجلد.',
    },
    usage: {
      en: 'Apply a generous layer onto dry skin areas 2-3 times daily.',
      ar: 'توضع كمية مناسبة على الجلد الجاف 2-3 مرات يومياً.',
    },
    price: 9.80,
    categorySlug: 'skin-care-product',
    categoryName: { en: 'Skin care product', ar: 'منتجات العناية بالبشرة' },
    subCategorySlug: 'emulene-cream-tube',
    images: ['/images/slider-3-600x472.jpg'],
    inStock: true,
    stockQuantity: 40,
    isNewArrival: false,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 29,
  },
  {
    id: 'alfarep-mosquito-repellent',
    sku: 'ALF-SC-007',
    slug: 'alfarep-mosquito-repellent',
    name: {
      en: 'Alfarep Mosquito Repellent',
      ar: 'الفاريب بخاخ طارد الناموس والحشرات',
    },
    description: {
      en: 'Safe and long-lasting insect repellent formula protecting skin against mosquitoes, flies, and insect bites.',
      ar: 'تركيبة آمنة وفعالة للحماية من لدغات الناموس والحشرات وتوفير الوقاية التامة في الرحلات والمنازل.',
    },
    usage: {
      en: 'Spray directly on exposed skin and clothing. Avoid eyes and broken skin.',
      ar: 'يرش على المناطق المكشوفة من الجلد والملابس من مسافة مناسبة مع تجنب ملامسة العينين.',
    },
    price: 4.20,
    categorySlug: 'skin-care-product',
    categoryName: { en: 'Skin care product', ar: 'منتجات العناية بالبشرة' },
    subCategorySlug: 'alfarep',
    images: ['/images/slider-1-600x472.jpg'],
    inStock: true,
    stockQuantity: 120,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 18,
  },
  {
    id: 'argentum-wart-remover',
    sku: 'ALF-SC-008',
    slug: 'argentum-wart-remover',
    name: {
      en: 'Argentum Wart Treatment',
      ar: 'أرجينتوم محلول علاج الثآليل',
    },
    description: {
      en: 'Targeted topical solution for effective removal of skin warts and calluses.',
      ar: 'محلول طبي موضعي فعال للتخلص من الثآليل والزوائد الجلدية بسرعة وأمان.',
    },
    usage: {
      en: 'Surround wart with petroleum jelly, apply 1 drop directly onto wart daily for up to 3 days.',
      ar: 'تحاط المنطقة بفازلين، ثم توضع قطرة واحدة مباشرة على الثؤلول مرة يومياً لمدة 3 أيام.',
    },
    price: 10.10,
    categorySlug: 'skin-care-product',
    categoryName: { en: 'Skin care product', ar: 'منتجات العناية بالبشرة' },
    subCategorySlug: 'argentum',
    images: ['/images/slider-600x472.jpg'],
    inStock: true,
    stockQuantity: 35,
    isNewArrival: false,
    rating: 4.7,
    reviewCount: 14,
  },
  {
    id: 'cutell-stretch-marks-cream',
    sku: 'ALF-MB-001',
    slug: 'cutell-stretch-marks-cream',
    name: {
      en: 'Cutell Stretch Marks Cream',
      ar: 'كيوتيل كريم علاج علامات تمدد الجلد',
    },
    description: {
      en: 'Formulated specifically for pregnant women and postpartum recovery to reduce stretch marks, improve skin elasticity, and restore firmness.',
      ar: 'كريم مخصص للحوامل ولمرحلة ما بعد الولادة لتقليل علامات التمدد وتحسين مرونة الجلد واستعادة نضارته.',
    },
    usage: {
      en: 'Massage twice daily into abdomen, hips, thighs, and chest starting early in pregnancy.',
      ar: 'يُدلك بحركات دائرية على البطن والأفخاذ والأرداف مرتين يومياً ابتداءً من الأشهر الأولى للحمل.',
    },
    price: 14.50,
    originalPrice: 17.00,
    categorySlug: 'mums-and-babies',
    categoryName: { en: 'Mums and babies', ar: 'الأم والطفل' },
    subCategorySlug: 'stretch-marks-cream',
    images: ['/images/slider-3-600x472.jpg'],
    inStock: true,
    stockQuantity: 50,
    isNewArrival: true,
    isFeatured: true,
    isTopSeller: true,
    rating: 4.9,
    reviewCount: 43,
  },
  {
    id: 'cutell-nappy-rash-cream',
    sku: 'ALF-MB-002',
    slug: 'cutell-nappy-rash-cream',
    name: {
      en: 'Cutell Nappy Rash Cream',
      ar: 'كيوتيل كريم الوقاية وعلاج تسلخات الأطفال',
    },
    description: {
      en: 'Soothing barrier cream for infant diaper rash prevention and relief. Contains zinc oxide and protective emollients.',
      ar: 'كريم واقٍ ومُهدئ لالتهابات وتسلخات الحفاضات لدى الأطفال، غني بأكسيد الزنك لمنع التهيج وتهدئة الجلد.',
    },
    usage: {
      en: 'Apply a clear protective layer on clean, dry baby skin during every diaper change.',
      ar: 'توضع طبقة رقيقة ومحمية على بشرة الطفل النظيفة والجافة عند كل تغيير للحفاض.',
    },
    price: 6.40,
    categorySlug: 'mums-and-babies',
    categoryName: { en: 'Mums and babies', ar: 'الأم والطفل' },
    subCategorySlug: 'nappy-rash-cream',
    images: ['/images/slider-1-600x472.jpg'],
    inStock: true,
    stockQuantity: 90,
    isNewArrival: false,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 38,
  },
  {
    id: 'cutell-nipple-cream',
    sku: 'ALF-MB-003',
    slug: 'cutell-nipple-cream',
    name: {
      en: 'Cutell Nipple Care Cream',
      ar: 'كيوتيل كريم العناية بحلمة الثدي للأمهات',
    },
    description: {
      en: 'Safe, natural soothing cream for nursing mothers to soothe and heal sore or cracked nipples during breastfeeding.',
      ar: 'كريم مهدئ وآمن للأمهات المرضعات يساعد على التئام التشققات وآلام حلمة الثدي الناتجة عن الرضاعة.',
    },
    usage: {
      en: 'Apply after breastfeeding or as needed to soothe sore areas.',
      ar: 'يدلك بلطف بعد كل عملية رضاعة أو عند الحاجة لتهدئة المنطقة.',
    },
    price: 7.80,
    categorySlug: 'mums-and-babies',
    categoryName: { en: 'Mums and babies', ar: 'الأم والطفل' },
    subCategorySlug: 'nipple-cream',
    images: ['/images/slider-600x472.jpg'],
    inStock: true,
    stockQuantity: 40,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 21,
  },
  {
    id: 'cutell-personal-lubricant',
    sku: 'ALF-PL-001',
    slug: 'cutell-personal-lubricant',
    name: {
      en: 'Cutell Personal Lubricant Gel',
      ar: 'كيوتيل جل مزلق شخصي خالي من العطور',
    },
    description: {
      en: 'Water-based, fragrance-free personal lubricant providing silky smooth, long-lasting moisture and comfort.',
      ar: 'جل مزلق طبي مائي خالي من العطور لمنح ترطيب وإحساس لطيف وسلس للغاية.',
    },
    usage: {
      en: 'Apply desired amount to intimacy area. Compatible with latex condoms.',
      ar: 'توضع الكمية المناسبة عند الحاجة. آمن للاستخدام.',
    },
    price: 5.00,
    categorySlug: 'personal-lubricant',
    categoryName: { en: 'Personal lubricant', ar: 'المزلقات الشخصية' },
    subCategorySlug: 'cutell-personal-lubricant',
    images: ['/images/slider-3-600x472.jpg'],
    inStock: true,
    stockQuantity: 110,
    isNewArrival: false,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 65,
  },
  {
    id: 'blue-scan-ultrasound-gel',
    sku: 'ALF-UG-001',
    slug: 'blue-scan-ultrasound-gel',
    name: {
      en: 'Blue Scan Ultra Sound Gel (250ml)',
      ar: 'بلو سكان جل الألتراساوند والفحوصات الطبية (250 مل)',
    },
    description: {
      en: 'Professional acoustic transmission ultrasound gel for medical imaging, Doppler, and diagnostic scans.',
      ar: 'جل ألتراساوند طبي احترافي عالي الموصلية للموجات فوق الصوتية والفحوصات الطبية والموجات فوق الصوتية.',
    },
    usage: {
      en: 'Apply required quantity over examination area prior to ultrasound transducer scan.',
      ar: 'توضع كمية كافية على المنطقة المراد فحصها بالجهاز الطبي قبل المسح.',
    },
    price: 0.85,
    categorySlug: 'ultra-sound-gel',
    categoryName: { en: 'Ultra sound gel', ar: 'جل الألتراساوند' },
    subCategorySlug: 'blue-scan-ultrasound-gel',
    images: ['/images/slider-600x472.jpg'],
    inStock: true,
    stockQuantity: 300,
    isNewArrival: false,
    isTopSeller: true,
    rating: 5.0,
    reviewCount: 88,
  },
];
