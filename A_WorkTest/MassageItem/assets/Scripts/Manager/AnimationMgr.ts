/**
 * UI动画管理类
 */

import AbPrefab from "../Util/AbPrefab";
import Singleton from "../Util/Singleton";


export default class AnimationMgr extends Singleton {

    /**
     * 金币动画
     * @param node 金币节点 
     * @param pos 目标位置
     * @param coinPool 金币对象池
     */
    public coinAction(node: cc.Node, pos: cc.Vec3,coinPool:cc.NodePool,UILabelNode:cc.Node,callBack) {
        cc.tween(node)
            .to(0.1, { position: pos })
            .call(() => {
                cc.tween(node)
                    .to(0.8, { position: new cc.Vec3(-308, 725, 0) })
                    .call(() => {
                        AbPrefab.Instance(AbPrefab).recycleNode(coinPool, node);
                        callBack(1,UILabelNode);
                    })
                    .start()
            })
            .start()
    }

    /**
     * 气泡动画
     * @param node 气泡节点 
     */
    public bubbleAction(node:cc.Node){
        cc.tween(node)
            .repeatForever(
                cc.tween()
                    .to(1,{scale:1.1})
                    .to(1,{scale:1})
                    .to(2,{scale:1.15})
                    .to(2,{scale:1})
            )
            .start()
    }

}
