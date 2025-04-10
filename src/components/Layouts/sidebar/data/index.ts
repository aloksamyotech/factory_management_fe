import * as Icons from "../icons";
import { IconClipboard } from '@tabler/icons-react';
import { IconSitemap } from '@tabler/icons-react';
import { IconTimeline } from '@tabler/icons-react';
import { IconBuildingFactory2 } from '@tabler/icons-react';
import { IconGrain } from '@tabler/icons-react';
import { IconReportAnalytics } from '@tabler/icons-react';
import { IconBuildingWarehouse } from '@tabler/icons-react';
import { IconUserUp } from '@tabler/icons-react';
const icons = {
  IconClipboard,
  IconSitemap,
  IconTimeline,
  IconBuildingFactory2,
  IconGrain,
  IconReportAnalytics,
  IconBuildingWarehouse,
  IconUserUp
}
export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "Project",
        url: "/project",
        icon: icons.IconClipboard,
        items: [],
      },
      {
        title: "Customer",
        url: "/customer",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Product",
        url: "/product",
        icon: icons.IconSitemap,
        items: []
      },
      {
        title: "Order",
        url: "/order",
        icon: icons.IconSitemap,
        items: []
      },
    ],
  },
  {
    label: "SCHEDULE",
    items: [
      {
        title: "Planning",
        icon: icons.IconTimeline,
        url: "/planning",
        items: [],
      },
      {
        title: "Shiftment",
        url: "/shiftment",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Leader",
        url: "/leader",
        icon: icons.IconUserUp,
        items: [],
      },
    ],
  },
  {
    label: "PROCESSING",
    items: [
      {
        title: "Production",
        icon: Icons.HomeIcon,
        url: "/production",
        items: [],
      },
      {
        title: "Inventory",
        icon: Icons.HomeIcon,
        url: "/inventory",
        items: [],
      },
      {
        title: "Machine",
        url: "/machine",
        icon: icons.IconBuildingFactory2,
        items: [],
      },
      {
        title: "Vendor",
        url: "/vendor",
        icon: icons.IconUserUp,
        items: [],
      },
      {
        title: "Raw Materials",
        url: "/rawmaterial",
        icon: icons.IconGrain,
        items: [],
      },
      {
        title: "Purchase",
        url: "/purchase",
        icon: icons.IconGrain,
        items: [],
      },
    ],
  },
  {
    label: "REPORTS",
    items: [
      {
        title: "Report",
        icon: icons.IconReportAnalytics,
        url: "/report",
        items: [],
      },
      {
        title: "Ware Housing",
        url: "/warehousing",
        icon: IconBuildingWarehouse,
        items: [],
      }
    ],
  },
];
