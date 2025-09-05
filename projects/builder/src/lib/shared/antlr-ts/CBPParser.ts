// TypeScript wrapper for CBPParser
import { Parser, TokenStream } from 'antlr4ts';

// Import the existing JavaScript CBPParser
const CBPParserJS = require('../../../../../../src/assets/cbp/parser/Antlr/CBPParser').CBPParser;

export class CBPParser extends Parser {
  private jsParser: any;

  constructor(input: TokenStream) {
    super(input);
    this.jsParser = new CBPParserJS(input);
  }

  // Delegate main parse method to the JavaScript implementation
  public parse() {
    return this.jsParser.parse();
  }

  // Delegate other methods
  public set buildParseTrees(value: boolean) {
    this.jsParser.buildParseTrees = value;
  }

  public get buildParseTrees(): boolean {
    return this.jsParser.buildParseTrees;
  }

  public get grammarFileName(): string {
    return this.jsParser.grammarFileName;
  }

  public get ruleNames(): string[] {
    return this.jsParser.ruleNames;
  }

  public get tokenNames(): string[] {
    return this.jsParser.tokenNames;
  }

  public get vocabulary() {
    return this.jsParser.vocabulary;
  }

  // Token constants from CBPLexer
  static readonly UNKNOWN = 0;
  static readonly IF_FUNCTION = 1;
  static readonly AND = 2;
  static readonly OR = 3;
  static readonly NOT = 4;
  static readonly EQ = 5;
  static readonly NEQ = 6;
  static readonly GT = 7;
  static readonly LT = 8;
  static readonly GTEQ = 9;
  static readonly LTEQ = 10;
  static readonly PLUS = 11;
  static readonly MINUS = 12;
  static readonly MUL = 13;
  static readonly DIV = 14;
  static readonly ASSIGN = 15;
  static readonly SCOL = 16;
  static readonly DOT = 17;
  static readonly AMP = 18;
  static readonly OPAR = 19;
  static readonly CPAR = 20;
  static readonly OBRACE = 21;
  static readonly CBRACE = 22;
  static readonly TRUE = 23;
  static readonly FALSE = 24;
  static readonly NIL = 25;
  static readonly IF = 26;
  static readonly ELSE = 27;
  static readonly WHILE = 28;
  static readonly LOG = 29;
  static readonly GOTO = 30;
  static readonly KEY_CONTINUE = 31;
  static readonly KEY_SKIP = 32;
  static readonly KEY_CONFIRMCONTINUE = 33;
  static readonly ID = 34;
  static readonly INT = 35;
  static readonly FLOAT = 36;
  static readonly STRING = 37;
  static readonly VALUE_STRING = 38;
  static readonly COMMENT = 39;
  static readonly SPACE = 40;
  static readonly OTHER = 41;
}