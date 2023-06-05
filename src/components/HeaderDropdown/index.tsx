import { Dropdown } from 'antd';
import type { DropDownProps } from 'antd/es/dropdown';
import React from 'react';
// import styles from './index.less'

export type HeaderDropdownProps = {
  overlayClassName?: string;
  menu: React.ReactNode | (() => React.ReactNode) | any;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
} & Omit<DropDownProps, 'menu'>;

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown getPopupContainer={(target) => target.parentElement || document.body} {...restProps} />
);

export default HeaderDropdown;
