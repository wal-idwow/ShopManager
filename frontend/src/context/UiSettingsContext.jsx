/**
 * UiSettingsContext
 *
 * Responsibilities:
 * - Provide a context for managing UI settings such as language and theme.
 * - Store and retrieve user preferences from localStorage.
 * - Offer translation functionality for multilingual support.
 *
 * Components:
 * - `UiSettingsProvider`: Wraps the application and provides context values.
 * - `useUiSettings`: Custom hook to access the context.
 *
 * Translations:
 * - Contains English and Arabic translations for the application.
 */

import React from 'react';

const translations = {

  // English translations provided by a native speaker, with attention to context and cultural nuances.
  en: {
    appName: '7anouti',
    appTagline: '7anouti: my small shop, always close.',
    dashboard: 'Retail Dashboard',
    home: 'Home',
    products: 'Products',
    transactions: 'Transactions',
    admin: 'Admin',
    currentRole: 'Current role',
    guestAccount: 'Guest',
    userAccount: 'User account',
    adminAccount: 'Admin account',
    signOut: 'Sign out',
    accessPortal: 'Access Portal',
    landingEyebrow: 'Shop Manager starter portal',
    landingTitle: 'Welcome to a cleaner way to run the shop.',
    landingCopy:
      'Enter as a user to manage inventory and transactions, or switch to the admin workspace for database maintenance tasks.',
    continueAsUser: 'Enter as User',
    continueAsAdmin: 'Enter as Admin',
    guestAccessCopy: 'Choose a role to unlock the matching workspace.',
    userAccessCopy: 'User access is focused on catalog and daily operations.',
    adminAccessCopy: 'Admin access unlocks database monitoring and cleanup tools.',
    featureInventory: 'Inventory control',
    featureInventoryCopy: 'Track products, stock levels, and pricing from one place.',
    featureTransactions: 'Sales flow',
    featureTransactionsCopy: 'Record purchases and sales without leaving the dashboard.',
    featureRoles: 'Role handling',
    featureRolesCopy: 'Switch between user and admin sessions with a local role state.',
    featureInsights: 'Operational insight',
    featureInsightsCopy: 'See stock pressure and recent activity at a glance.',
    dashboardPreview: 'Dashboard preview',
    liveMetrics: 'Live metrics',
    liveActivity: 'Recent activity',
    roleGuest: 'Guest',
    roleUser: 'User',
    roleAdmin: 'Admin',
    english: 'English',
    arabic: 'العربية',
    darkMode: 'Dark',
    lightMode: 'Light',
    storeControlCenter: 'Store Control Center',
    homeHeroTitle: 'Move stock with fast purchase and sale actions.',
    homeHeroCopy:
      'Keep inventory updated in real time and review your latest activity from one dashboard.',
    makePurchase: 'Make Purchase',
    makeSale: 'Make Sale',
    productsCount: 'Products',
    activeItems: 'Active items in catalog',
    unitsInStock: 'Units In Stock',
    totalStockText: 'Total stock across all products',
    transactionsCount: 'Transactions',
    purchaseSaleRecords: 'Purchase and sale records',
    lowStock: 'Low Stock',
    lowStockText: 'Products with 5 units or less',
    lowStockProducts: 'Low stock products',
    noLowStockProducts: 'All products are in a healthy stock range.',
    failedLoadHomeData: 'Failed to load the home dashboard preview.',
    inventorySnapshot: 'Inventory Snapshot',
    topProducts: 'Top Products',
    viewProducts: 'View Products',
    sellingPrice: 'selling price',
    inStock: 'in stock',
    recentActivity: 'Recent Activity',
    latestTransactions: 'Latest Transactions',
    viewTransactions: 'View Transactions',
    inventory: 'Inventory',
    productList: 'Product List',
    addProduct: 'Add Product',
    updateInventory: 'Update Inventory',
    newInventoryItem: 'New Inventory Item',
    editProduct: 'Edit Product',
    name: 'Name',
    buyPrice: 'Buy Price',
    sellPrice: 'Sell Price',
    stock: 'Stock',
    updateProduct: 'Update Product',
    backToList: 'Back to List',
    pleaseEnterValidValues: 'Please enter valid positive values for all fields.',
    failedLoadProductDetails: 'Failed to load product details.',
    failedDeleteProduct: 'Failed to delete product.',
    failedSaveProduct: 'Failed to save product. Please try again.',
    noProductsFound: 'No products found.',
    id: 'ID',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    salesFlow: 'Sales Flow',
    transactionList: 'Transaction List',
    addTransaction: 'Add Transaction',
    noTransactionsFound: 'No transactions found.',
    date: 'Date',
    product: 'Product',
    productId: 'Product ID',
    type: 'Type',
    quantity: 'Quantity',
    total: 'Total',
    unknownProduct: 'Unknown product',
    loading: 'Loading...',
    notAvailable: 'N/A',
    sale: 'Sale',
    purchase: 'Purchase',
    newActivity: 'New Activity',
    recordTransaction: 'Record Transaction',
    productName: 'Product Name',
    chooseProduct: 'Please choose a product.',
    quantityGreaterZero: 'Quantity must be greater than zero.',
    unableLoadProducts: 'Unable to load products.',
    failedSaveTransaction: 'Failed to save transaction.',
    saving: 'Saving...',
    recordPurchase: 'Record Purchase',
    recordSale: 'Record Sale',
    confirmDeleteProduct: 'Are you sure you want to delete this product?',
    confirmEditProduct: 'Do you want to edit this product?',
    buyPriceCannotBeGreaterThanSellPrice: 'Buy price cannot be greater than sell price',
    currency: 'DH',
    Email: 'Email',
    password: 'Password',
    login: 'Login',
    register: 'Register',
    dontHaveAccount: "Don't have an account ? ",
    alreadyHaveAccount: 'Already have an account ? ',
    DemoAdmin: 'Demo for Admin',
    welcome: 'Welcome to',
    welcomingPhrase: 'Streamline your inventory management with a modern, intuitive platform. Track products, manage transactions, and gain insights—all in one place.',
    homeTitleH2: 'Powerful Features for Your Business',
    subTitle: 'Everything you need to manage your shop efficiently',
    readyToGetStarted: 'Ready to Get Started?',
    joinThousands: 'Join thousands of shop owners who trust Shop Manager for their inventory needs.',
    getStartedNow: 'Get Started Now',
  },


// Arabic translations provided by a native speaker, with attention to context and cultural nuances.
  ar: {
    appName: 'حانوتي',
    appTagline: 'حانوتي: دكاني الصغير ديما معايا.',
    dashboard: 'لوحة المتجر',
    home: 'الرئيسية',
    products: 'المنتجات',
    transactions: 'المعاملات',
    admin: 'الإدارة',
    currentRole: 'الدور الحالي',
    guestAccount: 'ضيف',
    userAccount: 'حساب مستخدم',
    adminAccount: 'حساب إداري',
    signOut: 'تسجيل الخروج',
    accessPortal: 'بوابة الدخول',
    landingEyebrow: 'بوابة البداية لإدارة المتجر',
    landingTitle: 'مرحبًا بك في طريقة أوضح لإدارة المتجر.',
    landingCopy:
      'ادخل كمستخدم لإدارة المخزون والمعاملات، أو انتقل إلى مساحة الإدارة لمهام صيانة قاعدة البيانات.',
    continueAsUser: 'الدخول كمستخدم',
    continueAsAdmin: 'الدخول كمدير',
    guestAccessCopy: 'اختر دورًا لفتح مساحة العمل المناسبة.',
    userAccessCopy: 'وضع المستخدم يركز على الكتالوج والعمليات اليومية.',
    adminAccessCopy: 'وضع الإدارة يفتح أدوات المراقبة والتنظيف لقاعدة البيانات.',
    featureInventory: 'التحكم في المخزون',
    featureInventoryCopy: 'تابع المنتجات والمخزون والأسعار من مكان واحد.',
    featureTransactions: 'تدفق المبيعات',
    featureTransactionsCopy: 'سجل عمليات الشراء والبيع من لوحة واحدة.',
    featureRoles: 'إدارة الأدوار',
    featureRolesCopy: 'بدّل بين جلسة المستخدم وجلسة المدير بحالة محلية بسيطة.',
    featureInsights: 'رؤية تشغيلية',
    featureInsightsCopy: 'راقب الضغط على المخزون والنشاط الأخير بسرعة.',
    dashboardPreview: 'معاينة اللوحة',
    liveMetrics: 'المؤشرات المباشرة',
    liveActivity: 'النشاط الأخير',
    roleGuest: 'ضيف',
    roleUser: 'مستخدم',
    roleAdmin: 'مدير',
    english: 'English',
    arabic: 'العربية',
    darkMode: 'داكن',
    lightMode: 'فاتح',
    storeControlCenter: 'مركز التحكم في المتجر',
    homeHeroTitle: 'حرّك المخزون بسرعة عبر الشراء والبيع.',
    homeHeroCopy: 'حدّث المخزون لحظيًا وراجع آخر العمليات من لوحة واحدة.',
    makePurchase: 'تسجيل شراء',
    makeSale: 'تسجيل بيع',
    productsCount: 'المنتجات',
    activeItems: 'العناصر النشطة في الكتالوج',
    unitsInStock: 'الوحدات في المخزون',
    totalStockText: 'إجمالي المخزون لكل المنتجات',
    transactionsCount: 'المعاملات',
    purchaseSaleRecords: 'سجلات الشراء والبيع',
    lowStock: 'مخزون منخفض',
    lowStockText: 'منتجات تحتوي على 5 وحدات أو أقل',
    lowStockProducts: 'أسماء المنتجات ذات المخزون المنخفض',
    noLowStockProducts: 'جميع المنتجات في وضع مخزون جيد.',
    failedLoadHomeData: 'تعذر تحميل معاينة لوحة البداية.',
    inventorySnapshot: 'ملخص المخزون',
    topProducts: 'أهم المنتجات',
    viewProducts: 'عرض المنتجات',
    sellingPrice: 'سعر البيع',
    inStock: 'في المخزون',
    recentActivity: 'النشاط الأخير',
    latestTransactions: 'آخر المعاملات',
    viewTransactions: 'عرض المعاملات',
    inventory: 'المخزون',
    productList: 'قائمة المنتجات',
    addProduct: 'إضافة منتج',
    updateInventory: 'تحديث المخزون',
    newInventoryItem: 'عنصر جديد للمخزون',
    editProduct: 'تعديل المنتج',
    name: 'الاسم',
    buyPrice: 'سعر الشراء',
    sellPrice: 'سعر البيع',
    stock: 'المخزون',
    updateProduct: 'تحديث المنتج',
    backToList: 'العودة إلى القائمة',
    pleaseEnterValidValues: 'الرجاء إدخال قيم صحيحة وموجبة لكل الحقول.',
    failedLoadProductDetails: 'تعذر تحميل بيانات المنتج.',
    failedDeleteProduct: 'تعذر حذف المنتج.',
    failedSaveProduct: 'تعذر حفظ المنتج. حاول مرة أخرى.',
    noProductsFound: 'لا توجد منتجات.',
    id: 'المعرف',
    actions: 'الإجراءات',
    edit: ' تعديل',
    delete: 'حذف',
    salesFlow: 'حركة المبيعات',
    transactionList: 'قائمة المعاملات',
    addTransaction: 'إضافة معاملة',
    noTransactionsFound: 'لا توجد معاملات.',
    date: 'التاريخ',
    product: 'المنتج',
    productId: 'معرف المنتج',
    type: 'النوع',
    quantity: 'الكمية',
    total: 'الإجمالي',
    unknownProduct: 'منتج غير معروف',
    loading: 'جار التحميل...',
    notAvailable: 'غير متاح',
    sale: 'بيع',
    purchase: 'شراء',
    newActivity: 'نشاط جديد',
    recordTransaction: 'تسجيل معاملة',
    productName: 'اسم المنتج',
    chooseProduct: 'الرجاء اختيار منتج.',
    quantityGreaterZero: 'يجب أن تكون الكمية أكبر من صفر.',
    unableLoadProducts: 'تعذر تحميل المنتجات.',
    failedSaveTransaction: 'تعذر حفظ المعاملة.',
    saving: 'جارٍ الحفظ...',
    recordPurchase: 'تسجيل شراء',
    recordSale: 'تسجيل بيع',
    confirmDeleteProduct: 'هل أنت متأكد من حذف هذا المنتج؟',
    confirmEditProduct: 'هل تريد تعديل هذا المنتج؟',
    buyPriceCannotBeGreaterThanSellPrice: 'سعر الشراء لا يمكن أن يكون أكبر من سعر البيع',
    currency: 'درهم',
    Email: 'البريد الالكتروني',
    password: 'كلمة المرور',
    login: 'تسجيل الدخول',
    register: 'تسجيل',
    dontHaveAccount: 'لا تملك حساباً ؟',
    alreadyHaveAccount: 'هل تملك حساباً بالفعل ؟',
    DemoAdmin: 'تجريبي للمدير',
    welcome: 'مرحبا بك في',
    welcomingPhrase: 'قم بتبسيط إدارة المخزون الخاص بك مع منصة حديثة وبديهية. تتبع المنتجات، إدارة المعاملات، والحصول على رؤى - كل ذلك في مكان واحد.',
    homeTitleH2: 'ميزات قوية لعملك',
    subTitle: 'كل ما تحتاجه لإدارة متجرك بكفاءة',
    readyToGetStarted: 'جاهز للبدء؟',
    joinThousands: 'انضم إلى آلاف أصحاب المحلات الذين يثقون في حانوتي لإدارة مخزونهم.',
    getStartedNow: 'ابدأ الآن',
  },
};

