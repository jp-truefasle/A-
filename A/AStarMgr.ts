/**
 * A*寻路算法管理类
 * 
 * 使用说明：
 * 对地图进行初始化操作
 * 判断地图哪里可以走哪里不能走，需要自定义范围，重写判断函数
 * 根据格子实际的长宽，和坐标系变化来计算格子在实际坐标系中的实际坐标位置
 */

import List from "../DataStructure/List";
import My2DArray from "../DataStructure/My2DArray";
import TableMgr from "../Manager/TableMgr";
import Singleton from "../Util/Singleton";
import AStarNode, { E_Node_type } from "./AStarNode";

export default class AStarMgr extends Singleton{
    //单例模式
    // private static instance: AStarMgr = null;

    // public static get Instance(): AStarMgr {
    //     if (!this.instance) {
    //         this.instance = new AStarMgr();
    //     }
    //     return this.instance;
    // }

    //地图宽高（例子格子大小50*100，地图750*1624，格子地图大小15列*16行，使用前需要进行换算）
    public mapW: number;
    public mapH: number;

    public mapRelWith:number = 750;
    public mapRelHeight:number = 1624;
    
    public boxWith:number = 50;
    public boxHeight:number = 100;

    //存储地图的容器
    public nodes: My2DArray<AStarNode>;

    //开启列表
    public openList: List<AStarNode> = new List<AStarNode>();

    //关闭列表
    public closeList: List<AStarNode> = new List<AStarNode>();

    /**
     * 初始化地图信息
     * @param w 整个地图有多少列
     * @param h 整个地图有多少行
     */
    public InitMapInfo(w: number, h: number): void {
        //将容器格子装进去
        this.mapW = w;
        this.mapH = h;
        this.nodes = new My2DArray(w, h, new AStarNode(0, 0, E_Node_type.wall));
        for (let i: number = 0; i < w; i++) {
            for (let j: number = 0; j < h; j++) {
                let node: AStarNode = new AStarNode(i, j, this.getBoxType(i, j));
                this.nodes.setValue(i, j, node);
            }
        }
    }

    /**
     * 判断当前格子类型，需要根据地图的来进行动态的修改
     * @param i 当前列-1
     * @param j 当前行-1
     * @returns 
     */
    public getBoxType(i: number, j: number): E_Node_type {
        if (j >= 0 && j <= 2 && i != 9) {
            return E_Node_type.wall;
        }
        else if ((j == 6 || j == 7) && ((i >= 1 && i <= 3) || (i >= 6 && i <= 8) || (i >= 11 && i <= 13))) {
            return E_Node_type.wall;
        }
        else if (j == 8 && ((i >= 1 && i <= 3) || (i >= 7 && i <= 8) || (i == 12))) {
            return E_Node_type.wall;
        }
        else if ((j == 10 || j == 11) && ((i >= 1 && i <= 3) || (i >= 6 && i <= 8) || (i >= 11 && i <= 13))) {
            return E_Node_type.wall;
        }
        else if ((j == 13 || j == 14) && ((i >= 5 && i <= 14))) {
            return E_Node_type.wall;
        }
        else {
            return E_Node_type.road;
        }
    }

    /**
     * 查找当前最短路径，A*算法
     * @param startPos 开始点
     * @param endPos 结束点
     * @returns 返回路径列表
     */
    public findPath(startPos: cc.Vec2, endPos: cc.Vec2): List<AStarNode> {
        //判断输入点是否合法
        if (startPos.x < 0 || startPos.x >= this.mapW || startPos.y < 0 || startPos.y >= this.mapH || endPos.x < 0 || endPos.x >= this.mapW || endPos.y < 0 || endPos.y >= this.mapH) {
            console.log("超过范围");
            return null;
        }
        var satrt: AStarNode = this.nodes.getValue(startPos.x, startPos.y);
        var end: AStarNode = this.nodes.getValue(endPos.x, endPos.y);
        if (satrt.type == E_Node_type.wall || end.type == E_Node_type.wall) {
            console.log("起点或终点为墙");
            return null;
        }

        //每次运算前清空开启和关闭列表
        this.openList.Clear();
        this.closeList.Clear();

        //将开始点放入关闭列表中
        satrt.father = null;
        satrt.f = 0;
        satrt.g = 0;
        satrt.h = 0;
        this.closeList.Add(satrt);

        while (true) {
            //左上
            this.FindNearlyNodeToOpenList(satrt.x - 1, satrt.y - 1, 1.4, satrt, end);
            //上
            this.FindNearlyNodeToOpenList(satrt.x, satrt.y - 1, 1, satrt, end);
            //右上
            this.FindNearlyNodeToOpenList(satrt.x + 1, satrt.y - 1, 1.4, satrt, end);
            //左
            this.FindNearlyNodeToOpenList(satrt.x - 1, satrt.y, 1, satrt, end);
            //右
            this.FindNearlyNodeToOpenList(satrt.x + 1, satrt.y, 1, satrt, end);
            //左下
            this.FindNearlyNodeToOpenList(satrt.x - 1, satrt.y + 1, 1.4, satrt, end);
            //下
            this.FindNearlyNodeToOpenList(satrt.x, satrt.y + 1, 1, satrt, end);
            //右下
            this.FindNearlyNodeToOpenList(satrt.x + 1, satrt.y + 1, 1.4, satrt, end);

            if (this.openList.Count() == 0) {
                console.log("死路")
                return null; //死路
            }

            this.openList.Sort(this.SortOpenList);
            this.closeList.Add(this.openList.getValue(0));
            satrt = this.openList.getValue(0);
            this.openList.RemoveAt(0);
            if (satrt.x == end.x && satrt.y == end.y) {
                var path: List<AStarNode> = new List<AStarNode>();
                path.Add(end);
                while (end.father != null) {
                    path.Add(end.father);
                    end = end.father;
                }
                path.Reverse();
                return path;
            }
        }
    }

