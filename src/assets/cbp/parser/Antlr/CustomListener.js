var antlr4 = require('../../antlr4/index');
var CBPLexer = require('./CBPLexer');
var CBPParser = require('./CBPParser');
var CBPListener = require('./CBPListener').CBPListener;
var callbackFunc;

CustomListener = function(callbackFunc) { 
    CBPListener.call(this); // inherit default listener
	this.callbackFunc = callbackFunc;
    return this;
};

CustomListener.prototype = Object.create(CBPListener.prototype);
CustomListener.prototype.constructor = CustomListener;

// Exit a parse tree produced by CBPParser#relationalExpr.
CustomListener.prototype.exitRelationalExpr = function(ctx) {
	expr1 = ctx.expr(0).getText();
	expr2 = ctx.expr(1).getText();
	operator = ctx.op.text;
	console.log(expr1+"  "+operator+"  "+expr2);
	if(operator == ">"){
		if(this.callbackFunc.getValue(expr1) > this.callbackFunc.getValue(expr2)){
			console.log(this.callbackFunc.getValue(expr1)+" GT "+this.callbackFunc.getValue(expr2));
		}
	} else if(operator == "<"){
		if(this.callbackFunc.getValue(expr1) < this.callbackFunc.getValue(expr2)){
			console.log(this.callbackFunc.getValue(expr1)+" LT "+this.callbackFunc.getValue(expr2));
		}
	}
};

exports.CustomListener = CustomListener;