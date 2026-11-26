import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'noor-sada-speaker',
    slug: 'sada-walnut-acoustic-speaker',
    category: 'tech',
    title: {
      en: 'Sada Walnut Acoustic Speaker',
      ur: 'صدا اخروٹ ایکوسٹک اسپیکر',
    },
    subtitle: {
      en: 'Hand-finished walnut enclosure with lossless wireless audio',
      ur: 'اخروٹ کی لکڑی اور بے مثال وائرلیس ساؤنڈ کا حسین سنگم',
    },
    description: {
      en: 'Carved from sustainably sourced Himalayan walnut and paired with brushed brass controls, the Sada Acoustic Speaker delivers warm, room-filling sound with 24-hour battery endurance and USB-C lossless DAC playback.',
      ur: 'ہمالیہ کی اخروٹ کی لکڑی اور پیتل کے نفیس کنٹرولز سے تیار کردہ صدا اسپیکر 24 گھنٹے بیٹری بیک اپ اور بے داغ آواز فراہم کرتا ہے۔',
    },
    priceUSD: 245,
    badge: {
      en: 'Signature Piece',
      ur: 'خاص پیشکش',
    },
    rating: 4.9,
    reviewCount: 128,
    stock: 14,
    accentPalette: ['#2C241E', '#B48A4E'],
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&w=900&q=80',
    ],
    artisanOrigin: {
      en: 'Chiniot & Lahore Workshop',
      ur: 'چنیوٹ اور لاہور ورکشاپ',
    },
    colors: [
      { id: 'walnut-brass', hex: '#5A3E2B', label: { en: 'Smoked Walnut', ur: 'اسموکڈ اخروٹ' } },
      { id: 'ebony-gold', hex: '#1E1D1B', label: { en: 'Obsidian Ash', ur: 'سیاہ آبنوس' } },
    ],
    sizes: [
      { id: 'compact', label: { en: 'Studio Compact', ur: 'اسٹوڈیو کمپیکٹ' }, priceDeltaUSD: 0 },
      { id: 'grand', label: { en: 'Salon Grand (+30W)', ur: 'سیلون گرینڈ (+30W)' }, priceDeltaUSD: 65 },
    ],
    specs: [
      { label: { en: 'Connectivity', ur: 'کنیکٹیویٹی' }, value: { en: 'Bluetooth 5.3 & USB-C DAC', ur: 'بلوٹوتھ 5.3 اور USB-C' } },
      { label: { en: 'Battery Life', ur: 'بیٹری لائف' }, value: { en: '24 Hours Continuous', ur: '24 گھنٹے مسلسل' } },
      { label: { en: 'Enclosure', ur: 'باڈی میٹریل' }, value: { en: 'Solid Oiled Walnut & Brass', ur: 'اخروٹ کی لکڑی اور پیتل' } },
    ],
  },
  {
    id: 'noor-qalam-keyboard',
    slug: 'qalam-mechanical-keyboard',
    category: 'desk',
    title: {
      en: 'Qalam Brass Mechanical Keyboard',
      ur: 'قلم براس مکینیکل کی بورڈ',
    },
    subtitle: {
      en: 'CNC-milled aluminum chassis with tactile silent switches',
      ur: 'CNC ایلومینیم باڈی اور پُرسکون مکینیکل سوئچز کے ساتھ',
    },
    description: {
      en: 'Engineered for deep focus writing and coding. Features a solid brushed-brass weight plate, dual-language PBT keycaps, gasket-mounted acoustics, and tri-mode wireless pairing across three devices.',
      ur: 'توجہ اور تخلیقی کام کے لیے تیار کردہ۔ اس میں پیتل کی ویٹ پلیٹ، پائیدار PBT کی کیپس اور تین ڈیوائسز سے بیک وقت جڑنے کی سہولت موجود ہے۔',
    },
    priceUSD: 210,
    badge: {
      en: 'Bestseller',
      ur: 'سب سے زیادہ پسندیدہ',
    },
    rating: 4.8,
    reviewCount: 94,
    stock: 9,
    accentPalette: ['#1C1E21', '#C59B5F'],
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    ],
    artisanOrigin: {
      en: 'Noor Hardware Lab',
      ur: 'نور ہارڈویئر لیب',
    },
    colors: [
      { id: 'sandstone', hex: '#D8CFC0', label: { en: 'Alabaster Sand', ur: 'ریتلا سفید' } },
      { id: 'graphite', hex: '#2B2B29', label: { en: 'Deep Graphite', ur: 'گہرا گریفائٹ' } },
    ],
    sizes: [
      { id: 'layout-75', label: { en: '75% Compact', ur: '75% کمپیکٹ' }, priceDeltaUSD: 0 },
      { id: 'layout-tkl', label: { en: '80% TKL Edition', ur: '80% TKL ایڈیشن' }, priceDeltaUSD: 25 },
    ],
    specs: [
      { label: { en: 'Switches', ur: 'سوئچز' }, value: { en: 'Hot-Swappable Silent Tactile', ur: 'ہاٹ سواپ ایبل سائلنٹ' } },
      { label: { en: 'Keycaps', ur: 'کی کیپس' }, value: { en: 'Double-Shot PBT Matte', ur: 'میٹ ڈبل شاٹ PBT' } },
      { label: { en: 'Weight', ur: 'وزن' }, value: { en: '1.65 kg Brass-Weighted', ur: '1.65 کلوگرام پیتل سمیت' } },
    ],
  },
  {
    id: 'noor-zafar-lamp',
    slug: 'zafar-architect-desk-lamp',
    category: 'home',
    title: {
      en: 'Zafar Brushed Brass Task Lamp',
      ur: 'ظفر برشڈ براس ڈیسک لیمپ',
    },
    subtitle: {
      en: 'Stepless warm-to-daylight illumination with weighted marble base',
      ur: 'سنگِ مرمر کے بیس اور مدھم روشنی کے کنٹرول کے ساتھ',
    },
    description: {
      en: 'Anchored by hand-honed Ziarat marble and a counterbalanced solid brass arm, the Zafar Task Lamp bathes your workspace in glare-free CRI 97+ light calibrated from 2700K candlelight to 4500K studio clarity.',
      ur: 'زیارت کے سنگِ مرمر اور خالص پیتل سے بنا یہ لیمپ آنکھوں کو سکون دینے والی CRI 97+ روشنی فراہم کرتا ہے جسے آپ اپنی ضرورت کے مطابق ایڈجسٹ کر سکتے ہیں۔',
    },
    priceUSD: 175,
    rating: 4.9,
    reviewCount: 73,
    stock: 11,
    accentPalette: ['#3A3228', '#D1A96A'],
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
    ],
    artisanOrigin: {
      en: 'Quetta Stone & Brass Guild',
      ur: 'کوئٹہ اسٹون اینڈ براس گلڈ',
    },
    colors: [
      { id: 'aged-brass', hex: '#B48A4E', label: { en: 'Aged Brass', ur: 'قدیم پیتل' } },
      { id: 'bronze-noir', hex: '#3B3028', label: { en: 'Bronzed Umber', ur: 'گہرا کانسی' } },
    ],
    sizes: [
      { id: 'standard', label: { en: 'Desk Height (48cm)', ur: 'ڈیسک سائز (48 سینٹی میٹر)' }, priceDeltaUSD: 0 },
      { id: 'tall', label: { en: 'Atelier Tall (62cm)', ur: 'بڑا سائز (62 سینٹی میٹر)' }, priceDeltaUSD: 35 },
    ],
    specs: [
      { label: { en: 'Color Accuracy', ur: 'روشنی کا معیار' }, value: { en: 'CRI 97+ Flicker-Free LED', ur: 'CRI 97+ فلکر فری LED' } },
      { label: { en: 'Base Material', ur: 'بیس میٹریل' }, value: { en: 'Honed Ziarat Marble', ur: 'زیارت سنگِ مرمر' } },
      { label: { en: 'Dimming', ur: 'ڈمنگ کنٹرول' }, value: { en: 'Rotary Brass Dial (2700K–4500K)', ur: 'پیتل کا روٹری ڈائل' } },
    ],
  },
  {
    id: 'noor-kashan-pourover',
    slug: 'kashan-ceramic-pourover-set',
    category: 'craft',
    title: {
      en: 'Kashan Stoneware Pour-Over Set',
      ur: 'کاشان مٹی کا پور اوور کافی سیٹ',
    },
    subtitle: {
      en: 'Wheel-thrown matte stoneware dripper & carafe with brass collar',
      ur: 'ہاتھ سے بنائے گئے سیرامک اور پیتل کے کالر والا کافی سیٹ',
    },
    description: {
      en: 'Thrown in small batches on a traditional potter’s wheel and fired at 1280°C for superior heat retention. Includes ribbed conical dripper, 600ml server carafe, and removable heat-insulated walnut collar.',
      ur: 'روایتی چاک پر تیار کردہ اور 1280 ڈگری پر پکایا گیا یہ سیٹ مشروبات کی حرارت دیر تک برقرار رکھتا ہے۔ اس میں ڈرپر، 600 ملی لیٹر کیفے اور اخروٹ کی لکڑی کا کالر شامل ہے۔',
    },
    priceUSD: 98,
    badge: {
      en: 'Small Batch',
      ur: 'محدود بیچ',
    },
    rating: 4.7,
    reviewCount: 62,
    stock: 19,
    accentPalette: ['#4A3F37', '#C8B8A6'],
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    ],
    artisanOrigin: {
      en: 'Multan Ceramic Atelier',
      ur: 'ملتان سیرامک ایٹیلیئر',
    },
    colors: [
      { id: 'raw-clay', hex: '#C6B49E', label: { en: 'Raw Sandstone', ur: 'خام ریتلا رنگ' } },
      { id: 'slate-glaze', hex: '#343A3F', label: { en: 'Charcoal Glaze', ur: 'چارکول گلیز' } },
    ],
    sizes: [
      { id: 'two-cup', label: { en: '400ml Solo Carafe', ur: '400 ملی لیٹر سولو' }, priceDeltaUSD: 0 },
      { id: 'four-cup', label: { en: '650ml Hosting Set', ur: '650 ملی لیٹر ہوسٹنگ سیٹ' }, priceDeltaUSD: 22 },
    ],
    specs: [
      { label: { en: 'Craftsmanship', ur: 'تیاری' }, value: { en: 'Hand-Thrown High-Fire Stoneware', ur: 'ہاتھ سے بنا اسٹون ویئر' } },
      { label: { en: 'Care', ur: 'دیکھ بھال' }, value: { en: 'Dishwasher Safe (Remove Collar)', ur: 'کالر ہٹا کر دھونے کے قابل' } },
      { label: { en: 'Filters', ur: 'فلٹرز' }, value: { en: 'Standard V60-02 Compatible', ur: 'معیاری V60-02 فلٹر' } },
    ],
  },
  {
    id: 'noor-safar-deskmat',
    slug: 'safar-fullgrain-leather-desk-mat',
    category: 'desk',
    title: {
      en: 'Safar Full-Grain Leather Desk Mat',
      ur: 'سفر خالص چمڑے کی ڈیسک میٹ',
    },
    subtitle: {
      en: 'Vegetable-tanned Sialkot leather lined with merino wool felt',
      ur: 'سیالکوٹ کے خالص چمڑے اور میرینو اون سے تیار کردہ',
    },
    description: {
      en: 'Ages into a rich personal patina over years of daily work. Hand-stitched along the perimeter with waxed linen thread and backed with natural merino felt to protect fine wood tables.',
      ur: 'روزمرہ استعمال کے ساتھ اس چمڑے کی خوبصورتی میں مزید نکھار آتا ہے۔ مضبوط دھاگے سے ہاتھ کی سلائی اور نیچے نرم اون کی تہہ میز کو خراشوں سے محفوظ رکھتی ہے۔',
    },
    priceUSD: 115,
    rating: 4.8,
    reviewCount: 85,
    stock: 22,
    accentPalette: ['#5C3A21', '#9C7A54'],
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80',
    ],
    artisanOrigin: {
      en: 'Sialkot Leather Guild',
      ur: 'سیالکوٹ لیدر گلڈ',
    },
    colors: [
      { id: 'cognac', hex: '#8B4F28', label: { en: 'Cognac Saddle', ur: 'کونیاک براؤن' } },
      { id: 'espresso', hex: '#2F221C', label: { en: 'Dark Espresso', ur: 'گہرا ایسپریسو' } },
    ],
    sizes: [
      { id: 'medium', label: { en: 'Medium (70 × 35 cm)', ur: 'درمیانہ (70 × 35 سینٹی میٹر)' }, priceDeltaUSD: 0 },
      { id: 'executive', label: { en: 'Executive (90 × 42 cm)', ur: 'بڑا (90 × 42 سینٹی میٹر)' }, priceDeltaUSD: 28 },
    ],
    specs: [
      { label: { en: 'Leather Grade', ur: 'چمڑے کا معیار' }, value: { en: 'Full-Grain Vegetable Tanned', ur: 'فل گرین خالص چمڑا' } },
      { label: { en: 'Underside', ur: 'نچلی تہہ' }, value: { en: '3mm Natural Merino Felt', ur: '3 ملی میٹر قدرتی اون' } },
      { label: { en: 'Stitching', ur: 'سلائی' }, value: { en: 'Hand-Waxed Linen Thread', ur: 'ہاتھ سے سلائی شدہ مضبوط دھاگہ' } },
    ],
  },
  {
    id: 'noor-mihrab-charger',
    slug: 'mihrab-travertine-wireless-dock',
    category: 'tech',
    title: {
      en: 'Mihrab Travertine Charging Dock',
      ur: 'محراب ٹراورٹائن وائرلیس چارجنگ ڈاک',
    },
    subtitle: {
      en: 'Carved natural travertine stone with Qi2 15W magnetic fast charge',
      ur: 'قدرتی ٹراورٹائن پتھر اور 15W تیز وائرلیس چارجنگ',
    },
    description: {
      en: 'Sculpted from a single block of warm porous travertine, the Mihrab Dock hides unsightly cables while keeping your phone and earbuds effortlessly topped up on a nightstand or desk.',
      ur: 'قدرتی ٹراورٹائن پتھر کے ایک ہی ٹکڑے سے تراشا گیا یہ چارجر تاروں کے الجھاؤ کو چھپا کر آپ کے فون اور ایئربڈز کو تیزی سے چارج کرتا ہے۔',
    },
    priceUSD: 138,
    badge: {
      en: 'New Arrival',
      ur: 'نئی آمد',
    },
    rating: 4.7,
    reviewCount: 41,
    stock: 16,
    accentPalette: ['#8D7E6A', '#D5C7B2'],
    images: [
      'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1616400619175-5beda3a17896?auto=format&fit=crop&w=900&q=80',
    ],
    artisanOrigin: {
      en: 'Islamabad Design Studio',
      ur: 'اسلام آباد ڈیزائن اسٹوڈیو',
    },
    colors: [
      { id: 'ivory-travertine', hex: '#D8CCBA', label: { en: 'Ivory Travertine', ur: 'آئیوری ٹراورٹائن' } },
      { id: 'silver-slate', hex: '#63666A', label: { en: 'Basalt Grey', ur: 'بسالٹ سرمئی' } },
    ],
    sizes: [
      { id: 'single-pad', label: { en: 'Single Qi2 Pad', ur: 'سنگل چارجنگ پیڈ' }, priceDeltaUSD: 0 },
      { id: 'dual-valet', label: { en: 'Dual Phone + Earbuds', ur: 'ڈوئل فون اور ایئربڈز' }, priceDeltaUSD: 40 },
    ],
    specs: [
      { label: { en: 'Output', ur: 'پاور آؤٹ پٹ' }, value: { en: 'Qi2 Certified 15W + 5W', ur: 'Qi2 مصدقہ 15W + 5W' } },
      { label: { en: 'Cable', ur: 'کیبل' }, value: { en: '2m Braided Linen USB-C', ur: '2 میٹر بنے ہوئے کپڑے کی USB-C' } },
      { label: { en: 'Weight', ur: 'وزن' }, value: { en: '940g Solid Stone Anchor', ur: '940 گرام مضبوط پتھر' } },
    ],
  },
  {
    id: 'noor-zardozi-throw',
    slug: 'swat-merino-cashmere-throw',
    category: 'home',
    title: {
      en: 'Swat Hand-Loomed Cashmere Throw',
      ur: 'سوات ہاتھ سے بنے کیشمیئر کا تھرو',
    },
    subtitle: {
      en: 'Featherlight brushed highland wool woven on wooden pit looms',
      ur: 'روایتی کھڈی پر بنا گیا نہایت نرم اور گرم پہاڑی اون',
    },
    description: {
      en: 'Woven over four days by master weavers in the Swat valley using undyed organic wool and fine cashmere yarn. Breathable warmth for reading nooks, studio lounges, and quiet evenings.',
      ur: 'وادی سوات کے ماہر کاریگروں کے ہاتھوں چار دن میں تیار کردہ یہ شال بغیر کسی مصنوعی رنگ کے خالص اون اور کیشمیئر سے بنی ہے۔',
    },
    priceUSD: 165,
    rating: 5.0,
    reviewCount: 57,
    stock: 8,
    accentPalette: ['#6E655A', '#DFD5C5'],
    images: [
      'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80',
    ],
    artisanOrigin: {
      en: 'Islampur Looms, Swat',
      ur: 'اسلام پور لومز، سوات',
    },
    colors: [
      { id: 'oatmeal', hex: '#D9CFC1', label: { en: 'Natural Oatmeal', ur: 'قدرتی اوٹ میل' } },
      { id: 'camel', hex: '#A5835F', label: { en: 'Warm Camel', ur: 'گندمی براؤن' } },
    ],
    sizes: [
      { id: 'throw', label: { en: 'Lounge Throw (140 × 200 cm)', ur: 'لاؤنج تھرو (140 × 200 سینٹی میٹر)' }, priceDeltaUSD: 0 },
      { id: 'oversized', label: { en: 'Bed Blanket (180 × 230 cm)', ur: 'بڑا سائز (180 × 230 سینٹی میٹر)' }, priceDeltaUSD: 45 },
    ],
    specs: [
      { label: { en: 'Fiber Blend', ur: 'دھاگے کا معیار' }, value: { en: '70% Highland Merino, 30% Cashmere', ur: '70% میرینو اون، 30% کیشمیئر' } },
      { label: { en: 'Weave', ur: 'بنائی' }, value: { en: 'Hand-Loomed Herringbone', ur: 'ہاتھ کی ہیرنگ بون بنائی' } },
      { label: { en: 'Edge Detail', ur: 'کنارے' }, value: { en: 'Hand-Knotted Fringe', ur: 'ہاتھ سے گندھے ہوئے کنارے' } },
    ],
  },
  {
    id: 'noor-mizan-pen',
    slug: 'mizan-titanium-fountain-pen',
    category: 'craft',
    title: {
      en: 'Mizan Machined Titanium Pen',
      ur: 'میزان ٹائٹینیم فاؤنٹین قلم',
    },
    subtitle: {
      en: 'Aerospace grade-5 titanium body with German iridium nib',
      ur: 'ایرو اسپیس ٹائٹینیم باڈی اور جرمن اریڈیم نب کے ساتھ',
    },
    description: {
      en: 'Balanced at the exact center of gravity for effortless long-form journaling. Precision-threaded cap seals air-tight to prevent ink evaporation, paired with a buttery-smooth Bock nib.',
      ur: 'طویل تحریر کے لیے بہترین توازن کے ساتھ تیار کردہ۔ اس کا ایئرٹائٹ ڈھکن سیاہی کو خشک ہونے سے بچاتا ہے اور ہموار جرمن نب لکھائی کو یادگار بناتی ہے۔',
    },
    priceUSD: 128,
    rating: 4.9,
    reviewCount: 112,
    stock: 15,
    accentPalette: ['#2C3034', '#9FA6AD'],
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    ],
    artisanOrigin: {
      en: 'Karachi Precision Atelier',
      ur: 'کراچی پریسیژن ایٹیلیئر',
    },
    colors: [
      { id: 'raw-ti', hex: '#8A8D8F', label: { en: 'Bead-Blasted Titanium', ur: 'خام ٹائٹینیم' } },
      { id: 'brass-fluted', hex: '#B48A4E', label: { en: 'Fluted Raw Brass', ur: 'نالی دار پیتل' } },
    ],
    sizes: [
      { id: 'fine', label: { en: 'Fine Nib (0.5mm)', ur: 'باریک نب (0.5mm)' }, priceDeltaUSD: 0 },
      { id: 'medium', label: { en: 'Medium Nib (0.7mm)', ur: 'درمیانی نب (0.7mm)' }, priceDeltaUSD: 0 },
    ],
    specs: [
      { label: { en: 'Material', ur: 'مواد' }, value: { en: 'Grade-5 Titanium / C360 Brass', ur: 'گریڈ 5 ٹائٹینیم / پیتل' } },
      { label: { en: 'Nib', ur: 'نب' }, value: { en: 'German Bock #6 Iridium', ur: 'جرمن بوک #6 اریڈیم' } },
      { label: { en: 'Filling System', ur: 'سیاہی کا نظام' }, value: { en: 'Converter + Cartridge Included', ur: 'کنورٹر اور کارٹریج شامل ہیں' } },
    ],
  },
];
