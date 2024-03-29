export interface UserSaleList{
  product_name: string;
  sale_list_id: string;
  user_id: string;
  description: string;
  image_urls: string;
  image_sm_urls: string;
  vendor: string;
  price: string;
  created_at:  Date;
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
  email: string;
  store_address1: string;
  store_address2: string;
  store_city: string;
  store_state: string;
  store_country: string;
  register_no: string;
  representative_phone_no: string;
  store_name: string;
  representative_name: string;
}