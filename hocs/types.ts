import {Request, Response} from 'express';
import {NextPageContext} from 'next';
import {AppStore} from '../nredux/store';

export interface CustomNextPageContext extends NextPageContext {
  req?: Request;
  res?: Response;
  store: AppStore;
}
