import {NextPageContext} from 'next';
import {AppStore} from '../redux/store';

export interface CustomNextPageContext extends NextPageContext {
  store: AppStore;
}
