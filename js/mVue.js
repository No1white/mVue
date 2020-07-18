
class mVue{
	constructor(options) {
		
	    this.$el = options.el;
		this.$data = options.data;
		this.$options = options; 
		if (this.$el) {
			// 创建观察者  传data
			new Observer(this.$data);
			//指令解析   传根元素 及vue实例
			new Compile(this.$el,this);
			
		}
	}
}