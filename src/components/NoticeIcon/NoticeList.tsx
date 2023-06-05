import { Avatar, List } from 'antd';
import classNames from 'classnames';
import React from 'react';
import styles from './NoticeList.less';

export type NoticeIconTabProps = {
  count?: number;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  title: string;
  tabKey: API.NoticeIconItemType;
  onClick?: (item: API.NoticeIconItem) => void;
  onClear?: () => void;
  emptyText?: string;
  clearText?: string;
  viewMoreText?: string;
  list: API.NoticeIconItem[];
  onViewMore?: (e: any) => void;
};
const NoticeList: React.FC<NoticeIconTabProps> = ({
  list = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
}) => {
  if (!list || list.length === 0) {
    return (
      <div>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List<API.NoticeIconItem>
        dataSource={list}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          // eslint-disable-next-line no-nested-ternary
          const leftIcon = item.avatar ? (
            typeof item.avatar === 'string' ? (
              <Avatar src={item.avatar} />
            ) : (
              <span>{item.avatar}</span>
            )
          ) : null;

          return (
            <div
              onClick={() => {
                onClick?.(item);
              }}
            >
              <List.Item className={itemCls} key={item.key || i}>
                <List.Item.Meta
                  avatar={leftIcon}
                  title={
                    <div>
                      {item.title}
                      <div>{item.extra}</div>
                    </div>
                  }
                  description={
                    <div>
                      <div>{item.description}</div>
                      <div>{item.datetime}</div>
                    </div>
                  }
                />
              </List.Item>
            </div>
          );
        }}
      />
      <div>
        {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NoticeList;
