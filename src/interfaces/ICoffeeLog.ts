export interface ICoffee {
  id: number;
  roasting_facility: string;
  coffee_name: string;
  size_g: number;
  roast_date: Date;
  open_date: Date;
  price: number;
  country_of_origin: string | null;
  isNew?: boolean;
}
