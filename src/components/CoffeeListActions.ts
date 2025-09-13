import { ICoffee } from "@/interfaces/ICoffeeLog";
import { connection } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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

export async function postCoffeeList(
  apiUrl: string,
  newCoffee: ICoffee,
): Promise<boolean> {
  // normalize dates
  // (api requires date, so everything after T needs to be zero => T00:00:00.000Z)
  newCoffee = {
    ...newCoffee,
    roast_date: dayjs(newCoffee.roast_date).utc(true).toDate(),
    open_date: dayjs(newCoffee.open_date).utc(true).toDate(),
  };

  const resultData: Response = await fetch(`${apiUrl}/coffee/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCoffee),
  });
  return resultData.ok;
}

export async function patchCoffeeList(
  apiUrl: string,
  coffeeId: number,
  newCoffee: ICoffee,
): Promise<boolean> {
  // normalize dates
  // (api requires date, so everything after T needs to be zero => T00:00:00.000Z)
  newCoffee = {
    ...newCoffee,
    roast_date: dayjs(newCoffee.roast_date).utc(true).toDate(),
    open_date: dayjs(newCoffee.open_date).utc(true).toDate(),
  };

  const resultData: Response = await fetch(`${apiUrl}/coffee/${coffeeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCoffee),
  });
  return resultData.ok;
}

export async function deleteCoffeeList(
  apiUrl: string,
  coffeeId: number,
): Promise<boolean> {
  const resultData: Response = await fetch(`${apiUrl}/coffee/${coffeeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return resultData.ok;
}
