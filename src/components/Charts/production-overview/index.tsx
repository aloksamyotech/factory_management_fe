import { getApi } from "@/common/api";
import { urls } from "@/common/url";
import { cn } from "@/lib/utils";
import { ProductionDonutChart } from "./chart";
import PrintButton from "@/components/ui/dropdown";

type ProductionOverviewProps = {
  className?: string;
};

export async function getProductionStatusOverview() {
  const response = await getApi(`${urls?.endpoints?.production.getAll}?page=1&limit=10000`);
  const production = response?.data?.data[0] || [];

  const today = new Date();
  const todayStr = today.toISOString().slice(0,10);
  
  const todaysProduction = production?.filter((prod:any)=>{
    if(!prod.createdAt) return false;
    const prodDate = new Date(prod.createdAt).toISOString().slice(0,10);
    return prodDate === todayStr;
  })

  const statusCounts = todaysProduction?.reduce((acc: Record<string, number>, prod: any) => {
    const status = (prod.status || "").toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc; 
  }, {});

  const inProduction = todaysProduction?.filter(
    (prod:any) => 
      prod?.status?.toLowerCase() === 'pending' || prod?.status?.toLowerCase() === 'in_progress'
  );

  const productsInProduction = inProduction?.map((prod:any)=> ({
    productName: prod?.product?.name || "",
    machineName: prod?.machine?.name || "",
    quantity: prod?.quantity || 0,
    status: prod?.status,
    estimateTime: prod?.estimationTime,
    id: prod?.id, 
  }));

  return {statusCounts, productsInProduction};
}

export async function ProductionOverview({className} : ProductionOverviewProps) {
  const {statusCounts, productsInProduction} = await getProductionStatusOverview();

  const chartData = [
    {name: 'Pending', amount: statusCounts["pending"]},
    {name: 'In Progress', amount: statusCounts["in_progress"]},
    {name: 'Completed', amount: statusCounts["completed"]},
  ]?.filter(item => item.amount > 0);
  return (
    <div className={cn("grid grid-cols-1 grid-rows-[auto_1fr] gap-9 rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",className)}>
      <div className="flex justify-between items-center mb-3 ml-2 mr-2">
      <h2 className="text-body-2xlg font-bold text-dark dark:text-white mb-3">Todays Production Overview</h2>
      <PrintButton />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0 flex items-center justify-center w-full md:w-100">
          <ProductionDonutChart data={chartData}/>
      </div>
        {/* table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto max-h-96 production-print" id="print-section">
          <h1 className="only-print-heading hidden text-xl font-bold mb-4 text-center">Todays Production</h1>  
          <table className="min-w-[650px] border rounded production-table">
            <thead className="sticky top-0 bg-gray-100 dark:bg-gray-dark z-10">
              <tr className="bg-gray-100 dark:bg-gray-dark dark:text-white dark:border-y">
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Machine Name</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Estimate Time</th>
                <th className="px-4 py-2 text-left only-print hidden">Note</th>
              </tr>
            </thead>
            <tbody>
              {productsInProduction?.length > 0 ? (
                productsInProduction?.map((prod:any)=>(
                  <tr key={prod.id}>
                    <td className="px-4 py-2">{prod?.productName}</td>
                    <td className="px-4 py-2">{prod?.machineName}</td>
                    <td className="px-4 py-2">{prod?.quantity}</td>
                    <td className="px-4 py-2">{
                      <span className={prod?.status === 'pending' ? 'text-yellow-400': 'text-blue-500'}>
                        {prod?.status === 'pending' ? "Pending":"In Progress"}
                        </span>
                      }
                    </td>
                    <td className='px-4 py-2'>{prod?.estimateTime}</td>
                    <td className='px-4 py-2 only-print hidden'></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center text-gray-400">
                    No Pending or In Progress Productions of Today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
