import React from 'react';
import {NextPage, NextPageContext} from 'next';
import i18next, {Resource} from 'i18next';
import {initReactI18next, useSSR} from 'react-i18next';
import i18nextXhrBackend from 'i18next-xhr-backend';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import * as Yup from 'yup';
import {getCookieFromRequest} from '../utils/cookie';
import {isBrowser} from '../utils/environment';

Yup.setLocale({
  mixed: {
    required: (props): string => {
      return i18next.t('validation.isRequired', {labelKey: props.path});
    },
  },
  string: {
    email: (): string => {
      return i18next.t('validation.isEmail');
    },
    min: (props): string => {
      return i18next.t('validation.atLeast', {
        labelKey: props.path,
        limit: props.min,
      });
    },
    max: (props): string => {
      return i18next.t('validation.atMost', {
        labelKey: props.path,
        limit: props.max,
      });
    },
  },
});

if (isBrowser && !i18next.isInitialized) {
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

export const withI18next = <P, IP>(
  Component: NextPage<P, IP>,
): ((props: P) => JSX.Element) => {
  const LoadI18next = (
    props: {
      initialI18nStore: Resource;
      initialLanguage: string;
      pageProps: IP;
    } & P,
  ): JSX.Element => {
    const {initialI18nStore, initialLanguage, pageProps, ...otherProps} = props;
    useSSR(initialI18nStore, initialLanguage);
    return <Component {...pageProps} {...((otherProps as unknown) as P)} />;
  };

  LoadI18next.getInitialProps = async (
    ctx: NextPageContext,
  ): Promise<{
    initialI18nStore: Resource;
    initialLanguage: string;
    pageProps: IP;
  }> => {
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
        : undefined,
      initialLanguage: i18next.language,
      initialI18nStore: i18next.services.resourceStore.data,
    };
  };

  return LoadI18next;
};
