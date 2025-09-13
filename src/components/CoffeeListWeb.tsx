import { getCoffeeList } from "@/components/CoffeeListActions";
import CoffeeListUI from "@/components/CoffeeListUI";
import { ICoffee } from "@/interfaces/ICoffeeLog";
import { Suspense } from "react";

export default function CoffeeListWeb() {
  const data: Promise<ICoffee[]> = getCoffeeList();
  const apiUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL!;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoffeeListUI data={data} apiUrl={apiUrl} />
    </Suspense>
  );
}
