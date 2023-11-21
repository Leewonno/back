import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {Goods} from "../entity/goods.entity";
import {ListService} from "./list.service";
import {Category} from "../entity/category.entity";

@Controller('list')
export class ListController{
    constructor(private listService: ListService) {}

    @Post('/:category')
    getGoodsByCategory(@Param('category') category:string, @Body('page')page: number): Promise<Category[]>{
        return this.listService.getGoodsByCategory(category,page);
    }

}