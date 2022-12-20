import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, notification, Space, Alert, Button, Row, Tag, Divider } from 'antd';
import { CoffeeOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { autoDD } from '@/services/mldata/mlapi';

import moment from 'moment';
moment.locale('en');

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */

const Reddit: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * The openNotification function is called when the user clicks the "Get Summary" button. It opens a
   * notification window with the data of the news article
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
      message: 'DigitsAI Reddit data finished',
      description: arg,
      placement: 'bottomRight',
      duration: 0,
      btn,
      key,
      onClose: close,
    });
  };

  const grabReddit = async () => {
    setLoading(true);
    autoDD().then((response: any) => {
      const arr = response.data;
      const symbols = Object.keys(arr[Object.keys(arr)[0]]);
      const fixed: any = [];
      symbols.forEach((symbol) => {
        fixed.push({
          Ticker: symbol,
          '24H Total': arr['24H Total'][symbol],
          Recent: arr.Recent[symbol],
          Prev: arr.Prev[symbol],
          Change: arr.Change[symbol],
          Rockets: arr.Rockets[symbol],
          pennystocks: arr.pennystocks[symbol],
          RobinHoodPennyStocks: arr.RobinHoodPennyStocks[symbol],
          Daytrading: arr.Daytrading[symbol],
          StockMarket: arr.StockMarket[symbol],
          stocks: arr.stocks[symbol],
          investing: arr.investing[symbol],
          wallstreetbets: arr.wallstreetbets[symbol],
          Price: arr.Price[symbol],
          '1DayChange%': arr['1DayChange%'][symbol],
          '50DayChange%': arr['50DayChange%'][symbol],
          'ChangeVol%': arr['ChangeVol%'][symbol],
          'Float Shares': arr['Float Shares'][symbol],
          'Short/Float%': arr['Short/Float%'][symbol],
          Industry: arr.Industry[symbol],
          prvCls: arr.prvCls[symbol],
          open: arr.open[symbol],
          daylow: arr.daylow[symbol],
          dayhigh: arr.dayhigh[symbol],
          pytRatio: arr.pytRatio[symbol],
          forwardPE: arr.forwardPE[symbol],
          beta: arr.beta[symbol],
          bidSize: arr.bidSize[symbol],
          askSize: arr.askSize[symbol],
          volume: arr.volume[symbol],
          '3mAvgVol': arr['3mAvgVol'][symbol],
          avgvlmn10: arr.avgvlmn10[symbol],
          '50dayavg': arr['50dayavg'][symbol],
          '200dayavg': arr['200dayavg'][symbol],
          QckRatio: arr.QckRatio[symbol],
          CrntRatio: arr.CrntRatio[symbol],
          Trgtmean: arr.Trgtmean[symbol],
          Recommend: arr.Recommend[symbol],
        });
      });
      setData(fixed);
      setLoading(false);
      openNotification(
        `Frequency analysis on ${symbols.length} symbols has finished. Fundamental data is included.`,
      );
    });
  };

  const columns = [
    {
      dataIndex: 'Ticker',
      key: 'Ticker',
      title: '🏷️',
    },
    {
      dataIndex: '24H Total',
      key: '24H Total',
      title: '24H',
      defaultSortOrder: 'descend',
      sorter: (a: Record<string, number>, b: Record<string, number>) =>
        a['24H Total'] - b['24H Total'],
    },
    {
      dataIndex: 'Recent',
      key: 'Recent',
      title: 'Recent',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.Recent - b.Recent,
    },
    {
      dataIndex: 'Prev',
      key: 'Prev',
      title: 'Prev',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.Prev - b.Prev,
    },
    {
      dataIndex: 'Change',
      key: 'Change',
      title: 'Change',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.Change - b.Change,
    },
    {
      dataIndex: 'Rockets',
      key: 'Rockets',
      title: 'Rockets',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.Rockets - b.Rockets,
    },
    {
      dataIndex: 'pennystocks',
      key: 'pennystocks',
      title: 'pennystocks',
      sorter: (a: Record<string, number>, b: Record<string, number>) =>
        a.pennystocks - b.pennystocks,
    },
    {
      dataIndex: 'RobinHoodPennyStocks',
      key: 'RobinHoodPennyStocks',
      title: 'RobinHoodPennyStocks',
      sorter: (a: Record<string, number>, b: Record<string, number>) =>
        a.RobinHoodPennyStocks - b.RobinHoodPennyStocks,
    },
    {
      dataIndex: 'Daytrading',
      key: 'Daytrading',
      title: 'Daytrading',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.Daytrading - b.Daytrading,
    },
    {
      dataIndex: 'StockMarket',
      key: 'StockMarket',
      title: 'StockMarket',
      sorter: (a: Record<string, number>, b: Record<string, number>) =>
        a.StockMarket - b.StockMarket,
    },
    {
      dataIndex: 'stocks',
      key: 'stocks',
      title: 'stocks',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.stocks - b.stocks,
    },
    {
      dataIndex: 'investing',
      key: 'investing',
      title: 'investing',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.investing - b.investing,
    },
    {
      dataIndex: 'wallstreetbets',
      key: 'wallstreetbets',
      title: 'wallstreetbets',
      sorter: (a: Record<string, number>, b: Record<string, number>) =>
        a.wallstreetbets - b.wallstreetbets,
    },
    {
      dataIndex: 'Price',
      key: 'Price',
      title: 'Price',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.Price - b.Price,
    },
    {
      dataIndex: '1DayChange%',
      key: '1DayChange%',
      title: '1D%',
      sorter: (a: Record<string, number>, b: Record<string, number>) =>
        a['1DayChange%'] - b['1DayChange%'],
    },
    {
      dataIndex: '50DayChange%',
      key: '50DayChange%',
      title: '50D%',
      sorter: (a: Record<string, number>, b: Record<string, number>) =>
        a['50DayChange%'] - b['50DayChange%'],
    },
    {
      dataIndex: 'ChangeVol%',
      key: 'ChangeVol%',
      title: 'ChangeVol%',
      sorter: (a: Record<string, number>, b: Record<string, number>) =>
        a['ChangeVol%'] - b['ChangeVol%'],
    },
    {
      dataIndex: 'Float Shares',
      key: 'Float Shares',
      title: 'Float#',
    },
    {
      dataIndex: 'Short/Float%',
      key: 'Short/Float%',
      title: 'Short/Float%',
    },
    {
      dataIndex: 'Industry',
      key: 'Industry',
      title: 'Industry',
    },
    {
      dataIndex: 'prvCls',
      key: 'prvCls',
      title: 'prvCls',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.prvCls - b.prvCls,
    },
    {
      dataIndex: 'open',
      key: 'open',
      title: 'open',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.open - b.open,
    },
    {
      dataIndex: 'daylow',
      key: 'daylow',
      title: 'low',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.daylow - b.daylow,
    },
    {
      dataIndex: 'dayhigh',
      key: 'dayhigh',
      title: 'high',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.dayhigh - b.dayhigh,
    },
    {
      dataIndex: 'pytRatio',
      key: 'pytRatio',
      title: 'pytRatio',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.pytRatio - b.pytRatio,
    },
    {
      dataIndex: 'forwardPE',
      key: 'forwardPE',
      title: 'P/E',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.forwardPE - b.forwardPE,
    },
    {
      dataIndex: 'beta',
      key: 'beta',
      title: 'beta',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.beta - b.beta,
    },
    {
      dataIndex: 'bidSize',
      key: 'bidSize',
      title: 'bid#',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.bidSize - b.bidSize,
    },
    {
      dataIndex: 'askSize',
      key: 'askSize',
      title: 'ask#',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.askSize - b.askSize,
    },
    {
      dataIndex: 'volume',
      key: 'volume',
      title: 'volume',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.volume - b.volume,
    },
    {
      dataIndex: '3mAvgVol',
      key: '3mAvgVol',
      title: '3mAvgVol',
      sorter: (a: Record<string, number>, b: Record<string, number>) =>
        a['3mAvgVol'] - b['3mAvgVol'],
    },
    {
      dataIndex: 'avgvlmn10',
      key: 'avgvlmn10',
      title: 'avgvlmn10',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.avgvlmn10 - b.avgvlmn10,
    },
    {
      dataIndex: '50dayavg',
      key: '50dayavg',
      title: '50dayavg',
      sorter: (a: Record<string, number>, b: Record<string, number>) =>
        a['50dayavg'] - b['50dayavg'],
    },
    {
      dataIndex: '200dayavg',
      key: '200dayavg',
      title: '200dayavg',
      sorter: (a: Record<string, number>, b: Record<string, number>) =>
        a['200dayavg'] - b['200dayavg'],
    },
    {
      dataIndex: 'QckRatio',
      key: 'QckRatio',
      title: 'QckRatio',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.QckRatio - b.QckRatio,
    },
    {
      dataIndex: 'CrntRatio',
      key: 'CrntRatio',
      title: 'CrntRatio',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.CrntRatio - b.CrntRatio,
    },
    {
      dataIndex: 'Trgtmean',
      key: 'Trgtmean',
      title: 'Trgtmean',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.Trgtmean - b.Trgtmean,
    },
    {
      dataIndex: 'Recommend',
      key: 'Recommend',
      title: 'Recommend',
      sorter: (a: Record<string, number>, b: Record<string, number>) => a.Recommend - b.Recommend,
    },
  ];

  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        title="Reddit Analysis"
        extra={
          <Button type="primary" onClick={grabReddit} loading={loading}>
            Process
          </Button>
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
              width: '65%',
            }}
          >
            {data.length > 0 && !loading ? (
              <Space>
                Here is your{' '}
                <Tag color="gold">
                  <img src="/16x16.png" />
                  .AI
                </Tag>
                Reddit data. <CoffeeOutlined style={{ color: '#964B00' }} />
              </Space>
            ) : loading ? (
              <Tag icon={<SyncOutlined spin />} color="processing">
                <img src="/16x16.png" />
                .AI processing
              </Tag>
            ) : (
              <Tag icon={<ClockCircleOutlined />} color="default">
                <img src="/16x16.png" />
                .AI waiting
              </Tag>
            )}
            {!data && !loading ? (
              <Alert
                message="AI data failed 😔"
                showIcon
                description="Bad Reddit data, or can be a result of an API problem!"
                type="warning"
                action={
                  <Button type="dashed" size="small" danger>
                    Report Error
                  </Button>
                }
              />
            ) : (
              ''
            )}
            <Divider dashed />
          </p>
          <div className="site-card-wrapper">
            <Row gutter={24}>
              <Table
                scroll={{ x: 0 }}
                dataSource={data}
                size="small"
                loading={loading}
                columns={columns}
              />
            </Row>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Reddit;
