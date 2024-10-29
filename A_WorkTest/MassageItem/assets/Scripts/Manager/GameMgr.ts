/**
 * 主函数
 */
import CustomMgr from "../Manager/CustomMgr";
import UIManager from "../Manager/UIManager";
import WeChat from "../WeChat/WeChat";
import MusicMgr from "./MusicMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class test extends cc.Component {

    @property(cc.Prefab)
    customPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    coinPrefab:cc.Prefab = null;

    @property(cc.Node)
    customParentNode: cc.Node = null;

    @property(cc.Node)
    coinParent:cc.Node = null;

    @property(cc.Node)
    coinUILabelNode:cc.Node = null;

    @property(cc.AudioClip)
    bgMusic:cc.AudioClip = null;

    @property(cc.AudioClip)
    clickBubbleMusic:cc.AudioClip = null;


    // onLoad () {

    // }

    start() {
        WeChat.Instance(WeChat).init();
        CustomMgr.Instance(CustomMgr).init(this.customPrefab);
        UIManager.Instance(UIManager).init(this.coinPrefab,this.coinParent,this.coinUILabelNode);
        MusicMgr.Instance(MusicMgr).init(this.bgMusic,this.clickBubbleMusic);

        this.schedule(()=>{
            CustomMgr.Instance(CustomMgr).getCustom(this.customParentNode);
        },2);
    }

    update(){
        CustomMgr.Instance(CustomMgr).getFirstWaitCustom();
    }
  
   
}
