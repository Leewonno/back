import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressRepository } from 'src/repository/address.repository';
import { OrderRepository } from 'src/repository/order.repository';
import { OrderCredentialDto } from './dto/order.credential.dto';
import { AddressCredentialDto } from './dto/address.credential.dto';
import { AddressUpdateCredentialDto } from './dto/address-update.credential.dto';
import { GoodsRepository } from 'src/repository/goods.repository';

@Injectable()
export class BuyService {
    constructor(
        @InjectRepository(OrderRepository)
        private readonly orderRepository:OrderRepository,

        @InjectRepository(AddressRepository)
        private readonly addressRepository:AddressRepository,

        @InjectRepository(GoodsRepository)
        private readonly goodsReposiry:GoodsRepository,
    ){}

    async getGoods(goodsArray:any){
        console.log(goodsArray.goodsArray);
        let temp = goodsArray.goodsArray.split(',');
        let arr = [];
        for(let i = 0; i < temp.length; i++){
            const goods =  await this.goodsReposiry.findOne({where:{id:temp[i]}});
            arr.push(goods);
        }

        console.log(arr);
    }

    async getAddress(){

    }

    async createOrder(orderArray:[]){
        this.orderRepository.createOrder(orderArray)
    }

    async createAddress(addressCredentialDto:AddressCredentialDto){
        this.addressRepository.createAddress(addressCredentialDto);
    }

    async updateAddress(addressUpdateCredentialDto:AddressUpdateCredentialDto){
        const {detail, address, address_name, user_id, zip_code, id} = addressUpdateCredentialDto;

        try{
            const address_res = await this.addressRepository.update(id, {detail, address, address_name, user_id, zip_code});
            console.log(address_res);
            return {result:true}
        }catch(err){
            console.log(err);
            return {result:false}
        }
    }

    async deleteAddress(id:number){
        try{
            const address_res = await this.addressRepository.delete(id);
            return {result:true}
        }catch(err){
            console.log(err);
            return {result:false}
        }
    }
    
}
