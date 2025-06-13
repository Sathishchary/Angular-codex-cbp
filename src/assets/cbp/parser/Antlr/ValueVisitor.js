var antlr4 = require('../../antlr4/index');
var CBPLexer = require('./CBPLexer');
var CBPParser = require('./CBPParser');
var CBPVisitor = require('./CBPVisitor').CBPVisitor;
var callBackObject;
var returnResponse;

ValueVisitor = function(callBackObject) {
  CBPVisitor.call(this); // inherit default visitor
	this.callBackObject = callBackObject;
  return this;
};

ValueVisitor.prototype = Object.create(CBPVisitor.prototype);
ValueVisitor.prototype.constructor = ValueVisitor;
ValueVisitor.prototype.getResponse = function(){
	return this.returnResponse;
};

// Visit a parse tree produced by CBPParser#if_stat.
ValueVisitor.prototype.visitIf_stat = function(ctx) {
	var conditions = ctx.condition_block();
	var evaluated;
	for(i = 0; i < conditions.length; i++){
		evaluated = this.visit(conditions[i].expr());
		if(Array.isArray(evaluated)){
			evaluated = evaluated[0];
		}
		if(evaluated == true){
			this.visit(conditions[i].stat_block());
			break;
		}
	}
	//Else
	if(!evaluated && ctx.stat_block() != null){
		this.visit(ctx.stat_block());
	}
	return null;
};

// Visit a parse tree produced by CBPParser#assignment.
/*ValueVisitor.prototype.visitAssignment = function(ctx) {
	id = ctx.getChild(1).getText();
	this.callBackObject.setValue(id, ctx.expr().getText());
  	return this.visitChildren(ctx);
};*/

ValueVisitor.prototype.visitGoto_stat = function(ctx) {
	id = this.visit(ctx.sectionstepid());
};

// Visit a parse tree produced by CBPParser#sectionstepid.
ValueVisitor.prototype.visitSectionstepid = function(ctx) {
	this.returnResponse = ctx.ID().getText().replace('{', '').replace('}', '');
};

// Visit a parse tree produced by CBPParser#relationalExpr.
ValueVisitor.prototype.visitRelationalExpr = function(ctx) {
	operator = ctx.op.text;
	var value1 = this.visit(ctx.expr(0))[0];
	var value2 = this.visit(ctx.expr(1))[0];
	var dateFormat = this.callBackObject.dateFormat;
	var isValueDate = value1?.includes('/') || value1?.includes('-') ? true : false;
    var number1 = isValueDate ? parseDate(value1, dateFormat) : parseFloat(value1);
	var number2 = isValueDate ? parseDate(value2, dateFormat) : parseFloat(value2);
    value1 = Number.isNaN(number1) ? value1 : number1;
	value2 = Number.isNaN(number2) ? value2 : number2;
	if(operator == ">"){
		return value1 > value2;
	} else if(operator == "<"){
		return value1 < value2;
	} else if(operator == ">="){
		return value1 >= value2;
	} else if(operator == "<="){
		return value1 <= value2;
	}
    return false;
};

