import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressRepository } from 'src/repository/address.repository';
import { OrderRepository } from 'src/repository/order.repository';
import { AddressCredentialDto } from './dto/address.credential.dto';
import { AddressUpdateCredentialDto } from './dto/address-update.credential.dto';
import { GoodsRepository } from 'src/repository/goods.repository';
import { GoodsGetCredentialDto } from './dto/goods-get.credential.dto';
import { AddressGetCredentialDto } from './dto/address-get.credential.dto';
import { D_payRepository } from 'src/repository/d_pay.repository';
import { DpayCredentialDto } from './dto/dpay.credential.dto';
import { DpayDeleteCredentialDto } from './dto/dpay-delete.credential.dto';

@Injectable()
export class BuyService {
    constructor(
        @InjectRepository(OrderRepository)
        private readonly orderRepository:OrderRepository,

        @InjectRepository(AddressRepository)
        private readonly addressRepository:AddressRepository,

        @InjectRepository(GoodsRepository)
        private readonly goodsReposiry:GoodsRepository,

        @InjectRepository(D_payRepository)
        private readonly d_payRepository:D_payRepository,
    ){}

    async getGoods(goodsGetCredentialDto:GoodsGetCredentialDto):Promise<object>{
        let arr = [];
        try{
            const {goods_ids} = goodsGetCredentialDto;
            let temp = goods_ids.split(',');
            
            for(let i = 0; i < temp.length; i++){
                const goods =  await this.goodsReposiry.findOne({where:{id:temp[i]}});
                arr.push(goods);
            }
        }catch(err){
            console.log(err);
        }
        return {result:true, data:arr};
    }

    async getAddress(addressGetCredentialDto:AddressGetCredentialDto):Promise<object>{

        const {user_id} = addressGetCredentialDto;
        let address = [];
        try{
            address =  await this.addressRepository.find({where:{user_id}});
        }catch(err){
            console.log(err);
        }
        return {result:true, data:address}
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

    async createDpay(dpayCredentialDto:DpayCredentialDto){
        return this.d_payRepository.createDpay(dpayCredentialDto);
    }

    async getDpay(user:number){
        console.log(user);
        try{
            const dpay = await this.d_payRepository.find({where:{user_id:user}});
            return {result:true, dpay}
        }catch(err){
            console.log(err);
            return {result:false}
        }
        
    }

    async deleteDpay(dpayDeleteCredentialDto:DpayDeleteCredentialDto){
        const {id} = dpayDeleteCredentialDto;
        try{
            const dpay = await this.d_payRepository.delete(id);
            return {result:true}
        }catch(err){
            console.log(err);
            return {result:false}
        }
    }
    
}
