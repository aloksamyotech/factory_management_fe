import { getInventoryAlerts } from "./fetch";

export async function InventoryAlerts() {
  const { lowStockProducts, outOfStockProducts, lowStockRawMaterials, outOfStockRawMaterials} = await getInventoryAlerts();
  
  const renderProductRow = (item: any, status: string)=>(
    <tr key={item?.productId?.id}>
      <td className="px-4 py-2 font-medium">{item?.productId?.name}</td>
      <td className="px-4 py-2">{item?.productId?.category}</td>
      <td className="px-4 py-2">{item?.quantity}</td>
      <td className="px-4 py-2">{status}</td>
    </tr>
  );

  const renderRawMaterialRow = (item:any, status:string)=>(
    <tr key={item?.rawMaterialId?.id}>
      <td className="px-4 py-2 font-medium">{item?.rawMaterialId?.title}</td>
      <td className="px-4 py-2">{item?.rawMaterialId?.description}</td>
      <td className="px-4 py-2">{item?.quantity}</td>
      <td className="px-4 py-2">{status}</td>
    </tr>
  );
  return (
    <div className="col-span-12 rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <h2 className="mb-7 text-body-2xlg font-bold text-dark dark:text-white">
        Inventory Alerts
      </h2>
      {/* Products Table */}
      <h3 className="mb-2 text-lg font-semibold text-blue-700">Products</h3>  
      <div className="overflow-x-auto mb-6 max-h-75 overflow-y-auto">
        <table className="min-w-full border rounded">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-dark dark:text-white dark:border-y">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts?.map((item:any) => renderProductRow(item, "Low Stock"))}
            {outOfStockProducts?.map((item:any) => renderProductRow(item, "Out of Stock"))}
            {lowStockProducts?.length === 0 && outOfStockProducts?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-gray-400">
                  All products sufficiently stocked
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Raw Materials Table */}
      <h3 className="mb-2 text-lg font-semibold text-blue-700">Raw Materials</h3>
      <div className="overflow-x-auto max-h-75 overflow-y-auto">
        <table className="min-w-full border rounded">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-dark dark:text-white dark:border-y">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {lowStockRawMaterials?.map((item:any) => renderRawMaterialRow(item, "Low Stock"))}
            {outOfStockRawMaterials?.map((item:any) => renderRawMaterialRow(item, "Out of Stock"))}
            {lowStockRawMaterials?.length === 0 && outOfStockRawMaterials?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-gray-400">
                  All raw materials sufficiently stocked
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
