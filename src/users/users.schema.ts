import { Comments } from './../comments/comments.schema';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true, //db에서 하나 만들어질때마다 timestamp 찍음!
};

@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: 'jihoon806@gmail.com',
    required: true,
    description: 'email',
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '백지훈',
    required: true,
    description: 'name',
  })
  @Prop({
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '1q2w3e4r!',
    required: true,
    description: 'password',
  })
  @Prop({
    required: true,
  })
  @IsString()
  password: string;

  @Prop({
    default:
      'https://raw.githubusercontent.com/amamov/teaching-nestjs-a-to-z/main/images/1.jpeg',
  })
  imgUrl: string;

  @Prop()
  @IsBoolean()
  adultAuth: boolean;

  readonly readOnlyData: {
    email: string;
    id: string;
    name: string;
    imgUrl: string;
    comments: Comments[];
  };

  readonly comments: Comments[];
}

const _UserSchema = SchemaFactory.createForClass(User);

_UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    email: this.email,
    id: this.id,
    name: this.name,
    imgUrl: this.imgUrl,
    comments: this.comments,
  };
});

_UserSchema.virtual('comments', {
  ref: 'comments',
  localField: '_id',
  foreignField: 'info',
});
_UserSchema.set('toObject', { virtuals: true });
_UserSchema.set('toJSON', { virtuals: true });

export const UserSchema = _UserSchema;
