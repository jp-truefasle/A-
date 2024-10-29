/**
 * 等待点管理类
 */
import WaitPlaceData from "../Data/WaitPlaceData";
import Singleton from "../Util/Singleton";

export default class WaitPlaceMgr extends Singleton {

    /**
     * 设置等待点的空闲状态
     * @param number 第几个place，从0开始算
     * @param isFree 空闲状态
     */
    setWaitPlaceType(number: number, isFree: boolean) {
        if (number >= 0) {
            WaitPlaceData[number].isFree = isFree;
        }
    }

    /**
     * 得到第number个place点的空闲状态
     * @param number 第几个，从0开始算
     * @returns 返回空闲状态
     */
    getWaitPlaceType(number: number): boolean {
        return WaitPlaceData[number].isFree;
    }

    /**
     * 查找第number个place的位置
     * @param number 第几个，从0开始算
     * @returns 
     */
    getWaitPlacePos(number: number): cc.Vec2 {
        return WaitPlaceData[number].waitPos;
    }

    /**
     * 根据位置查找到是第几个place
     * @param pos 位置
     * @returns 返回序号
     */
    getWaitPlaceNumberByPos(pos: cc.Vec2): number {
        for (let i = 0; i < 8; i++) {
            if (WaitPlaceData[i].waitPos == pos) {
                return i;
            }
        }
    }

}
