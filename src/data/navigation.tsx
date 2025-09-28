import { RiAdminFill, RiHome2Fill } from 'react-icons/ri';
import { MdSupportAgent } from 'react-icons/md';
import { FaClock, FaRegBell, FaStickyNote } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { BsBox, BsBroadcastPin } from 'react-icons/bs';
import { BsFillPeopleFill } from 'react-icons/bs';
import { shouldHideForRoles, ROLE_GROUPS } from '@/utils/roleUtils';
import { IoCodeSlashOutline } from 'react-icons/io5';
import { Badge } from 'antd';

export const navigation = (options?: any) => {
  console.log(options);
  return {
    home: {
      title: 'Home',
      links: {
        home: {
          title: 'Home',
          link: '/',
          icon: <RiHome2Fill />,
        },
        notifications: {
          title: 'Notifications',
          link: '/notifications',
          icon: <FaRegBell />,
        },
      },
      hidden: false,
    },
    ministries: {
      title: 'Ministry Details',
      links: {
        members: {
          title: 'Members',
          link: '/members',
          icon: <BsFillPeopleFill />,
        },
      },
      hidden: false,
    },
    management: {
      title: 'Management',
      links: {
        users: {
          title: 'Users',
          link: '/users',
          icon: <BsFillPeopleFill />,
        },
      },
      hidden: false,
    },
    admin: {
      title: 'Admin Tools',
      links: {
        admin_profiles: {
          title: 'Admin Profiles',
          link: '/admin/profiles/admin',
          icon: <RiAdminFill />,
        },
        legal: {
          title: 'Legal (Terms & Policy)',
          link: '/account_details/legal',
          icon: <FaStickyNote />,
        },
        plans: {
          title: 'Plans & Billing',
          link: '/admin/plans',
          icon: <BsBox />,
        },
        support_admin: {
          title: `Support Admin`,
          link: '/account_details/support_admin',
          icon: <MdSupportAgent />,
        },
        schedulers: {
          title: 'Schedulers',
          link: '/admin/schedulers',
          icon: (
            <Badge count={options?.schedulersCount}>
              <FaClock />
            </Badge>
          ),
          hidden: true,
        },
      },
      // Only show to users with admin or developer roles
      hidden: shouldHideForRoles(options?.user?.roles, ROLE_GROUPS.ADMIN_AND_DEV),
    },
    account_details: {
      title: 'Account Details',
      links: {
        support: {
          title: 'Support',
          link: '/account_details/support',
          icon: <MdSupportAgent />,
        },
        account_details: {
          title: 'Edit Account Settings',
          link: '/account_details',
          icon: <CgProfile />,
        },
      },
      hidden: false,
    },
    // error and 404 boundary, always hidden but something for the page layout to point to
    error_boundary: {
      title: 'Error Boundary',
      links: {
        not_found: {
          title: 'Not Found',
          link: '/404',
          icon: <BsBroadcastPin />,
        },
        error: {
          title: 'Error',
          link: '/error',
          icon: <BsBroadcastPin />,
        },
      },
      hidden: true,
    },
  };
};
