/**
 * custom对象类
 */
import AnimationMgr from "../Manager/AnimationMgr";
import CustomMgr from "../Manager/CustomMgr";
import MusicMgr from "../Manager/MusicMgr";
import TableMgr from "../Manager/TableMgr";
import UIManager from "../Manager/UIManager";
import AbPrefab from "../Util/AbPrefab";
import Util from "../Util/Util";

/**
 * custom需要的服务类别
 */
export enum E_Custom_ServiceType {
    xijio,
    massage,
}

/**
 * custom状态类别
 * idle 闲逛
 * service 寻路到服务台或等待点
 * waitservice 从等待点寻路到服务台
 * die 死亡
 * move
 * servicing 服务
 */
export enum E_Custom_StateType {
    idle,
    service,
    waitService,
    die,
    move,
    servicing,
}

/**
 * custom类别
 */
export enum E_Custom_Type {
    baby,
    qingnian,
    laonian,
    man,
    woman,
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class Custom extends cc.Component {

    //custom类别
    public customType: E_Custom_Type;
    //custom状态
    public stateType: E_Custom_StateType;
    //custom需要服务的属性
    public serviceType: E_Custom_ServiceType;
    //记录custom等待的位置,标记移动后的位置，也就是移动后的当前位置
    public waitPos: cc.Vec2;
    //唯一标识custom
    public tag: string;
    //记录上一个custom状态
    public lastState: E_Custom_StateType;
    //控制service事件调用的次数，防止多次调用
    public ctrlServiceEvent: boolean = false;
    //控制waitService事件调用的次数，防止多次调用
    public ctrlWaitServiceEvent: boolean = false;
    //控制waitToService事件调用，防止多次调用
    public ctrlWaitToServiceEvent: boolean = false;
    //控制servicing事件调用，防止多次调用
    public ctrlServicingEvent: boolean = false;
    //控制idle事件调用，防止多次调用
    public ctrlIdleEvent: boolean = false;
    //控制die事件调用，防止多次调用
    public ctrlDieEvent: boolean = false;
    //记录custom是否已经被服务
    public haveServiced:boolean = false;


    onLoad() {
        this.customType = this.initCustomType();
        this.stateType = E_Custom_StateType.idle;
        this.lastState = null;
        this.serviceType = this.initServiceType();
        this.waitPos = new cc.Vec2(0, 0);
        this.tag = this.customType + CustomMgr.Instance(CustomMgr).count.toString();
        this.setCustomIsServiced(false);
    }

    start() {

    }

    update() {
        this.onCustomState();
        this.setIndex();
    }


    /**
     * 设置当前custom节点的Zindex
     */
    setIndex() {
        this.node.zIndex = -this.node.y;
    }

    /**
     * 简单状态机
     */
    onCustomState() {
        switch (this.stateType) {
            case E_Custom_StateType.die:
                // CustomMgr.Instance(CustomMgr).deleteCustom(this.node);
                CustomMgr.Instance(CustomMgr).dieEvent(this.node);
                break;
            case E_Custom_StateType.idle:
                CustomMgr.Instance(CustomMgr).idleEvent(this.node);
                break;
            case E_Custom_StateType.move:
                break;
            case E_Custom_StateType.service:
                CustomMgr.Instance(CustomMgr).serviceEvent(this.node);
                break;
            case E_Custom_StateType.waitService:
                // CustomMgr.Instance(CustomMgr).customWaitToservice(this.node);
                CustomMgr.Instance(CustomMgr).waitServiceEvent(this.node);
                break;
            case E_Custom_StateType.servicing:
                CustomMgr.Instance(CustomMgr).servicingEvent(this.node);
                break;
        }
    }

    /**
     * 初始化custom类型
     * @returns 返回custom类型
     */
    public initCustomType(): E_Custom_Type {
        var number = Util.Instance(Util).randomNumber(0, 5, 1);
        switch (number) {
            case 0:
                return E_Custom_Type.baby;
            case 1:
                return E_Custom_Type.qingnian;
            case 2:
                return E_Custom_Type.man;
            case 3:
                return E_Custom_Type.qingnian;
            case 4:
                return E_Custom_Type.woman;
            default:
                return E_Custom_Type.baby;
        }
    }

    /**
     * 初始化需要服务的类型
     * @returns 返回需要服务的类别
     */
    public initServiceType(): E_Custom_ServiceType {
        var number = Util.Instance(Util).randomNumber(0, 2, 1);
        switch (number) {
            case 0:
                return E_Custom_ServiceType.massage;
            case 1:
                return E_Custom_ServiceType.massage;
            default:
                return E_Custom_ServiceType.massage;
        }
    }

    /**
     * 设置custom当前的状态，并得到custom上一个节点的状态
     * @param statetype 状态
     */
    public setCustomStateType(statetype: E_Custom_StateType) {
        this.lastState = this.stateType;
        this.stateType = statetype;
        switch (statetype) {
            case E_Custom_StateType.service:
                this.setCtrlServiceEventValue(true);
                break;
            case E_Custom_StateType.waitService:
                this.setCtrlWaitServiceEventValue(true);
                break;
            case E_Custom_StateType.servicing:
                this.setCtrlServicingEventValue(true);
                break;
            case E_Custom_StateType.idle:
                this.setCtrlIdleEventValue(true);
                break;
            case E_Custom_StateType.die:
                this.setCtrlDieEventValue(true);
                break;
            default:
                break;
        }
    }

    /**
     * 清洗掉脏数据同时初始化一部分数据
     */
    initCustomData() {
        this.customType = this.initCustomType();
        this.stateType = E_Custom_StateType.idle;
        this.lastState = null;
        this.serviceType = this.initServiceType();
        this.waitPos = new cc.Vec2(0, 0);
        this.tag = this.customType + CustomMgr.Instance(CustomMgr).count.toString();
        this.setCustomIsServiced(false);
    }

    /**
     * 设置控制service事件的变量值
     * @param value boolean变量值
     */
    public setCtrlServiceEventValue(value: boolean) {
        this.ctrlServiceEvent = value;
    }

    /**
     * 得到控制service事件的变量值
     * @returns 返回boolean变量
     */
    public getCtrlServiceEventValue(): boolean {
        return this.ctrlServiceEvent;
    }

    /**
     * 设置控制waitService事件的变量值
     * @param value boolean变量
     */
    public setCtrlWaitServiceEventValue(value: boolean) {
        this.ctrlWaitServiceEvent = value;
    }

    /**
     * 得到控制waitService事件的变量值
     * @returns 返回boolean变量
     */
    public getCtrlWaitServiceEventValue(): boolean {
        return this.ctrlWaitServiceEvent;
    }

    /**
     * 设置控制waitToService事件的变量值
     * @param value boolean变量值
     */
    public setCtrlWaitToServiceEventValue(value: boolean) {
        this.ctrlWaitToServiceEvent = value;
    }

    /**
     * 得到控制waitToService事件的变量值
     * @returns 返回boolean变量值
     */
    public getCtrlWaitToServiceEventValue(): boolean {
        return this.ctrlWaitToServiceEvent;
    }

    /**
     * 设置控制servicing事件的变量值
     * @param value boolean变量值
     */
    public setCtrlServicingEventValue(value: boolean) {
        this.ctrlServicingEvent = value;
    }

    /**
     * 得到控制servicing事件的变量值
     * @returns 返回boolean变量值
     */
    public getCtrlServicingEventValue(): boolean {
        return this.ctrlServicingEvent;
    }

    /**
     * 设置控制idle事件的变量值
     * @param value boolean变量值
     */
    public setCtrlIdleEventValue(value: boolean) {
        this.ctrlIdleEvent = value;
    }

    /**
     * 返回控制idle事件的变量值
     * @returns 返回boolean变量值
     */
    public getCtrlIdleEventValue(): boolean {
        return this.ctrlIdleEvent;
    }

    /**
     * 返回控制die事件的变量值
     * @returns 返回boolean变量值
     */
    public setCtrlDieEventValue(value: boolean) {
        this.ctrlDieEvent = value;
    }

    /**
     * 返回控制die事件的变量值
     * @returns 返回boolean变量值
     */
    public getCtrlDieEventEventValue(): boolean {
        return this.ctrlDieEvent;
    }

    /**
     * 返回上一次的状态
     * @returns custom状态
     */
    public getCustomlastState(): E_Custom_StateType {
        return this.lastState;
    }

    /**
     * 得到当前节点的状态
     * @returns 返回当前节点的状态
     */
    public getCustomStateType(): E_Custom_StateType {
        return this.stateType;
    }

    /**
     * 对于该custom来说，查找到的空闲桌子编号
     * @returns 返回空闲桌子的编号
     */
    public getFreeTableNumber() {
        for (let i = 0; i < 6; i++) {
            if (this.serviceType == TableMgr.Instance(TableMgr).getTableServiceType(i) && TableMgr.Instance(TableMgr).getTableType(i)) {
                return i + 1;
            }
        }
        return null;
    }

    /**
     * 设置运动到当前位置之后，记录当前位置
     * @param pos 移动后的位置
     */
    public setWaitPos(pos: cc.Vec2) {
        this.waitPos = pos;
    }

    /**
     * 得到当前custom的位置
     * @returns 返回当前位置
     */
    public getWaitPos(): cc.Vec2 {
        return this.waitPos;
    }

    /**
     * 得到custom的唯一标签
     * @returns 返回custom的唯一标签
     */
    public getCustomTag(): string {
        return this.tag;
    }

    /**
     * 回收custom节点
     * @param node 待回收的custom节点
     */
    public deleteCustom() {
        this.initCustomData();
        AbPrefab.Instance(AbPrefab).recycleNode(CustomMgr.Instance(CustomMgr).customPool, this.node);
        var length = CustomMgr.Instance(CustomMgr).customList.Count();
        for (let i = 0; i < length; i++) {
            var customTag = CustomMgr.Instance(CustomMgr).customList.getValue(i).getComponent("Custom").getCustomTag();
            if (this.getCustomTag() == customTag) {
                CustomMgr.Instance(CustomMgr).customList.RemoveAt(i);
                break;
            }
        }
    }

    /**
     * custom节点服务进度条显示
     */
    public isServicing(){
        var servicingUINode = this.node.getChildByName("serviceBar");
        servicingUINode.active = true;
        var count = 0;
        servicingUINode.getComponent(cc.ProgressBar).progress = count;
        this.schedule(()=>{
            count = count + 0.2;
            servicingUINode.getComponent(cc.ProgressBar).progress = count;
            if(count == 1){
                servicingUINode.active = false;
                this.setCustomIsServiced(true);
                this.setCustomStateType(E_Custom_StateType.idle);
            }
        },1,5,1)
    }

    /**
     * 等待点击气泡
     */
    public waitClick(){
        var bubble = this.node.getChildByName("bubble");
        bubble.active = true;
        UIManager.Instance(UIManager).setCustomWordByType(this.node,0);
        var mask = bubble.children[1].children[0];
        mask.setPosition(new cc.Vec3(0,-100,0));
        AnimationMgr.Instance(AnimationMgr).bubbleAction(bubble);
        cc.tween(mask)
            .to(30,{position:new cc.Vec3(0,0,0)})
            .call(()=>{
                mask.stopAllActions();
                bubble.stopAllActions();
                mask.setPosition(new cc.Vec3(0,-100,0));
                bubble.active = false;
                this.setCustomIsServiced(false);
                this.setCustomStateType(E_Custom_StateType.idle);
            })
            .start()
    }

    /**
     * 点击气泡开始服务
     */
    public clickStartService(){
        MusicMgr.Instance(MusicMgr).playEffect(MusicMgr.Instance(MusicMgr).clickBubbleMusic);
        var bubble = this.node.getChildByName("bubble");
        var mask = bubble.children[1].children[0];
        mask.stopAllActions();
        mask.setPosition(new cc.Vec3(0,-100,0));
        bubble.stopAllActions();
        bubble.active = false;
        this.isServicing();
    }

    /**
     * csutom是否已经服务过
     * @returns 返回boolean值
     */
    public getCustomIsServiced():boolean{
        return this.haveServiced;
    }

    /**
     * 设置custom当前的服务状态，是否已被服务
     * @param value boolean值
     */
    public setCustomIsServiced(value:boolean){
        this.haveServiced = value;
    }

}
