import { PageContainer } from '@ant-design/pro-components';
import {
  Card,
  Button,
  // notification,
  Timeline,
  Badge,
  Table,
  Space,
  Statistic,
  Row,
  Col,
  Checkbox,
  Typography,
} from 'antd';
import { HighlightOutlined } from '@ant-design/icons';
const { Title } = Typography;

import { useModel } from 'umi';
import { quarterly } from '@/services/altdata/leaks';
import { pdfSentiment } from '@/services/mldata/mlapi';
import moment from 'moment';
moment.locale('en');
import React, { useState } from 'react';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */

const Documents: React.FC = () => {
  const [aiLoading, setAILoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const [error, setError] = useState('');
  const { initialState } = useModel('@@initialState');
  const [filteredLeaks, setLeaks] = useState([{}]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [sentiment, setSentiment] = useState([{}]);
  const getSentiment = (url: any) => {
    setAILoading(true);
    console.log(url);
    pdfSentiment({
      data: {
        query: url,
        email: initialState?.currentUser?.email,
        insert: { quota: { type: 'Oracle', date: moment().format() } },
      },
    }).then((sentRes: any) => {
      setSentiment(JSON.parse(sentRes.message));
      setAILoading(false);
    });
  };
  const columns = [
    {
      title: 'ℹ️',
      dataIndex: 'displayLink',
      key: 'displayLink',
      render: (text: any) => <small>{text}</small>,
    },
    {
      title: '💬',
      dataIndex: 'title',
      key: 'title',
      render: (text: any) => <small>{text}</small>,
    },
    {
      title: '🔗',
      dataIndex: 'link',
      key: 'link',
      render: (text: any) =>
        text ? (
          <small>
            <a href={text} target="_blank" rel="noreferrer">
              {text.slice(0, 100)}...
            </a>
          </small>
        ) : (
          ''
        ),
    },
    {
      title: '⚡️',
      dataIndex: 'link',
      key: 'process',
      render: (text: any) =>
        text ? (
          <Button
            loading={aiLoading}
            disabled={aiLoading}
            onClick={() => getSentiment(text)}
            size="small"
            icon={<HighlightOutlined />}
          ></Button>
        ) : (
          ''
        ),
    },
  ];

  const options = [
    { label: 'T. Rowe Price', value: 'troweprice.com' },
    { label: 'Fidelity', value: 'institutional.fidelity.com' },
    { label: 'Merrill Lynch', value: 'olui2.fs.ml.com' },
    { label: 'JP Morgan', value: 'am.jpmorgan.com' },
    { label: 'West End', value: 'westendadvisors.com' },
    { label: 'Blackrock', value: 'blackrock.com' },
  ];
  const simpleOptions = options.map((val) => {
    return val.value;
  });
  const onChange = (list: CheckboxValueType[]) => {
    setChecked(list);
    setIndeterminate(!!list.length && list.length < simpleOptions.length);
    setCheckAll(list.length === simpleOptions.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked ? simpleOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  /**
   * The openNotification function is called when the user clicks the "Get Summary" button. It opens a
   * notification window with the summary of the news article
   */
  // const openNotification = (arg: string) => {
  //   const key = `open${Date.now()}`;
  //   const btn = (
  //     <Button type="primary" danger size="small" onClick={() => notification.close(key)}>
  //       Mark Read
  //     </Button>
  //   );
  //   notification.success({
  //     closeIcon: [],
  //     message: 'DigitsAI Oracle answer ready',
  //     description: arg,
  //     placement: 'bottomRight',
  //     duration: 0,
  //     btn,
  //     key,
  //     onClose: close,
  //   });
  // };
  /**
   * It takes a query, sets the loading state to true, then calls the summarize function from the
   * backend, and sets the summary state to the response from the backend
   * @param {any} url - The query to be asked.
   */

  const getLeaks = () => {
    const all: any[] = [];
    setAILoading(true);
    quarterly({
      data: {
        email: initialState?.currentUser?.email,
        insert: { quota: { type: 'Oracle', date: moment().format() } },
      },
    }).then((leaks: any) => {
      if (!leaks.data.items) {
        setError(leaks.data.message);
        console.log(error);
      } else {
        const _ = leaks.data.items;
        checked.forEach((each: any) => {
          _.forEach((_each: any) => {
            if (_each.link.includes(each)) {
              all.push(_each);
            }
          });
        });
        setLeaks(all);
        // openNotification(`Found ${num} leaks.`);
      }
      setAILoading(false);
    });
  };

  /**
   * It takes a query, sets the loading state to true, then makes an API call to the News API, and then
   * sets the news state to the response data, and then summarizes the content of the articles
   * @param {any} query - The query you want to search for.
   */

  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        title="Document Processing AI"
        extra={
          <Button
            type="primary"
            disabled={aiLoading ? true : false}
            loading={aiLoading}
            onClick={() => getLeaks()}
          >
            Find Leaks
          </Button>
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
              width: '100%',
            }}
          >
            <Row gutter={24}>
              <Col span={12} xl={12} lg={24} md={24} sm={24}>
                <Row gutter={24}>
                  <Card
                    title="🕵️ Private Firm Analysis Leaks"
                    style={{ margin: 7 }}
                    extra={
                      <Space>
                        <Badge
                          className="site-badge-count-109"
                          count={'DigitsAI'}
                          style={{ backgroundColor: '#6500FF' }}
                        />
                        <a
                          href="https://github.com/DylanAlloy/digits-api-altdata/tree/main/routes/leaks"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source
                        </a>
                      </Space>
                    }
                  >
                    When private banking, investment, and wealth management services publish their
                    quarterly market reports, only some of them are stored securely where the public
                    internet cannot scour for them.
                    <br></br>
                    Often these reports are geared toward individual clients to be consumed as
                    general updates regarding global macroeconomic concerns within the past fiscal
                    quarter.
                    <br></br>
                    <br></br>
                    Using these leaked documents, it is easy to pair with DigitsAI to save time
                    reading and collect a &quot;greater-than-parts&quot; understanding from several
                    premium sources.
                  </Card>
                </Row>
                <Row>
                  <Col span={24} xl={24} lg={24} md={24} sm={24}>
                    <br></br>
                    <center>
                      <Title level={3}>
                        🔍 Source Filters{' '}
                        <Checkbox
                          indeterminate={indeterminate}
                          onChange={onCheckAllChange}
                          checked={checkAll}
                        >
                          🤷
                        </Checkbox>
                      </Title>
                      <Checkbox.Group
                        value={checked}
                        options={options}
                        onChange={onChange}
                      ></Checkbox.Group>
                    </center>
                  </Col>
                </Row>
                <br></br>
                <Row>
                  <Table
                    size="small"
                    style={{ width: '100%' }}
                    dataSource={filteredLeaks}
                    columns={columns}
                  />
                </Row>
              </Col>
              <Col span={12} xl={12} lg={24} md={24} sm={24}>
                <Row gutter={24}>
                  <Card
                    title="🧠 Document Analysis"
                    style={{ margin: 7 }}
                    extra={
                      <Space>
                        <Badge
                          className="site-badge-count-109"
                          count={'DigitsAI'}
                          style={{ backgroundColor: '#6500FF' }}
                        />
                        <a
                          href="https://github.com/DylanAlloy/digits-api-ml/blob/main/pdf_sentiment.py"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source
                        </a>
                      </Space>
                    }
                  >
                    Document analysis is the process of researching and making comparisons manually.
                    It can be time-consuming, but the difficulty can be low for someone with a
                    background in economics & experience in the market.
                    <br></br>
                    <br></br>
                    The amount of information we need to process is unsustainable and constantly
                    increasing. However, with advanced AI technology, we can now make powerful
                    algorithms available to everyone to process large amounts of information more
                    easily.
                  </Card>
                </Row>
                <Row>
                  <Col span={24} xl={24} lg={24} md={24} sm={24}></Col>
                </Row>
                <br></br>
                <div className="site-statistic-demo-card">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card>
                        <Statistic
                          title="Dovish"
                          value={
                            sentiment.filter((val) => {
                              return val.flat == '🚀';
                            }).length
                          }
                          precision={2}
                          valueStyle={{ color: '#1BC113' }}
                          prefix={'🚀'}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Statistic
                          title="Hawkish"
                          value={
                            sentiment.filter((val) => {
                              return val.flat == '🔥';
                            }).length
                          }
                          precision={2}
                          valueStyle={{ color: '#FF7575' }}
                          prefix={'🔥'}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Statistic
                          title="Neutral"
                          value={
                            sentiment.filter((val) => {
                              return val.flat == '👌🏼';
                            }).length
                          }
                          precision={2}
                          valueStyle={{ color: '#ACACAC' }}
                          prefix={'👌🏼'}
                        />
                      </Card>
                    </Col>
                    <br></br>
                  </Row>
                  <br></br>
                  <Row
                    gutter={24}
                    style={{ padding: '25px', maxHeight: '500px', overflow: 'auto' }}
                  >
                    <div style={{ margin: '24' }}>
                      {sentiment.map((val) => {
                        if (val.flat == '🚀') {
                          return (
                            <>
                              <Timeline.Item color="green">
                                <small>{val.sentence}</small>
                              </Timeline.Item>
                            </>
                          );
                        } else if (val.flat == '🔥') {
                          return (
                            <>
                              <Timeline.Item color="red">
                                <small>{val.sentence}</small>
                              </Timeline.Item>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <Timeline.Item color="grey">
                                <small>{val.sentence}</small>
                              </Timeline.Item>
                            </>
                          );
                        }
                        return;
                      })}
                    </div>
                  </Row>
                </div>
              </Col>
            </Row>
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Documents;
