import * as Icons from "../icons";
import { IconClipboard } from '@tabler/icons-react';
import { IconSitemap } from '@tabler/icons-react';
import { IconTimeline } from '@tabler/icons-react';
import { IconBuildingFactory2 } from '@tabler/icons-react';
import { IconGrain } from '@tabler/icons-react';
import { IconReportAnalytics } from '@tabler/icons-react';
import { IconBuildingWarehouse } from '@tabler/icons-react';
import { IconUserUp } from '@tabler/icons-react';
import { IconForklift } from '@tabler/icons-react';
import { IconTruckDelivery } from '@tabler/icons-react';
import { IconShoppingCart } from '@tabler/icons-react';
const icons = {
  IconForklift,
  IconClipboard,
  IconSitemap,
  IconTimeline,
  IconBuildingFactory2,
  IconGrain,
  IconReportAnalytics,
  IconBuildingWarehouse,
  IconUserUp,
  IconTruckDelivery,
  IconShoppingCart
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
        title: "Machine",
        url: "/machine",
        icon: icons.IconBuildingFactory2,
        items: [],
      },
      {
        title: "Inventory",
        icon: icons.IconBuildingWarehouse,
        url: "/inventory",
        items: [],
      },
      {
        title: "Production",
        icon: icons.IconForklift,
        url: "/production",
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
        icon: icons.IconTruckDelivery,
        items: []
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
        icon: icons.IconShoppingCart,
        items: [],
      },
      {
        title: "Employee",
        url: "/employee",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Report",
        icon: icons.IconReportAnalytics,
        url: "/report",
        items: [],
      }
    ],
  }
];
