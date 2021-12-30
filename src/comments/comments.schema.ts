import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { Document, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true, //db에서 하나 만들어질때마다 timestamp 찍음!
};

@Schema(options)
export class Comments extends Document {
  @ApiProperty({
    required: true,
    description: '댓글 작성한 유저 id',
  })
  @Prop({
    types: Types.ObjectId,
    required: true,
    unique: true,
    ref: 'users',
  })
  @IsNotEmpty()
  author: Types.ObjectId;

  @ApiProperty({
    required: true,
    description: 'content of comment',
  })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    required: true,
    description: '좋아요 수',
  })
  @Prop({
    default: 0,
  })
  @IsPositive()
  @IsNotEmpty()
  likeCount: number;

  @ApiProperty({
    required: true,
    description: '작성 대상',
  })
  @Prop({
    types: Types.ObjectId,
    required: true,
    unique: true,
    ref: 'users',
  })
  @IsNotEmpty()
  info: Types.ObjectId;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
