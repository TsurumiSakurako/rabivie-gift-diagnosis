export const COLORS = [
  "レッド",
  "ピンク",
  "オレンジ",
  "イエロー",
  "ベージュ",
  "グリーン",
  "ブルー",
  "パープル",
  "ホワイト",
  "ブラック",
] as const;

export const STYLES = [
  "キュート",
  "ナチュラル",
  "エレガント",
  "ポップ",
  "クール",
] as const;

export type GiftProduct = {
  id: string;
  name: string;
  category: string;

  priceMin: number | null;
  priceMax: number | null;
  priceStatus: "confirmed" | "estimated" | "quote";

  image: string | null;
  url: string;

  options: {
    name: string;
    values: string[];
  }[];

  variants?: {
    id: string;
    label: string;
    url: string;
    image?: string | null;
  }[];

  resultType:
    | "product"
    | "category"
    | "kit"
    | "fullOrder";

  tags: {
    moods: string[];
    occasions: string[];
    uses: string[];
  };
};

const colorAndStyle = [
  { name: "カラー", values: [...COLORS] },
  { name: "スタイル", values: [...STYLES] },
];

// =====================================
// 商品画像URLの登録場所
// null を画像URLに置き換えてください
// =====================================

export const PRODUCT_IMAGES: Record<string, string | null> = {
  "petit-bouquet": "https://baseec-img-mng.akamaized.net/images/item/origin/b64831760f3cecad2adcb95edb516ed6.png?imformat=generic",
  "mini-bouquet": "https://baseec-img-mng.akamaized.net/images/item/origin/b6114dfff9a64962e05ef868ae36268b.png?imformat=generic",

  "standard-bouquet":
    "https://baseec-img-mng.akamaized.net/images/item/origin/c9aa78afab1f0fc4852b30304454aa67.png",

  "large-bouquet": "https://baseec-img-mng.akamaized.net/images/item/origin/61274d8d3e42b27291dbbe53898cb13b.png?imformat=generic",
  "standard-arrangement": "https://baseec-img-mng.akamaized.net/images/item/origin/628cdfef04fa4850d72870ea1c26c686.png?imformat=generic",

  "mole-cake": "https://baseec-img-mng.akamaized.net/images/item/origin/74c2f1b826866a8d4fc24f354271624c.png?imformat=generic",
  "mole-cake-shortcake": "https://baseec-img-mng.akamaized.net/images/item/origin/74c2f1b826866a8d4fc24f354271624c.png?imformat=generic",
  "mole-cake-chocolate": "https://baseec-img-mng.akamaized.net/images/item/origin/e585ced9d809beb1cf16e9ef7fc0b00a.png?imformat=generic",

  "single-flower": "https://baseec-img-mng.akamaized.net/images/item/origin/00eb0488e9aa79a3f0994a321ba8c23b.png?imformat=generic",
  "alphabet-charm": "https://baseec-img-mng.akamaized.net/images/item/origin/38dac701dd61c6daedf831acd4caeaec.png?imformat=generic",
  "rose-charm": "https://baseec-img-mng.akamaized.net/images/item/origin/b5a56e1672cbbe61dd256a6a17371e6e.png?imformat=generic",

  "rabi-doll-charm": "https://baseec-img-mng.akamaized.net/images/item/origin/d7deb58894101b50498b09d9443f1e8d.png?imformat=generic",
  "rabi-doll-charm-select": "https://baseec-img-mng.akamaized.net/images/item/origin/481d3d2d8122b09f740a6683f3f71c00.png?imformat=generic",
  "rabi-doll-charm-custom": "https://baseec-img-mng.akamaized.net/images/item/origin/d7deb58894101b50498b09d9443f1e8d.png?imformat=generic",

  "handmade-kit": "https://baseec-img-mng.akamaized.net/images/item/origin/41fdcb3368531c041f8ce797a57fe3b2.png?imformat=generic&q=90&im=Resize,width=1280,type=normal",
  "full-order": "https://baseec-img-mng.akamaized.net/images/item/origin/cec5e2d872a13bee9ff3443d1d98353c.png?imformat=generic",
};

// =====================================
// 商品データ
// =====================================

