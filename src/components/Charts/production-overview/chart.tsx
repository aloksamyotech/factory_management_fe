// "use client";

// import { useIsMobile } from "@/hooks/use-mobile";
// import type { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";

// type PropsType = {
//   data: {
//     received: { x: unknown; y: number }[];
//     due: { x: unknown; y: number }[];
//   };
// };

// const Chart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// export function PaymentsOverviewChart({ data }: PropsType) {
//   const isMobile = useIsMobile();

//   const options: ApexOptions = {
//     legend: {
//       show: false,
//     },
//     colors: ["#5750F1", "#0ABEF9"],
//     chart: {
//       height: 310,
//       type: "area",
//       toolbar: {
//         show: false,
//       },
//       fontFamily: "inherit",
//     },
//     fill: {
//       gradient: {
//         opacityFrom: 0.55,
//         opacityTo: 0,
//       },
//     },
//     responsive: [
//       {
//         breakpoint: 1024,
//         options: {
//           chart: {
//             height: 300,
//           },
//         },
//       },
//       {
//         breakpoint: 1366,
//         options: {
//           chart: {
//             height: 320,
//           },
//         },
//       },
//     ],
//     stroke: {
//       curve: "smooth",
//       width: isMobile ? 2 : 3,
//     },
//     grid: {
//       strokeDashArray: 5,
//       yaxis: {
//         lines: {
//           show: true,
//         },
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     tooltip: {
//       marker: {
//         show: true,
//       },
//     },
//     xaxis: {
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//   };

//   return (
//     <div className="-ml-4 -mr-5 h-[310px]">
//       <Chart
//         options={options}
//         series={[
//           {
//             name: "Received",
//             data: data.received,
//           },
//           {
//             name: "Due",
//             data: data.due,
//           },
//         ]}
//         type="area"
//         height={310}
//       />
//     </div>
//   );
// }

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

export function ProductionDonutChart({ data }: PropsType) {
  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    colors: ['#ffff57','#87CEEB','#90ff7e'],
    labels: data.map((item) => item.name),
    legend: {
      show: true,
      position: "bottom",
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      formatter: (legendName, opts) => {
        const { seriesPercent } = opts.w.globals;
        return `${legendName}: ${seriesPercent[opts.seriesIndex]}%`;
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
              label: "Production Status",
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
            width: 412,
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
      series={data.map((item) => item.amount)}
      type="donut"
    />
  );
}
