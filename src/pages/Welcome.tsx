import { PageContainer } from '@ant-design/pro-components';
import {
  Card,
  Col,
  Row,
  Button,
  Badge,
  notification,
  Space,
  Input,
  Alert,
  Tag,
  Divider,
  Calendar,
  Modal,
  AutoComplete,
} from 'antd';
import type { Dayjs } from 'dayjs';
import {
  ShareAltOutlined,
  ClockCircleOutlined,
  BookOutlined,
  FileSearchOutlined,
  CoffeeOutlined,
  SyncOutlined,
} from '@ant-design/icons';
const { Search } = Input;
const { Meta } = Card;
import { everything } from '@/services/altdata/newsapi';
import { schedule } from '@/services/altdata/reserve';
import { summarize } from '@/services/mldata/mlapi';
import moment from 'moment';
moment.locale('en');
import dayjs from 'dayjs';
dayjs.locale('en');

import React, { useLayoutEffect, useState } from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */

const Welcome: React.FC = () => {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState('');
  const [fedLoading, setFedLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAILoading] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);
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
      message: 'DigitsAI news summary finished',
      description: arg,
      placement: 'bottomRight',
      duration: 0,
      btn,
      key,
      onClose: close,
    });
  };

  const fedSchedule = () => {
    setFedLoading(true);
    schedule().then((response: any) => {
      const workingData = response.data;
      if (workingData.events && workingData.events.length > 0) {
        setEvents(workingData.events);
        setFedLoading(false);
      }
    });
  };

  const getListData = (value: Dayjs) => {
    let listData;
    events.forEach((item) => {
      if (item.month === value.format('YYYY-MM') && item.days === value.date().toString()) {
        listData = [item];
      }
    });
    return listData || [];
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.title}>
            <Badge />
            <small>
              {item.title} - {item.time}
            </small>
          </li>
        ))}
      </ul>
    );
  };

  /**
   * It takes a query, sets the loading state to true, then calls the summarize function from the
   * backend, and sets the summary state to the response from the backend
   * @param {any} query - The query to be summarized.
   */
  const summarizeAll = (query: any) => {
    setAILoading(true);
    summarize({ data: { query: query } }).then((response: any) => {
      setSummary(response.data.message[0].summary_text);
      if (summary) {
        openNotification(response.data.message[0].summary_text);
      }
      setAILoading(false);
    });
  };

  /**
   * It takes a query, sets the loading state to true, then makes an API call to the News API, and then
   * sets the news state to the response data, and then summarizes the content of the articles
   * @param {any} query - The query you want to search for.
   */
  const queryEverything = (query: any) => {
    setLoading(true);
    everything({ data: { query: query } }).then((response: any) => {
      const workingData = response.data;
      if (workingData.articles && workingData.articles.length > 0) {
        setNews(workingData.articles);
        setSummary('');
        let allNewsContent = '';
        workingData.articles.forEach(
          (article: { description: any; urlToImage: any; content: string; source: string }) => {
            if (
              article.description &&
              article.description.length > 150 &&
              article.urlToImage &&
              article.source.name != 'Business Wire'
            ) {
              allNewsContent += article.content;
            }
          },
        );
        summarizeAll(allNewsContent);
        setLoading(false);
      }
    });
  };

  useLayoutEffect(() => {
    queryEverything('stock market');
    fedSchedule();
  }, []);
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        title={
          <Button
            type="primary"
            disabled={fedLoading ? true : false}
            onClick={() => setCalendarOpen(true)}
          >
            Reserve Calendar
          </Button>
        }
        extra={
          <Space>
            <AutoComplete
              key="AutoComplete"
              options={[
                {
                  label: 'food prices',
                  value: 'food prices',
                },
                {
                  label: 'commodities',
                  value: 'commodities',
                },
                {
                  label: 'FOMC',
                  value: 'FOMC',
                },
                {
                  label: '$TSLA',
                  value: '$TSLA',
                },
              ]}
            >
              <Search
                placeholder="headline search"
                allowClear
                enterButton={!loading ? <FileSearchOutlined /> : <SyncOutlined spin />}
                size="large"
                onSearch={queryEverything}
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
            backgroundImage: "url('/brain.png')",
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(0,0,0,0.65)',
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            {!aiLoading ? (
              <Space>
                Here is your{' '}
                <Tag color="gold">
                  <img src="/16x16.png" />
                  .AI
                </Tag>
                news summary. <CoffeeOutlined style={{ color: '#964B00' }} />
              </Space>
            ) : (
              <Tag icon={<SyncOutlined spin />} color="processing">
                <img src="/16x16.png" />
                .AI processing
              </Tag>
            )}
            <Divider dashed />
            {!summary && !aiLoading ? (
              <Alert
                message="AI summary failed 😔"
                showIcon
                description="Bad article descriptions, or can be a result of a News API problem!"
                type="warning"
                action={
                  <Button type="dashed" size="small" danger>
                    Report Error
                  </Button>
                }
              />
            ) : (
              <p style={{ backgroundColor: '#fff' }}>{summary}</p>
            )}
          </p>
          <div className="site-card-wrapper">
            <Row gutter={24} style={{ maxHeight: '750px', overflow: 'auto' }}>
              {news.map(
                (article: {
                  source: any;
                  publishedAt: string;
                  url: string;
                  urlToImage: string;
                  title: string;
                  description: string;
                }) => {
                  if (
                    article &&
                    article.description &&
                    article.description.length > 150 &&
                    article?.urlToImage
                  ) {
                    return (
                      <>
                        <Col span={24} xxl={6} xl={8} lg={12} md={12} sm={24}>
                          <Card
                            hoverable={true}
                            style={{ marginBottom: 15 }}
                            bordered={true}
                            extra={
                              <Space>
                                <Badge key="articleSource" dot>
                                  <a href={article.url} target="_blank" rel="noreferrer">
                                    {article.source.name}
                                  </a>
                                </Badge>
                                <Badge
                                  key="articleDate"
                                  count={moment(article.publishedAt).fromNow()}
                                />
                                <Badge
                                  key="articleIcon"
                                  count={<ClockCircleOutlined style={{ color: '#f5222d' }} />}
                                />
                              </Space>
                            }
                            cover={
                              <img
                                alt="example"
                                src={article.urlToImage}
                                style={{ height: 250, objectFit: 'cover' }}
                              />
                            }
                            actions={[
                              <Button
                                type="link"
                                key="read"
                                icon={<BookOutlined />}
                                target="_blank"
                                href={article.url}
                              >
                                Read
                              </Button>,
                              <Button
                                type="link"
                                key="read"
                                icon={<ShareAltOutlined />}
                                target="_blank"
                                href={`https://twitter.com/intent/tweet?text=From my %23Digits feed:%0A${article.url}`}
                              >
                                Share
                              </Button>,
                            ]}
                          >
                            <Meta
                              title={article.title}
                              description={`${article.description.slice(0, 150)}...`}
                            />
                          </Card>
                        </Col>
                      </>
                    );
                  }
                },
              )}
            </Row>
          </div>
        </div>
      </Card>
      <Modal
        title="🗓️ Federal Reserve Calendar"
        centered
        footer={null}
        open={calendarOpen}
        onCancel={() => setCalendarOpen(false)}
        destroyOnClose={true}
        style={{ minWidth: '75%' }}
        maskClosable={false}
      >
        <Calendar fullscreen={true} cellRender={dateCellRender} />
      </Modal>
    </PageContainer>
  );
};

export default Welcome;
