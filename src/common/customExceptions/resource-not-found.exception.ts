import { BusinessException } from './business.exception';
import { CommonErrors } from '../response/errors';

/**
 * Resource를 찾지 못할 경우에 발생시키는 exception
 * @param message string 에러 메시지
 */
export class ResourceNotFoundException extends BusinessException {
  constructor(message: string = CommonErrors.RESOURCE_NOT_FOUND_ERROR) {
    super(message, 400);
  }
}
