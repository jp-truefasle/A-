/**
 * AStarNode对象类
 */

export enum E_Node_type {
    road,
    wall,
}

//default 默认导出class
export default class AStarNode {
    // 格子对象的坐标x,y
    public x: number;
    public y: number;

    //寻路消耗g+h
    public f: number;
    //离起点的距离，勾股定律
    public g: number;
    //离终点的距离,曼哈頓街區算法
    public h: number;

    //父对象
    public father: AStarNode;

    //格子類型
    public type: E_Node_type;

    constructor(x: number, y: number, type: E_Node_type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}
