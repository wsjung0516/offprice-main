export interface Category {
  id: string;
  key: string;
  value: string;
}

export interface Product {
  key: string;
  value: string;
  categoryId: string;
  group: string;
}
export const Categories1: Category[] = [
  {id: '1', key: 'Women', value:'women'},
  {id: '2', key: 'Men', value:'men'},
  {id: '3', key: 'Kids', value:'kids'},
]
export const Categories2: Product[] = [
  {key: 'Tops', value: 'Tops', categoryId: '1', group: '1'},
  {key: 'Blouses', value: 'Blouses', categoryId: '1', group: '1'},
  {key: 'Bodysuits', value: 'Bodysuits', categoryId: '1', group: '1'},
  {key: 'Casual', value: 'Casual', categoryId: '1', group: '1'},
  {key: 'Dresses', value: 'Dresses', categoryId: '1', group: '1'},
  {key: 'Suit', value: 'Suit', categoryId: '1', group: '1'},
  {key: 'T-Shirts', value: 'T-Shirts', categoryId: '1', group: '1'},

  {key: 'Bottoms', value: 'Bottoms', categoryId: '1', group: '2'},
  {key: 'Jeans', value: 'Jeans', categoryId: '1', group: '2'},
  {key: 'Joggers', value: 'Joggers', categoryId: '1', group: '2'},
  {key: 'Leggings', value: 'Leggings', categoryId: '1', group: '2'},
  {key: 'Pants', value: 'Pants', categoryId: '1', group: '2'},
  {key: 'Shorts', value: 'Shorts', categoryId: '1', group: '2'},
  {key: 'Skirts', value: 'Skirts', categoryId: '1', group: '2'},

  {key: 'Activewear', value: 'Activewear', categoryId: '1', group: '3'},
  {key: 'Jumpsuits', value: 'Jumpsuits', categoryId: '1', group: '3'},
  {key: 'Lingerie', value: 'Lingerie', categoryId: '1', group: '3'},
  {key: 'Loungewear', value: 'Loungewear', categoryId: '1', group: '3'},
  {key: 'Outerwear', value: 'Outerwear', categoryId: '1', group: '3'},
  {key: 'PlusSize', value: 'PlusSize', categoryId: '1', group: '3'},
  {key: 'Sets', value: 'Sets', categoryId: '1', group: '3'},
  {key: 'SweaterKnit', value: 'SweaterKnit', categoryId: '1', group: '3'},
  {key: 'Swimwear', value: 'Swimwear', categoryId: '1', group: '3'},


  {key: 'Jackets', value: 'Jackets', categoryId: '2', group: '3'},
  {key: 'Shirts', value: 'Shirts', categoryId: '2', group: '3'},
  {key: 'Sweater', value: 'Sweaters', categoryId: '2', group: '3'},
  {key: 'Jeans', value: 'Jeans', categoryId: '2', group: '3'},
  {key: 'Pants', value: 'Pants', categoryId: '2', group: '3'},
  {key: 'Shorts', value: 'Shorts', categoryId: '2', group: '3'},
  {key: 'Swimwear', value: 'Swimwear', categoryId: '2', group: '3'},
  {key: 'Sportswear', value: 'Sportswear', categoryId: '2', group: '3'},

  {key: 'Jackets', value: 'Jackets', categoryId: '3', group: '3'},
  {key: 'Shirts', value: 'Shirts', categoryId: '3', group: '3'},
  {key: 'Sweaters', value: 'Sweaters', categoryId: '3', group: '3'},
  {key: 'Jeans', value: 'Jeans', categoryId: '3', group: '3'},
  {key: 'Pants', value: 'Pants', categoryId: '3', group: '3'},
  {key: 'Shorts', value: 'Shorts', categoryId: '3', group: '3'},
  {key: 'Swimwear', value: 'Swimwear', categoryId: '3', group: '3'},
  {key: 'Sportswear', value: 'Sportswear', categoryId: '3', group: '3'},
]
export interface IStatus {
  // id: string;
  key: string;
  value: string;
}
export const Status: IStatus[] = [
  { key: 'Sale', value: 'Sale'},
  { key: 'Reserved', value: 'Reserved'},
  { key: 'Pending', value: 'Pending'},
  { key: 'Sold', value: 'Sold'},
  { key: 'Canceled', value: 'Canceled'},
]
// export const Status: IStatus[] = [
//   {id: '1', key: 'Sale', value: 'Sale'},
//   {id: '2', key: 'Reserved', value: 'Reserved'},
//   {id: '3', key: 'Pending', value: 'Pending'},
//   {id: '4', key: 'Sold', value: 'Sold'},
//   {id: '5', key: 'Canceled', value: 'Canceled'},
// ]
export const Sizes = [
  {key: 'All', value: 'All', category: 'All'},
  {key: 'XS', value: 'XS', category: 'BASE'},
  {key: 'S', value: 'S', category: 'BASE'},
  {key: 'M', value: 'M', category: 'BASE'},
  {key: 'L', value: 'L', category: 'BASE'},
  {key: 'XL', value: 'XL', category: 'BASE'},
  {key: '2XL', value: '2XL', category: 'BASE'},
  {key: '3XL', value: '3XL', category: 'BASE'},
  {key: '4XL', value: '4XL', category: 'BASE'},
  {key: '5XL', value: '5XL', category: 'BASE'},
  {key: '6XL', value: '6XL', category: 'BASE'},
  {key: '1', value: '1', category: 'US'},
  {key: '2', value: '2', category: 'US'},
  {key: '3', value: '3', category: 'US'},
  {key: '4', value: '4', category: 'US'},
  {key: '5', value: '5', category: 'US'},
  {key: '6', value: '6', category: 'US'},
  {key: '7', value: '7', category: 'US'},
  {key: '8', value: '8', category: 'US'},
  {key: '9', value: '9', category: 'US'},
  {key: '10', value: '10', category: 'US'},
  {key: '11', value: '11', category: 'US'},
  {key: '12', value: '12', category: 'US'},
  {key: '80', value: '80', category: 'KR'},
  {key: '85', value: '85', category: 'KR'},
  {key: '90', value: '90', category: 'KR'},
  {key: '95', value: '95', category: 'KR'},
  {key: '100', value: '100', category: 'KR'},
  {key: '105', value: '105', category: 'KR'},
  {key: '110', value: '110', category: 'KR'},
]

