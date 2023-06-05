import { PageContainer } from '@ant-design/pro-components';
import { Comment } from '@ant-design/compatible';
import { Card, Row, Col, Space, Badge, Avatar, Tooltip } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { spCompare } from '@/services/altdata/darkpool';

am4core.useTheme(am4themes_animated);

const DarkPool: React.FC = () => {
  const [spCompareData, setSPCompareData] = useState([]);

  /**
   * It takes data from the server, converts it to a format that the charting library can use, and then
   * sets the state of the component to the new data
   */
  const setDPChartData = async () => {
    spCompare().then((response: any) => {
      response.data.forEach(
        (datum: {
          price: any;
          dix: { toString: () => any };
          color: string;
          gex: { toString: () => any };
        }) => {
          datum.gex = (datum.gex.toString() / 1000000000).toFixed(2);
          datum.dix = (datum.dix.toString() * 100).toFixed(2);
          datum.price = (datum.price.toString() * 1).toFixed(2);
        },
      );
      setSPCompareData(response.data);
    });
  };
  const x = useRef(null);

  /**
   * `createDPChart` is an async function that creates a chart using the `am4charts` library
   * @returns A function that disposes of the chart.
   */
  const createDPChart = async () => {
    const chart = am4core.create('spCompareChart', am4charts.XYChart);
    chart.colors.step = 3;
    chart.data = spCompareData;
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    const d = new Date();
    const pastYear = d.getMonth() - 6;
    d.setMonth(pastYear);
    chart.events.on('ready', function () {
      dateAxis.zoomToDates(d, new Date(), true, false);
    });
    dateAxis.showOnInit = true;
    chart.legend = new am4charts.Legend();
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.tooltipText = '[{stroke}]{name}[/]';

    function createAxisAndSeries(field: string, name: string, opposite: boolean) {
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      if (chart.yAxes.indexOf(valueAxis) != 0) {
        valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
      }
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = 'date';
      series.strokeWidth = 2;
      series.yAxis = valueAxis;
      series.name = name;
      series.tooltipText = '{name}: [bold]{valueY}[/]';
      series.tensionX = 1;
      series.showOnInit = false;
      series.legendSettings.labelText = '[{stroke}]{name}[/]';
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.stroke = series.stroke;
      valueAxis.renderer.labels.template.fill = series.stroke;
      valueAxis.renderer.opposite = opposite;
    }

    createAxisAndSeries('dix', 'Dark Short %', true);
    createAxisAndSeries('gex', 'Gamma Exposure', true);
    createAxisAndSeries('price', 'S&P 500', true);

    x.current = chart;

    return () => {
      chart.dispose();
    };
  };

  if (spCompareData) {
    createDPChart();
  }

  useEffect(() => {
    setDPChartData();
  }, []);
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '500px auto',
            backgroundImage: "url('/brain.png')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: '#1A1A1A',
            }}
          >
            <a href="https://twitter.com/SqueezeMetrics" target="_blank" rel="noreferrer">
              🍋
            </a>{' '}
            Dark Pool
          </div>
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
            <Comment
              author={
                <a
                  href="https://www.investopedia.com/terms/d/dark-pool.asp"
                  target="_blank"
                  rel="noreferrer"
                >
                  Investopedia
                </a>
              }
              avatar={
                <a
                  href="https://www.investopedia.com/terms/d/dark-pool.asp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Avatar
                    src="https://logosandtypes.com/wp-content/uploads/2021/02/investopedia.svg"
                    alt="Investopedia"
                  />
                </a>
              }
              datetime={'Updated May 25, 2022'}
              content={
                <p style={{ backgroundColor: '#fff' }}>
                  A dark pool is a privately organized financial forum or exchange for trading
                  securities. Dark pools allow institutional investors to trade without exposure
                  until after the trade has been executed and reported. Dark pools are a type of
                  alternative trading system (ATS) that gives certain investors the opportunity to
                  place large orders and make trades without publicly revealing their intentions
                  during the search for a buyer or seller.
                </p>
              }
            />
          </p>
          <Row gutter={24}>
            <Col span={24} xl={8} lg={24} md={24} sm={24}>
              <Card
                title="What is GEX?"
                style={{ marginBottom: 15 }}
                extra={
                  <Space>
                    <Badge
                      className="site-badge-count-109"
                      count={'SqueezeMetrics'}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                    <a
                      href="https://squeezemetrics.com/monitor/docs"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source
                    </a>
                  </Space>
                }
              >
                Any time{' '}
                <Tooltip title="Most long options have positive gamma and most short options have negative gamma. Long options have a positive relationship with gamma because as price increases, Gamma increases as well, causing Delta to approach 1 from 0 (long call option) and 0 from −1 (long put option). The inverse is true for short options.">
                  a contract &apos;gamma&apos; <QuestionCircleTwoTone />
                </Tooltip>{' '}
                is under 1.00, puts are relatively more important; any time &apos;gamma&apos; is
                over 1.00, calls are relatively more important. By design, the critically important
                concept of &quot;zero GEX&quot; is completely preserved here (as gamma = 1.00),
                while removing all other confounding factors. So, e.g., if the gamma of all call
                open interest in a stock, across all expirations and strikes, adds up to 500,000
                shares per 1.00% move; and the gamma of all of the same puts adds up to 1,000,000
                shares per 1.00% move, then &apos;gamma&apos; is 0.50. i.e., &quot;there is half as
                much call gamma as put gamma.&quot; Likewise, if call gamma is 20,000 and put gamma
                is 10,000, &apos;gamma&apos; is 2.00. The predictive power of GEX is essentially
                driven by the necessity of option dealers&apos; (market makers&apos;) re-hedging
                activities. In order to limit risk and realize profit, an option market-maker must
                limit their exposure to deltas.
              </Card>
            </Col>
            <Col span={24} xl={8} lg={24} md={24} sm={24}>
              <Card
                title="Okay, what's the Dark Pool Index?"
                style={{ marginBottom: 15 }}
                extra={
                  <Space>
                    <Badge
                      className="site-badge-count-109"
                      count={'SqueezeMetrics'}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                    <a
                      href="https://squeezemetrics.com/monitor/docs"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source
                    </a>
                  </Space>
                }
              >
                The result can be expressed as a decimal (0.0 to 1.0) or as a percentage (like DIX),
                but in either case, it tells us the relative amount of trade volume marked
                &quot;short&quot; in off-exchange (dark) trading. As with gamma, dark becomes more
                powerful when viewed in the context of the other predictors. Because it rises and
                falls without regard to price, volatility, or gamma, it provides an uncorrelated
                signal that frequently tracks sentiment, whether or not that sentiment has been
                reflected in price. This fourth axis is the final dimension of the data. The need
                for each of these four dimensions as inputs is what drives the presentation and
                visualization of the data (it&apos;s not easy to think in 4-D), as well as the
                algorithmic methods with which we derive{' '}
                <Tooltip title="a mathematical description of a random phenomenon in terms of its sample space and the probabilities of events.">
                  probability distributions. <QuestionCircleTwoTone />
                </Tooltip>
              </Card>
            </Col>
            <Col span={24} xl={8} lg={24} md={24} sm={24}>
              <Card
                title="How does this help?"
                style={{ marginBottom: 15 }}
                extra={
                  <Space>
                    <Badge
                      className="site-badge-count-109"
                      count={'SqueezeMetrics'}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                    <a
                      href="https://squeezemetrics.com/monitor/download/pdf/short_is_long.pdf"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source
                    </a>
                  </Space>
                }
              >
                To understand, you need to know how market-makers (MMs) do business. Traditionally,
                market-makers make their money by &quot;quoting a spread.&quot; This means placing a
                bid at, say, $19.95, and an offer at $20.00. Since the MMs have no position in the
                stock, the offer at $20.00 is necessarily entered as a short sale―they don&apos;t
                own it, so they can&apos;t actually sell it... If the belief is that there is little
                probability to a contract obligation, this is typical contrarian signal-making.
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
      <div id="spCompareChart" style={{ width: '100%', height: '500px' }} />
    </PageContainer>
  );
};

export default DarkPool;
