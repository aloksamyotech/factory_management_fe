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
      value: orderResult?.data?.data[0].length || 0,
    },
    profit: {
      value: orderResult?.data?.data[0].reduce((sum:any, order: any)=>sum+(order.totalAmount || 0), 0) || 0,
    },
    products: {
      value: productResult?.data?.data[0].length || 0,
    },
    customers: {
      value: customerResult?.data?.data[0].length || 0,
    },
    inventory: {
      value: inventoryResult?.data?.data[0].length || 0,
    },
    rawMaterial: {
      value: rawMaterialResult?.data?.data[0].length || 0,
    },
    machines: {
      value: machineResult?.data?.data[0].length || 0,
    },
    employees: {
      value: employeeResult?.data?.data[0].length || 0,
    }
  };
}

export async function getChatsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Jacob Jones",
      profile: "/images/user/user-01.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "Wilium Smith",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Johurul Haque",
      profile: "/images/user/user-04.png",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "M. Chowdhury",
      profile: "/images/user/user-05.png",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "Akagami",
      profile: "/images/user/user-07.png",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}