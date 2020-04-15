import React, {ComponentType} from 'react';
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
import {CustomNextPageContext} from './types';
import {isServer} from '../utils/environment';

interface SsrProps {
  initialI18nStore: Resource;
  initialLanguage: string;
}

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

// export const withI18next = <P extends WithTranslation>(
//   Component: ComponentType<P>,
// ): React.ComponentType<Omit<P, keyof WithTranslation>> => {
//   return withTranslation()(Component);
// };

// export const withI18next1 = () => <P extends WithTranslation>(
//   Component: ComponentType<P>,
// ): React.ComponentType<Omit<P, keyof WithTranslation>> => (
//   props: P,
// ): JSX.Element => {
//   const WrappedComponent = withSSR()(withTranslation()(Component));
//
//   return (
//     <WrappedComponent
//       initialLanguage="en"
//       initialI18nStore={{en: {translation: {login: 'Login 123'}}}}
//       {...(props as Omit<P, keyof WithTranslation>)}
//     />
//   );
// };
//
// export const withI18next4 = () => <P extends WithTranslation>(
//   Component: ComponentType<P>,
// ): React.ComponentType<Omit<P, keyof WithTranslation>> => {
//   const El = (props: P): JSX.Element => {
//     const WrappedComponent = withSSR()(withTranslation()(Component));
//
//     return (
//       <WrappedComponent
//         initialLanguage="en"
//         initialI18nStore={{en: {translation: {login: 'Login 123'}}}}
//         {...(props as Omit<P, keyof WithTranslation>)}
//       />
//     );
//   };
//   return El;
// };

export const withI18next5 = () => <P extends WithTranslation>(
  Component: ComponentType<P>,
): NextComponentType<
  CustomNextPageContext,
  {},
  Omit<P, keyof WithTranslation>
> => {
  const Wrapper = (props: P & SsrProps): JSX.Element => {
    const ComponentWithInjectedProps = withSSR()(withTranslation()(Component));
    console.log(props);
    return (
      <ComponentWithInjectedProps
        initialLanguage={props.initialLanguage}
        initialI18nStore={props.initialI18nStore}
        {...(props as Omit<P, keyof WithTranslation>)}
      />
    );
  };
  Wrapper.getInitialProps = async () => {
    return {
      initialLanguage: 'en',
      initialI18nStore: {en: {translation: {login: 'Login 123'}}},
    };
  };
  return Wrapper;
};

// export const withI18next3 = () => (Component,) => (props,) => {
//   const WrappedComponent = withSSR()(withTranslation()(Component));
//
//   return (
//     <WrappedComponent
//       initialLanguage="en"
//       initialI18nStore={{en: {translation: {login: 'Login 123'}}}}
//       {...props}
//     />
//   );
// };

// export const withI18next2 = (
//   Component,
// ) => {
//   const EnsureI18nStoreComponent: FC<SsrProps> = (): JSX.Element => {
//     const WrappedComponent = withSSR()(withTranslation()(Component));
//
//     return (
//       <WrappedComponent
//         initialLanguage="en"
//         initialI18nStore={{en: {translation: {login: 'Login 123'}}}}
//       />
//     );
//   };
//   return EnsureI18nStoreComponent;
// };

// initialLanguage="en"
// initialI18nStore={{en: {translation: {login: 'Login 123'}}}}
