"use client";

import { compactFormat } from "@/lib/format-number";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: { name: string; amount: number }[];
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function DonutChart({ data }: PropsType) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  const chartData = data.map((item) => {
    const percent = total > 0 ? ((item.amount / total) * 100).toFixed(2) : "0.00";
    return {
      ...item,
      label: `${item.name}: ${percent}%`,
    };
  });
  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    colors: ['#ffff57','#90ff7e','#ff735f'],
    labels: data?.map((item) => item.name),
    legend: {
      show: true,
      position: "bottom",
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      formatter: (legendName, opts) => {
        // const { seriesPercent } = opts.w.globals;
        // return `${legendName}: ${seriesPercent[opts.seriesIndex]}%`;
        const label = chartData.find((item) => item.name === legendName)?.label;
        return label ?? legendName;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Order Status",
              fontSize: "16px",
              fontWeight: "400",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
              formatter: (val) => compactFormat(+val),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: "100%",
          },
        },
      },
      {
        breakpoint: 370,
        options: {
          chart: {
            width: 260,
          },
        },
      },
    ],
  };

  return (
    <Chart
      options={chartOptions}
      series={data?.map((item) => item.amount)}  
      type="donut"
    />
  );
}
