/**
 * 工具类，用来统一存放函数计算方法
 */

import Singleton from "./Singleton";

export default class Util extends Singleton {


    /**
     * 计算三次贝塞尔曲线的两个控制点及一个终点
     * @param startPos 开始点
     * @param endPos 终点
     * @returns 返回两个控制点+一个终点的坐标数组
     */
    public getBezierPosCtrl(startPos: cc.Vec2, endPos: cc.Vec2): cc.Vec2[] {
        var posArray = [];
        var x = (startPos.x + endPos.x) / 2;
        if (startPos.y >= endPos.y) {
            var y = startPos.y + 50;
        }
        else {
            var y = endPos.y + 50;
        }

        var offset = Math.abs(startPos.x - x) / 2;

        if (startPos.x >= endPos.x) {
            var position1 = cc.v2(x + offset, y);
            var position2 = cc.v2(x - offset, y);
        }
        else {
            var position1 = cc.v2(x - offset, y);
            var position2 = cc.v2(x + offset, y);
        }

        posArray.push(position1);
        posArray.push(position2);
        posArray.push(endPos);
        return posArray;
    }

    /**
     * 返回x,y之间的随机数,random左闭右开
     * @param min 最小值
     * @param max 最大值
     * @param type 0：可取小数，1：向上取整
     * @returns 返回随机数
     */
    public randomNumber(min: number, max: number, type: number): number {
        switch (type) {
            case 0:
                return Math.random() * (max - min + 1) + min;
            case 1:
                return Math.floor(Math.random() * (max - min + 1) + min);
            default:
                console.log("类型取值错误");
                break;
        }
    }

    /**
     * 得到custom在各个不同场景中的对话文本
     * @param number 场景标识：0，正在等待点击气泡；1，顾客没有被服务;2，顾客已被服务，正在闲逛
     * @returns 返回string文本
     */
    public getCustomWorld(number: number): string {
        var randomNumber = this.randomNumber(0, 4, 1);
        switch (number) {
            case 0:     //正在等待点击气泡
                return "点我点我";
            case 1:     //顾客没有被服务时说的话
                switch (randomNumber) {
                    case 0:
                        return "什么破店！";
                    case 1:
                        return "再也不来了！";
                    case 2:
                        return "服务真差！";
                    case 3:
                        return "还是早点关门吧！";
                    case 4:
                        return "气死我了！";
                }
                break;
            case 2:      //顾客已被服务，正在闲逛
                switch (randomNumber) {
                    case 0:
                        return "真舒服啊！";
                    case 1:
                        return "晚上还来！";
                    case 2:
                        return "真卷啊！";
                    case 3:
                        return "明天还要来！";
                    case 4:
                        return "这家店位置真好！";
                }
                break;
        }
    }
}
