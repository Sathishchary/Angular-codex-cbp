// Generated from CBP.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('../../antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by CBPParser.

function CBPVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

CBPVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
CBPVisitor.prototype.constructor = CBPVisitor;

// Visit a parse tree produced by CBPParser#parse.
CBPVisitor.prototype.visitParse = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#block.
CBPVisitor.prototype.visitBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#stat.
CBPVisitor.prototype.visitStat = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#direct_mapping.
CBPVisitor.prototype.visitDirect_mapping = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#goto_stat.
CBPVisitor.prototype.visitGoto_stat = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#skip_return.
CBPVisitor.prototype.visitSkip_return = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#continue_return.
CBPVisitor.prototype.visitContinue_return = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#confirmcontinue_return.
CBPVisitor.prototype.visitConfirmcontinue_return = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#if_stat.
CBPVisitor.prototype.visitIf_stat = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#condition_block.
CBPVisitor.prototype.visitCondition_block = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#stat_block.
CBPVisitor.prototype.visitStat_block = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#return_stat.
CBPVisitor.prototype.visitReturn_stat = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#while_stat.
CBPVisitor.prototype.visitWhile_stat = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#log.
CBPVisitor.prototype.visitLog = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#sectionstepid.
CBPVisitor.prototype.visitSectionstepid = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#variable.
CBPVisitor.prototype.visitVariable = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#variableExpr.
CBPVisitor.prototype.visitVariableExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#notExpr.
CBPVisitor.prototype.visitNotExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#unaryMinusExpr.
CBPVisitor.prototype.visitUnaryMinusExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#multiplicationExpr.
CBPVisitor.prototype.visitMultiplicationExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#atomExpr.
CBPVisitor.prototype.visitAtomExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#orExpr.
CBPVisitor.prototype.visitOrExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#additiveExpr.
CBPVisitor.prototype.visitAdditiveExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#relationalExpr.
CBPVisitor.prototype.visitRelationalExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#equalityExpr.
CBPVisitor.prototype.visitEqualityExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#andExpr.
CBPVisitor.prototype.visitAndExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#operator.
CBPVisitor.prototype.visitOperator = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#parExpr.
CBPVisitor.prototype.visitParExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#numberAtom.
CBPVisitor.prototype.visitNumberAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#booleanAtom.
CBPVisitor.prototype.visitBooleanAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#idAtom.
CBPVisitor.prototype.visitIdAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#stringAtom.
CBPVisitor.prototype.visitStringAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#nilAtom.
CBPVisitor.prototype.visitNilAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#valueStringAtom.
CBPVisitor.prototype.visitValueStringAtom = function(ctx) {
  return this.visitChildren(ctx);
};



exports.CBPVisitor = CBPVisitor;