import React from 'react';
import {NextComponentType} from 'next';
import i18next, {Resource} from 'i18next';
import {
  initReactI18next,
  withSSR,
  withTranslation,
  WithTranslation,
} from 'react-i18next';
import i18nextXhrBackend from 'i18next-xhr-backend';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import {getCookieFromRequest} from '../utils/cookie';
import {CustomNextPageContext} from './types';
import {isServer} from '../utils/environment';

// export interface InitialI18nextData {
//   initialI18nStore?: Resource;
//   initialLanguage?: string;
// }
//
// export type WithI18nextProps = WithTranslation;
//
// interface WrapperProps {
//   pageProps: object;
//   initialI18nextData: InitialI18nextData;
// }
//
// export const getInitialI18nextData = (i18next): InitialI18nextData => {
//   return {
//     initialI18nStore: i18next.services.resourceStore.data,
//     initialLanguage: i18next.language,
//   };
// };

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

export const withI18next2 = (
  Component,
): NextComponentType<CustomNextPageContext, WrapperProps, WrapperProps> => {
  const ExtendedComponent = (props: WrapperProps): JSX.Element => {
    const ComposedComponent = withSSR()(withTranslation()(Component));
    const {initialI18nStore, initialLanguage, pageProps, ...otherProps} = props;
    return (
      <ComposedComponent
        initialI18nStore={initialI18nStore}
        initialLanguage={initialLanguage}
        {...pageProps}
        {...otherProps}
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
      initialLanguage: i18next.language,
      initialI18nStore: i18next.services.resourceStore.data,
    };
  };

  return ExtendedComponent;
};

// export const withI18next1 = (Component): NextComponentType => {
//   interface WrapperProps {
//     initialI18nStore: Resource;
//     initialLanguage: string;
//     pageProps: object;
//   }
//
//   const ExtendedComponent = ({
//     pageProps,
//     initialI18nStore,
//     initialLanguage,
//   }: WrapperProps): JSX.Element => {
//     const ComposedComponent = withSSR()(withTranslation()(Component));
//     return (
//       <ComposedComponent
//         initialI18nStore={initialI18nStore}
//         initialLanguage={initialLanguage}
//         {...pageProps}
//       />
//     );
//   };
//
//   ExtendedComponent.getInitialProps = async (
//     ctx: CustomNextPageContext,
//   ): Promise<WrapperProps> => {
//     const {req} = ctx;
//     const isServer = !!req;
//
//     if (isServer) {
//       const language = getCookieFromRequest('lng', ctx.req) || 'en';
//       await i18next.use(initReactI18next).init({
//         lng: language,
//         fallbackLng: 'en',
//         resources: {
//           [language]: {
//             translation: require(`../public/static/locales/${language}.json`),
//           },
//         },
//       });
//     }
//
//     return {
//       pageProps: Component.getInitialProps
//         ? await Component.getInitialProps(ctx)
//         : {},
//       initialLanguage: i18next.language,
//       initialI18nStore: i18next.services.resourceStore.data,
//     };
//   };
//
//   return ExtendedComponent;
// };

export const withI18next = () => <IP extends {}, P extends WithTranslation>(
  Component,
): NextComponentType<
  CustomNextPageContext,
  {
    initialI18nStore: Resource;
    initialLanguage: string;
    pageProps: IP;
  },
  Omit<P, keyof WithTranslation>
> => {
  interface SsrProps {
    initialI18nStore: Resource;
    initialLanguage: string;
    pageProps: IP;
  }

  const Wrapper: NextComponentType<CustomNextPageContext, SsrProps, P> = (
    props: SsrProps & P,
  ): JSX.Element => {
    const ComponentWithInjectedProps = withSSR()(withTranslation()(Component));
    const {initialLanguage, initialI18nStore, pageProps, ...otherProps} = props;
    return (
      <ComponentWithInjectedProps
        initialLanguage={initialLanguage}
        initialI18nStore={initialI18nStore}
        {...pageProps}
        {...otherProps}
      />
    );
  };
  Wrapper.getInitialProps = async (ctx): Promise<SsrProps> => {
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

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : undefined;
    return {
      initialLanguage: i18next.language,
      initialI18nStore: i18next.services.resourceStore.data,
      pageProps,
    };
  };

  return Wrapper;
};
