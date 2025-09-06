import { ICoffee } from "@/interfaces/ICoffeeLog";

export async function getCoffeeList(): Promise<ICoffee[]> {
  const resultData: Response = await fetch(
    `${process.env.BACKEND_URL}/coffee/`,
    {},
  );
  return resultData.json();
}

export async function postCoffeeList(newCoffee: ICoffee): Promise<boolean> {
  const resultData: Response = await fetch(
    `${process.env.BACKEND_URL}/coffee/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCoffee),
    },
  );
  return resultData.ok;
}

export async function patchCoffeeList(newCoffee: ICoffee): Promise<boolean> {
  const resultData: Response = await fetch(
    `${process.env.BACKEND_URL}/coffee/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCoffee),
    },
  );
  return resultData.ok;
}
