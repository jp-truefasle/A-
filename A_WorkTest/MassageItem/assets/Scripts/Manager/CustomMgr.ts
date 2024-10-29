/**
 * custom管理类
 */

import AStarMgr from "../AStar/AStarMgr";
import customIdlePointData from "../Data/IdlePointData";
import TableData from "../Data/TableData";
import List from "../DataStructure/List";
import { E_Custom_StateType } from "../Player/Custom";
import AbPrefab from "../Util/AbPrefab";
import Singleton from "../Util/Singleton";
import Util from "../Util/Util";
import TableMgr from "./TableMgr";
import UIManager from "./UIManager";
import WaitPlaceMgr from "./WaitPlaceMgr";

export default class CustomMgr extends Singleton {

    //custom对象池
    public customPool: cc.NodePool;
    //custom预制体
    public customPrefab: cc.Prefab;
    //custom列表
    public customList: List<cc.Node> = new List<cc.Node>();
    //标记custom唯一标识
    public count: number = 1;

    /**
     * 初始化custom地图
     */
    public initCustomMap() {
        AStarMgr.Instance(AStarMgr).InitMapInfo(15, 16);
    }

    /**
     * 创建custom对象池
     */
    public createCustomPool() {
        this.customPool = AbPrefab.Instance(AbPrefab).CreateNodePool();
    }

    /**
     * 初始化对象池
     * @param prefab 
     */
    public initCustomPool(prefab: cc.Prefab) {
        this.customPrefab = prefab;
        AbPrefab.Instance(AbPrefab).initNodePool(this.customPool, prefab);
    }

    /**
     * 初始化customMgr
     * @param prefab custom预制体 
     */
    public init(prefab:cc.Prefab){
        this.initCustomMap();
        this.createCustomPool();
        this.initCustomPool(prefab);
    }

    /**
     * 创建custom对象
     * @param parentNode 父对象
     */
    public getCustom(parentNode: cc.Node) {
        if (this.customList.Count() == 14) { return; }
        var startPos = new cc.Vec2(9, 0);
        this.count++;
        var custom = AbPrefab.Instance(AbPrefab).createNode(this.customPool, this.customPrefab, parentNode, AStarMgr.Instance(AStarMgr).getTargetRelPos(startPos.x, startPos.y));
        this.customList.Add(custom);


        var tableFreeNumber = TableMgr.Instance(TableMgr).freeTableNumber();
        if (tableFreeNumber > 0) {
            custom.getComponent("Custom").setCustomStateType(E_Custom_StateType.service);
        }
        else {
            custom.getComponent("Custom").setCustomStateType(E_Custom_StateType.waitService);
        }
        // custom.name = "custom_" + this.customList.Count();
        // console.log(this.customList.getValue(0).getComponent("Custom").getFreeTableNumber());
        // if(tableNumber){

        // }
        // console.log(custom.getComponent("Custom").getFreeTableNumber());
        // this.customList.getValue(0);

    }

