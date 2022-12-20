import { GithubOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Tag, Space } from 'antd';
import { health } from '@/services/user/index';
import React, { useEffect, useState } from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const [healthStatus, setHealth] = useState({});
  const healthCheck = async () => {
    health().then((data) => {
      setHealth(data);
    });
  };

  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '蚂蚁集团体验技术部出品',
  });

  const currentYear = new Date().getFullYear();
  useEffect(() => {
    healthCheck();
  }, []);
  return (
    <>
      <DefaultFooter
        style={{
          background: 'none',
        }}
        copyright={`${currentYear} ${defaultMessage}`}
        links={[
          {
            key: 'Digits Pro',
            title: `Digits Pro 3.0.0-beta`,
            href: 'https://dgtsapp.com',
            blankTarget: true,
          },
          {
            key: 'github',
            title: <GithubOutlined />,
            href: 'https://github.com/DylanAlloy/digits',
            blankTarget: true,
          },
          {
            key: 'always use on landscape 📱',
            title: 'always use on landscape 📱',
            href: 'https://detectmybrowser.com',
            blankTarget: true,
          },
        ]}
      />
      <Space style={{ marginLeft: 'auto', marginRight: 'auto', paddingBottom: 10, marginTop: -15 }}>
        <Tag
          icon={
            healthStatus.type == 'success' ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CloseCircleTwoTone twoToneColor="#eb2f96" />
            )
          }
          color={healthStatus.type == 'success' ? 'success' : 'error'}
        >
          {healthStatus.type == 'success' ? 'main API online' : 'main API offline'}
        </Tag>
      </Space>
    </>
  );
};

export default Footer;
