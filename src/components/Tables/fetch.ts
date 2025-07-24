import * as logos from "@/assets/logos";
import { getApi } from "@/common/api";
import { urls } from "@/common/url";

function getProductProfit(product:any, orders:any){
  return orders
        .filter((order:any) => order.productId === product.id)
        .reduce((sum:any, order:any)=> sum + (order.totalAmount || 0), 0);
}
export async function getTopProducts() {
  const [productResult, orderResult] = await Promise.all([
    getApi(urls?.endpoints?.product.product),
    getApi(urls?.endpoints?.order.order),
  ]);

  const products = productResult?.data?.data[0] || 0;
  const orders = orderResult?.data?.data[0] || 0;

  const productStats = products.map((product:any) => {

    const ordersOfProduct = orders.filter((order:any) => order.productId == product.id);

    const sold = ordersOfProduct.reduce((sum:any, order:any)=>sum + (order.totalAmount || 1), 0);

    const profit = getProductProfit(product, ordersOfProduct);

    return {
      name: product.name,
      category: product.category,
      price: product.price || 0,
      sold,
      profit,
    };  
  });
  productStats.sort((a:any,b:any)=>b.sold - a.sold);

  return productStats.slice(0,5);
}

export async function getInvoiceTableData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return [
    {
      name: "Free package",
      price: 0.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Business Package",
      price: 99.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Unpaid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Pending",
    },
  ];
}

export async function getTopChannels() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      name: "Google",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.google,
    },
    {
      name: "X.com",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.x,
    },
    {
      name: "Github",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.github,
    },
    {
      name: "Vimeo",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.vimeo,
    },
    {
      name: "Facebook",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.facebook,
    },
  ];
}
