import { PageContainer } from '@ant-design/pro-components';
import { Comment } from '@ant-design/compatible';
import {
  Card,
  Row,
  Col,
  Space,
  Badge,
  Result,
  Avatar,
  Input,
  Switch,
  Tooltip,
  DatePicker,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleTwoTone } from '@ant-design/icons';
import React, { useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { volatility } from '@/services/tdadata/tdaapi';
import moment from 'moment';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

am4core.useTheme(am4themes_animated);
const { Search } = Input;

const Volatility: React.FC = () => {
  const [exp, setExp] = useState('');
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [put, setPut] = useState(false);
  const strikeCount = 100;

  /**
   * It creates a chart with two lines, one for volatility and one for theoretical volatility
   * @returns A function that disposes of the chart.
   */
  const createVolatilityChart = (
    val: any,
    underlyingData: { mark: any; open: any; low: any },
    working: any[],
  ) => {
    const chart = am4core.create('volatilityChart', am4charts.XYChart);
    am4core.options.autoDispose = true;

    chart.data = working;
    chart.exporting.menu = new am4core.ExportMenu();
    const expAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    expAxis.dataFields.category = 'strike';
    expAxis.showOnInit = true;
    //chart.legend = new am4charts.Legend();
    const underlyingLabel = chart.createChild(am4core.Label);
    const pinLabel = chart.createChild(am4core.Label);
    pinLabel.text = `📌 ${val}`;
    pinLabel.fontSize = 36;
    pinLabel.align = 'center';
    pinLabel.isMeasured = false;
    pinLabel.x = am4core.percent(10);
    pinLabel.y = am4core.percent(2);
    pinLabel.horizontalCenter = 'middle';
    underlyingLabel.text = `⚖️ mark: ${underlyingData.mark}\n ⏰ open: ${underlyingData.open}\n 🪜 low: ${underlyingData.low}`;
    underlyingLabel.fontSize = 20;
    underlyingLabel.align = 'center';
    underlyingLabel.isMeasured = false;
    underlyingLabel.x = am4core.percent(10);
    underlyingLabel.y = am4core.percent(10);
    underlyingLabel.horizontalCenter = 'middle';
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.tooltipText = '[{stroke}]{name}[/]';
    chart.leftAxesContainer.layout = 'vertical';
    const oiAxis = chart.yAxes.push(new am4charts.ValueAxis());
    oiAxis.height = am4core.percent(35);
    oiAxis.zIndex = 3;
    oiAxis.marginTop = 400;
    oiAxis.renderer.baseGrid.disabled = true;
    oiAxis.renderer.inside = true;
    oiAxis.renderer.labels.template.verticalCenter = 'bottom';
    oiAxis.renderer.labels.template.padding(2, 2, 2, 2);
    oiAxis.renderer.maxLabelPosition = 0.95;
    oiAxis.renderer.fontSize = '0.8em';

    oiAxis.renderer.gridContainer.background.fill = am4core.color('#000000');
    oiAxis.renderer.gridContainer.background.fillOpacity = 0.05;

    const columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.name = 'Open Interest';
    columnSeries.yAxis = oiAxis;
    columnSeries.dataFields.valueY = 'openInterest';
    columnSeries.dataFields.categoryX = 'strike';
    columnSeries.strokeWidth = 10;
    columnSeries.tooltipText = '{name}: [bold]{valueY}[/]';
    columnSeries.showOnInit = false;
    columnSeries.legendSettings.labelText = '[{stroke}]{name}[/]';
    function createAxisAndSeries(field: string, name: string, opposite: boolean) {
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = 'strike';
      series.propertyFields.stroke = 'color';
      series.strokeWidth = 10;
      series.yAxis = valueAxis;
      series.name = name;
      series.tooltipText = '{name}: [bold]{valueY}[/]';
      series.tensionX = 1;
      series.showOnInit = true;
      series.legendSettings.labelText = '[{stroke}]{name}[/]';
      valueAxis.renderer.line.strokeOpacity = 0.5;
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.stroke = series.stroke;
      valueAxis.renderer.labels.template.fill = series.stroke;
      valueAxis.renderer.opposite = opposite;
    }
    createAxisAndSeries('vol', `${symbol} Strike Volatility`, true);
  };
  const setExpiration = (val: Dayjs | null) => {
    const expiration = dayjs(val).format('YYYY-MM-DD');
    setExp(expiration);
  };
  const setSym = (val: string) => {
    const sym = val.replace(/[^a-zA-Z]+/g, '');
    setSymbol(sym);
  };
  /**
   * It sets the volatility data for the chart.
   */
  const setVolatilityChartData = (val: any) => {
    setSym(val);
    setLoading(true);
    setError(false);
    if (exp && val.replace(/[^a-zA-Z]+/g, '')) {
      volatility({
        data: {
          symbol: val.replace(/[^a-zA-Z]+/g, ''),
          type: put ? 'PUT' : 'CALL',
          strikeCount: strikeCount.toString(),
          fromDate: exp,
          toDate: exp,
        },
      }).then((response: any) => {
        if (response.data.strikeMap) {
          const working = response.data.strikeMap.sort(
            (a: { strike: string }, b: { strike: string }) =>
              parseFloat(a.strike) > parseFloat(b.strike) ? 1 : -1,
          );
          if (
            response.data.pin &&
            working.length > 1 &&
            exp.length > 0 &&
            val.replace(/[^a-zA-Z]+/g, '').length > 0
          ) {
            setLoading(false);
            createVolatilityChart(response.data.pin, response.data.underlying, working);
          }
        } else {
          setError(true);
          setLoading(false);
        }
      });
    } else {
      console.log('---Noped out with---\n');
      console.log({
        Value: symbol,
        Expiration: exp,
      });
    }
  };

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
            <a href="https://twitter.com/jam_croissant" target="_blank" rel="noreferrer">
              🥐
            </a>{' '}
            Volatility
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
                  href="https://www.investopedia.com/articles/investing/021716/strategies-trading-volatility-options-nflx.asp"
                  target="_blank"
                  rel="noreferrer"
                >
                  Investopedia
                </a>
              }
              avatar={
                <a
                  href="https://www.investopedia.com/articles/investing/021716/strategies-trading-volatility-options-nflx.asp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Avatar
                    src="https://logosandtypes.com/wp-content/uploads/2021/02/investopedia.svg"
                    alt="Investopedia"
                  />
                </a>
              }
              datetime={'Updated March 22, 2022'}
              content={
                <p style={{ backgroundColor: '#fff' }}>
                  <h3>Key Takeaways</h3>
                  <ul>
                    <li>
                      Options prices depend crucially on the estimated future volatility of the
                      underlying asset.
                    </li>
                    <li>
                      As a result, while all the other inputs to an option&apos;s price are known,
                      people will have varying expectations of volatility.
                    </li>
                    <li>
                      Trading volatility, therefore, becomes a key set of strategies used by options
                      traders.
                    </li>
                  </ul>
                </p>
              }
            />
          </p>
          <Row gutter={24}>
            <Col span={24} xl={8} lg={24} md={24} sm={24}>
              <Card
                title="What is 'vol'?"
                style={{ marginBottom: 15 }}
                extra={
                  <Space>
                    <Badge
                      className="site-badge-count-109"
                      count={'Wikipedia'}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                    <a href="https://en.wikipedia.org/wiki/Heston_model">Source</a>
                  </Space>
                }
              >
                &apos;Vol&apos; is common shorthand for <b>volatility</b>. tVol is theoretical
                volatility, meaning it&apos;s skewed for real-world probability using the{' '}
                <Tooltip title="In finance, the Heston model, named after Steven L. Heston, is a mathematical model that describes the evolution of the volatility of an underlying asset. It is a stochastic volatility model: such a model assumes that the volatility of the asset is not constant, nor even deterministic, but follows a random process.">
                  Heston Model <QuestionCircleTwoTone />
                </Tooltip>
                . Measuring the volatility over strikes and dates allows for a 4-dimensional
                understanding of the probability space in the options market.
              </Card>
            </Col>
            <Col span={24} xl={8} lg={24} md={24} sm={24}>
              <Card
                title="Why is this remarkable?"
                style={{ marginBottom: 15 }}
                extra={
                  <Space>
                    <Badge
                      className="site-badge-count-109"
                      count={'NYU'}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                    <a
                      href="https://pages.stern.nyu.edu/~asavov/alexisavov/Alexi_Savov_files/DMS_Liquidity_and_Volatility.pdf"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source
                    </a>
                  </Space>
                }
              >
                &quot;We test the model in the cross section of short-term reversals, which mimic
                the portfolios of liquidity providers. As predicted by the model, reversals have
                large{' '}
                <Tooltip title="The beta (β) of a stock or portfolio is a number describing the volatility of an asset in relation to the volatility of the benchmark that said asset is being compared to. This benchmark is generally the overall financial market and is often estimated via the use of representative indices, such as the S&P 500.">
                  negative betas <QuestionCircleTwoTone />
                </Tooltip>{' '}
                to aggregate volatility shocks. These betas explain reversals&apos; average returns
                with the same price of volatility risk that prevails in option markets. Volatility
                risk thus explains the liquidity premium among stocks, and why it increases in
                volatile times.&quot;
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
                      count={'Kai Volatility'}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                    <a
                      href="https://www.youtube.com/watch?v=2ySu499wb1o"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source
                    </a>
                  </Space>
                }
              >
                Another way to think of volatility is &quot;disagreement in value estimations&quot;
                since indeed, if there is a disagreement on prices there will be difference in the
                market sale price relative to the mean of the ask and offer, or the ask. Yet a
                deeper understanding comes from imagining two markets: one where there are few
                participants and one where there are many, all with their own idea of value. The
                probability distribution that may come from measuring volatility is only as useful
                as the amount of liquidity involved. Thus, the most useful way to think about
                volatility is &apos;lack of liquidity&apos;.
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
      <Card>
        <Space size={6}>
          <DatePicker format={'YYYY-MM-DD'} onChange={setExpiration} placeholder="Expiration" />
          <Search
            style={{ maxWidth: '300px' }}
            placeholder="SPY, TSLA, AAPL, etc."
            loading={loading}
            onSearch={setVolatilityChartData}
          />
          <Switch checkedChildren="PUTs🫡" unCheckedChildren="PUTs🤔" onChange={setPut} />

          {exp && symbol ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          {exp && symbol
            ? `Displaying ${strikeCount} $${symbol} ${put ? 'PUT' : 'CALL'} strikes for ${moment(
                exp,
              ).format('YYYY-MM-DD')}`
            : `Fill form details`}
        </Space>
        {!error ? (
          <div id="volatilityChart" style={{ width: '100%', height: '600px' }} />
        ) : (
          <Result
            status="error"
            title="Symbol not found"
            subTitle="Indices have different symbols across exchanges, try the '^' or '.' listing."
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default Volatility;
