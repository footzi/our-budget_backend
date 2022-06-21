import { SuccessHandler } from './interfaces';

export const successHandler = (): SuccessHandler => {
  return {
    success: true,
  };
};