    /**
     * 找到临近的点，并放入开启列表中
     * @param x 当前列
     * @param y 当前行
     * @param g 距起点距离
     * @param father 父节点
     * @param end 终节点
     * @returns 
     */
    private FindNearlyNodeToOpenList(x: number, y: number, g: number, father: AStarNode, end: AStarNode): void {
        //边界判断
        if (x < 0 || x >= this.mapW || y < 0 || y >= this.mapH){
            // console.log("超过范围");
            return;
        };
        let node: AStarNode = this.nodes.getValue(x, y);
        if (node == null || node.type == E_Node_type.wall || this.closeList.Contains(node) || this.openList.Contains(node)){
            // console.log("遇到墙或者已经查找过");
            return;
        };
        node.father = father;
        node.g = father.g + g;
        node.h = Math.abs(end.x - node.x) + Math.abs(end.y - node.y);
        node.f = node.g + node.h;
        this.openList.Add(node);
    }
    
    /**
     * 排序条件
     * @param a 节点
     * @param b 节点
     * @returns 返回比较后的结果
     */
    private SortOpenList(a: AStarNode, b: AStarNode): number {
        if (a.f > b.f) {
            return 1;
        }
        else if (a.f == b.f) {
            return 1;
        }
        else {
            return -1;
        }
    }

    /**
     * 得到实际的路径节点坐标列表
     * @param path 路径列表
     * @returns 返回实际的路径节点的坐标列表
     */
    public GetTargetRelPosList(path:List<AStarNode>):List<cc.Vec2>{
        let posList = new List<cc.Vec2>();
        for (let i = 0; i < path.Count(); i++) {
            let value = path.getValue(i);
            let pos = this.getTargetRelPos(value.x, value.y);
            posList.Add(pos);
        }
        return posList;
    }

    /**
     * 返回实际的节点坐标，可能需要手动进行调整
     * @param x 多少列
     * @param y 多少行
     * @returns 返回实际的节点坐标
     */
    public getTargetRelPos(x: number, y: number):cc.Vec2{
        let x1: number = 0;
        let y1: number = 0;
        x = x + 1;
        y = y + 1;

        if (x > 0 && x <= this.mapW/2) {
            x1 = -this.mapRelWith/2 + x * this.boxWith;
        }
        else {
            x1 = (x - this.mapW/2) * this.boxWith;
        }

        if (y > 0 && y <= this.mapH/2) {
            y1 = this.mapRelHeight/2 - y * this.boxHeight;
        }
        else {
            y1 = (this.mapRelHeight/2/this.boxHeight - y) * this.boxHeight;
        }
        return new cc.Vec2(x1, y1);
    }

    /**
     * 节点根据路径列表移动
     * 递归实现按照递归路径列表移动
     * @param node 进行移动的节点
     * @param path 移动的实际路径列表
     * @param index 实际路径列表的第index个
     * @param tableNumber 移动到第几个table
     * @param fun 回调函数
     */
    public move(node: cc.Node, path: List<cc.Vec2>, index: number,tableNumber:number,fun:(player:cc.Node,number:number,fun,idlePointList:cc.Vec2[])=>void,idlePointList:cc.Vec2[]) {
        cc.tween(node)
            .to(1, { position: new cc.Vec3(path.getValue(index).x, path.getValue(index).y, 0) })
            .call(() => {
                if (index >= path.Count()-1) {
                    if(fun == null){
                        console.log("空回调");
                    }
                    else{
                        fun(node,tableNumber,fun,idlePointList);
                    }
                    return;
                }
                else {
                    this.move(node, path, index + 1,tableNumber,fun,idlePointList);
                }
            })
            .start()
    }

    /**
     * 直接进行移动操作，不需要单独写路径什么的，集成到一起
     * @param startPos 开始节点位置
     * @param endPos 结束位置
     * @param mapWith 地图实际宽
     * @param mapHeight 地图实际高
     * @param boxWith 格子宽
     * @param boxHeight 格子高
     * @param player 移动节点
     * @param tableNumber 移动到第几个table
     * @param fun 回调函数
     */
    public AIMoveByA(startPos:cc.Vec2,endPos:cc.Vec2,player:cc.Node,tableNumber:number,fun,idlePointList:cc.Vec2[]){
        TableMgr.Instance(TableMgr).setTableType(tableNumber,false);
        var path = this.findPath(startPos,endPos);
        var targetRelPosList = this.GetTargetRelPosList(path);
        this.move(player,targetRelPosList,1,tableNumber,fun,idlePointList);

    }



}