const UiSettingsContext = React.createContext(null);

/**
 * Retrieve a stored value from localStorage or return a fallback value.
 * @param {string} key - The key to retrieve from localStorage.
 * @param {string} fallback - The fallback value if the key does not exist.
 * @returns {string} - The stored value or the fallback.
 */
const getStoredValue = (key, fallback) => {
  const value = window.localStorage.getItem(key);
  return value || fallback;
};

/**
 * UiSettingsProvider Component
 *
 * Responsibilities:
 * - Manage language and theme state.
 * - Persist user preferences in localStorage.
 * - Provide translation and utility functions to the application.
 */
export const UiSettingsProvider = ({ children }) => {
  const [language, setLanguage] = React.useState(() => getStoredValue('minishop-language', 'ar'));
  const [theme, setTheme] = React.useState(() => getStoredValue('minishop-theme', 'dark'));

  // Update the document's language and direction attributes when the language changes
  React.useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    window.localStorage.setItem('minishop-language', language);
  }, [language]);

  // Update the document's theme attribute when the theme changes
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('minishop-theme', theme);
  }, [theme]);

  // Memoize the context value to optimize performance
  const value = React.useMemo(
    () => ({
      language,
      theme,
      toggleLanguage: () => setLanguage((current) => (current === 'en' ? 'ar' : 'en')),
      toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
      t: (key) => translations[language][key] || key,
      isArabic: language === 'ar',
    }),
    [language, theme]
  );

  return <UiSettingsContext.Provider value={value}>{children}</UiSettingsContext.Provider>;
};

/**
 * Custom hook to access the UiSettingsContext.
 * Throws an error if used outside of the UiSettingsProvider.
 * @returns {object} - The context value.
 */
export const useUiSettings = () => {
  const context = React.useContext(UiSettingsContext);

  if (!context) {
    throw new Error('useUiSettings must be used within UiSettingsProvider');
  }

  return context;
};
