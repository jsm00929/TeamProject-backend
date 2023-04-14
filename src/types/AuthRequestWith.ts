import { AuthRequest } from './AuthRequest';
import { RequestWith } from './RequestWith';

export interface AuthRequestWith<T> extends RequestWith<T>, AuthRequest {}
