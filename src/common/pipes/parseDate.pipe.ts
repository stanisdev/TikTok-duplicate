import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';


@Injectable()
export class ParseDatePipe implements PipeTransform {
  constructor() {}

  transform(from: string) {
    const date = new Date(+from);
    if (date.toString() == 'Invalid Date') {
      throw new BadRequestException();
    }
    return date;
  }
}