function parseDate(dateStr, dateFormat) {
    const months = {
        "jan": 0, "feb": 1, "mar": 2, "apr": 3, "may": 4, "jun": 5,
        "jul": 6, "aug": 7, "sep": 8, "oct": 9, "nov": 10, "dec": 11
	};
	console.log(this.callBackObject);
	let parts;
    switch (dateFormat) {
        case 'mm/dd/yyyy':
			parts = dateStr.split('/');
            return getDateInMilliSeconds(parts[2], parts[0] - 1, parts[1]);
        case 'dd/mm/yyyy':
			parts = dateStr.split('/');
			return getDateInMilliSeconds(parts[2], parts[1] - 1, parts[0]);
        case 'dd/mon/yyyy':
            parts = dateStr.split('/');
		    return getDateInMilliSeconds(parts[2], months[parts[1].toLowerCase()], parts[0]);
        case 'yyyy/mon/dd':
			parts = dateStr.split('/');
			return getDateInMilliSeconds(parts[0], months[parts[1].toLowerCase()], parts[2]);
        case 'mm-dd-yyyy':
            parts = dateStr.split('-');
            return getDateInMilliSeconds(parts[2], parts[0] - 1, parts[1]);
        case 'dd-mm-yyyy':
            parts = dateStr.split('-');
			return getDateInMilliSeconds(parts[2], parts[1] - 1, parts[0]);
        case 'dd-mon-yyyy':
            parts = dateStr.split('-');
			return getDateInMilliSeconds(parts[2], months[parts[1].toLowerCase()], parts[0]);
        case 'yyyy-mon-dd':
            parts = dateStr.split('-');
            return getDateInMilliSeconds(parts[0], months[parts[1].toLowerCase()], parts[2]);
        default:
            throw new Error("Unsupported date format");
    }
}
function getDateInMilliSeconds(date1, date2, date3){
	var date = new Date(date1, date2, date3);
	var milliseconds = date.getTime(); 
	return milliseconds;
}
ValueVisitor.prototype.visitEqualityExpr = function(ctx) {
	let  operator = ctx.op.text;
  try{
    var value1 = this.visit(ctx.expr(0))[0];
    var value2 = this.visit(ctx.expr(1))[0];
  } catch(error){
    // console.log('visitequal expr:',value1, value2);
  }
//   console.log('visitequal expr:',value1, value2);
	var number1 = parseFloat(value1);
	var number2 = parseFloat(value2);
	if(!isNaN(value1) && !isNaN(value2)){
		value1 = number1;
		value2 = number2;
	}
	if(operator == "=="){
		if(String(value2) == "<<DG_EMPTY>>" && String(value1) == "<<DG_EMPTY>>"){
		 return true;
		}
    if(Array.isArray(value1)){
      let isValid = value1.filter(item=>item === value2);
      return isValid?.length>0 ? true: false;
    }
		return String(value1) == String(value2);
	}
  if(operator == "!="){
    if(value1 == undefined) return false;
    if((typeof value1 == 'number' && typeof value2 == 'number') && value1 != value2) return true;
    if(Array.isArray(value1)){
      let isValid = value1.filter(item=>item === value2);
      return isValid?.length>0 ? true: false;
    }
    if((typeof value1 == 'string' && typeof value2 == 'string') && String(value1) != String(value2)) return true;
    return String(value1) !== String(value2);
  }
  return false;
};

// Visit a parse tree produced by CBPParser#stringAtom.
ValueVisitor.prototype.visitStringAtom = function(ctx) {
	//console.log(returnResponse);
  return ctx.STRING().getText().replace("\"", "").replace("\"", "");
};

// Visit a parse tree produced by CBPParser#valueStringAtom.
ValueVisitor.prototype.visitValueStringAtom = function(ctx) {
  return ctx.VALUE_STRING().getText().replace("<DOUBLE_QUOTE>", "").replace("<DOUBLE_QUOTE>", "");
};

// Visit a parse tree produced by CBPParser#idAtom.
ValueVisitor.prototype.visitIdAtom = function(ctx) {
  return ctx.ID().getText();
};

ValueVisitor.prototype.visitVariable = function(ctx) {
  // &UserQual
 if(ctx.ID().getText().replace('&', '') == "UserQual"){
  //  console.log(this.callBackObject.qualificationRoles);
   return this.callBackObject.qualificationRoles;
 }
 var varValue = this.callBackObject.getValue(ctx.ID().getText().replace('&', ''));
 //Check the variable value is empty/null/undefined.
 //If empty/null/undefined return <<DG_EMPTY>>
 if (varValue === undefined || varValue === null)
	 return "<<DG_EMPTY>>";
 return varValue;
};

ValueVisitor.prototype.visitAndExpr = function(ctx) {
	var resp1 = this.visit(ctx.expr(0));
	var resp2 = this.visit(ctx.expr(1));
	if(Array.isArray(resp1)){ resp1 = resp1[0];}
	if(Array.isArray(resp2)){ resp2 = resp2[0];}
	return (resp1 && resp2);
};

// Visit a parse tree produced by CBPParser#orExpr.
CBPVisitor.prototype.visitOrExpr = function(ctx) {
  var resp1 = this.visit(ctx.expr(0));
	var resp2 = this.visit(ctx.expr(1));
	if(Array.isArray(resp1)){ resp1 = resp1[0];}
	if(Array.isArray(resp2)){ resp2 = resp2[0];}
	//console.log(resp1);
	//console.log(resp2);
	return (resp1 || resp2);
};

