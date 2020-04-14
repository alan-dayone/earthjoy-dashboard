import React, {useState, ReactNode} from 'react';
import { withTranslation } from 'react-i18next'
import {NextComponentType} from 'next';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import i18nextXhrBackend from 'i18next-xhr-backend';
import Cookie from 'js-cookie';
import {
  getBooleanCookieFromRequest,
  getCookieFromRequest
} from "../utils/cookie";
import {CustomNextPageContext} from "./types";
import {logout, selectors} from "../redux/slices/loginUserSlice";
import {isAdmin} from "../models/Account";
import {RootState} from "../redux/slices";

export interface InitialI18nextData {
  initialI18nStore?: object;
  initialLanguage?: string;
}

export const getInitialI18nextData = (i18next): InitialI18nextData => {
  return {
    initialI18nStore: i18next.services.resourceStore.data,
    initialLanguage: i18next.language
  }
};

export const withI18next = (Component): ReactNode => {
  const ExtendedComponent: NextComponentType = withTranslation()(Component);

  ExtendedComponent.getInitialProps = async (
    ctx,
  ): Promise<object> => {
    return Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
  };

  return ExtendedComponent
};
