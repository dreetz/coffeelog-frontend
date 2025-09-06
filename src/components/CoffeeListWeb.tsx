import {
  postCoffeeList,
  getCoffeeList,
  patchCoffeeList,
} from "@/components/CoffeeListActions";
import CoffeeListUI from "@/components/CoffeeListUI";
import { ICoffee } from "@/interfaces/ICoffeeLog";
import { Suspense } from "react";

export default function CoffeeListWeb() {
  const data: Promise<ICoffee[]> = getCoffeeList();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoffeeListUI data={data} />
    </Suspense>
  );
}
