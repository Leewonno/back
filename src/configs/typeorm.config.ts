import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/auth/user.entity";

export const typeORMConfig : TypeOrmModuleOptions = {
    type:'postgres',
    host:'demure.culickc0o7pc.ap-southeast-2.rds.amazonaws.com',
    port:5432,
    username:'postgres',
    password:'pyjsok5253!',
    database:'demure',
    entities:[__dirname + '../**/*.entity.{js, ts}', User],
    synchronize: true,
    ssl:{
        rejectUnauthorized:false
    }
}