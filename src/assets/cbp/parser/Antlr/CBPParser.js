// Generated from CBP.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('../../antlr4/index');
var CBPListener = require('./CBPListener').CBPListener;
var CBPVisitor = require('./CBPVisitor').CBPVisitor;

var grammarFileName = "CBP.g4";


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003.\u00b0\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0004",
    "\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013\u0004\u0014\t",
    "\u0014\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0003\u0007\u0003-",
    "\n\u0003\f\u0003\u000e\u00030\u000b\u0003\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0005\u0004=\n\u0004\u0003\u0005\u0003",
    "\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0007\u0003",
    "\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003\b\u0003",
    "\b\u0003\b\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003",
    "\t\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0007\n\\\n\n\f\n\u000e\n",
    "_\u000b\n\u0003\n\u0003\n\u0005\nc\n\n\u0003\u000b\u0003\u000b\u0003",
    "\u000b\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0005\fm\n\f\u0003\r",
    "\u0003\r\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e",
    "\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u0010\u0003\u0010",
    "\u0003\u0010\u0003\u0010\u0003\u0011\u0003\u0011\u0003\u0011\u0003\u0012",
    "\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012",
    "\u0005\u0012\u0089\n\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003",
    "\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003",
    "\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003",
    "\u0012\u0003\u0012\u0003\u0012\u0007\u0012\u009d\n\u0012\f\u0012\u000e",
    "\u0012\u00a0\u000b\u0012\u0003\u0013\u0003\u0013\u0003\u0014\u0003\u0014",
    "\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0014",
    "\u0003\u0014\u0003\u0014\u0005\u0014\u00ae\n\u0014\u0003\u0014\u0002",
    "\u0003\"\u0015\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016",
    "\u0018\u001a\u001c\u001e \"$&\u0002\t\u0003\u0002\u000e\u0010\u0003",
    "\u0002\f\r\u0003\u0002\b\u000b\u0003\u0002\u0006\u0007\u0003\u0002\u0006",
    "\u000f\u0003\u0002()\u0003\u0002\u001c\u001d\u0002\u00b8\u0002(\u0003",
    "\u0002\u0002\u0002\u0004.\u0003\u0002\u0002\u0002\u0006<\u0003\u0002",
    "\u0002\u0002\b>\u0003\u0002\u0002\u0002\n@\u0003\u0002\u0002\u0002\f",
    "D\u0003\u0002\u0002\u0002\u000eI\u0003\u0002\u0002\u0002\u0010N\u0003",
    "\u0002\u0002\u0002\u0012V\u0003\u0002\u0002\u0002\u0014d\u0003\u0002",
    "\u0002\u0002\u0016l\u0003\u0002\u0002\u0002\u0018n\u0003\u0002\u0002",
    "\u0002\u001ar\u0003\u0002\u0002\u0002\u001cv\u0003\u0002\u0002\u0002",
    "\u001ez\u0003\u0002\u0002\u0002 ~\u0003\u0002\u0002\u0002\"\u0088\u0003",
    "\u0002\u0002\u0002$\u00a1\u0003\u0002\u0002\u0002&\u00ad\u0003\u0002",
    "\u0002\u0002()\u0005\u0004\u0003\u0002)*\u0007\u0002\u0002\u0003*\u0003",
    "\u0003\u0002\u0002\u0002+-\u0005\u0006\u0004\u0002,+\u0003\u0002\u0002",
    "\u0002-0\u0003\u0002\u0002\u0002.,\u0003\u0002\u0002\u0002./\u0003\u0002",
    "\u0002\u0002/\u0005\u0003\u0002\u0002\u00020.\u0003\u0002\u0002\u0002",
    "1=\u0005\u0012\n\u00022=\u0005\b\u0005\u00023=\u0005\u001a\u000e\u0002",
    "4=\u0005\u001c\u000f\u00025=\u0005\n\u0006\u00026=\u0005\u0018\r\u0002",
    "7=\u0005\f\u0007\u00028=\u0005\u000e\b\u00029=\u0005\u0010\t\u0002:",
    ";\u0007.\u0002\u0002;=\b\u0004\u0001\u0002<1\u0003\u0002\u0002\u0002",
    "<2\u0003\u0002\u0002\u0002<3\u0003\u0002\u0002\u0002<4\u0003\u0002\u0002",
    "\u0002<5\u0003\u0002\u0002\u0002<6\u0003\u0002\u0002\u0002<7\u0003\u0002",
    "\u0002\u0002<8\u0003\u0002\u0002\u0002<9\u0003\u0002\u0002\u0002<:\u0003",
    "\u0002\u0002\u0002=\u0007\u0003\u0002\u0002\u0002>?\u0005\"\u0012\u0002",
    "?\t\u0003\u0002\u0002\u0002@A\u0007#\u0002\u0002AB\u0005\u001e\u0010",
    "\u0002BC\u0007\u0016\u0002\u0002C\u000b\u0003\u0002\u0002\u0002DE\u0007",
    "%\u0002\u0002EF\u0007\u0018\u0002\u0002FG\u0007\u0019\u0002\u0002GH",
    "\u0007\u0016\u0002\u0002H\r\u0003\u0002\u0002\u0002IJ\u0007$\u0002\u0002",
    "JK\u0007\u0018\u0002\u0002KL\u0007\u0019\u0002\u0002LM\u0007\u0016\u0002",
    "\u0002M\u000f\u0003\u0002\u0002\u0002NO\u0007&\u0002\u0002OP\u0007\u0018",
    "\u0002\u0002PQ\u0007*\u0002\u0002QR\u0007\u0015\u0002\u0002RS\u0007",
    "*\u0002\u0002ST\u0007\u0019\u0002\u0002TU\u0007\u0016\u0002\u0002U\u0011",
    "\u0003\u0002\u0002\u0002VW\u0007\u001f\u0002\u0002W]\u0005\u0014\u000b",
    "\u0002XY\u0007 \u0002\u0002YZ\u0007\u001f\u0002\u0002Z\\\u0005\u0014",
    "\u000b\u0002[X\u0003\u0002\u0002\u0002\\_\u0003\u0002\u0002\u0002][",
    "\u0003\u0002\u0002\u0002]^\u0003\u0002\u0002\u0002^b\u0003\u0002\u0002",
    "\u0002_]\u0003\u0002\u0002\u0002`a\u0007 \u0002\u0002ac\u0005\u0016",
    "\f\u0002b`\u0003\u0002\u0002\u0002bc\u0003\u0002\u0002\u0002c\u0013",
    "\u0003\u0002\u0002\u0002de\u0005\"\u0012\u0002ef\u0005\u0016\f\u0002",
    "f\u0015\u0003\u0002\u0002\u0002gh\u0007\u001a\u0002\u0002hi\u0005\u0004",
    "\u0003\u0002ij\u0007\u001b\u0002\u0002jm\u0003\u0002\u0002\u0002km\u0005",
    "\u0006\u0004\u0002lg\u0003\u0002\u0002\u0002lk\u0003\u0002\u0002\u0002",
    "m\u0017\u0003\u0002\u0002\u0002no\u0007\u0003\u0002\u0002op\u0005&\u0014",
    "\u0002pq\u0007\u0016\u0002\u0002q\u0019\u0003\u0002\u0002\u0002rs\u0007",
    "!\u0002\u0002st\u0005\"\u0012\u0002tu\u0005\u0016\f\u0002u\u001b\u0003",
    "\u0002\u0002\u0002vw\u0007\"\u0002\u0002wx\u0005\"\u0012\u0002xy\u0007",
    "\u0016\u0002\u0002y\u001d\u0003\u0002\u0002\u0002z{\u0007\u001a\u0002",
    "\u0002{|\u0007\'\u0002\u0002|}\u0007\u001b\u0002\u0002}\u001f\u0003",
    "\u0002\u0002\u0002~\u007f\u0007\u0013\u0002\u0002\u007f\u0080\u0007",
    "\'\u0002\u0002\u0080!\u0003\u0002\u0002\u0002\u0081\u0082\b\u0012\u0001",
    "\u0002\u0082\u0083\u0007\r\u0002\u0002\u0083\u0089\u0005\"\u0012\f\u0084",
    "\u0085\u0007\u0012\u0002\u0002\u0085\u0089\u0005\"\u0012\u000b\u0086",
    "\u0089\u0005&\u0014\u0002\u0087\u0089\u0005 \u0011\u0002\u0088\u0081",
    "\u0003\u0002\u0002\u0002\u0088\u0084\u0003\u0002\u0002\u0002\u0088\u0086",
    "\u0003\u0002\u0002\u0002\u0088\u0087\u0003\u0002\u0002\u0002\u0089\u009e",
    "\u0003\u0002\u0002\u0002\u008a\u008b\f\n\u0002\u0002\u008b\u008c\t\u0002",
    "\u0002\u0002\u008c\u009d\u0005\"\u0012\u000b\u008d\u008e\f\t\u0002\u0002",
    "\u008e\u008f\t\u0003\u0002\u0002\u008f\u009d\u0005\"\u0012\n\u0090\u0091",
    "\f\b\u0002\u0002\u0091\u0092\t\u0004\u0002\u0002\u0092\u009d\u0005\"",
    "\u0012\t\u0093\u0094\f\u0007\u0002\u0002\u0094\u0095\t\u0005\u0002\u0002",
    "\u0095\u009d\u0005\"\u0012\b\u0096\u0097\f\u0006\u0002\u0002\u0097\u0098",
    "\u0007\u0005\u0002\u0002\u0098\u009d\u0005\"\u0012\u0007\u0099\u009a",
    "\f\u0005\u0002\u0002\u009a\u009b\u0007\u0004\u0002\u0002\u009b\u009d",
    "\u0005\"\u0012\u0006\u009c\u008a\u0003\u0002\u0002\u0002\u009c\u008d",
    "\u0003\u0002\u0002\u0002\u009c\u0090\u0003\u0002\u0002\u0002\u009c\u0093",
    "\u0003\u0002\u0002\u0002\u009c\u0096\u0003\u0002\u0002\u0002\u009c\u0099",
    "\u0003\u0002\u0002\u0002\u009d\u00a0\u0003\u0002\u0002\u0002\u009e\u009c",
    "\u0003\u0002\u0002\u0002\u009e\u009f\u0003\u0002\u0002\u0002\u009f#",
    "\u0003\u0002\u0002\u0002\u00a0\u009e\u0003\u0002\u0002\u0002\u00a1\u00a2",
    "\t\u0006\u0002\u0002\u00a2%\u0003\u0002\u0002\u0002\u00a3\u00a4\u0007",
    "\u0018\u0002\u0002\u00a4\u00a5\u0005\"\u0012\u0002\u00a5\u00a6\u0007",
    "\u0019\u0002\u0002\u00a6\u00ae\u0003\u0002\u0002\u0002\u00a7\u00ae\t",
    "\u0007\u0002\u0002\u00a8\u00ae\t\b\u0002\u0002\u00a9\u00ae\u0007\'\u0002",
    "\u0002\u00aa\u00ae\u0007*\u0002\u0002\u00ab\u00ae\u0007\u001e\u0002",
    "\u0002\u00ac\u00ae\u0007+\u0002\u0002\u00ad\u00a3\u0003\u0002\u0002",
    "\u0002\u00ad\u00a7\u0003\u0002\u0002\u0002\u00ad\u00a8\u0003\u0002\u0002",
    "\u0002\u00ad\u00a9\u0003\u0002\u0002\u0002\u00ad\u00aa\u0003\u0002\u0002",
    "\u0002\u00ad\u00ab\u0003\u0002\u0002\u0002\u00ad\u00ac\u0003\u0002\u0002",
    "\u0002\u00ae\'\u0003\u0002\u0002\u0002\u000b.<]bl\u0088\u009c\u009e",
    "\u00ad"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'return '", "'OR'", "'AND'", "'=='", "'!='", 
                     "'>'", "'<'", "'>='", "'<='", "'+'", "'-'", "'*'", 
                     "'/'", "'%'", "'^'", "'!'", "'&'", "'<DOUBLE_QUOTE>'", 
                     "','", "';'", "'='", "'('", "')'", "'{'", "'}'", "'true'", 
                     "'false'", "'nil'", "'if'", "'else'", "'while'", "'log'", 
                     "'goto'", "'continue'", "'skip'", "'confirmcontinue'" ];

