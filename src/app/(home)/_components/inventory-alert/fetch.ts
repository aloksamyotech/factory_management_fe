import { getApi } from "@/common/api";
import { urls } from "@/common/url";

export async function getInventoryAlerts() {
  const response = await getApi(urls?.endpoints?.inventory.inventory);
  const inventory = response?.data?.data[0] || [];

  const LOW_STOCK_THRESHOLD = 10;

  // Products
  const lowStockProducts = inventory.filter(
    (item: any) =>
      item.type === "product" &&
      item.productId &&
      item.quantity > 0 &&
      item.quantity < LOW_STOCK_THRESHOLD
  );
  const outOfStockProducts = inventory.filter(
    (item: any) =>
      item.type === "product" &&
      item.productId &&
      item.quantity === 0
  );

  // Raw Materials
  const lowStockRawMaterials = inventory.filter(
    (item: any) =>
      item.type === "rawMaterial" &&
      item.rawMaterialId &&
      item.quantity > 0 &&
      item.quantity < LOW_STOCK_THRESHOLD
  );
  const outOfStockRawMaterials = inventory.filter(
    (item: any) =>
      item.type === "rawMaterial" &&
      item.rawMaterialId &&
      item.quantity === 0
  );

  return {
    lowStockProducts,
    outOfStockProducts,
    lowStockRawMaterials,
    outOfStockRawMaterials,
  };
}
