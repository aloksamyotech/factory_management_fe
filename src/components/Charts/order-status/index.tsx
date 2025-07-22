import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { DonutChart } from "./chart";
import { getApi } from "@/common/api";
import { urls } from "@/common/url";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

async function getOrderStatusChart(timeFrame: string='monthly'){
  const res = await getApi(urls?.endpoints?.order.order);
  const orders = res?.data?.data[0] || [];

  const uppercaseConversion = (status: string)=>{
    return status === 'pending' ? 'Pending' : 
           status === 'completed' ? 'Completed' : 
           status === 'cancelled' ? 'Cancelled': "";
  }

  const statusCounts = orders.reduce((acc: Record<string, number>, order: any)=>{
    const status = uppercaseConversion(order.status || '');
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return [
    {name: 'Pending', amount: statusCounts['Pending'] || 0},
    {name: 'Completed', amount: statusCounts['Completed'] || 0},
    {name: 'Cancelled', amount: statusCounts['Cancelled'] || 0},
  ]
}


export async function OrderStatus({
  timeFrame = "monthly",
  className,
}: PropsType) {

  const data = await getOrderStatusChart(timeFrame);

  return (
    <div
      className={cn(
        "grid grid-cols-1 grid-rows-[auto_1fr] gap-9 rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Order Status
        </h2>

        <PeriodPicker defaultValue={timeFrame} sectionKey="order_status" />
      </div>

      <div className="grid place-items-center">
        <DonutChart data={data} />
      </div>
    </div>
  );
}
