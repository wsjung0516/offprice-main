export interface SaleList{
  product_name: string;
  sale_list_id: string;
  user_id: string;
  description: string;
  image_urls: string;
  image_sm_urls: string;
  vendor: string;
  price: string;
  created_at:  Date;
  updated_at:  Date;
  category: string;
  category1: string; // Parent category id '1': women, '2': men, '3': kids
  size: string;
  sizeArray: string;
  color: string;
  quantity: number;
  material: string;
  status1: string;
  status2: string;
  status3: string;
}
export interface SoldSaleList{
  product_name: string;
  sale_list_id: string;
  user_id: string;
  image_sm_urls: string;
  vendor: string;
  price: string;
  category: string;
  category1: string; // Parent category id '1': women, '2': men, '3': kids
  quantity: number;
  status1: string;
  status2: string;
  buyer_id: string;
}