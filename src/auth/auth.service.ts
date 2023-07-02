import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string | object> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({
      where: { username: username },
    });

    if (user) {
      const verifiedOk = await bcrypt.compare(password, user.password);
      console.log('UserId-', user.id, '- Verified', verifiedOk);
      if (verifiedOk) {
        const payload: JwtPayload = { username };
        const token: string = await this.jwtService.signAsync(payload);
        return { accessToken: token };
      } else {
        throw new UnauthorizedException('Please check your login credentials');
      }
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      console.log(error.code);
      if (error.code == 23505) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
