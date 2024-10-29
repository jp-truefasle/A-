/**
 * 对象池相关的创建，取用和销毁的通用方法
 */

import Singleton from "./Singleton";

export default class AbPrefab extends Singleton{

    /**
     * 创建对象池
     * @returns 返回创建的对象池
     */
    public CreateNodePool():cc.NodePool{
        let pool = new cc.NodePool();
        return pool;
    }

    /**
     * 初始化对象池
     * @param pool 对象池
     * @param prefab 预制体
     */
    public initNodePool(pool:cc.NodePool,prefab:cc.Prefab){
        let count = 5;
        for (let i = 0; i < count; i++) {
            let node = cc.instantiate(prefab);
            node.active = false;
            pool.put(node);     
        }
    }

    /**
     * 取预制体
     * @param pool 对象池
     * @param prefab 预制体
     * @param parent 父节点
     * @param pos 位置
     * @returns 返回取出来的预制体，节点
     */
    public createNode(pool:cc.NodePool,prefab:cc.Prefab,parent:cc.Node,pos:cc.Vec2):cc.Node{
        let node = null;
        if(pool.size() > 0){
            node = pool.get();
            node.active = true;
        }
        else{
            node = cc.instantiate(prefab);
        }
        node.parent = parent;
        node.position = pos;
        return node;
    }

    /**
     * 回收预制体
     * @param pool 对象池
     * @param node 回收的节点
     */
    public recycleNode(pool:cc.NodePool,node:cc.Node){
        node.active = false;
        pool.put(node);
    }

    

}
