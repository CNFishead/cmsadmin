import { TabsProps } from 'antd';
import UserDetails from './memberInfo/UserDetails.component';
import PaymentDetails from './paymentDetails/PaymentDetails.view';
import Ministry from './ministry/Ministry.view';

export default [
  {
    key: '0',
    label: 'User Information',
    children: <UserDetails />,
  },
  {
    key: '1',
    label: 'Payment Information',
    children: <PaymentDetails />,
  },
  {
    key: '2',
    label: 'Ministry',
    children: <Ministry />,
  },
] as TabsProps['items'];
