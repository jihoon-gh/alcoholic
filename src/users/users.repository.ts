import { CommentsSchema } from './../comments/comments.schema';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './users.schema';
import { UserRequestDto } from './dto/users.request.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async existsByEmail(email: String): Promise<Boolean> {
    try {
      const result = await this.userModel.exists({ email });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
  async create(user: UserRequestDto): Promise<User> {
    return await this.userModel.create(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findUserByIdWithoutPassword(
    userId: string | Types.ObjectId,
  ): Promise<User | null> {
    const user = await this.userModel.findById(userId).select('-password');
    return user;
  }

  async findByIdAndUploadImg(id: string, fileName: string) {
    const user = await this.userModel.findById(id);

    user.imgUrl = `http://localhost:3000/media/${fileName}`;
    const newUser = await user.save();
    console.log(newUser);
    return newUser.readOnlyData;
  }

  async findAll() {
    const CommentsModel = mongoose.model('comments', CommentsSchema);

    const result = await this.userModel
      .find()
      .populate('comments', CommentsModel);

    return result;
  }
}
