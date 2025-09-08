import { ICoffee } from "@/interfaces/ICoffeeLog";
import { connection } from "next/server";

export async function getCoffeeList(): Promise<ICoffee[]> {
  await connection();

  console.log(`API URL ${process.env.BACKEND_URL}`);
  if (process.env.BACKEND_URL) {
    const resultData: Response = await fetch(
      `${process.env.BACKEND_URL}/coffee/`,
      {},
    );
    return resultData.json();
  } else {
    return [];
  }
}

export async function postCoffeeList(newCoffee: ICoffee): Promise<boolean> {
  await connection();

  if (process.env.BACKEND_URL) {
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
  } else {
    return false;
  }
}

export async function patchCoffeeList(newCoffee: ICoffee): Promise<boolean> {
  await connection();

  if (process.env.BACKEND_URL) {
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
  } else {
    return false;
  }
}