// Visit a parse tree produced by CBPParser#skip_return.
ValueVisitor.prototype.visitSkip_return = function(ctx) {
  this.returnResponse = false;
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by CBPParser#continue_return.
ValueVisitor.prototype.visitContinue_return = function(ctx) {
	this.returnResponse = true;
  return this.visitChildren(ctx);
};

ValueVisitor.prototype.visitConfirmcontinue_return = function(ctx) {
  this.returnResponse = ctx.STRING()[1].getText().replace("\"", "").replace("\"", "");
  return this.visitChildren(ctx);
};

ValueVisitor.prototype.visitAtomExpr = function(ctx) {
  return this.visitChildren(ctx);
};

// Visit a parse tree produced by CBPParser#parExpr.
ValueVisitor.prototype.visitParExpr = function(ctx) {
	//console.log(ctx.expr(0));
	//if(ctx.expr() instanceof RelationalExprContext){
	//	console.log("Relation");
	//} else if(ctx.expr() instanceof AndExprContext){
	//	console.log("And");
	//} else if(ctx.expr() instanceof OrExprContext){
	//	console.log("Or");
	//}
	var response = this.visit(ctx.expr(0));
	//console.log("PAR EXP: "+response);
  	return response;
};

// Visit a parse tree produced by CBPParser#return_stat.
ValueVisitor.prototype.visitReturn_stat = function(ctx) {
  this.returnResponse = ctx.atom().getText()
  return this.visitChildren(ctx);
};

ValueVisitor.prototype.visitWhile_stat = function(ctx) {
	var evaluated = this.visit(ctx.expr());
	if(Array.isArray(evaluated)){
		evaluated = evaluated[0];
	}
	if(evaluated == true){
		this.visit(ctx.stat_block());
	} else {
		this.returnResponse = false;
	}
	return null;
};

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
};


/*ValueVisitor.prototype.visitArithmetic = function(ctx) {
	console.log(ctx.expr(0));
	console.log(ctx.expr(1));
	console.log(ctx.expr(2));
	operator = ctx.operator().getText();
	var value1 = this.visit(ctx.expr(0));
	var value2 = this.visit(ctx.expr(1));
	console.log(value1);
	console.log(value2);
	if(Array.isArray(value1)){
		if(isNumeric(value1[0])){
			value1 = Number(value1[0]);
		}else{
			value1 = String(value1[0]);
		}
	}
	if(Array.isArray(value2)){
		if(isNumeric(value2[0])){
			value2 = Number(value2[0]);
		}else{
			value2 = String(value2[0]);
		}
	}
	console.log("After: "+value1);
	console.log("After: "+value2);
	console.log(operator);
	if(!this.returnResponse){
		this.returnResponse = "";
	}
	if(operator == "+"){
		this.returnResponse +=  value1 + value2;
	} else if(operator == "-"){
		this.returnResponse +=  value1 - value2;
	} else if(operator == "*"){
		this.returnResponse +=  value1 * value2;
	} else if(operator == "/"){
		this.returnResponse +=  value1 / value2;
	}
  	return this.visitChildren(ctx);
};*/

ValueVisitor.prototype.visitDirect_mapping = function(ctx) {
	var value1 = this.visit(ctx.expr(0));
	this.returnResponse = value1;
    return this.visitChildren(ctx);
};

ValueVisitor.prototype.visitMultiplicationExpr = function(ctx) {
	var operator = ctx.op.text;
	var value1 = this.visit(ctx.expr(0));
	var value2 = this.visit(ctx.expr(1));
	if(isNumeric(value1[0])){
		value1 = Number(value1[0]);
	}else{
		value1 = String(value1[0]);
	}
	if(isNumeric(value2[0])){
		value2 = Number(value2[0]);
	}else{
		value2 = String(value2[0]);
	}
	if(operator == "*"){
		//console.log("******");
		arr = new Array(1);
		arr[0] = value1 * value2;
		return arr;
	} else if(operator == "/"){
		//console.log("////////");
		arr = new Array(1);
		arr[0] = value1 / value2;
		return arr;
	} else {
		return "";
	}
};

ValueVisitor.prototype.visitAdditiveExpr = function(ctx) {
    var operator = ctx.op.text;
	var value1 = this.visit(ctx.expr(0));
	var value2 = this.visit(ctx.expr(1));
	var number1 = parseFloat(value1[0]);
	var number2 = parseFloat(value2[0]);
	if(number1 != NaN){
		value1 = number1;
	}else{
		value1 = String(value1[0]);
	}
	if(number2 != NaN){
		value2 = number2;
	}else{
		value2 = String(value2[0]);
	}
	if(operator == "+"){
		arr = new Array(1);
		arr[0] = value1 + value2;
		return arr;
	} else if(operator == "-"){
		arr = new Array(1);
		arr[0] = value1 - value2;
		return arr;
	} else {
		return "";
	}
};

exports.ValueVisitor = ValueVisitor;
