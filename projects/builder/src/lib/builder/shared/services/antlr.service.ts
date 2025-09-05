import { Injectable } from '@angular/core';
import { CallbackObject } from 'cbp-shared';
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { CBPLexer, CBPParser, ExpressionVisitor, ValueVisitor } from '../../../shared/antlr-ts';

@Injectable({
  providedIn: 'root'
})
export class AntlrService {

  callBackObject: CallbackObject;
  constructor() {
    this.callBackObject = new CallbackObject();
  }

  createExpression(input:any, fieldName:any, dgUniquId:any) {
    const chars = CharStreams.fromString(input);
    const lexer = new CBPLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new CBPParser(tokens);
    parser.buildParseTrees = true;
    if(fieldName && dgUniquId)
    this.callBackObject.init(fieldName, dgUniquId);
    const expressionVisitor = new ExpressionVisitor(this.callBackObject);
    expressionVisitor.visit(parser.parse());
    const expression = expressionVisitor.createExpression(input);
   // console.log('Expression : ' + expression);
    return expression;
  }

  executeExpression(input:any) {
    const chars = CharStreams.fromString(input);
    const lexer = new CBPLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new CBPParser(tokens);
    parser.buildParseTrees = true;
    const	valueVisitor = new ValueVisitor(this.callBackObject);
    valueVisitor.visit(parser.parse());
    return valueVisitor.getResponse();
  }
}
