import Footer from '@/components/Footer';
import { register } from '@/services/user/api';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, SelectLang, useIntl } from '@umijs/max';
import { Alert, message, Tabs, Modal } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import type { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './styles.css';

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    // Prod: pk_live_efNoQ4Hk5I5jsMXINvh0YTMD
    // Dev
    stripePromise = loadStripe('pk_test_5ikem4Zc1QoyRuWV1ljpMDwM');
  }

  return stripePromise;
};
const RegisterMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Register: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [product, setProduct] = useState('monthly');

  const item = {
    price:
      product == 'monthly' ? 'price_1M0AsaAy6KNxnnbKOTjIk6dC' : 'price_1MELQNAy6KNxnnbKq2bQC2iV',
    quantity: 1,
  };

  const checkoutOptions = {
    lineItems: [item],
    mode: product == 'monthly' ? 'subscription' : 'payment',
    successUrl: `${window.location.origin}/payment/success`,
    cancelUrl: `${window.location.origin}/payment/failure`,
  };

  const redirectToCheckout = async () => {
    setLoading(true);
    console.log('redirectToCheckout');

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout(checkoutOptions);
    console.log('Stripe checkout error', error);

    if (error) setStripeError(error.message);
    setLoading(false);
  };

  if (stripeError) alert(stripeError);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const intl = useIntl();
  const handleSubmit = async (values: API.RegisterParams) => {
    try {
      // Register
      const msg = await register({ ...values });
      if (msg.type === 'success') {
        const defaultRegisterSuccessMessage = intl.formatMessage({
          id: 'pages.register.success',
          defaultMessage: 'registerSucceeded',
        });
        message.success(defaultRegisterSuccessMessage);
        showModal();
        return;
      } else {
        const defaultRegisterFailureMessage = intl.formatMessage({
          id: 'pages.register.failure',
          defaultMessage: 'registerFailedPleaseTryAgain',
        });
        message.error(defaultRegisterFailureMessage);
      }
      console.log(msg);
    } catch (error) {
      const defaultRegisterFailureMessage = intl.formatMessage({
        id: 'pages.register.failure',
        defaultMessage: 'registerFailedPleaseTryAgain',
      });
      message.error(defaultRegisterFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/digits2.gif" />}
          action="Register"
          title="Digits"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.register.accountRegister.tab',
                  defaultMessage: 'Welcome to Digits',
                }),
              },
            ]}
          />

          {status === 'error' && (
            <RegisterMessage
              content={intl.formatMessage({
                id: 'pages.register.accountRegister.errorMessage',
                defaultMessage: '',
              })}
            />
          )}
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.username.placeholder',
                defaultMessage: 'desired username',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.username.required"
                      defaultMessage="username required"
                    />
                  ),
                },
              ]}
            />
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.email.placeholder',
                defaultMessage: 'a good email',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.email.required"
                      defaultMessage="email required"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.password.placeholder',
                defaultMessage: 'use a 1st party manager',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.password.required"
                      defaultMessage="password required"
                    />
                  ),
                },
              ]}
            />
          </>

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <a
              href="/user/login"
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.register.existing" defaultMessage="Already a member?" />
            </a>
            <br />
            <Modal
              title="Checkout"
              open={isModalOpen}
              onOk={redirectToCheckout}
              confirmLoading={isLoading}
              okText={'Checkout'}
              onCancel={handleCancel}
            >
              <Tabs
                onChange={(key) => {
                  setProduct(key);
                }}
                defaultActiveKey="1"
                centered
                items={[
                  {
                    label: `Monthly`,
                    key: 'monthly',
                    children: (
                      <>
                        <center>
                          <div className="checkout">
                            <p className="checkout-title">Digits Pro Monthly</p>
                            <p className="checkout-description">
                              the most precise real-time market analysis platform.
                            </p>
                            <h1 className="checkout-price">$14.99/mo</h1>
                            <img
                              src={'/digits2.gif'}
                              style={{ maxWidth: '200px' }}
                              className="checkout-product-image"
                              alt="Product"
                            />
                          </div>
                        </center>
                      </>
                    ),
                  },
                  {
                    label: `Annual`,
                    key: 'annual',
                    children: (
                      <>
                        <center>
                          <div className="checkout">
                            <p className="checkout-title">Digits Pro Annual</p>
                            <p className="checkout-description">
                              the most precise real-time market analysis platform.
                            </p>
                            <h1 className="checkout-price">$149.88</h1>
                            <img
                              src={'/digits2.gif'}
                              style={{ maxWidth: '200px' }}
                              className="checkout-product-image"
                              alt="Product"
                            />
                          </div>
                        </center>
                      </>
                    ),
                  },
                ]}
              />
            </Modal>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
