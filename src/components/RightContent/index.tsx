import { QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang, useModel } from '@umijs/max';
import { Space, Modal } from 'antd';
import // historicalPrices,
// secFiling,
// financialGrowth,
// dcf,
// erTranscript,
// senateDisclosure,
// financialRatios,
'@/services/finmoddata/finmodapi';
import { historicalPrices } from '@/services/tdadata/tdaapi';
import React, { useState, useRef } from 'react';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import moment from 'moment';
moment.locale('en');

am4core.useTheme(am4themes_animated);

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [modalOpen, openModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [symbol, setSymbol] = useState('');
  const x = useRef(null);
  const [histPrices, setHistoricalPrices] = useState([]);
  const _setSymbol = (val: string) => {
    const sym = val.replace(/[^a-zA-Z]+/g, '').toUpperCase();
    setSymbol(sym);
  };
  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'realDark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const createHistoricalPricesChart = async () => {
    console.log(histPrices);
    // Create chart
    const chart = am4core.create('historicalPricesChart', am4charts.XYChart);
    chart.padding(0, 15, 0, 15);

    // Load data
    chart.data = histPrices;
    // the following line makes value axes to be arranged vertically.
    chart.leftAxesContainer.layout = 'vertical';
    // uncomment this line if you want to change order of axes
    //chart.bottomAxesContainer.reverseOrder = true;
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.skipEmptyPeriods = true;
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.ticks.template.length = 8;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = false;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
    dateAxis.renderer.minLabelPosition = 0.01;
    dateAxis.renderer.maxLabelPosition = 0.99;
    dateAxis.keepSelection = true;
    dateAxis.minHeight = 30;
    dateAxis.groupData = false;
    dateAxis.minZoomCount = 5;
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.zIndex = 1;
    valueAxis.renderer.baseGrid.disabled = true;
    // height of axis
    valueAxis.height = am4core.percent(65);
    valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis.renderer.labels.template.padding(2, 2, 2, 2);
    //valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis.renderer.fontSize = '0.8em';
    const series = chart.series.push(new am4charts.CandlestickSeries());
    series.dataFields.dateX = 'datetime';
    series.dataFields.openValueY = 'open';
    series.dataFields.valueY = 'close';
    series.dataFields.lowValueY = 'low';
    series.dataFields.highValueY = 'high';
    series.clustered = true;
    series.tooltipText =
      'open: {openValueY}\nlow: {lowValueY}\nhigh: {highValueY}\nclose: {valueY}';
    series.name = symbol;
    series.defaultState.transitionDuration = 0;
    const valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    // height of axis
    valueAxis2.height = am4core.percent(35);
    valueAxis2.zIndex = 3;
    // this makes gap between panels
    valueAxis2.marginTop = 30;
    valueAxis2.renderer.baseGrid.disabled = true;
    valueAxis2.renderer.inside = true;
    valueAxis2.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis2.renderer.labels.template.padding(2, 2, 2, 2);
    //valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis2.renderer.fontSize = '0.8em';
    valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;
    const series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.dateX = 'datetime';
    series2.clustered = true;
    series2.dataFields.valueY = 'volume';
    series2.yAxis = valueAxis2;
    series2.tooltipText = '{valueY.value}';
    series2.name = 'Series 2';
    // volume should be summed
    series2.groupFields.valueY = 'sum';
    series2.defaultState.transitionDuration = 0;
    chart.cursor = new am4charts.XYCursor();
    const scrollbarX = new am4charts.XYChartScrollbar();

    const sbSeries = chart.series.push(new am4charts.LineSeries());
    sbSeries.dataFields.valueY = 'close';
    sbSeries.dataFields.dateX = 'datetime';
    scrollbarX.series.push(sbSeries);
    sbSeries.disabled = true;
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;
    scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;
    x.current = chart;

    return () => {
      chart.dispose();
    };
  };
  const getEquityData = (val: any) => {
    _setSymbol(val);
    // Premium :(
    // financialGrowth({
    //   data: {
    //     symbol: val.replace(/[^a-zA-Z]+/g, ''),
    //     email: initialState?.currentUser?.email,
    //     insert: { quota: { type: 'Research Model', date: moment().format() } },
    //   },
    // }).then((financialGrowthRes: any) => {
    //   //console.log(financialGrowthRes);
    // });
    // // Premium :(
    // financialRatios({
    //   data: {
    //     symbol: val.replace(/[^a-zA-Z]+/g, ''),
    //     email: initialState?.currentUser?.email,
    //     insert: { quota: { type: 'Research Model', date: moment().format() } },
    //   },
    // }).then((financialRatiosRes: any) => {
    //   //console.log(financialRatiosRes);
    // });
    // // Premium :(
    // erTranscript({
    //   data: {
    //     symbol: val.replace(/[^a-zA-Z]+/g, ''),
    //     email: initialState?.currentUser?.email,
    //     insert: { quota: { type: 'Research Model', date: moment().format() } },
    //   },
    // }).then((erTranscriptRes: any) => {
    //   //console.log(erTranscriptRes);
    // });
    // // Premium :(
    // senateDisclosure({
    //   data: {
    //     symbol: val.replace(/[^a-zA-Z]+/g, ''),
    //     email: initialState?.currentUser?.email,
    //     insert: { quota: { type: 'Research Model', date: moment().format() } },
    //   },
    // }).then((senateDisclosureRes: any) => {
    //   //console.log(senateDisclosureRes);
    // });
    // dcf({
    //   data: {
    //     symbol: val.replace(/[^a-zA-Z]+/g, ''),
    //     email: initialState?.currentUser?.email,
    //     insert: { quota: { type: 'Research Model', date: moment().format() } },
    //   },
    // }).then((dcfRes: any) => {
    //   //console.log(dcfRes);
    // });
    // secFiling({
    //   data: {
    //     symbol: val.replace(/[^a-zA-Z]+/g, ''),
    //     email: initialState?.currentUser?.email,
    //     insert: { quota: { type: 'Research Model', date: moment().format() } },
    //   },
    // }).then((secFilingRes: any) => {
    //   //console.log(secFilingRes);
    // });
    historicalPrices({
      data: {
        symbol: val.replace(/[^a-zA-Z]+/g, ''),
        email: initialState?.currentUser?.email,
        insert: { quota: { type: 'Research Model', date: moment().format() } },
      },
    }).then((histPricesRes: any) => {
      setHistoricalPrices(histPricesRes.data.candles);
      if (histPrices) {
        createHistoricalPricesChart();
        setProcessing(false);
      }
    });
  };

  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="symbol"
        options={[]}
        onSearch={(value) => {
          setProcessing(true);
          openModal(true);
          getEquityData(value);
        }}
      />
      <span
        className={styles.action}
        onClick={() => {
          window.open('https://github.com/DylanAlloy/digits/issues');
        }}
      >
        <QuestionCircleOutlined />
      </span>
      <Avatar />
      <SelectLang className={styles.action} />
      <Modal
        title={processing ? processing : 'Loading'}
        centered
        destroyOnClose={true}
        open={modalOpen}
        onOk={() => openModal(false)}
        onCancel={() => openModal(false)}
        style={{ minWidth: '75%' }}
      >
        <div id="historicalPricesChart" style={{ width: '100%', height: '500px' }} />

        {processing ? <p>done processing ${symbol}</p> : <p>processing ${symbol}</p>}
      </Modal>
    </Space>
  );
};
export default GlobalHeaderRight;
