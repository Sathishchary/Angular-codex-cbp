import { Injectable } from '@angular/core';
import { CallbackObject } from 'cbp-shared';
// Antrl source files

const antlr4 = require('src/assets/cbp/antlr4/index');
const CBPLexer = require('src/assets/cbp/parser/Antlr/CBPLexer');
const CBPParser = require('src/assets/cbp/parser/Antlr/CBPParser');
const ExpressionVisitor = require('src/assets/cbp/parser/Antlr/ExpressionVisitor');
const ValueVisitor = require('src/assets/cbp/parser/Antlr/ValueVisitor');

@Injectable({
  providedIn: 'root'
})
export class AntlrService {

  callBackObject: CallbackObject;
  constructor() {
    this.callBackObject = new CallbackObject();
  }

  createExpression(input:any, fieldName:any, dgUniquId:any) {
    const chars = new antlr4.InputStream(input);
    const lexer = new CBPLexer.CBPLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new CBPParser.CBPParser(tokens);
    parser.buildParseTrees = true;
    if(fieldName && dgUniquId)
    this.callBackObject.init(fieldName, dgUniquId);
    const expressionVisitor = new ExpressionVisitor.ExpressionVisitor(this.callBackObject);
    expressionVisitor.visit(parser.parse());
    const expression = expressionVisitor.createExpression(input);
   // console.log('Expression : ' + expression);
    return expression;
  }

  executeExpression(input:any) {
    const chars = new antlr4.InputStream(input);
    const lexer = new CBPLexer.CBPLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new CBPParser.CBPParser(tokens);
    parser.buildParseTrees = true;
    const	valueVisitor = new ValueVisitor.ValueVisitor(this.callBackObject);
    valueVisitor.visit(parser.parse());
    return valueVisitor.getResponse();
  }
}
