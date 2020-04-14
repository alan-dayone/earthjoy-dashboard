import React, {ReactNode} from 'react';
import {Resource, TFunction, i18n} from 'i18next';
import {initReactI18next, withSSR, withTranslation} from 'react-i18next';
import i18next from 'i18next';
import i18nextXhrBackend from 'i18next-xhr-backend';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import {getCookieFromRequest} from '../utils/cookie';
import {CustomNextPageContext} from './types';
import {isServer} from '../utils/environment';

export interface InitialI18nextData {
  initialI18nStore?: Resource;
  initialLanguage?: string;
}

export interface WithI18nextProps {
  t: TFunction;
  i18n: i18n;
  ready: boolean;
}

interface WrapperProps {
  pageProps: object;
  initialI18nextData: InitialI18nextData;
}

export const getInitialI18nextData = (i18next): InitialI18nextData => {
  return {
    initialI18nStore: i18next.services.resourceStore.data,
    initialLanguage: i18next.language,
  };
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

export const withI18next = (Component): ReactNode => {
  const ExtendedComponent = ({
    pageProps,
    initialI18nextData,
  }: WrapperProps): JSX.Element => {
    const ComposedComponent = withSSR()(withTranslation()(Component));
    return (
      <ComposedComponent
        initialI18nStore={initialI18nextData.initialI18nStore}
        initialLanguage={initialI18nextData.initialLanguage}
        {...pageProps}
      />
    );
  };

  ExtendedComponent.getInitialProps = async (
    ctx: CustomNextPageContext,
  ): Promise<WrapperProps> => {
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
    };
  };

  return ExtendedComponent;
};
