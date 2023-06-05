import React from 'react';
import { Modal } from 'antd';
import ProForm, { ProFormText, ProFormRadio } from '@ant-design/pro-form';
import type { TableListItem } from '../data';

/* Defining the type of the form values. */
export interface FormValueType extends Partial<TableListItem> {
  username?: string;
  password?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

/* Defining the props of the CreateForm component. */
export interface CreateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values?: FormValueType) => Promise<void>;
  modalVisible: boolean;
  values: Partial<TableListItem> | null;
  isDetail?: boolean;
}

const CreateForm: React.FC<CreateFormProps> = ({
  isDetail,
  onCancel,
  modalVisible,
  values,
  onSubmit,
}) => {
  return (
    <Modal
      destroyOnClose
      title={!values ? 'New User' : isDetail ? 'User Details' : 'Modify User'}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      width={840}
    >
      <ProForm
        initialValues={values as TableListItem}
        // eslint-disable-next-line @typescript-eslint/no-shadow
        onFinish={async (values: Partial<TableListItem>) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          !isDetail && onSubmit(values);
        }}
        {...(isDetail && { submitter: false })}
      >
        <ProFormText
          rules={[{ required: true, message: 'enterOneUserName!' }]}
          disabled={isDetail}
          label="username"
          name="username"
        />
        <ProFormText
          rules={[{ required: true, message: 'pleaseInputAPassword!' }]}
          disabled={isDetail}
          label="password"
          name="password"
        />
        <ProFormText
          rules={[{ required: true, message: 'pleaseEnterYourEmailAddress!' }]}
          disabled={isDetail}
          label="email"
          name="email"
        />
        <ProFormRadio.Group
          name="access"
          disabled={isDetail}
          label="role"
          rules={[{ required: true, message: 'pleaseSelectARole!' }]}
          options={[
            {
              label: 'administrators',
              value: 'admin',
            },
            {
              label: 'user',
              value: 'user',
            },
          ]}
        />
        <ProFormText disabled={isDetail} label="avatar" name="avatar" placeholder="image url" />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;