export const ENUM_COLOR = [
  'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Navy',   
  'Purple', 'Pink', 'Brown', 'Gray', 'White', 'Black',  
  'Indigo', 'Violet', 'Cyan', 'Magenta','Silver', 
  'Gold', 'Beige', 'Maroon','Olive',  
] as const
export type Color = typeof ENUM_COLOR[number];

export const Colors = [
  {key:'All', value: 'All'},
  {key: 'Red', value: '#FF0000'},
  {key: 'Orange', value: '#FFA500'},
  {key: 'Yellow', value: '#FFFF00'},
  {key: 'Green', value: '#008000'},
  {key: 'Blue', value: '#0000FF'},
  {key: 'Navy', value: '#000080'},
  {key: 'Purple', value: '#800080'},
  {key: 'Pink', value: '#FFC0CB'},
  {key: 'Brown', value: '#A52A2A'},
  {key: 'Gray', value: '#808080'},
  {key: 'White', value: '#FFFFFF'},
  {key: 'Black', value: '#000000'},
  {key: 'Indigo', value: '#4B0082'},
  {key: 'Violet', value: '#EE82EE'},
  {key: 'Cyan', value: '#00FFFF'},
  {key: 'Magenta', value: '#FF00FF'},
  {key: 'Silver', value: '#C0C0C0'},
  {key: 'Gold', value: '#FFD700'},
  {key: 'Beige', value: '#F5F5DC'},
  {key: 'Maroon', value: '#800000'},
  {key: 'Olive', value: '#808000'},
]
export enum EWaist {
  w23 = '23',
  w24 = '24',
  w25 = '25',
  w26 = '26',
  w27 = '27',
  w28 = '28',
  w29 = '29',
  w30 = '30',
  w31 = '31',
  w32 = '32',
  w33 = '33',
  w34 = '34',
  w35 = '35',
  w36 = '36',
  w37 = '37',
}
export const Categories = [
  {key:'All', value: 'All'},
  {key:'Women', value: 'Women'},
  {key:'Clothing', value: 'Clothing'},
  {key:'Dresses', value: 'Dresses'},
  {key:'Tops', value: 'Tops'},
  {key:'Sweaters', value: 'Sweaters'},
  {key:'Jackets', value: 'Jackets'},
  {key:'Jeans', value: 'Jeans'},
  {key:'Pants', value: 'Pants'},
  {key:'Shorts', value: 'Shorts'},
  {key:'Skirts', value: 'Skirts'},
  {key:'Swimwear', value: 'Swimwear'},
  {key:'Sportswear', value: 'Sportswear'},
]

