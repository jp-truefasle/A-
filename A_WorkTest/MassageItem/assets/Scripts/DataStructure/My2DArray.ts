/***********
 * 自定义二维数组
 */

export default class My2DArray<T> {
    private my2DArray: Array<Array<T>> = new Array<Array<T>>();
    private rows: number;    //行
    private columns: number;   //列

    constructor(rows: number, columns: number, value: T) {
        this.rows = rows;
        this.columns = columns;
        this.initRows(rows);
        this.initcolums(columns, value);
    }

    //初始化列
    public initRows(rows: number): void {
        if (rows < 1) {
            return;
        }
        for (let i = 0; i < rows; i++) {
            this.my2DArray.push(new Array<T>());
        }
    }

    //初始化行
    public initcolums(columns: number, value: T): void {
        if (columns < 1) {
            return;
        }
        for (let i = 0; i < this.my2DArray.length; i++) {
            for (let j = 0; j < columns; j++) {
                this.my2DArray[i].push(value);
            }
        }
    }

    //取值
    public getValue(rows: number, columns: number): T {
        if (rows < 0 || columns < 0 || rows >= this.rows || columns >= this.columns) {
            return;
        }
        return this.my2DArray[rows][columns];
    }

    //赋值
    public setValue(rows: number, columns: number, value: T) {
        if (rows < 0 || columns < 0 || rows >= this.rows || columns >= this.columns) { return; }
        this.my2DArray[rows][columns] = value;
    }


}