var symbolicNames = [ null, null, "OR", "AND", "EQ", "NEQ", "GT", "LT", 
                      "GTEQ", "LTEQ", "PLUS", "MINUS", "MULT", "DIV", "MOD", 
                      "POW", "NOT", "AMP", "DOUBLE_QUOTE", "COMMA", "SCOL", 
                      "ASSIGN", "OPAR", "CPAR", "OBRACE", "CBRACE", "TRUE", 
                      "FALSE", "NIL", "IF", "ELSE", "WHILE", "LOG", "GOTO", 
                      "KEY_CONTINUE", "KEY_SKIP", "KEY_CONFIRMCONTINUE", 
                      "ID", "INT", "FLOAT", "STRING", "VALUE_STRING", "COMMENT", 
                      "SPACE", "OTHER" ];

var ruleNames =  [ "parse", "block", "stat", "direct_mapping", "goto_stat", 
                   "skip_return", "continue_return", "confirmcontinue_return", 
                   "if_stat", "condition_block", "stat_block", "return_stat", 
                   "while_stat", "log", "sectionstepid", "variable", "expr", 
                   "operator", "atom" ];

function CBPParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

CBPParser.prototype = Object.create(antlr4.Parser.prototype);
CBPParser.prototype.constructor = CBPParser;

