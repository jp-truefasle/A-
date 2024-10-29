/**
 * 标记节点的Zindex
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class setIndex extends cc.Component {

    start() {
        this.node.zIndex = -this.node.y;
    }

}
