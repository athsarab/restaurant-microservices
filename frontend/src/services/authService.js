// This file re-exports the auth service from api.js
// to maintain backward compatibility with existing imports
import { authService as service } from './api';

export const authService = service;
