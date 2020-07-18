
class Watcher{
	constructor(vm,expr,cb) {
	    this.vm = vm;
		this.expr = expr;
		this.cb = cb;
		this.oldVal = this.getOldVal()
	}
	getOldVal() {
		Dep.target = this;
		let value = this.expr.replace(/\{\{(.+?)\}\}/,(...args)=>{
			/* 如果expr = {{msg}}--{{message}}
				args四个参数  
				第一个匹配项   结果：{{msg}}
				第二个匹配内容   结果：msg
				第三个匹配内容下标 结果：0
				第四个原字符串 {{msg}}--{{message}}
			*/
		  return args[1]
		   
		})
		const oldVal = compileUtils.getValue(value,this.vm)
		
		return oldVal
	}
	update() {
		
		const newVal = compileUtils.getValue(this.expr,this.vm);
		if(this.oldVal !== newVal) {
			this.cb(newVal);
		}
	}
	
}
class Dep{
	constructor() {
		this.subs = []
	}
	addSub(watcher) {
		this.subs.push(watcher);
		Dep.target =null;
	}
	notify(){
		console.log('notify');
		console.log(this.subs);
		
		this.subs.forEach(w=>w.update())
		console.log(this.subs);
	}
}
class Observer{
	constructor(data) {
	    this.observer(data);
		
		
	}
	observer(data){
		`
		msg:'haha',
		message:'hehe',
		a:"5",
		person: {
			name:'zhangsan',
			age:'18',
			fav:{
				a:'1',
				b:'2'
			}
		}
		`
		if(data && typeof data === 'object'){
			Object.keys(data).forEach(key => {
				this.defineReactive(data,key,data[key]);
			})
		}
	}
	defineReactive(data,key,value){
		//例如 person此时传过来还是一个对象 所以还要递归劫持属性
		this.observer(value);//递归
		const dep = new Dep();
		Object.defineProperty(data,key,{
			configurable:false,
			enumrable:true,
			set:(newVal)=>{
				//订阅数据变化时
				console.log(dep.target);
				
				if(newVal !==value) {
					value = newVal;
				}
				dep.notify()
			},
			get:()=>{
				Dep.target && dep.addSub(Dep.target);
				return value;
				
			}
		})
	}
}