    /**
     * A*寻路到服务台上之后的回调
     * @param number 第几个桌子，大于0:寻路到服务台，0：寻路到等待点，-1：销毁节点
     * @param node custom节点
     */
    public callBack(node: cc.Node, number: number, idlePointList: cc.Vec2[], fun) {
        if (number > 0) { //直接寻路到服务台
            // var endPos = TableData[number - 1].playerPos;
            // var startPos = AStarMgr.Instance(AStarMgr).getTargetRelPos(endPos.x, endPos.y);
            // var servicePos = TableData[number - 1].servicePos;
            // node.getComponent("Custom").setWaitPos(servicePos);
            // var bezier = Util.Instance(Util).getBezierPosCtrl(startPos, servicePos);
            // var action = cc.sequence(cc.bezierTo(0.8, bezier), cc.callFunc(() => {

            //     node.getComponent("Custom").setCustomStateType(E_Custom_StateType.service);
            //     setTimeout(() => {
            //         var bezierBack = Util.Instance(Util).getBezierPosCtrl(servicePos, startPos);
            //         var action = cc.sequence(cc.bezierTo(0.8, bezierBack), cc.callFunc(() => {

            //             // console.log("服务结束");
            //             TableMgr.Instance(TableMgr).setTableType(number, true);
            //             // node.getComponent("Custom").setCustomStateType(E_Custom_StateType.idle);
            //             AStarMgr.Instance(AStarMgr).AIMoveByA(endPos, new cc.Vec2(9, 0), node, -1, callBack);

            //         }))
            //         node.runAction(action);
            //     }, 5000);
            // }))
            // node.runAction(action);
            node.getComponent("Custom").setCustomStateType(E_Custom_StateType.servicing);
        }
        else if (number == 0) { //目前是寻路到等待点
            // node.getComponent("Custom").setCustomStateType(E_Custom_StateType.waitService);
            node.getComponent("Custom").setCtrlWaitToServiceEventValue(true);
        }
        else if (number == -1) {
            // console.log("溜了溜了");
            // AbPrefab.Instance(AbPrefab).recycleNode(pool, node);
            // this.deleteCustom(node);
            // node.getComponent("Custom").setCustomStateType(E_Custom_StateType.die);
            node.getComponent("Custom").deleteCustom();
        }
    }

    /**
     * 查找等待点的位置
     * @returns 返回等待点的位置
     */
    public getWaitPos(): cc.Vec2 {
        for (let i = 0; i < 8; i++) {
            if (WaitPlaceMgr.Instance(WaitPlaceMgr).getWaitPlaceType(i)) {
                WaitPlaceMgr.Instance(WaitPlaceMgr).setWaitPlaceType(i, false);
                return WaitPlaceMgr.Instance(WaitPlaceMgr).getWaitPlacePos(i);
            }
        }
        return null;
    }

    /**
     * 从等待点移动到服务点
     * @param node custom节点
     */
    public customWaitToservice(node: cc.Node) {
        // var ndoe = this.findWaitCustom();
        // var startPos = node.getComponent("Custom").getWaitPos();
        var tableNumber = node.getComponent("Custom").getFreeTableNumber();
        if (tableNumber > 0 && node.getComponent("Custom").getCtrlWaitToServiceEventValue()) {
            node.getComponent("Custom").setCustomStateType(E_Custom_StateType.service);
            node.getComponent("Custom").setCtrlWaitToServiceEventValue(false);
        }
    }

    /**
     * 找到customlist中第一个等待的custom,并进入状态切换函数
     */
    public getFirstWaitCustom(){
        for (let i = 0; i < this.customList.Count(); i++) {
            if(this.customList.getValue(i).getComponent("Custom").getCustomStateType() == E_Custom_StateType.waitService){
                this.customWaitToservice(this.customList.getValue(i));
                return;
            }            
        }
    }



    /**
     * custom的状态切换为service时候的事件处理函数
     * @param node custom节点
     */
    public serviceEvent(node: cc.Node) {
        if (node.getComponent("Custom").getCtrlServiceEventValue() && node.getComponent("Custom").getCustomlastState() == E_Custom_StateType.idle) {
            node.getComponent("Custom").setCtrlServiceEventValue(false);
            var startPos = new cc.Vec2(9, 0);
            var tableNumber = node.getComponent("Custom").getFreeTableNumber();
            var endPos = TableData[tableNumber - 1].playerPos;
            node.getComponent("Custom").setWaitPos(endPos);
            AStarMgr.Instance(AStarMgr).AIMoveByA(startPos, endPos, node, tableNumber, this.callBack, null);
        }
        if (node.getComponent("Custom").getCtrlServiceEventValue() && node.getComponent("Custom").getCustomlastState() == E_Custom_StateType.waitService) {
            node.getComponent("Custom").setCtrlServiceEventValue(false);
            var startPos: cc.Vec2 = node.getComponent("Custom").getWaitPos();
            var tableNumber = node.getComponent("Custom").getFreeTableNumber();
            // console.log("这里这里",tableNumber);
            var endPos = TableData[tableNumber - 1].playerPos;
            var waitPlaceNumber = WaitPlaceMgr.Instance(WaitPlaceMgr).getWaitPlaceNumberByPos(node.getComponent("Custom").getWaitPos());
            WaitPlaceMgr.Instance(WaitPlaceMgr).setWaitPlaceType(waitPlaceNumber, true);
            node.getComponent("Custom").setWaitPos(endPos);
            AStarMgr.Instance(AStarMgr).AIMoveByA(startPos, endPos, node, tableNumber, this.callBack, null);
        }
    }

