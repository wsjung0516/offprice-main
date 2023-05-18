import { Color, Size } from "../constants/data-define";


export interface SaleList{
  product_name: string;
  sale_list_id: string;
  user_id: string;
  description: string;
  image_urls: string;
  vendor: string;
  price: string;
  created_at:  Date;
  updated_at:  Date;
  category: string;
  size: string;
  sizeArray: string;
  color: string;
  colorArray: string;
  material: string;
  status1: string;
  status2: string;
  status3: string;
}