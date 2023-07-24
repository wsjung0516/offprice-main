export interface User{
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  zipcode: string;
  phone_no: string;
  address1: string;
  address2: string;
  created_at:  Date;
  updated_at:  Date;
  city: string;
  state: string;
  country: string;
  subscribe: boolean;
  seller: string;
  store_name: string;
  representative_name: string;
  register_no: string;
  representative_phone_no: string;
  store_address1: string;
  store_address2: string;
  store_city: string;
  store_state: string;
  store_country: string;
  store_zipcode: string;
}
export interface UserId {
  user_id: string;
  id: any;
}