Object.defineProperty(CBPParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

CBPParser.EOF = antlr4.Token.EOF;
CBPParser.T__0 = 1;
CBPParser.OR = 2;
CBPParser.AND = 3;
CBPParser.EQ = 4;
CBPParser.NEQ = 5;
CBPParser.GT = 6;
CBPParser.LT = 7;
CBPParser.GTEQ = 8;
CBPParser.LTEQ = 9;
CBPParser.PLUS = 10;
CBPParser.MINUS = 11;
CBPParser.MULT = 12;
CBPParser.DIV = 13;
CBPParser.MOD = 14;
CBPParser.POW = 15;
CBPParser.NOT = 16;
CBPParser.AMP = 17;
CBPParser.DOUBLE_QUOTE = 18;
CBPParser.COMMA = 19;
CBPParser.SCOL = 20;
CBPParser.ASSIGN = 21;
CBPParser.OPAR = 22;
CBPParser.CPAR = 23;
CBPParser.OBRACE = 24;
CBPParser.CBRACE = 25;
CBPParser.TRUE = 26;
CBPParser.FALSE = 27;
CBPParser.NIL = 28;
CBPParser.IF = 29;
CBPParser.ELSE = 30;
CBPParser.WHILE = 31;
CBPParser.LOG = 32;
CBPParser.GOTO = 33;
CBPParser.KEY_CONTINUE = 34;
CBPParser.KEY_SKIP = 35;
CBPParser.KEY_CONFIRMCONTINUE = 36;
CBPParser.ID = 37;
CBPParser.INT = 38;
CBPParser.FLOAT = 39;
CBPParser.STRING = 40;
CBPParser.VALUE_STRING = 41;
CBPParser.COMMENT = 42;
CBPParser.SPACE = 43;
CBPParser.OTHER = 44;

CBPParser.RULE_parse = 0;
CBPParser.RULE_block = 1;
CBPParser.RULE_stat = 2;
CBPParser.RULE_direct_mapping = 3;
CBPParser.RULE_goto_stat = 4;
CBPParser.RULE_skip_return = 5;
CBPParser.RULE_continue_return = 6;
CBPParser.RULE_confirmcontinue_return = 7;
CBPParser.RULE_if_stat = 8;
CBPParser.RULE_condition_block = 9;
CBPParser.RULE_stat_block = 10;
CBPParser.RULE_return_stat = 11;
CBPParser.RULE_while_stat = 12;
CBPParser.RULE_log = 13;
CBPParser.RULE_sectionstepid = 14;
CBPParser.RULE_variable = 15;
CBPParser.RULE_expr = 16;
CBPParser.RULE_operator = 17;
CBPParser.RULE_atom = 18;


function ParseContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_parse;
    return this;
}

ParseContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParseContext.prototype.constructor = ParseContext;

ParseContext.prototype.block = function() {
    return this.getTypedRuleContext(BlockContext,0);
};

ParseContext.prototype.EOF = function() {
    return this.getToken(CBPParser.EOF, 0);
};

ParseContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterParse(this);
	}
};

ParseContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitParse(this);
	}
};

ParseContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitParse(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.ParseContext = ParseContext;

CBPParser.prototype.parse = function() {

    var localctx = new ParseContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, CBPParser.RULE_parse);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 38;
        this.block();
        this.state = 39;
        this.match(CBPParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function BlockContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_block;
    return this;
}

BlockContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BlockContext.prototype.constructor = BlockContext;

BlockContext.prototype.stat = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(StatContext);
    } else {
        return this.getTypedRuleContext(StatContext,i);
    }
};

BlockContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterBlock(this);
	}
};

BlockContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitBlock(this);
	}
};

BlockContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitBlock(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.BlockContext = BlockContext;

CBPParser.prototype.block = function() {

    var localctx = new BlockContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, CBPParser.RULE_block);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 44;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << CBPParser.T__0) | (1 << CBPParser.MINUS) | (1 << CBPParser.NOT) | (1 << CBPParser.AMP) | (1 << CBPParser.OPAR) | (1 << CBPParser.TRUE) | (1 << CBPParser.FALSE) | (1 << CBPParser.NIL) | (1 << CBPParser.IF) | (1 << CBPParser.WHILE))) !== 0) || ((((_la - 32)) & ~0x1f) == 0 && ((1 << (_la - 32)) & ((1 << (CBPParser.LOG - 32)) | (1 << (CBPParser.GOTO - 32)) | (1 << (CBPParser.KEY_CONTINUE - 32)) | (1 << (CBPParser.KEY_SKIP - 32)) | (1 << (CBPParser.KEY_CONFIRMCONTINUE - 32)) | (1 << (CBPParser.ID - 32)) | (1 << (CBPParser.INT - 32)) | (1 << (CBPParser.FLOAT - 32)) | (1 << (CBPParser.STRING - 32)) | (1 << (CBPParser.VALUE_STRING - 32)) | (1 << (CBPParser.OTHER - 32)))) !== 0)) {
            this.state = 41;
            this.stat();
            this.state = 46;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function StatContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_stat;
    this._OTHER = null; // Token
    return this;
}

StatContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
StatContext.prototype.constructor = StatContext;

StatContext.prototype.if_stat = function() {
    return this.getTypedRuleContext(If_statContext,0);
};

StatContext.prototype.direct_mapping = function() {
    return this.getTypedRuleContext(Direct_mappingContext,0);
};

StatContext.prototype.while_stat = function() {
    return this.getTypedRuleContext(While_statContext,0);
};

StatContext.prototype.log = function() {
    return this.getTypedRuleContext(LogContext,0);
};

StatContext.prototype.goto_stat = function() {
    return this.getTypedRuleContext(Goto_statContext,0);
};

StatContext.prototype.return_stat = function() {
    return this.getTypedRuleContext(Return_statContext,0);
};

StatContext.prototype.skip_return = function() {
    return this.getTypedRuleContext(Skip_returnContext,0);
};

StatContext.prototype.continue_return = function() {
    return this.getTypedRuleContext(Continue_returnContext,0);
};

StatContext.prototype.confirmcontinue_return = function() {
    return this.getTypedRuleContext(Confirmcontinue_returnContext,0);
};

StatContext.prototype.OTHER = function() {
    return this.getToken(CBPParser.OTHER, 0);
};

StatContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterStat(this);
	}
};

StatContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitStat(this);
	}
};

StatContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitStat(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.StatContext = StatContext;

CBPParser.prototype.stat = function() {

    var localctx = new StatContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, CBPParser.RULE_stat);
    try {
        this.state = 58;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case CBPParser.IF:
            this.enterOuterAlt(localctx, 1);
            this.state = 47;
            this.if_stat();
            break;
        case CBPParser.MINUS:
        case CBPParser.NOT:
        case CBPParser.AMP:
        case CBPParser.OPAR:
        case CBPParser.TRUE:
        case CBPParser.FALSE:
        case CBPParser.NIL:
        case CBPParser.ID:
        case CBPParser.INT:
        case CBPParser.FLOAT:
        case CBPParser.STRING:
        case CBPParser.VALUE_STRING:
            this.enterOuterAlt(localctx, 2);
            this.state = 48;
            this.direct_mapping();
            break;
        case CBPParser.WHILE:
            this.enterOuterAlt(localctx, 3);
            this.state = 49;
            this.while_stat();
            break;
        case CBPParser.LOG:
            this.enterOuterAlt(localctx, 4);
            this.state = 50;
            this.log();
            break;
        case CBPParser.GOTO:
            this.enterOuterAlt(localctx, 5);
            this.state = 51;
            this.goto_stat();
            break;
        case CBPParser.T__0:
            this.enterOuterAlt(localctx, 6);
            this.state = 52;
            this.return_stat();
            break;
        case CBPParser.KEY_SKIP:
            this.enterOuterAlt(localctx, 7);
            this.state = 53;
            this.skip_return();
            break;
        case CBPParser.KEY_CONTINUE:
            this.enterOuterAlt(localctx, 8);
            this.state = 54;
            this.continue_return();
            break;
        case CBPParser.KEY_CONFIRMCONTINUE:
            this.enterOuterAlt(localctx, 9);
            this.state = 55;
            this.confirmcontinue_return();
            break;
        case CBPParser.OTHER:
            this.enterOuterAlt(localctx, 10);
            this.state = 56;
            localctx._OTHER = this.match(CBPParser.OTHER);
            console.log("unknown char: " + (localctx._OTHER===null ? null : localctx._OTHER.text));
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function Direct_mappingContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_direct_mapping;
    return this;
}

Direct_mappingContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Direct_mappingContext.prototype.constructor = Direct_mappingContext;

Direct_mappingContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};

Direct_mappingContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterDirect_mapping(this);
	}
};

Direct_mappingContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitDirect_mapping(this);
	}
};

Direct_mappingContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitDirect_mapping(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.Direct_mappingContext = Direct_mappingContext;

CBPParser.prototype.direct_mapping = function() {

    var localctx = new Direct_mappingContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, CBPParser.RULE_direct_mapping);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 60;
        this.expr(0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function Goto_statContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_goto_stat;
    return this;
}

Goto_statContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Goto_statContext.prototype.constructor = Goto_statContext;

Goto_statContext.prototype.GOTO = function() {
    return this.getToken(CBPParser.GOTO, 0);
};

Goto_statContext.prototype.sectionstepid = function() {
    return this.getTypedRuleContext(SectionstepidContext,0);
};

Goto_statContext.prototype.SCOL = function() {
    return this.getToken(CBPParser.SCOL, 0);
};

Goto_statContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterGoto_stat(this);
	}
};

Goto_statContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitGoto_stat(this);
	}
};

Goto_statContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitGoto_stat(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.Goto_statContext = Goto_statContext;

CBPParser.prototype.goto_stat = function() {

    var localctx = new Goto_statContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, CBPParser.RULE_goto_stat);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 62;
        this.match(CBPParser.GOTO);
        this.state = 63;
        this.sectionstepid();
        this.state = 64;
        this.match(CBPParser.SCOL);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function Skip_returnContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_skip_return;
    return this;
}

Skip_returnContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Skip_returnContext.prototype.constructor = Skip_returnContext;

Skip_returnContext.prototype.KEY_SKIP = function() {
    return this.getToken(CBPParser.KEY_SKIP, 0);
};

Skip_returnContext.prototype.OPAR = function() {
    return this.getToken(CBPParser.OPAR, 0);
};

Skip_returnContext.prototype.CPAR = function() {
    return this.getToken(CBPParser.CPAR, 0);
};

Skip_returnContext.prototype.SCOL = function() {
    return this.getToken(CBPParser.SCOL, 0);
};

Skip_returnContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterSkip_return(this);
	}
};

Skip_returnContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitSkip_return(this);
	}
};

Skip_returnContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitSkip_return(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.Skip_returnContext = Skip_returnContext;

CBPParser.prototype.skip_return = function() {

    var localctx = new Skip_returnContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, CBPParser.RULE_skip_return);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 66;
        this.match(CBPParser.KEY_SKIP);
        this.state = 67;
        this.match(CBPParser.OPAR);
        this.state = 68;
        this.match(CBPParser.CPAR);
        this.state = 69;
        this.match(CBPParser.SCOL);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function Continue_returnContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_continue_return;
    return this;
}

Continue_returnContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Continue_returnContext.prototype.constructor = Continue_returnContext;

Continue_returnContext.prototype.KEY_CONTINUE = function() {
    return this.getToken(CBPParser.KEY_CONTINUE, 0);
};

Continue_returnContext.prototype.OPAR = function() {
    return this.getToken(CBPParser.OPAR, 0);
};

Continue_returnContext.prototype.CPAR = function() {
    return this.getToken(CBPParser.CPAR, 0);
};

Continue_returnContext.prototype.SCOL = function() {
    return this.getToken(CBPParser.SCOL, 0);
};

Continue_returnContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterContinue_return(this);
	}
};

Continue_returnContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitContinue_return(this);
	}
};

Continue_returnContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitContinue_return(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.Continue_returnContext = Continue_returnContext;

CBPParser.prototype.continue_return = function() {

    var localctx = new Continue_returnContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, CBPParser.RULE_continue_return);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 71;
        this.match(CBPParser.KEY_CONTINUE);
        this.state = 72;
        this.match(CBPParser.OPAR);
        this.state = 73;
        this.match(CBPParser.CPAR);
        this.state = 74;
        this.match(CBPParser.SCOL);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function Confirmcontinue_returnContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_confirmcontinue_return;
    return this;
}

Confirmcontinue_returnContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Confirmcontinue_returnContext.prototype.constructor = Confirmcontinue_returnContext;

Confirmcontinue_returnContext.prototype.KEY_CONFIRMCONTINUE = function() {
    return this.getToken(CBPParser.KEY_CONFIRMCONTINUE, 0);
};

Confirmcontinue_returnContext.prototype.OPAR = function() {
    return this.getToken(CBPParser.OPAR, 0);
};

Confirmcontinue_returnContext.prototype.STRING = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(CBPParser.STRING);
    } else {
        return this.getToken(CBPParser.STRING, i);
    }
};


Confirmcontinue_returnContext.prototype.COMMA = function() {
    return this.getToken(CBPParser.COMMA, 0);
};

Confirmcontinue_returnContext.prototype.CPAR = function() {
    return this.getToken(CBPParser.CPAR, 0);
};

Confirmcontinue_returnContext.prototype.SCOL = function() {
    return this.getToken(CBPParser.SCOL, 0);
};

Confirmcontinue_returnContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterConfirmcontinue_return(this);
	}
};

Confirmcontinue_returnContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitConfirmcontinue_return(this);
	}
};