export const newProducts: GiftProduct[] = [
  {
    id: "petit-bouquet",
    name: "プチブーケ",
    category: "bouquet",
    priceMin: 1500,
    priceMax: 1800,
    priceStatus: "confirmed",
    image: PRODUCT_IMAGES["petit-bouquet"],
    url: "https://rabivie.base.shop/items/150334774",
    options: colorAndStyle,
    resultType: "product",
    tags: { moods: [], occasions: [], uses: [] },
  },
  {
    id: "mini-bouquet",
    name: "ミニブーケ",
    category: "bouquet",
    priceMin: 2500,
    priceMax: 2800,
    priceStatus: "confirmed",
    image: PRODUCT_IMAGES["mini-bouquet"],
    url: "https://rabivie.base.shop/items/145783710",
    options: colorAndStyle,
    resultType: "product",
    tags: { moods: [], occasions: [], uses: [] },
  },
  {
    id: "standard-bouquet",
    name: "スタンダードブーケ",
    category: "bouquet",
    priceMin: 3600,
    priceMax: 4100,
    priceStatus: "confirmed",
    image: PRODUCT_IMAGES["standard-bouquet"],
    url: "https://rabivie.base.shop/items/136955519",
    options: colorAndStyle,
    resultType: "product",
    tags: { moods: [], occasions: [], uses: [] },
  },
  {
    id: "large-bouquet",
    name: "ラージブーケ",
    category: "bouquet",
    priceMin: 4800,
    priceMax: 5300,
    priceStatus: "confirmed",
    image: PRODUCT_IMAGES["large-bouquet"],
    url: "https://rabivie.base.shop/items/136955625",
    options: colorAndStyle,
    resultType: "product",
    tags: { moods: [], occasions: [], uses: [] },
  },
  {
    id: "standard-arrangement",
    name: "スタンダードアレンジ",
    category: "arrangement",
    priceMin: 3800,
    priceMax: 4300,
    priceStatus: "confirmed",
    image: PRODUCT_IMAGES["standard-arrangement"],
    url: "https://rabivie.base.shop/items/118639384",
    options: colorAndStyle,
    resultType: "product",
    tags: { moods: [], occasions: [], uses: [] },
  },
  {
    id: "large-arrangement",
    name: "ラージアレンジ",
    category: "arrangement",
    priceMin: 4980,
    priceMax: 5480,
    priceStatus: "confirmed",
    image: PRODUCT_IMAGES["large-arrangement"],
    url: "https://rabivie.base.shop/items/118639645",
    options: colorAndStyle,
    resultType: "product",
    tags: { moods: [], occasions: [], uses: [] },
  },
  {
    id: "mole-cake",
    name: "モールケーキ",
    category: "cake",
    priceMin: 4700,
    priceMax: 5450,
    priceStatus: "confirmed",
    image: PRODUCT_IMAGES["mole-cake"],
    url: "https://rabivie.base.shop/items/137057375",
    options: [
      {
        name: "おすすめタイプ",
        values: [
          "ショートケーキ",
          "チョコレートケーキ",
        ],
      },
    ],
    variants: [
      {
        id: "shortcake",
        label: "ショートケーキ",
        url: "https://rabivie.base.shop/items/137057375",
        image: PRODUCT_IMAGES["mole-cake-shortcake"],
      },
      {
        id: "chocolate",
        label: "チョコレートケーキ",
        url: "https://rabivie.base.shop/items/137057609",
        image: PRODUCT_IMAGES["mole-cake-chocolate"],
      },
    ],
    resultType: "product",
    tags: { moods: [], occasions: [], uses: [] },
  },
  {
    id: "single-flower",
    name: "シングルフラワー",
    category: "singleFlower",
    priceMin: 750,
    priceMax: 750,
    priceStatus: "confirmed",
    image: PRODUCT_IMAGES["single-flower"],
    url: "https://rabivie.base.shop/categories/7780212",
    options: [],
    resultType: "category",
    tags: { moods: [], occasions: [], uses: [] },
  },
  {
    id: "alphabet-charm",
    name: "アルファベットチャーム",
    category: "charm",
    priceMin: 800,
    priceMax: 1000,
    priceStatus: "confirmed",
    image: PRODUCT_IMAGES["alphabet-charm"],
    url: "https://rabivie.base.shop/items/124177939",
    options: [
      {
        name: "カラー",
        values: [...COLORS],
      },
      {
        name: "デザイン",
        values: [
          "ノーマル",
          "リボン",
          "グリッター&リボン",
        ],
      },
    ],
    resultType: "product",
    tags: { moods: [], occasions: [], uses: [] },
  },
  {
    id: "rose-charm",
    name: "ローズチャーム",
    category: "charm",
    priceMin: 800,
    priceMax: 800,
    priceStatus: "confirmed",
    image: PRODUCT_IMAGES["rose-charm"],
    url: "https://rabivie.base.shop/items/115517051",
    options: [
      {
        name: "カラー",
        values: [...COLORS],
      },
    ],
    resultType: "product",
    tags: { moods: [], occasions: [], uses: [] },
  },
  {
    id: "rabi-doll-charm",
    name: "ラビドールチャーム",
    category: "charm",
    priceMin: 1400,
    priceMax: 2100,
    priceStatus: "confirmed",
    image: PRODUCT_IMAGES["rabi-doll-charm"],
    url: "https://rabivie.base.shop/items/137134620",
    options: [
      {
        name: "おすすめタイプ",
        values: ["セレクト", "カスタム"],
      },
    ],
    variants: [
      {
        id: "select",
        label: "セレクト",
        url: "https://rabivie.base.shop/items/137134620",
        image: PRODUCT_IMAGES["rabi-doll-charm-select"],
      },
      {
        id: "custom",
        label: "カスタム",
        url: "https://rabivie.base.shop/items/137135608",
        image: PRODUCT_IMAGES["rabi-doll-charm-custom"],
      },
    ],
    resultType: "product",
    tags: { moods: [], occasions: [], uses: [] },
  },
  {
    id: "handmade-kit",
    name: "手作りキット",
    category: "kit",
    priceMin: 2000,
    priceMax: 3500,
    priceStatus: "estimated",
    image: PRODUCT_IMAGES["handmade-kit"],
    url: "https://rabivie.base.shop/categories/6857727",
    options: [],
    resultType: "kit",
    tags: {
      moods: [],
      occasions: [],
      uses: ["handmade"],
    },
  },
  {
    id: "full-order",
    name: "フルオーダー",
    category: "fullOrder",
    priceMin: null,
    priceMax: null,
    priceStatus: "quote",
    image: PRODUCT_IMAGES["full-order"],
    url: "https://rabivie.base.shop/categories/7217373",
    options: [],
    resultType: "fullOrder",
    tags: { moods: [], occasions: [], uses: [] },
  },
];