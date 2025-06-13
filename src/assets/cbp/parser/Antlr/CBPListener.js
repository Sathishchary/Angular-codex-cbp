// Generated from CBP.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('../../antlr4/index');

// This class defines a complete listener for a parse tree produced by CBPParser.
function CBPListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

CBPListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
CBPListener.prototype.constructor = CBPListener;

// Enter a parse tree produced by CBPParser#parse.
CBPListener.prototype.enterParse = function(ctx) {
};

// Exit a parse tree produced by CBPParser#parse.
CBPListener.prototype.exitParse = function(ctx) {
};


// Enter a parse tree produced by CBPParser#block.
CBPListener.prototype.enterBlock = function(ctx) {
};

// Exit a parse tree produced by CBPParser#block.
CBPListener.prototype.exitBlock = function(ctx) {
};


// Enter a parse tree produced by CBPParser#stat.
CBPListener.prototype.enterStat = function(ctx) {
};

// Exit a parse tree produced by CBPParser#stat.
CBPListener.prototype.exitStat = function(ctx) {
};


// Enter a parse tree produced by CBPParser#direct_mapping.
CBPListener.prototype.enterDirect_mapping = function(ctx) {
};

// Exit a parse tree produced by CBPParser#direct_mapping.
CBPListener.prototype.exitDirect_mapping = function(ctx) {
};


// Enter a parse tree produced by CBPParser#goto_stat.
CBPListener.prototype.enterGoto_stat = function(ctx) {
};

// Exit a parse tree produced by CBPParser#goto_stat.
CBPListener.prototype.exitGoto_stat = function(ctx) {
};


// Enter a parse tree produced by CBPParser#skip_return.
CBPListener.prototype.enterSkip_return = function(ctx) {
};

// Exit a parse tree produced by CBPParser#skip_return.
CBPListener.prototype.exitSkip_return = function(ctx) {
};


// Enter a parse tree produced by CBPParser#continue_return.
CBPListener.prototype.enterContinue_return = function(ctx) {
};

// Exit a parse tree produced by CBPParser#continue_return.
CBPListener.prototype.exitContinue_return = function(ctx) {
};


// Enter a parse tree produced by CBPParser#confirmcontinue_return.
CBPListener.prototype.enterConfirmcontinue_return = function(ctx) {
};

// Exit a parse tree produced by CBPParser#confirmcontinue_return.
CBPListener.prototype.exitConfirmcontinue_return = function(ctx) {
};


// Enter a parse tree produced by CBPParser#if_stat.
CBPListener.prototype.enterIf_stat = function(ctx) {
};

// Exit a parse tree produced by CBPParser#if_stat.
CBPListener.prototype.exitIf_stat = function(ctx) {
};


// Enter a parse tree produced by CBPParser#condition_block.
CBPListener.prototype.enterCondition_block = function(ctx) {
};

// Exit a parse tree produced by CBPParser#condition_block.
CBPListener.prototype.exitCondition_block = function(ctx) {
};


// Enter a parse tree produced by CBPParser#stat_block.
CBPListener.prototype.enterStat_block = function(ctx) {
};

// Exit a parse tree produced by CBPParser#stat_block.
CBPListener.prototype.exitStat_block = function(ctx) {
};


// Enter a parse tree produced by CBPParser#return_stat.
CBPListener.prototype.enterReturn_stat = function(ctx) {
};

// Exit a parse tree produced by CBPParser#return_stat.
CBPListener.prototype.exitReturn_stat = function(ctx) {
};


// Enter a parse tree produced by CBPParser#while_stat.
CBPListener.prototype.enterWhile_stat = function(ctx) {
};

// Exit a parse tree produced by CBPParser#while_stat.
CBPListener.prototype.exitWhile_stat = function(ctx) {
};


// Enter a parse tree produced by CBPParser#log.
CBPListener.prototype.enterLog = function(ctx) {
};

// Exit a parse tree produced by CBPParser#log.
CBPListener.prototype.exitLog = function(ctx) {
};


// Enter a parse tree produced by CBPParser#sectionstepid.
CBPListener.prototype.enterSectionstepid = function(ctx) {
};

// Exit a parse tree produced by CBPParser#sectionstepid.
CBPListener.prototype.exitSectionstepid = function(ctx) {
};


// Enter a parse tree produced by CBPParser#variable.
CBPListener.prototype.enterVariable = function(ctx) {
};

// Exit a parse tree produced by CBPParser#variable.
CBPListener.prototype.exitVariable = function(ctx) {
};


// Enter a parse tree produced by CBPParser#variableExpr.
CBPListener.prototype.enterVariableExpr = function(ctx) {
};

// Exit a parse tree produced by CBPParser#variableExpr.
CBPListener.prototype.exitVariableExpr = function(ctx) {
};


