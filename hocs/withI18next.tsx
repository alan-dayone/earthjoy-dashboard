import React, {useState, ReactNode} from 'react';
import { withTranslation, withSSR } from 'react-i18next'
import {NextComponentType} from 'next';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import i18nextXhrBackend from 'i18next-xhr-backend';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import Cookie from 'js-cookie';
import {
  getBooleanCookieFromRequest,
  getCookieFromRequest
} from "../utils/cookie";
import {CustomNextPageContext} from "./types";
import {logout, selectors} from "../redux/slices/loginUserSlice";
import {isAdmin} from "../models/Account";
import {RootState} from "../redux/slices";
import {isServer} from "../utils/environment";

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

if (!isServer()) {
  if (!i18next.isInitialized) {
    i18next
      .use(i18nextXhrBackend)
      .use(i18nextBrowserLanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        backend: {
          loadPath: '/static/locales/{{lng}}.json'
        },
        detection: {
          lookupCookie: 'lng',
          caches: ['cookie'],
        },
        partialBundledLanguages: true,
      });
  }
}

export const withI18next = (Component): ReactNode => {
  const ExtendedComponent = ({pageProps, initialI18nextData}) => {
    const ComposedComponent = withSSR()(withTranslation()(Component));
    return (
      <ComposedComponent
        initialI18nStore={initialI18nextData.initialI18nStore}
        initialLanguage={initialI18nextData.initialLanguage}
        {...pageProps}
      />
    )
  };

  ExtendedComponent.getInitialProps = async (
    ctx: CustomNextPageContext,
  ): Promise<{pageProps: object, initialI18nextData: InitialI18nextData}> => {
    const {req} = ctx;
    const isServer = !!req;

    if (isServer) {
      const language = getCookieFromRequest('lng', ctx.req) || 'en';
      await i18next.use(initReactI18next).init({
        lng: language,
        fallbackLng: 'en',
        resources: {
          [language]: {
            translation: require(`../public/static/locales/${language}.json`),
          },
        },
      });
    }

    return {
      pageProps: Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {},
      initialI18nextData: isServer ? getInitialI18nextData(i18next) : {},
    }
  };

  return ExtendedComponent;
};