Confirmcontinue_returnContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitConfirmcontinue_return(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.Confirmcontinue_returnContext = Confirmcontinue_returnContext;

CBPParser.prototype.confirmcontinue_return = function() {

    var localctx = new Confirmcontinue_returnContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, CBPParser.RULE_confirmcontinue_return);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 76;
        this.match(CBPParser.KEY_CONFIRMCONTINUE);
        this.state = 77;
        this.match(CBPParser.OPAR);
        this.state = 78;
        this.match(CBPParser.STRING);
        this.state = 79;
        this.match(CBPParser.COMMA);
        this.state = 80;
        this.match(CBPParser.STRING);
        this.state = 81;
        this.match(CBPParser.CPAR);
        this.state = 82;
        this.match(CBPParser.SCOL);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function If_statContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_if_stat;
    return this;
}

If_statContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
If_statContext.prototype.constructor = If_statContext;

If_statContext.prototype.IF = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(CBPParser.IF);
    } else {
        return this.getToken(CBPParser.IF, i);
    }
};


If_statContext.prototype.condition_block = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Condition_blockContext);
    } else {
        return this.getTypedRuleContext(Condition_blockContext,i);
    }
};

If_statContext.prototype.ELSE = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(CBPParser.ELSE);
    } else {
        return this.getToken(CBPParser.ELSE, i);
    }
};


If_statContext.prototype.stat_block = function() {
    return this.getTypedRuleContext(Stat_blockContext,0);
};

If_statContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterIf_stat(this);
	}
};

If_statContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitIf_stat(this);
	}
};

If_statContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitIf_stat(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.If_statContext = If_statContext;

CBPParser.prototype.if_stat = function() {

    var localctx = new If_statContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, CBPParser.RULE_if_stat);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 84;
        this.match(CBPParser.IF);
        this.state = 85;
        this.condition_block();
        this.state = 91;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,2,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 86;
                this.match(CBPParser.ELSE);
                this.state = 87;
                this.match(CBPParser.IF);
                this.state = 88;
                this.condition_block(); 
            }
            this.state = 93;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,2,this._ctx);
        }

        this.state = 96;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
        if(la_===1) {
            this.state = 94;
            this.match(CBPParser.ELSE);
            this.state = 95;
            this.stat_block();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function Condition_blockContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_condition_block;
    return this;
}

Condition_blockContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Condition_blockContext.prototype.constructor = Condition_blockContext;

Condition_blockContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};

Condition_blockContext.prototype.stat_block = function() {
    return this.getTypedRuleContext(Stat_blockContext,0);
};

Condition_blockContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterCondition_block(this);
	}
};

Condition_blockContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitCondition_block(this);
	}
};

Condition_blockContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitCondition_block(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.Condition_blockContext = Condition_blockContext;

CBPParser.prototype.condition_block = function() {

    var localctx = new Condition_blockContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, CBPParser.RULE_condition_block);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 98;
        this.expr(0);
        this.state = 99;
        this.stat_block();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function Stat_blockContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_stat_block;
    return this;
}

Stat_blockContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Stat_blockContext.prototype.constructor = Stat_blockContext;

Stat_blockContext.prototype.OBRACE = function() {
    return this.getToken(CBPParser.OBRACE, 0);
};

Stat_blockContext.prototype.block = function() {
    return this.getTypedRuleContext(BlockContext,0);
};

Stat_blockContext.prototype.CBRACE = function() {
    return this.getToken(CBPParser.CBRACE, 0);
};

Stat_blockContext.prototype.stat = function() {
    return this.getTypedRuleContext(StatContext,0);
};

Stat_blockContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterStat_block(this);
	}
};

Stat_blockContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitStat_block(this);
	}
};

Stat_blockContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitStat_block(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.Stat_blockContext = Stat_blockContext;

CBPParser.prototype.stat_block = function() {

    var localctx = new Stat_blockContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, CBPParser.RULE_stat_block);
    try {
        this.state = 106;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case CBPParser.OBRACE:
            this.enterOuterAlt(localctx, 1);
            this.state = 101;
            this.match(CBPParser.OBRACE);
            this.state = 102;
            this.block();
            this.state = 103;
            this.match(CBPParser.CBRACE);
            break;
        case CBPParser.T__0:
        case CBPParser.MINUS:
        case CBPParser.NOT:
        case CBPParser.AMP:
        case CBPParser.OPAR:
        case CBPParser.TRUE:
        case CBPParser.FALSE:
        case CBPParser.NIL:
        case CBPParser.IF:
        case CBPParser.WHILE:
        case CBPParser.LOG:
        case CBPParser.GOTO:
        case CBPParser.KEY_CONTINUE:
        case CBPParser.KEY_SKIP:
        case CBPParser.KEY_CONFIRMCONTINUE:
        case CBPParser.ID:
        case CBPParser.INT:
        case CBPParser.FLOAT:
        case CBPParser.STRING:
        case CBPParser.VALUE_STRING:
        case CBPParser.OTHER:
            this.enterOuterAlt(localctx, 2);
            this.state = 105;
            this.stat();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function Return_statContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_return_stat;
    return this;
}

Return_statContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Return_statContext.prototype.constructor = Return_statContext;

Return_statContext.prototype.atom = function() {
    return this.getTypedRuleContext(AtomContext,0);
};

Return_statContext.prototype.SCOL = function() {
    return this.getToken(CBPParser.SCOL, 0);
};

Return_statContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterReturn_stat(this);
	}
};

Return_statContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitReturn_stat(this);
	}
};

Return_statContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitReturn_stat(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.Return_statContext = Return_statContext;

CBPParser.prototype.return_stat = function() {

    var localctx = new Return_statContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, CBPParser.RULE_return_stat);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 108;
        this.match(CBPParser.T__0);
        this.state = 109;
        this.atom();
        this.state = 110;
        this.match(CBPParser.SCOL);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function While_statContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_while_stat;
    return this;
}

While_statContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
While_statContext.prototype.constructor = While_statContext;

While_statContext.prototype.WHILE = function() {
    return this.getToken(CBPParser.WHILE, 0);
};

While_statContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};

While_statContext.prototype.stat_block = function() {
    return this.getTypedRuleContext(Stat_blockContext,0);
};

While_statContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterWhile_stat(this);
	}
};

While_statContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitWhile_stat(this);
	}
};

While_statContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitWhile_stat(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.While_statContext = While_statContext;

CBPParser.prototype.while_stat = function() {

    var localctx = new While_statContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, CBPParser.RULE_while_stat);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 112;
        this.match(CBPParser.WHILE);
        this.state = 113;
        this.expr(0);
        this.state = 114;
        this.stat_block();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function LogContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_log;
    return this;
}

LogContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LogContext.prototype.constructor = LogContext;

LogContext.prototype.LOG = function() {
    return this.getToken(CBPParser.LOG, 0);
};

LogContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};

