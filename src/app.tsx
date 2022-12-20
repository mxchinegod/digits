import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
/*import { SettingDrawer } from '@ant-design/pro-components';*/
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { parseJwt } from './services/user';
import { currentUser as queryCurrentUser } from './services/user/api';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = ['/user/login', '/user/register', '/user/login?redirect=%2Fwelcome'];

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    // If it is a login page, do not execute
    if (loginPath.includes(window.location.pathname + window.location.search)) {
      return undefined;
    }
    if (['/payment/success', '/payment/failure'].includes(window.location.pathname)) {
      return undefined;
    }
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      console.log(error);
      history.push(loginPath[0]);
    }
    return undefined;
  };

  return {
    fetchUserInfo,
    currentUser: (await fetchUserInfo()) ?? undefined,
    settings: defaultSettings,
  };
}

// ProLayoutAPI https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState /*, setInitialState*/ }) => {
  return {
    rightContentRender: () => <RightContent />,
    waterMarkProps: {
      content: 'DigitsAI Confidential Beta',
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const activeToken = localStorage.getItem('token');
      const dateNow = new Date();

      if (!activeToken) {
        // No token, redirect to login
        history.push(loginPath[0]);
      } else if (parseJwt(activeToken).exp < dateNow.getTime() / 1000) {
        // expired, redirect to login
        history.push(loginPath[0]);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI file</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    childrenRender: (children /*, props*/) => {
      return (
        <>
          {children}
          {/*!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
            )*/}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request configuration，error handling can be configured
 * Based on axios and useRequest hooks
 * @doc https://umijs.org/docs/max/request
 */
export const request = {
  ...errorConfig,
  headers: {
    Authorization: 'Bearer ' + `${localStorage.getItem('token')}`,
  },
};
