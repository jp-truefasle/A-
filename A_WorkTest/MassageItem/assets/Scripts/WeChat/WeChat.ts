/**
 * 引入wechat类包，npm install miniprogram-api-typings
 */

import Singleton from "../Util/Singleton";   
import 'miniprogram-api-typings';

export default class WeChat extends Singleton {

    /**
     * 初始化wechat类
     */
    public init(){
        this.openFriendShare();
    }

    /**
     * 打开朋友分享和朋友圈分享，这里是右上角三个点的分享
     */
    public openFriendShare() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
            });
        }
    }

    /**
     * 提示文本，只有确定键
     * @param text 提示文本
     */
    public showModal(text:string) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) { 
            wx.showModal({
                content: text,
                showCancel: false,
                confirmText: '确定',
                confirmColor: '#3CC51F',
            });
        }
    }

}
   