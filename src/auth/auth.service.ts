import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCrendentialDto } from './dto/auth.credential.dto';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt/dist';
import { AuthLoginCrendentialDto } from './dto/login.credential.dto';
import { AuthUserCrendentialDto } from './dto/userid.credential.dto';
import { UserRepository } from 'src/repository/user.repository';
import { UpdateUserCrendentialDto } from './dto/update-user.credential.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository:UserRepository,
        private jwtService: JwtService
    ){}

    async signUp(authCrendentialDto:AuthCrendentialDto):Promise<object>{
        return this.userRepository.createUser(authCrendentialDto);
    }

    async signIn(authLoginCrendentialDto:AuthLoginCrendentialDto):Promise<object>{
        const {userid, password} = authLoginCrendentialDto;
        
        const user = await this.userRepository.findOne({where:{userid}});

        if(user && (await bcrypt.compare(password, user.password))){
            const payload = { userid, id:user.id };
            const accessToken = await this.jwtService.sign(payload)

            return {result:true, accessToken};
        }
        else{
            return {result:false, message:"로그인 실패"}
        }
        
    }

    async idDuplicationCheck(authUserCrendentialDto:AuthUserCrendentialDto):Promise<object>{
        try{
            const {userid} = authUserCrendentialDto;
            const user = await this.userRepository.findOne({where:{userid}});

            if(!user){
                return {result:true}
            }else{
                return {result:false}
            }
        }catch(err){
            console.log(err);
            return {result:false, message:"오류가 발생했습니다."}
        }   
    }

    async updateUser(updateUserCrendentialDto:UpdateUserCrendentialDto):Promise<object>{
        try{
            const {id, user_name, password} = updateUserCrendentialDto;

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await this.userRepository.update(id, {user_name, password:hashedPassword});

            return {result:true}

        }catch(err){
            return {result:false, message:"오류가 발생했습니다. "+ err}
        }
    }

    async deleteUser(id:number):Promise<object>{
        try{
            const user = await this.userRepository.delete(id);
            return {result:true}
        }catch(err){
            console.log(err);
            return {result:false, message:"오류가 발생했습니다. " + err};
        }
    }

}
