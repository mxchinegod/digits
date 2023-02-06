import { Button, Result, Typography } from 'antd';
import React from 'react';

const { Paragraph } = Typography;

const BlankPage: React.FC = () => (
  <Result
    status="warning"
    title="There are some problems with your payment method or linking your email!"
    subTitle={
      <Paragraph>
        <blockquote>
          An AI utopia is a place where people have income guaranteed because their machines are
          working for them. Instead, they focus on activities that they want to do, that are
          personally meaningful like art or, where human creativity still shines, in science.
          <br />
          <br />-<b>Oren Etzioni </b>
          <br />
          <i>CEO, Allen Institute for Artificial Intelligence</i>
        </blockquote>
      </Paragraph>
    }
    extra={
      <Button type="primary" key="console" href="mailto:dylan@thisiswhereidostuff.com">
        Click me to get help!
      </Button>
    }
  />
);

export default BlankPage;
