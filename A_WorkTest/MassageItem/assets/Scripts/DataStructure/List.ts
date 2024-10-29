/************************************************************************************************
 * 
 * 
 * 
 * 
 * 描述：列表实现
 */
export default class List<T> {

    private array: Array<T>;

    constructor() {
        this.array = new Array<T>();
    }

    //向列表尾端添加新的元素
    public Add(element: T) {
        this.array.push(element);
    }

    //删除指定位置的元素,下标从零开始
    public RemoveAt(element: number) {
        this.array.splice(element, 1);
    }

    //清空列表
    public Clear() {
        this.array = new Array<T>();
    }

    //按照某个规则来对数组进行排序
    public Sort(callback: (a: T, b: T) => number) {
        this.array.sort(callback);
    }

    //翻转列表
    public Reverse() {
        this.array.reverse();
    }

    //是否包含某个元素,可利用try catch强行中断foreach
    public Contains(element: T): boolean {
        try {
            this.array.forEach(value => {
                if (value === element) {
                    throw Error();
                }
            });
        } catch (error) {
            return true;
        }
        return false;
    }

    //list长度
    public Count(): number {
        return this.array.length;
    }

    //取值
    public getValue(number: number): T {
        if (number >= 0 && number < this.array.length) {
            return this.array[number];
        }
    }


}