LogContext.prototype.SCOL = function() {
    return this.getToken(CBPParser.SCOL, 0);
};

LogContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterLog(this);
	}
};

LogContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitLog(this);
	}
};

LogContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitLog(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.LogContext = LogContext;

CBPParser.prototype.log = function() {

    var localctx = new LogContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, CBPParser.RULE_log);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 116;
        this.match(CBPParser.LOG);
        this.state = 117;
        this.expr(0);
        this.state = 118;
        this.match(CBPParser.SCOL);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function SectionstepidContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_sectionstepid;
    return this;
}

SectionstepidContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SectionstepidContext.prototype.constructor = SectionstepidContext;

SectionstepidContext.prototype.OBRACE = function() {
    return this.getToken(CBPParser.OBRACE, 0);
};

SectionstepidContext.prototype.ID = function() {
    return this.getToken(CBPParser.ID, 0);
};

SectionstepidContext.prototype.CBRACE = function() {
    return this.getToken(CBPParser.CBRACE, 0);
};

SectionstepidContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterSectionstepid(this);
	}
};

SectionstepidContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitSectionstepid(this);
	}
};

SectionstepidContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitSectionstepid(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.SectionstepidContext = SectionstepidContext;

CBPParser.prototype.sectionstepid = function() {

    var localctx = new SectionstepidContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, CBPParser.RULE_sectionstepid);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 120;
        this.match(CBPParser.OBRACE);
        this.state = 121;
        this.match(CBPParser.ID);
        this.state = 122;
        this.match(CBPParser.CBRACE);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function VariableContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_variable;
    return this;
}

VariableContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
VariableContext.prototype.constructor = VariableContext;

VariableContext.prototype.AMP = function() {
    return this.getToken(CBPParser.AMP, 0);
};

VariableContext.prototype.ID = function() {
    return this.getToken(CBPParser.ID, 0);
};

VariableContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterVariable(this);
	}
};

VariableContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitVariable(this);
	}
};

VariableContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitVariable(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.VariableContext = VariableContext;

CBPParser.prototype.variable = function() {

    var localctx = new VariableContext(this, this._ctx, this.state);
    this.enterRule(localctx, 30, CBPParser.RULE_variable);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 124;
        this.match(CBPParser.AMP);
        this.state = 125;
        this.match(CBPParser.ID);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_expr;
    return this;
}

ExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExprContext.prototype.constructor = ExprContext;


 
ExprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};

function VariableExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

VariableExprContext.prototype = Object.create(ExprContext.prototype);
VariableExprContext.prototype.constructor = VariableExprContext;

CBPParser.VariableExprContext = VariableExprContext;

VariableExprContext.prototype.variable = function() {
    return this.getTypedRuleContext(VariableContext,0);
};
VariableExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterVariableExpr(this);
	}
};

VariableExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitVariableExpr(this);
	}
};

VariableExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitVariableExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function NotExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

NotExprContext.prototype = Object.create(ExprContext.prototype);
NotExprContext.prototype.constructor = NotExprContext;

CBPParser.NotExprContext = NotExprContext;

NotExprContext.prototype.NOT = function() {
    return this.getToken(CBPParser.NOT, 0);
};

NotExprContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};
NotExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterNotExpr(this);
	}
};

NotExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitNotExpr(this);
	}
};

NotExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitNotExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function UnaryMinusExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

UnaryMinusExprContext.prototype = Object.create(ExprContext.prototype);
UnaryMinusExprContext.prototype.constructor = UnaryMinusExprContext;

CBPParser.UnaryMinusExprContext = UnaryMinusExprContext;

UnaryMinusExprContext.prototype.MINUS = function() {
    return this.getToken(CBPParser.MINUS, 0);
};

UnaryMinusExprContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};
UnaryMinusExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterUnaryMinusExpr(this);
	}
};

UnaryMinusExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitUnaryMinusExpr(this);
	}
};

UnaryMinusExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitUnaryMinusExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function MultiplicationExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    this.op = null; // Token;
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

MultiplicationExprContext.prototype = Object.create(ExprContext.prototype);
MultiplicationExprContext.prototype.constructor = MultiplicationExprContext;

CBPParser.MultiplicationExprContext = MultiplicationExprContext;

MultiplicationExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

MultiplicationExprContext.prototype.MULT = function() {
    return this.getToken(CBPParser.MULT, 0);
};

MultiplicationExprContext.prototype.DIV = function() {
    return this.getToken(CBPParser.DIV, 0);
};

MultiplicationExprContext.prototype.MOD = function() {
    return this.getToken(CBPParser.MOD, 0);
};
MultiplicationExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterMultiplicationExpr(this);
	}
};

MultiplicationExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitMultiplicationExpr(this);
	}
};

MultiplicationExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitMultiplicationExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function AtomExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AtomExprContext.prototype = Object.create(ExprContext.prototype);
AtomExprContext.prototype.constructor = AtomExprContext;

CBPParser.AtomExprContext = AtomExprContext;

AtomExprContext.prototype.atom = function() {
    return this.getTypedRuleContext(AtomContext,0);
};
AtomExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterAtomExpr(this);
	}
};

AtomExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitAtomExpr(this);
	}
};

AtomExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitAtomExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function OrExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

OrExprContext.prototype = Object.create(ExprContext.prototype);
OrExprContext.prototype.constructor = OrExprContext;

CBPParser.OrExprContext = OrExprContext;

OrExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

OrExprContext.prototype.OR = function() {
    return this.getToken(CBPParser.OR, 0);
};
OrExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterOrExpr(this);
	}
};

OrExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitOrExpr(this);
	}
};

OrExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitOrExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function AdditiveExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    this.op = null; // Token;
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AdditiveExprContext.prototype = Object.create(ExprContext.prototype);
AdditiveExprContext.prototype.constructor = AdditiveExprContext;

CBPParser.AdditiveExprContext = AdditiveExprContext;

AdditiveExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

AdditiveExprContext.prototype.PLUS = function() {
    return this.getToken(CBPParser.PLUS, 0);
};

AdditiveExprContext.prototype.MINUS = function() {
    return this.getToken(CBPParser.MINUS, 0);
};
AdditiveExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterAdditiveExpr(this);
	}
};

AdditiveExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitAdditiveExpr(this);
	}
};

AdditiveExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitAdditiveExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function RelationalExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    this.op = null; // Token;
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

RelationalExprContext.prototype = Object.create(ExprContext.prototype);
RelationalExprContext.prototype.constructor = RelationalExprContext;

CBPParser.RelationalExprContext = RelationalExprContext;

RelationalExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

RelationalExprContext.prototype.LTEQ = function() {
    return this.getToken(CBPParser.LTEQ, 0);
};

RelationalExprContext.prototype.GTEQ = function() {
    return this.getToken(CBPParser.GTEQ, 0);
};