    /**
     * custom的状态切换为waitservice时的事件处理函数
     * @param node custom节点
     */
    public waitServiceEvent(node: cc.Node) {
        if (node.getComponent("Custom").getCtrlWaitServiceEventValue() && node.getComponent("Custom").getCustomlastState() == E_Custom_StateType.idle) {
            node.getComponent("Custom").setCtrlWaitServiceEventValue(false);
            //去等待
            var startPos = new cc.Vec2(9, 0);
            var endPos = this.getWaitPos();
            node.getComponent("Custom").setWaitPos(endPos);
            AStarMgr.Instance(AStarMgr).AIMoveByA(startPos, endPos, node, 0, this.callBack, null);
        }
    }

    /**
     * custom的状态切换为servicing时的事件处理函数
     * @param node custom节点
     */
    public servicingEvent(node: cc.Node) {
        if (node.getComponent("Custom").getCtrlServicingEventValue() && node.getComponent("Custom").getCustomlastState() == E_Custom_StateType.service) {
            node.getComponent("Custom").setCtrlServicingEventValue(false);
            var waitPos = node.getComponent("Custom").getWaitPos();
            // console.log("waitPos:", waitPos);
            var number = TableMgr.Instance(TableMgr).getTableNumberByPlayerPos(waitPos);
            // console.log("number:", number);
            var endPos = TableData[number - 1].playerPos;
            var startPos = AStarMgr.Instance(AStarMgr).getTargetRelPos(endPos.x, endPos.y);
            var servicePos = TableData[number - 1].servicePos;
            node.getComponent("Custom").setWaitPos(servicePos);
            var bezier = Util.Instance(Util).getBezierPosCtrl(startPos, servicePos);
            var action = cc.sequence(cc.bezierTo(0.8, bezier), cc.callFunc(() => {

                // setTimeout(() => {
                //     // var bezierBack = Util.Instance(Util).getBezierPosCtrl(servicePos, startPos);
                //     // var action = cc.sequence(cc.bezierTo(0.8, bezierBack), cc.callFunc(() => {

                //     //     // console.log("服务结束");
                //     //     TableMgr.Instance(TableMgr).setTableType(number, true);
                //     //     AStarMgr.Instance(AStarMgr).AIMoveByA(endPos, new cc.Vec2(9, 0), node, -1, this.callBack);

                //     // }))
                //     // node.runAction(action);
                //     node.getComponent("Custom").setCustomStateType(E_Custom_StateType.idle);
                // }, 5000);
                // node.getComponent("Custom").isServicing();
                node.getComponent("Custom").waitClick();

            }))
            node.runAction(action);
        }

    }

