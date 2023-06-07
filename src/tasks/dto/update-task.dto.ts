import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskStatusDto{
  // @IsEnum(TaskStatus)
  status: TaskStatus;
  title: string;
  description: string;
}
