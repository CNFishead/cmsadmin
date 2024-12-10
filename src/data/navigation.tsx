import { RiHome2Fill } from "react-icons/ri";
import { MdSupportAgent } from "react-icons/md";
import { FaRegBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BsBox, BsBroadcastPin } from "react-icons/bs";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoCodeSlashOutline } from "react-icons/io5";

export const navigation = (options?: any) => {
  return {
    home: {
      title: "Home",
      links: {
        home: {
          title: "Home",
          link: "/",
          icon: <RiHome2Fill />,
        },
        notifications: {
          title: "Notifications",
          link: "/notifications",
          icon: <FaRegBell />,
        },
      },
    },
    ministries: {
      title: "Ministry Details",
      links: {
        members: {
          title: "Members",
          link: "/members",
          icon: <BsFillPeopleFill />,
        },
      },
    },
    admin: {
      title: "Admin Tools",
      links: {
        support: {
          title: "Support",
          link: "/account_details/support",
          icon: <MdSupportAgent />,
        },
        support_admin: {
          title: `Support Admin  `,
          link: "/account_details/support_admin",
          icon: <MdSupportAgent />,
          // check if the loggedInUser has a role "admin" in their role array
          hidden: options?.user?.role?.includes("admin") ? false : true,
        },
      },
    },
  };
};
