import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = [];
  // const orders: TOrder[] = useSelector((state) => state.order.data);

  return <ProfileOrdersUI orders={orders} />;
};
