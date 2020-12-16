import {Order} from './order'

export interface Sale {
    date: Date,
    items:{
        [key:number]: Order
    }
    total: number,
}