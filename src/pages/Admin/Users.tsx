// pages/ListTableList/index.tsx

import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Avatar } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import HandleForm from './components/UpdateForm';
import type { TableListItem } from './data';
import { queryRule, updateRule, addRule, removeRule } from './service';
import moment from 'moment';
moment.locale('en');

/**
 * It's a function that takes in an id and fields, and then returns a function that takes in a form
 * @param {string} [_id] - The id of the current record, if it exists, it is a modification, otherwise
 * it is an addition.
 * @param {TableListItem} [fields] - The form data that is submitted.
 */
const handleSubmit = async (_id?: string, fields?: TableListItem) => {
  const title = _id ? 'modify' : 'Add New';
  const hide = message.loading(`is${title}`);
  try {
    if (_id) {
      await updateRule({
        _id,
        ...fields,
        updatedAt: new Date(),
      });
    } else {
      await addRule({
        ...fields,
        updatedAt: new Date(),
      });
    }
    hide();
    message.success(`${title}success`);
    return true;
  } catch (error) {
    hide();
    message.error(`${title}fail`);
    return false;
  }
};

/**
 * It takes in an array of selected rows and an id, and then it tries to delete the selected rows or
 * the id, and then it returns true if it succeeds and false if it fails
 * @param {string[]} selectedRows - The selected rows in the table.
 * @param {string} _id - The id of the record to be deleted.
 * @returns A boolean value
 */
const handleRemove = async (selectedRows: string[], _id: string) => {
  const hide = message.loading('Deleting');
  try {
    await removeRule({
      _id: _id ? _id : selectedRows,
    });
    hide();
    message.success('Deletion Succeeded');
    return true;
  } catch (error) {
    hide();
    message.error('Deletion Failed');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [currentInfo, handleSaveCurrentInfo] = useState<TableListItem | null>(null);
  const [isDetail, setDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<any>([]);

  /* A table column configuration. */
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'username',
      dataIndex: 'username',
    },
    {
      title: 'password',
      dataIndex: 'password',
      hideInDescriptions: true, //detailsPageIsNotDisplayed
      hideInTable: true,
    },
    {
      title: 'role',
      dataIndex: 'access',
      search: false,
      filters: true,
      onFilter: true,
      valueEnum: {
        user: { text: 'user' },
        admin: { text: 'admin' },
      },
    },
    {
      title: '_id',
      dataIndex: '_id',
      sorter: true,
      hideInForm: true,
      search: false,
    },
    {
      title: 'avatar',
      dataIndex: 'avatar',
      search: false,
      hideInForm: true,
      render: (dom, entity) => {
        return <Avatar src={entity.avatar} alt="" />;
      },
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: 'updatedAt',
      dataIndex: 'updatedAt',
      sorter: true,
      hideInForm: true,
      search: false,
      renderText: (val) => {
        if (!val) return '';
        return moment(val).fromNow(); // convertAbsoluteTimeIntoRelativeTime
      },
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      sorter: true,
      hideInForm: true,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: 'operation',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            href="javascript:;"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              handleModalVisible(true), handleSaveCurrentInfo(record);
            }}
          >
            modify
          </a>
          <Divider type="vertical" />
          <a
            href="javascript:;"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              handleModalVisible(true), handleSaveCurrentInfo(record), setDetail(true);
            }}
          >
            details
          </a>
          <Divider type="vertical" />
          <a
            href="javascript:;"
            onClick={async () => {
              await handleRemove([], record._id as 'string');
              // refresh
              actionRef.current?.reloadAndRest?.();
            }}
          >
            delete
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="User Management"
        actionRef={actionRef}
        rowKey="_id"
        search={false}
        scroll={{ x: 0 }}
        toolBarRender={() => [
          <Button key="toolbar" type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined />
            Add New
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        form={{
          submitter: false,
        }}
        pagination={{
          showSizeChanger: true,
        }}
        rowSelection={{
          onChange: (selected) => {
            setSelectedRows(selected);
          },
        }}
      />
      <HandleForm
        onCancel={() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          handleModalVisible(false), handleSaveCurrentInfo({}), setDetail(false);
        }}
        modalVisible={modalVisible}
        values={currentInfo}
        isDetail={isDetail}
        onSubmit={async (values) => {
          const success = await handleSubmit(currentInfo?._id, values);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              selected <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> user
              {'s' ? selectedRowsState.length > 1 : ''}
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState, '');
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Batch Delete
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default TableList;