export const ESearchPeriod = [
  {key: 'All', value: 'All'},
  {key: 'Today', value: 0},
  {key: 'Yesterday', value: 1},
  {key: 'Last 2 days', value: 2},
  {key: 'Last 7 days', value: 7},
  {key: 'Last 30 days', value: 30},
  {key: 'Last 2 months', value: 60},
  {key: 'Last 6 months', value: 180},
  {key: 'Last year', value: 365}
]

export const APrice = [
  { key: 'All', value: '0, 10000' },
  { key: 'Under $10', value: '0, 10' },
  { key: '$10 - $25', value: '10, 25' },
  { key: '$25 - $50', value: '25, 50' },
  { key: '$50 - $150', value: '50, 150' },
  { key: '$150 - $500', value: '150, 500' },
  { key: '$500 - $10,000', value: '500, 10000' },
]

export enum ECondition {
  New = 'New',
  LikeNew = 'Like New',
  Used = 'Used',
  GentlyUsed = 'Gently Used',
  SignOfWear = 'Sign of Wear',
}

export const EMaterial = [
  { key: 'All', value: 'All' },
  { key: 'Cotton', value: 'Cotton' },
  { key: 'Polyester', value: 'Polyester' },
  { key: 'Rayon', value: 'Rayon' },
  { key: 'Spandex', value: 'Spandex' },
  { key: 'Silk', value: 'Silk' },
  { key: 'Wool', value: 'Wool' },
  { key: 'Linen', value: 'Linen' },
  { key: 'Leather', value: 'Leather' },
  { key: 'Denim', value: 'Denim' },
  { key: 'Lace', value: 'Lace' },
  { key: 'Velvet', value: 'Velvet' },
  { key: 'Faux Leather', value: 'Faux Leather' },
  { key: 'Cashmere', value: 'Cashmere' },
  { key: 'Acrylic', value: 'Acrylic' },
  { key: 'Nylon', value: 'Nylon' },
]
export enum EMaterial2 {
  Cotton = 'Cotton',
  Polyester = 'Polyester',
  Rayon = 'Rayon',
  Spandex = 'Spandex',
  Silk = 'Silk',
  Wool = 'Wool',
  Linen = 'Linen',
  Leather = 'Leather',
  Denim = 'Denim',
  Lace = 'Lace',
  Velvet = 'Velvet',
  FauxLeather = 'Faux Leather',
  Cashmere = 'Cashmere',
  Acrylic = 'Acrylic',
  Nylon = 'Nylon',
}

export enum EPattern {
  AnimalPrint = 'Animal Print',
  Floral = 'Floral',
  Striped = 'Striped',
  Tweed = 'Tweed',
  Tropical = 'Tropical',
  Solid = 'Solid',
  Plaid = 'Plaid',
  Paisley = 'Paisley',
  Graphic = 'Graphic',
  Geometric = 'Geometric',
  Embroidered = 'Embroidered',
  Sequined = 'Sequined',
  Lace = 'Lace',
  Ruched = 'Ruched',
  Ripped = 'Ripped',
  Distressed = 'Distressed',
  TieDye = 'Tie Dye',
  Sheer = 'Sheer',
  Mesh = 'Mesh',
  Metallic = 'Metallic',
  Beaded = 'Beaded',
  Embellished = 'Embellished',
  Cutout = 'Cutout',
  Frayed = 'Frayed',
  Pleated = 'Pleated',
  Tassel = 'Tassel',
  Tulle = 'Tulle',
  Velvet = 'Velvet',
  FauxLeather = 'Faux Leather',
}