RelationalExprContext.prototype.LT = function() {
    return this.getToken(CBPParser.LT, 0);
};

RelationalExprContext.prototype.GT = function() {
    return this.getToken(CBPParser.GT, 0);
};
RelationalExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterRelationalExpr(this);
	}
};

RelationalExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitRelationalExpr(this);
	}
};

RelationalExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitRelationalExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function EqualityExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    this.op = null; // Token;
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

EqualityExprContext.prototype = Object.create(ExprContext.prototype);
EqualityExprContext.prototype.constructor = EqualityExprContext;

CBPParser.EqualityExprContext = EqualityExprContext;

EqualityExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

EqualityExprContext.prototype.EQ = function() {
    return this.getToken(CBPParser.EQ, 0);
};

EqualityExprContext.prototype.NEQ = function() {
    return this.getToken(CBPParser.NEQ, 0);
};
EqualityExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterEqualityExpr(this);
	}
};

EqualityExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitEqualityExpr(this);
	}
};

EqualityExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitEqualityExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function AndExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AndExprContext.prototype = Object.create(ExprContext.prototype);
AndExprContext.prototype.constructor = AndExprContext;

CBPParser.AndExprContext = AndExprContext;

AndExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

AndExprContext.prototype.AND = function() {
    return this.getToken(CBPParser.AND, 0);
};
AndExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterAndExpr(this);
	}
};

AndExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitAndExpr(this);
	}
};

AndExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitAndExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};



CBPParser.prototype.expr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new ExprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 32;
    this.enterRecursionRule(localctx, 32, CBPParser.RULE_expr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 134;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case CBPParser.MINUS:
            localctx = new UnaryMinusExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;

            this.state = 128;
            this.match(CBPParser.MINUS);
            this.state = 129;
            this.expr(10);
            break;
        case CBPParser.NOT:
            localctx = new NotExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 130;
            this.match(CBPParser.NOT);
            this.state = 131;
            this.expr(9);
            break;
        case CBPParser.OPAR:
        case CBPParser.TRUE:
        case CBPParser.FALSE:
        case CBPParser.NIL:
        case CBPParser.ID:
        case CBPParser.INT:
        case CBPParser.FLOAT:
        case CBPParser.STRING:
        case CBPParser.VALUE_STRING:
            localctx = new AtomExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 132;
            this.atom();
            break;
        case CBPParser.AMP:
            localctx = new VariableExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 133;
            this.variable();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 156;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,7,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 154;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,6,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new MultiplicationExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, CBPParser.RULE_expr);
                    this.state = 136;
                    if (!( this.precpred(this._ctx, 8))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
                    }
                    this.state = 137;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << CBPParser.MULT) | (1 << CBPParser.DIV) | (1 << CBPParser.MOD))) !== 0))) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 138;
                    this.expr(9);
                    break;

                case 2:
                    localctx = new AdditiveExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, CBPParser.RULE_expr);
                    this.state = 139;
                    if (!( this.precpred(this._ctx, 7))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
                    }
                    this.state = 140;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(_la===CBPParser.PLUS || _la===CBPParser.MINUS)) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 141;
                    this.expr(8);
                    break;

                case 3:
                    localctx = new RelationalExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, CBPParser.RULE_expr);
                    this.state = 142;
                    if (!( this.precpred(this._ctx, 6))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                    }
                    this.state = 143;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << CBPParser.GT) | (1 << CBPParser.LT) | (1 << CBPParser.GTEQ) | (1 << CBPParser.LTEQ))) !== 0))) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 144;
                    this.expr(7);
                    break;

                case 4:
                    localctx = new EqualityExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, CBPParser.RULE_expr);
                    this.state = 145;
                    if (!( this.precpred(this._ctx, 5))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                    }
                    this.state = 146;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(_la===CBPParser.EQ || _la===CBPParser.NEQ)) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 147;
                    this.expr(6);
                    break;

                case 5:
                    localctx = new AndExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, CBPParser.RULE_expr);
                    this.state = 148;
                    if (!( this.precpred(this._ctx, 4))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                    }
                    this.state = 149;
                    this.match(CBPParser.AND);
                    this.state = 150;
                    this.expr(5);
                    break;

                case 6:
                    localctx = new OrExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, CBPParser.RULE_expr);
                    this.state = 151;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 152;
                    this.match(CBPParser.OR);
                    this.state = 153;
                    this.expr(4);
                    break;

                } 
            }
            this.state = 158;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,7,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};


function OperatorContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_operator;
    return this;
}

OperatorContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
OperatorContext.prototype.constructor = OperatorContext;

OperatorContext.prototype.PLUS = function() {
    return this.getToken(CBPParser.PLUS, 0);
};

OperatorContext.prototype.MINUS = function() {
    return this.getToken(CBPParser.MINUS, 0);
};

OperatorContext.prototype.MULT = function() {
    return this.getToken(CBPParser.MULT, 0);
};

OperatorContext.prototype.DIV = function() {
    return this.getToken(CBPParser.DIV, 0);
};

OperatorContext.prototype.LTEQ = function() {
    return this.getToken(CBPParser.LTEQ, 0);
};

OperatorContext.prototype.GTEQ = function() {
    return this.getToken(CBPParser.GTEQ, 0);
};

OperatorContext.prototype.LT = function() {
    return this.getToken(CBPParser.LT, 0);
};

OperatorContext.prototype.GT = function() {
    return this.getToken(CBPParser.GT, 0);
};

OperatorContext.prototype.EQ = function() {
    return this.getToken(CBPParser.EQ, 0);
};

OperatorContext.prototype.NEQ = function() {
    return this.getToken(CBPParser.NEQ, 0);
};

OperatorContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterOperator(this);
	}
};

OperatorContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitOperator(this);
	}
};

OperatorContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitOperator(this);
    } else {
        return visitor.visitChildren(this);
    }
};




CBPParser.OperatorContext = OperatorContext;

CBPParser.prototype.operator = function() {

    var localctx = new OperatorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, CBPParser.RULE_operator);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 159;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << CBPParser.EQ) | (1 << CBPParser.NEQ) | (1 << CBPParser.GT) | (1 << CBPParser.LT) | (1 << CBPParser.GTEQ) | (1 << CBPParser.LTEQ) | (1 << CBPParser.PLUS) | (1 << CBPParser.MINUS) | (1 << CBPParser.MULT) | (1 << CBPParser.DIV))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function AtomContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CBPParser.RULE_atom;
    return this;
}

AtomContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AtomContext.prototype.constructor = AtomContext;


 
AtomContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};


function ParExprContext(parser, ctx) {
	AtomContext.call(this, parser);
    AtomContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ParExprContext.prototype = Object.create(AtomContext.prototype);
ParExprContext.prototype.constructor = ParExprContext;

CBPParser.ParExprContext = ParExprContext;

ParExprContext.prototype.OPAR = function() {
    return this.getToken(CBPParser.OPAR, 0);
};

ParExprContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};

