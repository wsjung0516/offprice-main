export interface Category1 { // Women, Men, Kids
  id: string;
  key: string;
  value: string;
}
export interface Group {  // Tops, Bottoms, Activewear, Jumpsuits, Lingerie,  SweaterKnit, Swimwear
  id: string;
  key: string;
  value: string;
}
export interface Prod {
  key: string;
  value: string;
  categoryId: string;
  groupId: string;
}
export const enum ECat {
  c1, // Women
  c2, // Men
  c3  // Kids
}
export const tGroups: Group[] = [
  {id: '1', key: 'Tops', value: 'Tops'},
  {id: '2', key: 'Bottoms', value: 'Bottoms'},
  {id: '3', key: 'Dresses', value: 'Dresses'},
  {id: '4', key: 'Outerwear', value: 'Outerwear'},
  {id: '5', key: 'Activewear', value: 'Activewear'},
  {id: '6', key: 'Jumpsuits_Rompers', value: 'Jumpsuits_Rompers'},
  {id: '7', key: 'Swimwear', value: 'Swimwear'},
  {id: '8', key: 'Plus-Size', value: 'Plus-Size'},
  {id: '9', key: 'Sweater_Knit', value: 'Sweater_Knit'},
  {id: '10', key: 'Lingerie', value: 'Lingerie'},
  {id: '11', key: 'Loungewear', value: 'Loungewear'},
  {id: '12', key: 'Suits', value: 'Suits'},
  {id: '13', key: 'Party_Dresses', value: 'Party_Dresses'},
]
export const tProducts: Prod[] = [
  {categoryId: '1', groupId:'1', key: 'Tops', value:'Tops'},
  {categoryId: '1', groupId:'1', key: 'Blouse', value:'Blouse'},
  {categoryId: '1', groupId:'1', key: 'Bodysuits', value:'Bodysuits'},
  {categoryId: '1', groupId:'1', key: 'Botton-Down Shirts', value:'Botton-Down Shirts'},
  {categoryId: '1', groupId:'1', key: 'Casual', value:'Casual'},
  {categoryId: '1', groupId:'1', key: 'Crops', value:'Crops'},
  {categoryId: '1', groupId:'1', key: 'Dressy_Tops', value:'Dressy_Tops'},
  {categoryId: '1', groupId:'1', key: 'Fashion_Tops', value:'Fashion_Tops'},
  {categoryId: '1', groupId:'1', key: 'Graphic', value:'Graphic'},
  {categoryId: '1', groupId:'1', key: 'Tank_And_Tube', value:'Tank_And_Tube'},
  {categoryId: '1', groupId:'1', key: 'T-Shirts_and_Polo', value:'T-Shirts_and_Polo'},
  {categoryId: '1', groupId:'1', key: 'Tunics', value:'Tunics'},

  {categoryId: '1', groupId:'2', key: 'Bottoms', value:'Bottoms'},
  {categoryId: '1', groupId:'2', key: 'Jeans', value:'Jeans'},
  {categoryId: '1', groupId:'2', key: 'Joggers', value:'Joggers'},
  {categoryId: '1', groupId:'2', key: 'Leggings', value:'Leggings'},
  {categoryId: '1', groupId:'2', key: 'Pants', value:'Pants'},
  {categoryId: '1', groupId:'2', key: 'Shorts', value:'Shorts'},
  {categoryId: '1', groupId:'2', key: 'Skirts', value:'Skirts'},

  {categoryId: '1', groupId:'3', key: 'Dresses', value:'Dresses'},
  {categoryId: '1', groupId:'3', key: 'Bodycon', value:'Bodycon'},
  {categoryId: '1', groupId:'3', key: 'Casual_Dress', value:'Casual_Dress'},
  {categoryId: '1', groupId:'3', key: 'Classic_and_Casual', value:'Classic_and_Casual'},
  {categoryId: '1', groupId:'3', key: 'Fashion_Dress', value:'Fashion_Dress'},
  {categoryId: '1', groupId:'3', key: 'Maxi_Dress', value:'Maxi_Dress'},
  {categoryId: '1', groupId:'3', key: 'Midi', value:'Midi'},
  {categoryId: '1', groupId:'3', key: 'Mini', value:'Mini'},
  {categoryId: '1', groupId:'3', key: 'Night_Out', value:'Night_Out'},
  {categoryId: '1', groupId:'3', key: 'Vacation', value:'Vacation'},

  {categoryId: '1', groupId:'4', key: 'Outerwear', value:'Outerwear'},
  {categoryId: '1', groupId:'4', key: 'Anorak_Parka', value:'Anorak_Parka'},
  {categoryId: '1', groupId:'4', key: 'Cape', value:'Cape'},
  {categoryId: '1', groupId:'4', key: 'Coats', value:'Coats'},
  {categoryId: '1', groupId:'4', key: 'Jackets', value:'Jackets'},
  {categoryId: '1', groupId:'4', key: 'Kimonos', value:'Kimonos'},
  {categoryId: '1', groupId:'4', key: 'Poncho_and_Shawl', value:'Pohch_and_Shawl'},
  {categoryId: '1', groupId:'4', key: 'Raincoat', value:'Raincoat'},
  {categoryId: '1', groupId:'4', key: 'Vests', value:'Vests'},

  {categoryId: '1', groupId:'5', key: 'Activewear', value:'Activewear'},
  {categoryId: '1', groupId:'5', key: 'Shirts_and_Tees', value:'Shirts_and_Tees'},
  {categoryId: '1', groupId:'5', key: 'Sports_Bra', value:'Sports_Bra'},
  {categoryId: '1', groupId:'5', key: 'Sweatshirts', value:'Sweatshirts'},

  {categoryId: '1', groupId:'6', key: 'Jumpsuits_Rompers', value:'Jumpsuits_Rompers'},
  {categoryId: '1', groupId:'6', key: 'Jumpsuits', value:'Jumpsuits'},
  {categoryId: '1', groupId:'6', key: 'Rompers', value:'Rompers'},
    
  {categoryId: '1', groupId:'7', key: 'Swimwear', value:'Swimwear'},
  {categoryId: '1', groupId:'7', key: 'Bikini', value:'Bikini'},
  {categoryId: '1', groupId:'7', key: 'Cover-Ups', value:'Cover-Ups'},
  {categoryId: '1', groupId:'7', key: 'Monokini', value:'Monokini'},
  {categoryId: '1', groupId:'7', key: 'One-Pieces', value:'One-Pieces'},
  {categoryId: '1', groupId:'7', key: 'Tankini', value:'Tankini'},

  {categoryId: '1', groupId:'8', key: 'Plus-Size', value:'Plus-Size'},
  {categoryId: '1', groupId:'8', key: 'p_Activewear', value:'p_Activewear'},
  {categoryId: '1', groupId:'8', key: 'p_Bottoms', value:'p_Bottoms'},
  {categoryId: '1', groupId:'8', key: 'p_Dresses', value:'p_Dresses'},
  {categoryId: '1', groupId:'8', key: 'p_Jumpsuits_Rompers', value:'p_Jumpsuits_Rompers'},
  {categoryId: '1', groupId:'8', key: 'p_Lingerie', value:'p_Lingerie'},
  {categoryId: '1', groupId:'8', key: 'p_Loungewear', value:'p_Loungewear'},
  {categoryId: '1', groupId:'8', key: 'p_Outerwear', value:'p_Outerwear'},
  {categoryId: '1', groupId:'8', key: 'p_Sets', value:'p_Sets'},
  {categoryId: '1', groupId:'8', key: 'p_Swim', value:'p_Swim'},
  {categoryId: '1', groupId:'8', key: 'p_Tops', value:'p_Tops'},

  {categoryId: '1', groupId:'9', key: 'Sweater_Knit', value:'Sweater_Knit'},
  {categoryId: '1', groupId:'9', key: 'Cardigan', value:'Cardigan'},
  {categoryId: '1', groupId:'9', key: 'Hoodie', value:'Hoodie'},
  {categoryId: '1', groupId:'9', key: 'Pullover', value:'Pullover'},
  {categoryId: '1', groupId:'9', key: 'Sweaters', value:'Sweters'},
  {categoryId: '1', groupId:'9', key: 'Turtleneck', value:'Turtleneck'},

  {categoryId: '1', groupId:'10', key: 'Lingerie', value:'Lingerie'},
  {categoryId: '1', groupId:'10', key: 'Bra', value:'Bra'},
  {categoryId: '1', groupId:'10', key: 'Bralette', value:'Bralette'},
  {categoryId: '1', groupId:'10', key: 'Corsets', value:'Corsets'},
  {categoryId: '1', groupId:'10', key: 'Intimates', value:'Intimates'},
  {categoryId: '1', groupId:'10', key: 'Panties', value:'Panties'},
  {categoryId: '1', groupId:'10', key: 'Sets', value:'Sets'},
  {categoryId: '1', groupId:'10', key: 'Shapewear', value:'Shapewear'},

  {categoryId: '1', groupId:'11', key: 'Loungewear', value:'Loungewear'},
  {categoryId: '1', groupId:'11', key: 'l_Pants', value:'l_Pants'},
  {categoryId: '1', groupId:'11', key: 'l_Sets', value:'l_Sets'},
  {categoryId: '1', groupId:'11', key: 'l_Tops', value:'l_Tops'},

  {categoryId: '1', groupId:'12', key: 'Suits', value:'Suits'},
  {categoryId: '1', groupId:'12', key: 's_Pants', value:'s_Pants'},
  {categoryId: '1', groupId:'12', key: 's_Skirts', value:'s_Skirts'},
  
  {categoryId: '1', groupId:'13', key: 'Party_Dresses', value:'Party_Dresses'},
  {categoryId: '1', groupId:'13', key: 'Bridal_Dresses', value:'Bridal_Dresses'},
  {categoryId: '1', groupId:'13', key: 'Bridesmaid', value:'Bridesmaid'},
  {categoryId: '1', groupId:'13', key: 'Cocktail_Dresses', value:'Cocktail_Dresses'},
  {categoryId: '1', groupId:'13', key: 'Evening_Gowns', value:'Evening_Gowns'},
  {categoryId: '1', groupId:'13', key: 'Mother_and_Club', value:'Mother_and_Club'},
  {categoryId: '1', groupId:'13', key: 'Party_and_Club', value:'Party_and_Club'},
  {categoryId: '1', groupId:'13', key: 'Prom_Dresses', value:'Prom_Dresses'},
  {categoryId: '1', groupId:'13', key: 'Semiformal', value:'Semiformal'},
  
  {categoryId: '2', groupId:'1', key: 'Activewear', value:'Activewear'},
  {categoryId: '2', groupId:'1', key: 'Bottoms', value:'Bottoms'},
  {categoryId: '2', groupId:'1', key: 'Tops', value:'Tops'},
  {categoryId: '2', groupId:'1', key: 'Tracksuits_Sets', value:'Tracksuits_Sets'},
  
  {categoryId: '2', groupId:'2', key: 'Jeans_Denim', value:'Jeans_Denim'},
  {categoryId: '2', groupId:'2', key: 'Denim_Shirts', value:'Denim_Shirts'},
  {categoryId: '2', groupId:'2', key: 'Denim_Jackets', value:'Denim_Jackets'},
  {categoryId: '2', groupId:'2', key: 'Denim_Shorts', value:'Denim_Shorts'},

  {categoryId: '2', groupId:'3', key: 'Outerwear', value:'Outerwear'},
  {categoryId: '2', groupId:'3', key: 'Coats', value:'Coats'},
  {categoryId: '2', groupId:'3', key: 'Jackets_Blazers', value:'Jackets_Blazers'},
  {categoryId: '2', groupId:'3', key: 'Vests', value:'Vests'},

  {categoryId: '2', groupId:'4', key: 'Casual_Pants', value:'Casual_Pants'},
  {categoryId: '2', groupId:'4', key: 'Slacks_Dress_Pants', value:'Slacks_Dress_Pants'},
  {categoryId: '2', groupId:'4', key: 'Sweatpants_Joggers', value:'Sweatpants_Joggers'},

  {categoryId: '2', groupId:'5', key: 'Casual_Shorts', value:'Casual_Shorts'},
  {categoryId: '2', groupId:'5', key: 'Dress_Shorts', value:'Dress_Shorts'},
  {categoryId: '2', groupId:'5', key: 'Sweat_Shorts', value:'Sweat_Shorts'},

  {categoryId: '2', groupId:'6', key: 'Sweaters_Cardigans', value:'Sweaters_Cardigans'},
  {categoryId: '2', groupId:'6', key: 'Sweaters', value:'Sweters'},
  {categoryId: '2', groupId:'6', key: 'Cardigans', value:'Cardigans'},
  {categoryId: '2', groupId:'6', key: 'Sweaters_Vests', value:'Sweaters_Vests'},

  {categoryId: '2', groupId:'7', key: 'Swimwear', value:'Swimwear'},
  {categoryId: '2', groupId:'7', key: 'Trunks', value:'Trunks'},
  {categoryId: '2', groupId:'7', key: 'Rash_Guards', value:'Raash_Guards'},

  {categoryId: '2', groupId:'8', key: 'Tops', value:'Tops'},
  {categoryId: '2', groupId:'8', key: 'Casual_Shirts', value:'Casual_Shirts'},
  {categoryId: '2', groupId:'8', key: 'Dress_Shirts', value:'Dress_Shirts'},
  {categoryId: '2', groupId:'8', key: 'Graphic_T-Shirts', value:'Graphic_T-Shirts'},
  {categoryId: '2', groupId:'8', key: 'Polos', value:'Polos'},
  {categoryId: '2', groupId:'8', key: 'Sweatshirts_Hoodies', value:'Sweatshirts_Hoodies'},
  {categoryId: '2', groupId:'8', key: 'Tanks', value:'Tanks'},
  {categoryId: '2', groupId:'8', key: 'T-Shirts', value:'T-Shirts'},


  {categoryId: '3', groupId:'1', key: 'Girls_Apparel', value:'Girls_Apparel'},
  {categoryId: '3', groupId:'1', key: 'Dresses', value:'Dresses'},
  {categoryId: '3', groupId:'1', key: 'Jeans_Denim', value:'Jeans_Denim'},
  {categoryId: '3', groupId:'1', key: 'Outerwear', value:'Outerwear'},
  {categoryId: '3', groupId:'1', key: 'Pants_Leggings', value:'Pants_Leggings'},
  {categoryId: '3', groupId:'1', key: 'Party_Dresses', value:'Party_Dresses'},
  {categoryId: '3', groupId:'1', key: 'Rompers_Jumpsutis', value:'Romper_Jumpsuits'},
  {categoryId: '3', groupId:'1', key: 'Sets', value:'Sets'},
  {categoryId: '3', groupId:'1', key: 'Skirts', value:'Skirts'},
  {categoryId: '3', groupId:'1', key: 'Swimwear_Cover-ups', value:'Swimwear_Cover-ups'},
  {categoryId: '3', groupId:'1', key: 'Tops', value:'Tops'},
  {categoryId: '3', groupId:'1', key: 'Underwear_Bras', value:'Underwear_Bras'},


  {categoryId: '3', groupId:'2', key: 'Boys_Apparel', value:'Boys_Apparel'},
  {categoryId: '3', groupId:'2', key: 'Activewear_Sleepwear', value:'Activewear_Sleepwear'},
  {categoryId: '3', groupId:'2', key: 'Dresswear', value:'Dresswear'},
  {categoryId: '3', groupId:'2', key: 'Jeans_Denim', value:'Jean_Denim'},
  {categoryId: '3', groupId:'2', key: 'Outerwear', value:'Outerwear'},
  {categoryId: '3', groupId:'2', key: 'Pants', value:'Pants'},
  {categoryId: '3', groupId:'2', key: 'Swimwear', value:'Swimwear'},
  {categoryId: '3', groupId:'2', key: 'Tops', value:'Tops'},
  {categoryId: '3', groupId:'2', key: 'Underwear', value:'Underwear'},

]
export interface Product {
  key: string;
  value: string;
  categoryId: string;
  group: string;
}
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
export interface Category {
  id: string;
  key: string;
  value: string;
}

export const Categories1: Category[] = [
  {id: '1', key: 'Women', value:'women'},
  {id: '2', key: 'Men', value:'men'},
  {id: '3', key: 'Kids', value:'kids'},
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
  { key: 'Returned', value: 'Returned'},
]
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