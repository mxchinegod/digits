import { PageContainer } from '@ant-design/pro-components';
import {
  Card,
  Button,
  Timeline,
  notification,
  Space,
  Input,
  Alert,
  Tag,
  Divider,
  Progress,
  Spin,
  AutoComplete,
} from 'antd';
import {
  FileSearchOutlined,
  SyncOutlined,
  SmileOutlined,
  LoadingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
const { Search } = Input;
import { agi } from '@/services/mldata/mlapi';
import moment from 'moment';
moment.locale('en');
import React, { useLayoutEffect, useState } from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */

const AGI: React.FC = () => {
  const [conversation, setConversation] = useState(['Ask me a question.']);
  const [aiLoading, setAILoading] = useState(false);
  const [error, setError] = useState('');
  const [quota, setQuota] = useState(0);
  const { initialState } = useModel('@@initialState');

  /**
   * The openNotification function is called when the user clicks the "Get Summary" button. It opens a
   * notification window with the summary of the news article
   */
  const openNotification = (arg: string) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type="primary" danger size="small" onClick={() => notification.close(key)}>
        Mark Read
      </Button>
    );
    notification.success({
      closeIcon: [],
      message: 'DigitsAI Oracle answer ready',
      description: arg,
      placement: 'bottomRight',
      duration: 0,
      btn,
      key,
      onClose: close,
    });
  };
  /**
   * It takes a query, sets the loading state to true, then calls the summarize function from the
   * backend, and sets the summary state to the response from the backend
   * @param {any} query - The query to be asked.
   */
  const askQuestion = (query: any) => {
    setConversation([...conversation, query]);
    setAILoading(true);
    agi({
      data: {
        query: query,
        email: initialState?.currentUser?.email,
        insert: { quota: { type: 'Oracle', date: moment().format() } },
      },
    }).then((agiRes: any) => {
      setQuota(agiRes.data.quota.length);
      if (!agiRes.data.answer) {
        setError(agiRes.data.message);
      } else {
        const _ = agiRes.data.answer;
        setConversation([...conversation, query, _]);
        if (_) {
          openNotification(_);
        } else {
          setError('Bad question format, or can be a result of a processing problem!');
        }
      }
      setAILoading(false);
    });
  };

  /**
   * It takes a query, sets the loading state to true, then makes an API call to the News API, and then
   * sets the news state to the response data, and then summarizes the content of the articles
   * @param {any} query - The query you want to search for.
   */

  useLayoutEffect(() => {
    if (initialState?.currentUser?.quota) {
      setQuota(Object.values(initialState?.currentUser?.quota).length);
    }
  }, []);
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        title="Welcome to Digits Pro"
        extra={
          <Space>
            <AutoComplete
              key="AutoComplete"
              options={[
                {
                  label: `How are current Fed rates affecting US equity markets in ${moment().format(
                    'MMMM',
                  )} ${moment().format('YYYY')}?`,
                  value: `How are current Fed rates affecting US equity markets in ${moment().format(
                    'MMMM',
                  )} ${moment().format('YYYY')}?`,
                },
                {
                  label: `What is the largest ${moment().format('YYYY')} macroeconomic concern?`,
                  value: `What is the largest ${moment().format('YYYY')} macroeconomic concern?`,
                },
                {
                  label: `Is the US GDP expected to decline in ${moment().format(
                    'YYYY',
                  )}? Be free in your interpretation.`,
                  value: `Is the US GDP expected to decline in ${moment().format(
                    'YYYY',
                  )}? Be free in your interpretation.`,
                },
                {
                  label: `What are some predictions regarding inflation in the US for ${moment().format(
                    'MMMM',
                  )} ${moment().format('YYYY')}?`,
                  value: `What are some predictions regarding inflation in the US for ${moment().format(
                    'MMMM',
                  )} ${moment().format('YYYY')}?`,
                },
              ]}
            >
              <Search
                placeholder="Ask a question"
                style={{ minWidth: '500px' }}
                allowClear
                enterButton={
                  <Tag
                    icon={!aiLoading ? <FileSearchOutlined /> : <SyncOutlined spin />}
                    color={!aiLoading ? 'success' : 'processing'}
                  />
                }
                size="large"
                onSearch={askQuestion}
              />
            </AutoComplete>
          </Space>
        }
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '500px auto',
            backgroundImage: "url('/cybernetic.jpg')",
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(0,0,0,0.65)',
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '75%',
            }}
          >
            {!aiLoading ? (
              <Progress percent={quota} format={() => `${100 - quota}/100 quota left this month`} />
            ) : (
              <Progress
                percent={quota}
                status="active"
                format={() => (
                  <>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                  </>
                )}
              />
            )}
            <Divider dashed />
            {error.length > 0 && !aiLoading ? (
              <Alert
                message="Oracle failed 😔"
                showIcon
                description={error}
                type="warning"
                action={
                  <Button type="dashed" size="small" danger>
                    Report Error
                  </Button>
                }
              />
            ) : (
              <Timeline>
                {conversation.map((piece) => {
                  if (conversation.indexOf(piece) % 2 != 0) {
                    return (
                      <>
                        <Timeline.Item color="#00CCFF" dot={<UserOutlined />}>
                          <p>{piece}</p>
                        </Timeline.Item>
                      </>
                    );
                  }
                  return (
                    <>
                      <Timeline.Item color="#52c41a" dot={<SmileOutlined />}>
                        <p>{piece}</p>
                      </Timeline.Item>
                    </>
                  );
                })}
              </Timeline>
            )}
          </p>
          <div className="site-card-wrapper" />
        </div>
      </Card>
    </PageContainer>
  );
};

export default AGI;
