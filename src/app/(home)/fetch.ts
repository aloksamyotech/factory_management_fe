import { getApi } from "@/common/api";
import { urls } from "@/common/url";

export async function getOverviewData() {
  
  const [orderResult, productResult, customerResult, inventoryResult, rawMaterialResult, machineResult, employeeResult] = await Promise.all([
    getApi(urls?.endpoints?.order.order),
    getApi(urls?.endpoints?.product.product),
    getApi(urls?.endpoints?.customer.customer),
    getApi(urls?.endpoints?.inventory.inventory),
    getApi(urls?.endpoints?.rawMaterial.rawMaterial),
    getApi(urls?.endpoints?.machine.machine),
    getApi(urls?.endpoints?.employee.employee),
  ])
  
  return {
    orders: {
      value: orderResult?.data?.data[1] || 0,
    },
    profit: {
      value: orderResult?.data?.data[0]?.reduce((sum:any, order: any)=>sum+(order?.totalAmount || 0), 0) || 0,
    },
    products: {
      value: productResult?.data?.data[1] || 0,
    },
    customers: {
      value: customerResult?.data?.data[1] || 0,
    },
    inventory: {
      value: inventoryResult?.data?.data[1] || 0,
    },
    rawMaterial: {
      value: rawMaterialResult?.data?.data[1] || 0,
    },
    machines: {
      value: machineResult?.data?.data[1] || 0,
    },
    employees: {
      value: employeeResult?.data?.data[1] || 0,
    }
  };
}