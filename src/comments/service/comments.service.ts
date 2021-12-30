import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from 'src/users/users.repository';
import { Comments } from '../comments.schema';
import { CommentsCreateDto } from '../dtos/comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getAllComments() {
    try {
      const comments = await this.commentsModel.find();
      return comments;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createComment(id: string, commentData: CommentsCreateDto) {
    try {
      const targetUser = await this.usersRepository.findUserByIdWithoutPassword(
        id,
      );
      const { content, author } = commentData;
      const validatedAuthor =
        await this.usersRepository.findUserByIdWithoutPassword(author);
      const newComment = new this.commentsModel({
        author: validatedAuthor._id,
        content,
        info: targetUser._id,
      });
      return await newComment.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async plusLike(id: string) {
    try {
      const comment = await this.commentsModel.findById(id);
      comment.likeCount++;
      return await comment.save();
    } catch (error) {}
  }
}
