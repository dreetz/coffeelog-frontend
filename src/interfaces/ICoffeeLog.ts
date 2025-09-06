export interface ICoffee {
  id: number;
  roasting_facility: string;
  coffee_name: string;
  size_g: number;
  roast_date: string;
  open_date: string;
  price: number;
  country_of_origin: string | null;
  isNew?: boolean;
}
