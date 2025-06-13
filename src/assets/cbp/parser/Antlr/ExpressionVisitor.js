var antlr4 = require('../../antlr4/index');
var CBPLexer = require('./CBPLexer');
var CBPParser = require('./CBPParser');
var CBPVisitor = require('./CBPVisitor').CBPVisitor;
var callBackObject;
var displayToIdMap = new Array();

ExpressionVisitor = function(callBackObject) {
    CBPVisitor.call(this); // inherit default visitor
	this.callBackObject = callBackObject;
	return this;
};

ExpressionVisitor.prototype = Object.create(CBPVisitor.prototype);
ExpressionVisitor.prototype.constructor = ExpressionVisitor;


// ExpressionVisitor.prototype.createExpression = function(input){
// displayToIdMap['&DerivedValue'] = "&5";
// displayToIdMap['&DerivedValue_12'] = "&9";
// displayToIdMap['&DerivedValue_13'] = "&6";
// input : "if (&DerivedValue_12 == 34) { return true; } else { return false; }";
//expected output :"if (&9 == 34) { return true; } else { return false; }"
//actual output :"if (&5_12 == 34) { return true; } else { return false; }" its a issue here.
// DGV9DOT4-676 
//  for(i in displayToIdMap){
//      console.log(i);
//      console.log(displayToIdMap[i]);
//      input = input.replace(i, displayToIdMap[i])
//                      .replace(i, displayToIdMap[i])
//                      .replace(i, displayToIdMap[i]);
//  }
//  return input;
// };
ExpressionVisitor.prototype.createExpression = function(input) {
    const sortedKeys = Object.keys(displayToIdMap).sort((a, b) => b.length - a.length);
    sortedKeys.forEach(key => {
        const value = displayToIdMap[key];
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedKey, 'g');
        input = input.replace(regex, value);
    });
    return input;
};

// Visit a parse tree produced by CBPParser#if_stat.
ExpressionVisitor.prototype.visitIf_stat = function(ctx) {
	var conditions = ctx.condition_block();
	for(i = 0; i < conditions.length; i++){
		this.visit(conditions[i].expr());
		this.visit(conditions[i].stat_block());
	}
	//Else
	if(ctx.stat_block() != null){
		this.visit(ctx.stat_block());
	}
	return null;
};

// Visit a parse tree produced by CBPParser#assignment.
ExpressionVisitor.prototype.visitAssignment = function(ctx) {
	dgUniqueId = this.callBackObject.getDGUniqueID(ctx.ID().getText().replace('&', ''));
	displayToIdMap['&' + ctx.ID().getText()] = '&' + dgUniqueId;
	return;

};

ExpressionVisitor.prototype.visitGoto_stat = function(ctx) {
	id = this.visit(ctx.sectionstepid());
};

// Visit a parse tree produced by CBPParser#sectionstepid.
ExpressionVisitor.prototype.visitSectionstepid = function(ctx) {
		dgUniqueId = this.callBackObject.getSectionStepID(ctx.ID().getText().replace('{', '').replace('}', ''));
		displayToIdMap[ctx.getText()] = '{' + dgUniqueId + '}';
		return;
};

// Visit a parse tree produced by CBPParser#relationalExpr.
ExpressionVisitor.prototype.visitRelationalExpr = function(ctx) {
    expr1 = ctx.expr(0).getText();
	expr2 = ctx.expr(1).getText();
	operator = ctx.op.text;
	value1 = this.visit(ctx.expr(0));
	value2 = this.visit(ctx.expr(1));
};

// Visit a parse tree produced by CBPParser#idAtom.
ExpressionVisitor.prototype.visitIdAtom = function(ctx) {
		//console.log("visitIdAtom : "+ctx.ID().getText());
		//dgUniqueId = this.callBackObject.getDGUniqueID(ctx.ID().getText().replace('&', ''));
		//displayToIdMap[ctx.getText()] = '&' + dgUniqueId;
		return ctx.ID().getText();

};

ExpressionVisitor.prototype.visitVariable = function(ctx) {
		dgUniqueId = this.callBackObject.getDGUniqueID(ctx.ID().getText().replace('&', ''));
		displayToIdMap['&'+ctx.ID().getText()] = '&' + dgUniqueId;
		return;

};

ExpressionVisitor.prototype.visitVariableExpr = function(ctx) {
  return this.visitChildren(ctx);
};

ExpressionVisitor.prototype.visitAndExpr = function(ctx) {
  return this.visitChildren(ctx);
};

ExpressionVisitor.prototype.visitStringAtom = function(ctx) {
	//console.log(ctx.STRING().getText().replace(/"([^"]*)$/, "<DOUBLE_QUOTE>"));
	displayToIdMap[ctx.STRING().getText()] = ctx.STRING().getText();
	//console.log(ctx.STRING().getText().replace("\"", "<DOUBLE_QUOTE>").replace(/"([^"]*)$/, "<DOUBLE_QUOTE>"));
	//displayToIdMap[ctx.STRING().getText()] = ctx.STRING().getText();
  return ctx.STRING().getText();
};


// Visit a parse tree produced by CBPParser#parExpr.
CBPVisitor.prototype.visitParExpr = function(ctx) {
	//console.log(ctx.expr());
	//console.log(typeof ctx.expr());
	//if(ctx.expr() instanceof RelationalExprContext){
	//	console.log("Relation");
	//} else if(ctx.expr() instanceof AndExprContext){
	//	console.log("And");
	//} else if(ctx.expr() instanceof OrExprContext){
	//	console.log("Or");
	//}
  return this.visitChildren(ctx);
};

exports.ExpressionVisitor = ExpressionVisitor;
