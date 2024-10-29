/**
 * table管理类
 */

import TableData from "../Data/TableData";
import { E_Custom_ServiceType } from "../Player/Custom";
import Singleton from "../Util/Singleton";

export default class TableMgr extends Singleton {

    /**
     * 设置桌子的空闲状态
     * @param number 第几个桌子
     * @param isFree 桌子状态
     */
    setTableType(number: number, isFree: boolean) {
        if (number > 0) {
            TableData[number - 1].isFree = isFree;
        }
    }

    /**
     * 得到第几个桌子的状态
     * @param number 第几个桌子
     * @returns 返回第几个桌子的状态
     */
    getTableType(number: number): boolean {
        return TableData[number].isFree;
    }

    /**
     * 得到第number个桌子的服务项目
     * @param number 第几个桌子
     * @returns 返回第number个桌子的服务项目
     */
    getTableServiceType(number: number): E_Custom_ServiceType {
        return TableData[number].tableType;
    }

    /**
     * 空闲桌子的数量
     * @returns 返回空闲桌子的数量
     */
    freeTableNumber(): number {
        var count = 0;
        for (let i = 0; i < 6; i++) {
            if (TableData[i].isFree) {
                count++;
            }
        }
        return count;
    }

    /**
     * 根据custom当前位置返回custom所在的table
     * @param pos 当前位置
     * @returns 返回table值
     */
    getTableNumberByPlayerPos(pos:cc.Vec2):number{
        for (let i = 0; i < 6; i++) {
            if(TableData[i].playerPos == pos){
                return i+1;
            }
        }
    }

    /**
     * 根据servicePos返回custom所在的table
     * @param pos 当前位置
     * @returns 返回table值
     */
    getTableNumberByServicePos(pos:cc.Vec2):number{
        for (let i = 0; i < 6; i++) {
            if(TableData[i].servicePos == pos){
                return i+1;
            }
        }
    }
}