ParExprContext.prototype.CPAR = function() {
    return this.getToken(CBPParser.CPAR, 0);
};
ParExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterParExpr(this);
	}
};

ParExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitParExpr(this);
	}
};

ParExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitParExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BooleanAtomContext(parser, ctx) {
	AtomContext.call(this, parser);
    AtomContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BooleanAtomContext.prototype = Object.create(AtomContext.prototype);
BooleanAtomContext.prototype.constructor = BooleanAtomContext;

CBPParser.BooleanAtomContext = BooleanAtomContext;

BooleanAtomContext.prototype.TRUE = function() {
    return this.getToken(CBPParser.TRUE, 0);
};

BooleanAtomContext.prototype.FALSE = function() {
    return this.getToken(CBPParser.FALSE, 0);
};
BooleanAtomContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterBooleanAtom(this);
	}
};

BooleanAtomContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitBooleanAtom(this);
	}
};

BooleanAtomContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitBooleanAtom(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function IdAtomContext(parser, ctx) {
	AtomContext.call(this, parser);
    AtomContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IdAtomContext.prototype = Object.create(AtomContext.prototype);
IdAtomContext.prototype.constructor = IdAtomContext;

CBPParser.IdAtomContext = IdAtomContext;

IdAtomContext.prototype.ID = function() {
    return this.getToken(CBPParser.ID, 0);
};
IdAtomContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterIdAtom(this);
	}
};

IdAtomContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitIdAtom(this);
	}
};

IdAtomContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitIdAtom(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function StringAtomContext(parser, ctx) {
	AtomContext.call(this, parser);
    AtomContext.prototype.copyFrom.call(this, ctx);
    return this;
}

StringAtomContext.prototype = Object.create(AtomContext.prototype);
StringAtomContext.prototype.constructor = StringAtomContext;

CBPParser.StringAtomContext = StringAtomContext;

StringAtomContext.prototype.STRING = function() {
    return this.getToken(CBPParser.STRING, 0);
};
StringAtomContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterStringAtom(this);
	}
};

StringAtomContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitStringAtom(this);
	}
};

StringAtomContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitStringAtom(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ValueStringAtomContext(parser, ctx) {
	AtomContext.call(this, parser);
    AtomContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ValueStringAtomContext.prototype = Object.create(AtomContext.prototype);
ValueStringAtomContext.prototype.constructor = ValueStringAtomContext;

CBPParser.ValueStringAtomContext = ValueStringAtomContext;

ValueStringAtomContext.prototype.VALUE_STRING = function() {
    return this.getToken(CBPParser.VALUE_STRING, 0);
};
ValueStringAtomContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterValueStringAtom(this);
	}
};

ValueStringAtomContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitValueStringAtom(this);
	}
};

ValueStringAtomContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitValueStringAtom(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function NilAtomContext(parser, ctx) {
	AtomContext.call(this, parser);
    AtomContext.prototype.copyFrom.call(this, ctx);
    return this;
}

NilAtomContext.prototype = Object.create(AtomContext.prototype);
NilAtomContext.prototype.constructor = NilAtomContext;

CBPParser.NilAtomContext = NilAtomContext;

NilAtomContext.prototype.NIL = function() {
    return this.getToken(CBPParser.NIL, 0);
};
NilAtomContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterNilAtom(this);
	}
};

NilAtomContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitNilAtom(this);
	}
};

NilAtomContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitNilAtom(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function NumberAtomContext(parser, ctx) {
	AtomContext.call(this, parser);
    AtomContext.prototype.copyFrom.call(this, ctx);
    return this;
}

NumberAtomContext.prototype = Object.create(AtomContext.prototype);
NumberAtomContext.prototype.constructor = NumberAtomContext;

CBPParser.NumberAtomContext = NumberAtomContext;

NumberAtomContext.prototype.INT = function() {
    return this.getToken(CBPParser.INT, 0);
};

NumberAtomContext.prototype.FLOAT = function() {
    return this.getToken(CBPParser.FLOAT, 0);
};
NumberAtomContext.prototype.enterRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.enterNumberAtom(this);
	}
};

NumberAtomContext.prototype.exitRule = function(listener) {
    if(listener instanceof CBPListener ) {
        listener.exitNumberAtom(this);
	}
};

NumberAtomContext.prototype.accept = function(visitor) {
    if ( visitor instanceof CBPVisitor ) {
        return visitor.visitNumberAtom(this);
    } else {
        return visitor.visitChildren(this);
    }
};



CBPParser.AtomContext = AtomContext;

CBPParser.prototype.atom = function() {

    var localctx = new AtomContext(this, this._ctx, this.state);
    this.enterRule(localctx, 36, CBPParser.RULE_atom);
    var _la = 0; // Token type
    try {
        this.state = 171;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case CBPParser.OPAR:
            localctx = new ParExprContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 161;
            this.match(CBPParser.OPAR);
            this.state = 162;
            this.expr(0);
            this.state = 163;
            this.match(CBPParser.CPAR);
            break;
        case CBPParser.INT:
        case CBPParser.FLOAT:
            localctx = new NumberAtomContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 165;
            _la = this._input.LA(1);
            if(!(_la===CBPParser.INT || _la===CBPParser.FLOAT)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            break;
        case CBPParser.TRUE:
        case CBPParser.FALSE:
            localctx = new BooleanAtomContext(this, localctx);
            this.enterOuterAlt(localctx, 3);
            this.state = 166;
            _la = this._input.LA(1);
            if(!(_la===CBPParser.TRUE || _la===CBPParser.FALSE)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            break;
        case CBPParser.ID:
            localctx = new IdAtomContext(this, localctx);
            this.enterOuterAlt(localctx, 4);
            this.state = 167;
            this.match(CBPParser.ID);
            break;
        case CBPParser.STRING:
            localctx = new StringAtomContext(this, localctx);
            this.enterOuterAlt(localctx, 5);
            this.state = 168;
            this.match(CBPParser.STRING);
            break;
        case CBPParser.NIL:
            localctx = new NilAtomContext(this, localctx);
            this.enterOuterAlt(localctx, 6);
            this.state = 169;
            this.match(CBPParser.NIL);
            break;
        case CBPParser.VALUE_STRING:
            localctx = new ValueStringAtomContext(this, localctx);
            this.enterOuterAlt(localctx, 7);
            this.state = 170;
            this.match(CBPParser.VALUE_STRING);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


CBPParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 16:
			return this.expr_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

CBPParser.prototype.expr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 8);
		case 1:
			return this.precpred(this._ctx, 7);
		case 2:
			return this.precpred(this._ctx, 6);
		case 3:
			return this.precpred(this._ctx, 5);
		case 4:
			return this.precpred(this._ctx, 4);
		case 5:
			return this.precpred(this._ctx, 3);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.CBPParser = CBPParser;