// Enter a parse tree produced by CBPParser#notExpr.
CBPListener.prototype.enterNotExpr = function(ctx) {
};

// Exit a parse tree produced by CBPParser#notExpr.
CBPListener.prototype.exitNotExpr = function(ctx) {
};


// Enter a parse tree produced by CBPParser#unaryMinusExpr.
CBPListener.prototype.enterUnaryMinusExpr = function(ctx) {
};

// Exit a parse tree produced by CBPParser#unaryMinusExpr.
CBPListener.prototype.exitUnaryMinusExpr = function(ctx) {
};


// Enter a parse tree produced by CBPParser#multiplicationExpr.
CBPListener.prototype.enterMultiplicationExpr = function(ctx) {
};

// Exit a parse tree produced by CBPParser#multiplicationExpr.
CBPListener.prototype.exitMultiplicationExpr = function(ctx) {
};


// Enter a parse tree produced by CBPParser#atomExpr.
CBPListener.prototype.enterAtomExpr = function(ctx) {
};

// Exit a parse tree produced by CBPParser#atomExpr.
CBPListener.prototype.exitAtomExpr = function(ctx) {
};


// Enter a parse tree produced by CBPParser#orExpr.
CBPListener.prototype.enterOrExpr = function(ctx) {
};

// Exit a parse tree produced by CBPParser#orExpr.
CBPListener.prototype.exitOrExpr = function(ctx) {
};


// Enter a parse tree produced by CBPParser#additiveExpr.
CBPListener.prototype.enterAdditiveExpr = function(ctx) {
};

// Exit a parse tree produced by CBPParser#additiveExpr.
CBPListener.prototype.exitAdditiveExpr = function(ctx) {
};


// Enter a parse tree produced by CBPParser#relationalExpr.
CBPListener.prototype.enterRelationalExpr = function(ctx) {
};

// Exit a parse tree produced by CBPParser#relationalExpr.
CBPListener.prototype.exitRelationalExpr = function(ctx) {
};


// Enter a parse tree produced by CBPParser#equalityExpr.
CBPListener.prototype.enterEqualityExpr = function(ctx) {
};

// Exit a parse tree produced by CBPParser#equalityExpr.
CBPListener.prototype.exitEqualityExpr = function(ctx) {
};


// Enter a parse tree produced by CBPParser#andExpr.
CBPListener.prototype.enterAndExpr = function(ctx) {
};

// Exit a parse tree produced by CBPParser#andExpr.
CBPListener.prototype.exitAndExpr = function(ctx) {
};


// Enter a parse tree produced by CBPParser#operator.
CBPListener.prototype.enterOperator = function(ctx) {
};

// Exit a parse tree produced by CBPParser#operator.
CBPListener.prototype.exitOperator = function(ctx) {
};


// Enter a parse tree produced by CBPParser#parExpr.
CBPListener.prototype.enterParExpr = function(ctx) {
};

// Exit a parse tree produced by CBPParser#parExpr.
CBPListener.prototype.exitParExpr = function(ctx) {
};


// Enter a parse tree produced by CBPParser#numberAtom.
CBPListener.prototype.enterNumberAtom = function(ctx) {
};

// Exit a parse tree produced by CBPParser#numberAtom.
CBPListener.prototype.exitNumberAtom = function(ctx) {
};


// Enter a parse tree produced by CBPParser#booleanAtom.
CBPListener.prototype.enterBooleanAtom = function(ctx) {
};

// Exit a parse tree produced by CBPParser#booleanAtom.
CBPListener.prototype.exitBooleanAtom = function(ctx) {
};


// Enter a parse tree produced by CBPParser#idAtom.
CBPListener.prototype.enterIdAtom = function(ctx) {
};

// Exit a parse tree produced by CBPParser#idAtom.
CBPListener.prototype.exitIdAtom = function(ctx) {
};


// Enter a parse tree produced by CBPParser#stringAtom.
CBPListener.prototype.enterStringAtom = function(ctx) {
};

// Exit a parse tree produced by CBPParser#stringAtom.
CBPListener.prototype.exitStringAtom = function(ctx) {
};


// Enter a parse tree produced by CBPParser#nilAtom.
CBPListener.prototype.enterNilAtom = function(ctx) {
};

// Exit a parse tree produced by CBPParser#nilAtom.
CBPListener.prototype.exitNilAtom = function(ctx) {
};


// Enter a parse tree produced by CBPParser#valueStringAtom.
CBPListener.prototype.enterValueStringAtom = function(ctx) {
};

// Exit a parse tree produced by CBPParser#valueStringAtom.
CBPListener.prototype.exitValueStringAtom = function(ctx) {
};



exports.CBPListener = CBPListener;