export interface ListZellerCustomersData {
  listZellerCustomers?: {
    items?: Array<{
      id: string;
      name: string;
      role: 'Admin' | 'Manager';
    } | null>;
  } | null;
}