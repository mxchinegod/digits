import Footer from '@/components/Footer';
import { currentUser, login } from '@/services/user/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl, useModel } from '@umijs/max';
import { Alert, message, Tabs, Modal } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import type { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    // Prod: pk_live_efNoQ4Hk5I5jsMXINvh0YTMD
    // Dev
    stripePromise = loadStripe('pk_test_5ikem4Zc1QoyRuWV1ljpMDwM');
  }

  return stripePromise;
};

/* A React component that displays an error message. */
const LoginMessage: React.FC<{
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

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<
    API.LoginResult | { status: 'uninitialized' }
  >({ status: 'uninitialized' });
  const { setInitialState } = useModel('@@initialState');
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

  /**
   * A function that handles the login process.
   * @param values - API.LoginParams
   */
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const msg = await login({ ...values });
      if (msg.type === 'success') {
        localStorage.setItem('token', msg.message);
        const userInfo = await currentUser();
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo?.data ?? undefined,
        }));

        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'loginSucceeded',
        });
        message.success(defaultLoginSuccessMessage);
        if (!userInfo.data.paid) {
          showModal();
        } else {
          // URL(window.location.href).searchParams;
          history.push('/');
          return;
        }
      } else {
        const defaultLoginFailureMessage = intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: 'loginFailedPleaseTryAgain',
        });
        message.error(defaultLoginFailureMessage);
      }
      console.log(msg);
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'loginFailedPleaseTryAgain',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/digits2.gif" />}
          title={''}
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: 'accountPasswordLogin',
                }),
              },
            ]}
          />

          {status === 'error' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
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
                id: 'pages.login.username.placeholder',
                defaultMessage: 'admin or user',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="enterOneUserName!"
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
                id: 'pages.login.password.placeholder',
                defaultMessage: 'ant.design',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="pleaseInputAPassword"
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
            {/* <a>
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="Forgot password?" />
            </a> */}
            <a
              href="/user/register"
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.newUserRegister" defaultMessage="newUserRegister" />
            </a>
            <br />
          </div>
        </LoginForm>
      </div>
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
      <Footer />
    </div>
  );
};

export default Login;
