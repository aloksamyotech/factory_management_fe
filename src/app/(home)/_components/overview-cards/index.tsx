import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { orders, profit, products, customers, inventory, rawMaterial, machines,employees } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Orders"
        data={{
          ...orders,
          value: compactFormat(orders?.value),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Total Profit"
        data={{
          ...profit,
          value: "₹" + compactFormat(profit?.value),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Total Products"
        data={{
          ...products,
          value: compactFormat(products?.value),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Customers"
        data={{
          ...customers,
          value: compactFormat(customers?.value),
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Total Inventory"
        data={{
          ...inventory,
          value: compactFormat(inventory?.value),
        }}
        Icon={icons.Inventory}
      />

      <OverviewCard
        label="Total Raw Materials"
        data={{
          ...rawMaterial,
          value: compactFormat(rawMaterial?.value),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Employees"
        data={{
          ...employees,
          value: compactFormat(employees?.value),
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Total Machines"
        data={{
          ...machines,
          value: compactFormat(machines?.value),
        }}
        Icon={icons.Machine}
      />
    </div>
  );
}
