import {Menu} from './menu';

export interface Order {
    date: Date,
    items: {
        [key: number]: Menu
    }
    total: number,
} 