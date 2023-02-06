import { Button, Result, Typography } from 'antd';
import React from 'react';

const { Paragraph } = Typography;

const BlankPage: React.FC = () => (
  <Result
    status="success"
    title="Successfully Purchased Digits Pro!"
    subTitle={
      <Paragraph>
        <blockquote>
          We will not only use the machines for their intelligence, we will also collaborate with
          them in ways that we cannot even imagine.
          <br />
          <br />-<b>Fei Fei Li</b>
          <br />
          <i>Prof., Computer Science Stanford University</i>
        </blockquote>
      </Paragraph>
    }
    extra={[
      <Button type="primary" key="console" href="/">
        Log in again to begin!
      </Button>,
    ]}
  />
);

export default BlankPage;
