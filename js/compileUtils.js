const compileUtils = {
	getValue (expr,vm) { //数据有些是对象 例如 person.name   msg  person.age 需要对此进行处理
		console.log(expr);
		return expr.split('.').reduce((data,currentVal)=>{
			//reduce方法是一个累加器 
			//如果去person.name  步骤是 vm.$data[person]取出person对象然后 person[name] 取出name
			return data[currentVal];  //vm.$data[currentVal] vm.$data[person]
		},vm.$data);//这里传递vm.$data作为初值 
	},
	setVal(expr,vm,value) {
		
			return expr.split('.').reduce((data,currentVal,index,arr)=>{
				if(index == arr.length-1 ) {
					data[currentVal] = value;
				}else {
					return data[currentVal];
				}
			},vm.$data);//这出传入vm.$data作为初值
			
	},
	text(node,expr,vm) {
		//expr是数据名   模板{{msg}} --{{message}}
		let value;
		
		if(expr.indexOf('{{') !==-1) {
		
			value = expr.replace(/\{\{(.+?)\}\}/,(...args)=>{
				/* 如果expr = {{msg}}--{{message}}
					args四个参数  
					第一个匹配项   结果：{{msg}}
					第二个匹配内容   结果：msg
					第三个匹配内容下标 结果：0
					第四个原字符串 {{msg}}--{{message}}
				*/
			   console.log(args[1]);
			  
			   return this.getValue(args[1],vm);
			   
			})
		}else {
			value = this.getValue(expr,vm);
		}
		new Watcher(vm,expr,(newVal)=>{
			
			this.updater.textUpdater(node,newVal);
		})
		this.updater.textUpdater(node,value);
	},
	html(node,expr,vm) {//处理html
		const value = this.getValue(expr,vm);
		new Watcher(vm,expr,(newVal)=>{
			
			this.updater.htmlUpdater(node,newVal);
		})
		this.updater.htmlUpdater(node,value);
	},
	model(node,expr,vm){//处理model
		const value = this.getValue(expr,vm);
		new Watcher(vm,expr,(newVal)=>{
			
			this.updater.modelUpdater(node,newVal);
		})
		node.addEventListener('input',(e)=>{
			 this.setVal(expr,vm,e.target.value);
		})
		this.updater.modelUpdater(node,value);
	},
	bind(node,expr,vm,attrName){//node,value,this.vm,eventName
		const value = this.getVal(expr,vm);
	
		node.setAttribute(attrName,value);
	},
	on(node,expr,vm,eventName){
		
		let fn = vm.$options && vm.$options.methods[expr];
		node.addEventListener(eventName,fn.bind(this),false);
		
	},
	//更新的对象
	updater:{
		textUpdater(node,value) {
			node.textContent = value;
		},
		htmlUpdater(node,value) {
			node.innerHTML = value;
		},
		modelUpdater(node,value) {
			node.value = value;
		}
	}
}