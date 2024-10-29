/**
 * 数据存储管理类
 */
import Singleton from "../Util/Singleton";
import WeChat from "../WeChat/WeChat";

export default class StorageMgr extends Singleton {

    /**
     * 存入或取出金币
     * @param number 金币数量,正数是存入，负数是取出
     */
    public setCoin(number: number) {
        if (number < 0 && Math.abs(number) > this.getCoin()) {
            WeChat.Instance(WeChat).showModal("金币不足");
            return;
        }
        else if (number == 0) {
            return;
        }
        var coinNumber = this.getCoin();
        coinNumber = coinNumber + number;
        cc.sys.localStorage.setItem("coin", coinNumber.toString());
    }

    /**
     * 获取当前金币数量
     * @returns 返回当前金币数量
     */
    public getCoin(): number {
        var coinNumber = cc.sys.localStorage.getItem("coin");
        if (coinNumber == null || coinNumber == 'undefined') {
            coinNumber = 0;
        }
        return Number(coinNumber);
    }
}
  