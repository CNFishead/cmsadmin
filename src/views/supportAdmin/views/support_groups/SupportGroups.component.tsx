"use client";
import React from "react";
import styles from "./SupportGroups.module.scss";
import useApiHook from "@/state/useApi";
import Loader from "@/components/loader/Loader.component";
import Error from "@/components/error/Error.component";
import SearchWrapper from "@/layout/searchWrapper/SearchWrapper.layout";
import { AiOutlinePlus, AiOutlineUser } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { Button, Table } from "antd";
import { SupportGroupType } from "@/types/Support";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";

const SupportGroups = () => {
  const router = useRouter();
  const { data, isError, error, isLoading } = useApiHook({
    url: "/admin/support/support_group",
    method: "GET",
    key: "support_groups",
  }) as any;

  if (isLoading) return <Loader />;
  if (isError) return <Error error={error.message} />;
 
  return (
    <div className={styles.container}>
      <SearchWrapper
        buttons={[
          {
            toolTip: "Add Member",
            icon: (
              <div className={styles.iconContainer}>
                <AiOutlinePlus /> <AiOutlineUser className={styles.icon} />
              </div>
            ),
            // set onClick to return nothing
            onClick: () => {
              router.push("/members/new");
            },
            type: "primary",
          },
        ]}
        filters={[
          {
            label: "All",
            key: "",
          },
          {
            label: "Staff Only",
            key: `role;{"$eq":"staff"}`,
          },
        ]}
        sort={[
          {
            label: "None",
            key: "",
          },
          {
            label: "Name (A-Z)",
            key: "firstName;1",
          },
        ]}
        placeholder="Search Members"
        queryKey="support_groups"
        total={data?.metadata?.totalCount}
        isFetching={isLoading}
      >
        <div className={styles.contentContainer}>
          <Table
            className={styles.table}
            dataSource={data?.payload}
            loading={isLoading}
            size="small"
            rowKey={(record: SupportGroupType) => record._id}
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                key: "name",
              },

              {
                title: "Actions",
                dataIndex: "actions",
                key: "actions",
                render: (text: string, record: SupportGroupType) => {
                  return (
                    <div className={styles.actions}>
                      <Link href={`/members/${record._id}`}>
                        <Button>
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          // deleteMember({ url: `/member/${record._id}` })
                        }}
                      >
                        <FaTrash className={styles.danger}/>
                      </Button>
                    </div>
                  );
                },
              },
            ]}
            pagination={false}
          />
        </div>
      </SearchWrapper>
    </div>
  );
};

export default SupportGroups;