    /**
     * custom状态切换为idle时的事件处理函数
     * @param node custom节点
     */
    public idleEvent(node: cc.Node) {
        if (node.getComponent("Custom").getCtrlIdleEventValue() && node.getComponent("Custom").getCustomlastState() == E_Custom_StateType.servicing) {
            node.getComponent("Custom").setCtrlIdleEventValue(false);
            var servicePos = node.getComponent("Custom").getWaitPos();
            var number = TableMgr.Instance(TableMgr).getTableNumberByServicePos(servicePos);
            var endPos = TableData[number - 1].playerPos;
            node.getComponent("Custom").setWaitPos(endPos);
            var startPos = AStarMgr.Instance(AStarMgr).getTargetRelPos(endPos.x, endPos.y);
            var bezierBack = Util.Instance(Util).getBezierPosCtrl(servicePos, startPos);
            var action = cc.sequence(cc.bezierTo(0.8, bezierBack), cc.callFunc(() => {

                // console.log("服务结束");
                // TableMgr.Instance(TableMgr).setTableType(number, true);
                // AStarMgr.Instance(AStarMgr).AIMoveByA(endPos, new cc.Vec2(9, 0), node, -1, this.callBack);
                // node.getComponent("Custom").setCustomStateType(E_Custom_StateType.die);
                // var playerPos = node.getComponent("Custom").getWaitPos();
                // var number = TableMgr.Instance(TableMgr).getTableNumberByPlayerPos(playerPos);
                TableMgr.Instance(TableMgr).setTableType(number, true);
                if(node.getComponent("Custom").getCustomIsServiced()){
                    UIManager.Instance(UIManager).getCoin(number);
                    var idlePointList = this.getCustomIdlePath();
                    this.customIdleMove(node, null, this.customIdleMove, idlePointList);
                    UIManager.Instance(UIManager).setCustomWordByType(node,2);
                }
                else{
                    node.getComponent("Custom").setCustomStateType(E_Custom_StateType.die);
                    UIManager.Instance(UIManager).setCustomWordByType(node,1);
                }

                
            }))
            node.runAction(action);
        }
    }

    /**
     * custom状态切换为die时的事件处理函数
     * @param node custom节点
     */
    public dieEvent(node: cc.Node) {
        if (node.getComponent("Custom").getCtrlDieEventEventValue() && node.getComponent("Custom").getCustomlastState() == E_Custom_StateType.idle) {
            node.getComponent("Custom").setCtrlDieEventValue(false);
            var playerPos = node.getComponent("Custom").getWaitPos();
            // var number = TableMgr.Instance(TableMgr).getTableNumberByPlayerPos(playerPos);
            // TableMgr.Instance(TableMgr).setTableType(number, true);
            AStarMgr.Instance(AStarMgr).AIMoveByA(playerPos, new cc.Vec2(9, 0), node, -1, this.callBack, null);
        }
    }

    /**
     * 计算custom服务完成后在店内的闲逛停留点的路径列表
     */
    public getCustomIdlePath(): cc.Vec2[] {
        var idleData = customIdlePointData;
        var idlePointList = [];
        var number = null;
        var length = customIdlePointData.length;
        while (true) {
            number = Util.Instance(Util).randomNumber(0, length - 1, 1);
            if (length == 0) {
                idlePointList.push(idleData[number]);
            }
            else {
                var count = 0;
                for (let index = 0; index < idlePointList.length; index++) {
                    if (idlePointList[index] == idleData[number]) {
                        count++;
                    }
                }
                if (count == 0) {
                    idlePointList.push(idleData[number]);
                }
            }
            if (idlePointList.length == 2) {
                return idlePointList;
            }
        }
    }

    /**
     * customIdle闲逛状态的移动函数
     * @param node custom节点
     * @param tableNumber null参数
     * @param fun 回调函数
     * @param idlePointList 闲逛停留点的路径列表 
     * @returns 结束回调，切换为die状态
     */
    public customIdleMove(node: cc.Node, tableNumber: number, fun, idlePointList: cc.Vec2[]) {
        // var idlePointList = this.getCustomIdlePath();
        var startPos = node.getComponent("Custom").getWaitPos();
        switch (startPos) {
            case idlePointList[0]:
                var endPos = idlePointList[1];
                break;
            case idlePointList[1]:
                // console.log("结束了，好不好");
                node.getComponent("Custom").setCustomStateType(E_Custom_StateType.die);
                return;
            default:
                var endPos = idlePointList[0];
                break;
        }
        node.getComponent("Custom").setWaitPos(endPos);
        AStarMgr.Instance(AStarMgr).AIMoveByA(startPos, endPos, node, null, fun, idlePointList);
    }





}
