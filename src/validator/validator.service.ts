import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { CURRENCIES } from '../currencies/currencies.constants';
import { SAVING_ACTION_TYPE } from '../savings/savings.constants';

@Injectable()
export class ValidatorService {
  @Inject(WINSTON_MODULE_PROVIDER)
  private readonly logger: Logger;

  getIsRequiredFields(...args): boolean {
    const isNotValid = args.some((arg) => {
      if (typeof arg === 'number') {
        return false;
      }
      return !Boolean(arg);
    });

    if (isNotValid) {
      this.logger.info(`Ошибка валидации обязательных полей ${args}`);
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    return isNotValid;
  }

  getIsEqualCurrency(one: CURRENCIES, two: CURRENCIES) {
    const isNotValid = one !== two;

    if (isNotValid) {
      this.logger.info(`Попытка изменить типы валюты`);
      throw new HttpException('Не возможно изменить тип валюты', HttpStatus.BAD_REQUEST);
    }

    return isNotValid;
  }

  getIsEqualActionSavingTypes(one: SAVING_ACTION_TYPE, two: SAVING_ACTION_TYPE) {
    const isNotValid = one !== two;

    if (isNotValid) {
      this.logger.info(`Попытка изменить типа факта в копилке`);
      throw new HttpException('Не возможно изменить типа факта в копилке', HttpStatus.BAD_REQUEST);
    }

    return isNotValid;
  }
}

export const VALIDATOR_NAME = 'Validator';
