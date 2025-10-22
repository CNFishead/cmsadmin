'use client';
import UserDetails from '@/views/management/users/userDetails/UserDetails.view';
import { ControlNavItem } from '@/layout/control/Control.layout';
import { FaUser } from 'react-icons/fa';
import { useSetControlNav } from '@/providers/ControlNavProvider';

export default function Page() {
  const controlNav: ControlNavItem[] = [
    {
      title: 'User Moderation',
      icon: <FaUser />,
      children: <></>,
    },
  ];

  // Apply the control navigation - automatically cleans up on unmount
  useSetControlNav(controlNav);
  return <UserDetails />;
}
