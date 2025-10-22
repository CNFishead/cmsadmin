'use client';
import SupportDetails from '@/views/support/supportDetails/SupportDetails.view';
import SupportTicketOptions from '@/views/support/support_ticket_options/SupportTicketOptions.component';
import { BsGear } from 'react-icons/bs';
import { ControlNavItem } from '@/types/navigation';
import { useSetControlNav } from '@/providers/ControlNavProvider';

export default function Component() {
  // Set up control navigation with user data
  const controlNav: ControlNavItem[] | null = [
    {
      children: <SupportTicketOptions />,
      icon: <BsGear />,
      title: 'Ticket Options',
    },
  ];

  useSetControlNav(controlNav);
  return <SupportDetails />;
}
