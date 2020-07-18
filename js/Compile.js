// const compileUtils = {
// 	getValue (expr,vm) { //数据有些是对象 例如 person.name   msg  person.age 需要对此进行处理
		
// 		return expr.split('.').reduce((data,currentVal)=>{
// 			//reduce方法是一个累加器 
// 			//如果去person.name  步骤是 vm.$data[person]取出person对象然后 person[name] 取出name
			
// 			return data[currentVal];  //vm.$data[currentVal] vm.$data[person]
// 		},vm.$data);//这里传递vm.$data作为初值 
// 	},
// 	text(node,expr,vm) {
// 		//expr是数据名   模板{{msg}} --{{message}}
// 		let value;
		
// 		if(expr.indexOf('{{') !==-1) {
		
// 			value = expr.replace(/\{\{(.*?)}\}/,(...args)=>{
// 				/* 如果expr = {{msg}}--{{message}}
// 					args四个参数  
// 					第一个匹配项   结果：{{msg}}
// 					第二个匹配内容   结果：msg
// 					第三个匹配内容下标 结果：0
// 					第四个原字符串 {{msg}}--{{message}}
// 				*/
			  
// 			   return this.getValue(args[1],vm);
			   
// 			})
// 		}else {
// 			value = this.getValue(expr,vm);
// 		}
// 		new Watcher(vm,expr,(newVal)=>{
			
// 			this.updater.textUpdater(node,newVal);
// 		})
// 		this.updater.textUpdater(node,value);
// 	},
// 	html(node,expr,vm) {//处理html
// 		const value = this.getValue(expr,vm);
// 		new Watcher(vm,expr,(newVal)=>{
			
// 			this.updater.htmlUpdater(node,newVal);
// 		})
// 		this.updater.htmlUpdater(node,value);
// 	},
// 	model(node,expr,vm){//处理model
// 		const value = this.getValue(expr,vm);
// 		new Watcher(vm,expr,(newVal)=>{
			
// 			this.updater.hodelUpdater(node,newVal);
// 		})
// 		this.updater.modelUpdater(node,value);
// 	},
// 	bind(node,expr,vm,attrName){//node,value,this.vm,eventName
// 		const value = this.getVal(expr,vm);
	
// 		node.setAttribute(attrName,value);
// 	},
// 	on(node,expr,vm,eventName){
		
// 		let fn = vm.$options && vm.$options.methods[expr];
// 		node.addEventListener(eventName,fn.bind(this),false);
		
// 	},
// 	//更新的对象
// 	updater:{
// 		textUpdater(node,value) {
// 			node.textContent = value;
// 		},
// 		htmlUpdater(node,value) {
// 			node.innerHTML = value;
// 		},
// 		modelUpdater(node,value) {
// 			node.value = value;
// 		}
// 	}
// }
class Compile{
	constructor(el,vm) {
		//判断是否是节点 如果是返回el 否则获取dom节点
	    this.el = this.isElementNode(el) ? el : document.querySelector(el);
		this.vm =vm;
		// 获取文档碎片对象  此时fragment包含所有el下的子节点包括文本
		const fragment = this.nodeFragment(this.el);
		//调用compile方法对fragment的进行模板渲染
		this.compile(fragment); 
		//把渲染好的元素添加到页面上
		this.el.appendChild(fragment);
		
	}
	compile(fragment) {
		
		//获取子节点
		const childNodes = fragment.childNodes;
		[...childNodes].forEach(child => {//解构 
			if (this.isElementNode(child)){//判断是节点吗
				this.compileElement(child); //调用节点处理方法
			}else {
				this.compileText(child); //调用文本处理方法
			}
			//如果当前节点还有子元素继续编译
			if(child.childNodes && child.childNodes.length) {
				this.compile(child);
			}
		})
	}
	compileText(node){
		const content = node.textContent;
		
		if(/\{\{(.+?)\}\}/.test(content)) {
			compileUtils['text'](node,content,this.vm);
		}
		
	}
	compileElement(node) {
		const attributes = node.attributes; //获取节点属性所有属性 例如 v-text v-html v-model 等等
		[...attributes].forEach(attr => {
			const {name,value} = attr;
			if(name.startsWith('v-')){ //判断是不是v-开头
				const [,directive] = name.split('-');//因为第一个值v-对我们来说没有意义所以舍去 
				const [dirName,eventName] = directive.split(':');//此时有可能是 v-on:click 对方法进行处理
				//更新数据
				
				compileUtils[dirName](node,value,this.vm,eventName)
				
				//删除属性
				
				node.removeAttribute('v-'+directive)
			}else if(name.startsWith('@')){//处理简写例如@click
				const [,eventName] = name.split('@');
				compileUtils['on'](node,value,this.vm,eventName);
			} 
		})
	}
	isElementNode(el){ //判断是否是node节点  文字节点值为3  node为1
		return el.nodeType ===1
	}
	nodeFragment(el) { //获取所有子节点 并且返回 
		let firstChild;
		let fragment = document.createDocumentFragment();
		while(firstChild = el.firstChild) {
			fragment.appendChild(firstChild)
		}
		return fragment;
		
	}
}