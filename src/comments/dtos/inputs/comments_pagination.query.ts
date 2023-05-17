import { IsIn } from 'class-validator';
import { PaginationQuery } from '../../../core/dtos/inputs';

export class CommentsPaginationQuery extends PaginationQuery {
  @IsIn(['desc', 'asc'])
  order: string;

  constructor(after?: number, count?: number, order = 'desc') {
    super(after, count);
    this.order = order;
  }
}
