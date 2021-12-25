import { User } from './../users.schema';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class readOnlyUserDto extends PickType(User, [
  'email',
  'name',
] as const) {
  @ApiProperty({
    description: 'id',
    example: 'simiral',
  })
  id: string;
}
