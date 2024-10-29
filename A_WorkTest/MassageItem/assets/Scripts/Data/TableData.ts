/**
 * 服务台数据
 */
import { E_Custom_ServiceType } from "../Player/Custom";

let TabeList = [{
    number: 1,
    isFree: true,
    playerPos: new cc.Vec2(4, 7),
    servicePos: new cc.Vec2(-237, 60),
    coinPos: new cc.Vec2(-233,133),
    tableType: E_Custom_ServiceType.massage,
}, {
    number: 2,
    isFree: true,
    playerPos: new cc.Vec2(9, 7),
    servicePos: new cc.Vec2(3, 60),
    coinPos: new cc.Vec2(5,133),
    tableType: E_Custom_ServiceType.massage,
}, {
    number: 3,
    isFree: true,
    playerPos: new cc.Vec2(10, 7),
    servicePos: new cc.Vec2(243, 60),
    coinPos: new cc.Vec2(245,133),
    tableType: E_Custom_ServiceType.massage,
}, {
    number: 4,
    isFree: true,
    playerPos: new cc.Vec2(4, 10),
    servicePos: new cc.Vec2(-237, -295),
    coinPos: new cc.Vec2(-233,-222),
    tableType: E_Custom_ServiceType.massage,
}, {
    number: 5,
    isFree: true,
    playerPos: new cc.Vec2(9, 10),
    servicePos: new cc.Vec2(3, -295),
    coinPos: new cc.Vec2(5,-222),
    tableType: E_Custom_ServiceType.massage,
}, {
    number: 6,
    isFree: true,
    playerPos: new cc.Vec2(10, 10),
    servicePos: new cc.Vec2(243, -295),
    coinPos: new cc.Vec2(245,-222),
    tableType: E_Custom_ServiceType.massage,
}];
export default TabeList;
