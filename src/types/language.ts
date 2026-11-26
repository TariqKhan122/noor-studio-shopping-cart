export type Language = 'en' | 'ur';
export type TextDirection = 'ltr' | 'rtl';

export interface LocalizedText {
  en: string;
  ur: string;
}

export interface LanguageState {
  language: Language;
  direction: TextDirection;
}

export type LanguageAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'TOGGLE_LANGUAGE' };

export interface TranslationDictionary {
  brand: {
    name: string;
    tagline: string;
    copyright: string;
  };
  nav: {
    shop: string;
    orders: string;
    checkout: string;
    signIn: string;
    signOut: string;
    cart: string;
    languageToggle: string;
    account: string;
    demoBadge: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    exploreCta: string;
    promoBanner: string;
  };
  shop: {
    searchPlaceholder: string;
    allCategories: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortRating: string;
    resultsCount: string;
    noResultsTitle: string;
    noResultsSubtitle: string;
    resetFilters: string;
    addToCart: string;
    addedToCart: string;
    quickView: string;
    inStock: string;
    outOfStock: string;
    originLabel: string;
    selectColor: string;
    selectSize: string;
    quantity: string;
    specifications: string;
    closeModal: string;
  };
  categories: {
    all: string;
    tech: string;
    desk: string;
    home: string;
    craft: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    continueShopping: string;
    remove: string;
    subtotal: string;
    discount: string;
    shipping: string;
    freeShipping: string;
    tax: string;
    total: string;
    promoLabel: string;
    promoPlaceholder: string;
    applyPromo: string;
    removePromo: string;
    promoHint: string;
    promoInvalid: string;
    promoMinNotMet: string;
    promoApplied: string;
    proceedToCheckout: string;
    clearCart: string;
    itemCountSingular: string;
    itemCountPlural: string;
    freeShippingProgress: string;
    freeShippingUnlocked: string;
  };
  auth: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    redirectNotice: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    signInButton: string;
    demoLoginButton: string;
    demoHint: string;
    orDivider: string;
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordMinLength: string;
    signedInAs: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    emptyCartTitle: string;
    emptyCartSubtitle: string;
    backToShop: string;
    shippingHeading: string;
    fullName: string;
    email: string;
    phone: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
    paymentHeading: string;
    paymentCard: string;
    paymentCardDesc: string;
    paymentCod: string;
    paymentCodDesc: string;
    paymentWallet: string;
    paymentWalletDesc: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
    orderSummary: string;
    placeOrder: string;
    processing: string;
    requiredField: string;
    invalidPhone: string;
    invalidCard: string;
    receiptTitle: string;
    receiptSubtitle: string;
    orderNumber: string;
    orderDate: string;
    shippingTo: string;
    paymentMethodLabel: string;
    viewOrders: string;
    continueShopping: string;
  };
  orders: {
    title: string;
    subtitle: string;
    profileHeading: string;
    editProfile: string;
    saveProfile: string;
    cancelEdit: string;
    memberSince: string;
    totalOrders: string;
    noOrdersTitle: string;
    noOrdersSubtitle: string;
    startShopping: string;
    statusConfirmed: string;
    itemsLabel: string;
    orderTotal: string;
  };
}
