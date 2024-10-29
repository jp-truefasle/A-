/*
 * UI管理类
 * 
 */

import TableData from "../Data/TableData";
import AbPrefab from "../Util/AbPrefab";
import Singleton from "../Util/Singleton";
import Util from "../Util/Util";
import AnimationMgr from "./AnimationMgr";
import StorageMgr from "./StorageMgr";


export default class UIManager extends Singleton {

    /**
     * coin对象池
     */
    public coinPool: cc.NodePool;
    /**
     * coin预制体
     */
    public coinPrefab: cc.Prefab;
    /**
     * 父节点
     */
    public coinParent: cc.Node;
    /**
     * 金币UI节点
     */
    public coinUILabel: cc.Node;

    /**
     * 创建coin对象池
     */
    public createCoinPool() {
        this.coinPool = AbPrefab.Instance(AbPrefab).CreateNodePool();
    }

    /**
     * 初始化coin对象池
     * @param prefab coin预制体
     */
    public initCoinPool(prefab: cc.Prefab) {
        AbPrefab.Instance(AbPrefab).initNodePool(this.coinPool, prefab);
    }

    /**
     * 初始化金币数量UI
     */
    public initCoinUILabel() {
        var coinNumber = StorageMgr.Instance(StorageMgr).getCoin();
        this.setCoinUILabel(coinNumber);
    }


    /**
     * 初始化UIManager
     * @param prefab coin预制体
     * @param parent coin父节点
     * @param coinUINode coinUI节点
     */
    public init(prefab: cc.Prefab, parent: cc.Node, coinUINode: cc.Node) {
        this.coinPrefab = prefab;
        this.coinParent = parent;
        this.coinUILabel = coinUINode;
        this.createCoinPool();
        this.initCoinPool(prefab);
        this.initCoinUILabel();
    }

    /**
     * 创建金币对象
     * @param number 哪个桌子
     */
    public getCoin(number: number) {
        var pos = TableData[number - 1].coinPos;
        var posList = [];
        var coinList = [];
        for (let i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                    posList.push(new cc.Vec3(pos.x - 30, pos.y - 30, 0));
                    break;
                case 1:
                    posList.push(new cc.Vec3(pos.x + 30, pos.y + 30, 0));
                    break;
                case 2:
                    posList.push(new cc.Vec3(pos.x + 30, pos.y - 30, 0));
                    break;
                case 3:
                    posList.push(new cc.Vec3(pos.x - 30, pos.y + 30, 0));
                    break;
                default:
                    break;
            }
        }
        // console.log(posList);
        for (let i = 0; i < 4; i++) {
            var coin = AbPrefab.Instance(AbPrefab).createNode(this.coinPool, this.coinPrefab, this.coinParent, pos);
            coinList.push(coin);
        }
        for (let i = 0; i < 4; i++) {
            var node = coinList[i];
            AnimationMgr.Instance(AnimationMgr).coinAction(node, posList[i], this.coinPool, this.coinUILabel, this.addCoin);
        }

    }

    /**
     * 设置金币数量UI
     * @param number 
     */
    public setCoinUILabel(number: number) {
        this.coinUILabel.getComponent(cc.Label).string = number.toString();
    }

    /**
     * 存入或取出金币，并更新coinUI
     * @param number 金币数量，正数存入，负数取出 
     * @param node coinUI节点
     */
    public addCoin(number: number, node: cc.Node) {
        StorageMgr.Instance(StorageMgr).setCoin(number);
        var coinNumber = StorageMgr.Instance(StorageMgr).getCoin();
        node.getComponent(cc.Label).string = coinNumber.toString();
    }

    /**
     * 设置custom节点的文本信息
     * @param node custom节点
     * @param value word文本
     */
    public setCustomWord(node: cc.Node, value: string) {
        var bubble = node.getChildByName("bubble");
        var text = bubble.children[2];
        text.getComponent(cc.Label).string = value;
    }

    /**
     * 顾客没有服务时说的话
     * @param node custom节点
     */
    public setCustomNoServiceWorld(node: cc.Node) {
        var bubble = node.getChildByName("bubble");
        bubble.active = true;
        this.setCustomWord(node, Util.Instance(Util).getCustomWorld(1));
        setTimeout(() => {
            bubble.active = false;
        }, 1500);
    }

    /**
     * 顾客已被服务后说的话
     * @param node custom节点
     */
    public setCustomHaveServiced(node: cc.Node) {
        var bubble = node.getChildByName("bubble");
        setTimeout(() => {
            this.setCustomWord(node, Util.Instance(Util).getCustomWorld(2));
            bubble.active = true;
            setTimeout(() => {
                this.setCustomWord(node, Util.Instance(Util).getCustomWorld(2));
                setTimeout(() => {
                    bubble.active = false;
                }, 2500);
            }, 2500);
        }, 1000);
    }

    /**
     * 集成一下custom对话文本场景
     * @param node custom节点
     * @param number 对话场景类型：0，正在等待点击气泡；1，顾客没有被服务；2，顾客已被服务，正在闲逛
     */
    public setCustomWordByType(node:cc.Node,number:number){
        switch (number) {
            case 0:
                this.setCustomWord(node,Util.Instance(Util).getCustomWorld(0));
                node.children[1].children[3].getComponent(cc.Button).interactable = true;
                break;
            case 1:
                this.setCustomNoServiceWorld(node);
                node.children[1].children[3].getComponent(cc.Button).interactable = false;
                break;
            case 2:
                this.setCustomHaveServiced(node);
                node.children[1].children[3].getComponent(cc.Button).interactable = false;
                break;
        }
    }

}
