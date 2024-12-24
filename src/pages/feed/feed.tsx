import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeeds } from '../../services/slices/feedsSlice';

export const Feed: FC = () => {
  const { loading, data } = useSelector((state) => state.feed);
  const dispatch = useDispatch();

  const orders: TOrder[] = data.orders;

  if (!orders.length || loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
