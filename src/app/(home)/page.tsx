import { ProductionOverview } from "@/components/Charts/production-overview";
import { OrderStatus } from "@/components/Charts/order-status";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { InventoryAlerts } from "./_components/inventory-alert";
import { TopProducts } from "@/components/Tables/top-products";
import { TopProductsSkeleton } from "@/components/Tables/top-products/skeleton";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <ProductionOverview
          className="col-span-12 xl:col-span-12"
        />

        <OrderStatus
          className="col-span-12 xl:col-span-5"
          key={extractTimeFrame("order_status")}
          timeFrame={extractTimeFrame("order_status")?.split(":")[1]}
        />

        <InventoryAlerts />

        <div className="col-span-12 grid xl:col-span-12">
          <Suspense fallback={<TopProductsSkeleton />}>
            <TopProducts />
          </Suspense>
        </div>
      </div>
    </>
  );
}
