import React from 'react';
import {NextComponentType} from 'next';
import i18next, {Resource} from 'i18next';
import {initReactI18next, withSSR, withTranslation} from 'react-i18next';
import i18nextXhrBackend from 'i18next-xhr-backend';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import {getCookieFromRequest} from '../utils/cookie';
import {CustomNextPageContext} from './types';
import {isServer} from '../utils/environment';

if (!isServer()) {
  if (!i18next.isInitialized) {
    i18next
      .use(i18nextXhrBackend)
      .use(i18nextBrowserLanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        backend: {
          loadPath: '/static/locales/{{lng}}.json',
        },
        detection: {
          lookupCookie: 'lng',
          caches: ['cookie'],
        },
        partialBundledLanguages: true,
      });
  }
}

interface WrapperProps {
  initialI18nStore: Resource;
  initialLanguage: string;
  pageProps: object;
}

export const withI18next = (
  Component,
): NextComponentType<CustomNextPageContext, WrapperProps, WrapperProps> => {
  const LoadI18next = (props: WrapperProps): JSX.Element => {
    const WithSsrAndTransactionProps = withSSR()(withTranslation()(Component));
    const {initialI18nStore, initialLanguage, pageProps, ...otherProps} = props;
    return (
      <WithSsrAndTransactionProps
        initialI18nStore={initialI18nStore}
        initialLanguage={initialLanguage}
        {...pageProps}
        {...otherProps}
      />
    );
  };

  LoadI18next.getInitialProps = async (
    ctx: CustomNextPageContext,
  ): Promise<WrapperProps> => {
    const {req} = ctx;
    const isServer = !!req;

    if (isServer) {
      const language = getCookieFromRequest('lng', req) || 'en';
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
      initialLanguage: i18next.language,
      initialI18nStore: i18next.services.resourceStore.data,
    };
  };

  return LoadI18next;
};
