import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit, Attribute, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef,
  HostBinding, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, Output,
  Renderer2, SimpleChanges, ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AngularEditorToolbarComponent } from './angular-editor-toolbar.component';
import { AngularEditorService } from './angular-editor.service';
import { AngularEditorConfig, angularEditorConfig } from './config';
import { isDefined } from './utils';
@Component({
  selector: 'angular-editor',
  templateUrl: './angular-editor.component.html',
  styleUrls: ['./angular-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AngularEditorComponent),
      multi: true
    },
    AngularEditorService
  ]
})
export class AngularEditorComponent implements OnInit, ControlValueAccessor,
  AfterViewInit, OnDestroy, OnChanges {

  private onChange!: (value: any) => void;
  private onTouched!: () => void;

  modeVisual = true;
  showPlaceholder = false;
  disabled = false;
  focused = false;
  touched = false;
  changed = false;

  focusInstance: any;
  blurInstance: any;
  @Input() id = '';
  @Input() hyperLink: any;
  @Input()
  index!: boolean;
  @Input() config: AngularEditorConfig = angularEditorConfig;
  @Input() placeholder = '';
  @Input() tabIndex: number | null;
  @Input() foreColor!: any;
  @Input() stepObject!: any;
  @Output() html: any;
  @Input() defaultTextEditor: boolean = false;
  @Input() readonly: any;
  @Input() isDisabled: any;

  //HyperLink varibles
  lastCaretPos = 0;
  parentNode: any;
  range: any;
  selection: any;
  loaded = true;
  validNumberHtml: any;
  @Input() signatureConfig: any;

  @ViewChild('editor', { static: true })
  textArea!: ElementRef;
  @ViewChild('editorWrapper', { static: true })
  editorWrapper!: ElementRef;
  @ViewChild('editorToolbar')
  editorToolbar!: AngularEditorToolbarComponent;

  @Output() viewMode = new EventEmitter<boolean>();
  @Output() stepObjectChange: EventEmitter<any> = new EventEmitter<any>();

  /** emits `blur` event when focused out from the textarea */
  // tslint:disable-next-line:no-output-native no-output-rename
  @Output('blur') blurEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output('close') closeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output('data') dataEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output('position') positionEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output('update') updateView: EventEmitter<any> = new EventEmitter<any>();
  @Output('tab') tabEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() mouseOutEvent: EventEmitter<any> = new EventEmitter<any>();

  /** emits `focus` event when focused in to the textarea */
  // tslint:disable-next-line:no-output-rename no-output-native
  @Output('focus') focusEvent: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  @HostBinding('attr.tabindex') tabindex = -1;

  @HostListener('focus')
  onFocus() {
    this.focus();
  }

  constructor(
    private r: Renderer2,
    private editorService: AngularEditorService,
    @Inject(DOCUMENT) private doc: any,
    private cdRef: ChangeDetectorRef,
    @Attribute('tabindex') defaultTabIndex: string,
    @Attribute('autofocus') private autoFocus: any
  ) {
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'index' && !changes.index.firstChange) {
        this.dataEvent.emit({ position: this.showCaretPos(this.textArea.nativeElement), isFocused: this.focused });
        console.log(this.textArea.nativeElement)
      } else if (propName === 'hyperLink' && !changes.hyperLink.firstChange) {
        if (this.hyperLink && this.textArea) {
          // if (!this.focused) {
          //   this.hyperLink = null;
          //   this.positionEvent.emit({ isFocused: this.focused, type: 'focus' });
          //   return;
          // }
          var selectPastedContent = this.textArea.nativeElement.checked;
          this.pasteHtmlAtCaret(this.getHyperLinkString(this.hyperLink), selectPastedContent);

          this.editorService.setFontName(this.doc.queryCommandValue('FontName').replace(/"/g, ''));
          this.editorService.setFontSize(this.doc.queryCommandValue('FontSize'));
          this.hyperLink = null;
          this.positionEvent.emit({ isFocused: this.focused, type: 'refresh', html: this.textArea.nativeElement.innerHTML });
          this.cdRef.detectChanges();
        }

      } else if (propName === 'foreColor' && changes?.foreColor) {
        this.foreColor = changes.foreColor?.currentValue;
        this.addColor();
        this.config.foreColor = changes.foreColor?.currentValue;
      } else {
        this.dataEvent.emit(this.textArea.nativeElement.innerHTML.length + 1);
      }
    }
  }

  ngOnInit() {
    this.config.toolbarPosition = this.config.toolbarPosition ? this.config.toolbarPosition : angularEditorConfig.toolbarPosition;
  }

  ngAfterViewInit() {
    if (isDefined(this.autoFocus)) {
      this.focus();
    } else {
      setTimeout(() => {
        this.placeCaretAtEnd(this.textArea.nativeElement);
        this.configure();
        this.addColor();
      }, 1);
    }
  }

  placeCaretAtEnd(el: any) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
      var range: any = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel: any = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof (document.body as any)['createTextRange'] != "undefined") {
      var textRange = this.doc.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
    this.selection = window.getSelection();
    if (this.selection && this.selection.rangeCount > 0) {
      this.range = this.selection.getRangeAt(0);
      this.parentNode = this.range.commonAncestorContainer.parentNode;
    }
  }
  createHyperLinkWithPosition(event: any) {
    console.log(event)
  }
  getHyperLinkString(hlData: any): any {
    const id = Math.random().toString(36).slice(-8);
    const string = `<span type="button" class="popuptextClose" style="    font-size: 18px;
    float: right;

    margin-right: 12px;
    border: 1px solid black;
    border-radius: 41px;
    background-color: black;
    color: white;" >
    <span aria-hidden="true">&times;</span>
  </span>`
    let hyperLink = ' <a href="javascript:void(0);" id="' + id + '" class="hyperlink popup" dgc_reference_object_key="refObjKey" '
      + ' reference_object_code= "refObjCode" placement="top"  [ngbTooltip]="refContent">' + hlData.title + '</a> ';



    const data = {
      //  equipmentid:hlData.data.DGC_REFERENCE_OBJECT_DETAIL?.equipmentId,
      "dgc_reference_object_key": hlData.dgc_reference_object_key,
      "reference_object_code": hlData.reference_object_code
      // title: hlData.title,
      // link: hlData.link
    };
    hyperLink = hyperLink.replace(/refObjKey/g, hlData.dgc_reference_object_key);
    hyperLink = hyperLink.replace(/refObjCode/g, hlData.reference_object_code);

    return hyperLink;
  }

  /**
   * Executed command from editor header buttons
   * @param command string from triggerCommand
   */
  executeCommand(command: string) {
    if (this.editorToolbar && this.editorToolbar?.foreColour !== undefined) {
      this.foreColor = this.editorToolbar?.foreColour != this.foreColor ? this.editorToolbar.foreColour : this.foreColor;
    }
    this.focus();
    if (command === 'focus') {
      return;
    }
    if (command === 'toggleEditorMode') {
      this.toggleEditorMode(this.modeVisual);
    } else if (command !== '') {
      if (command === 'clear') {
        this.editorService.removeSelectedElements(this.getCustomTags());
        this.onContentChange(this.textArea.nativeElement);
      } else if (command === 'default') {
        this.editorService.removeSelectedElements('h1,h2,h3,h4,h5,h6,p,pre');
        this.onContentChange(this.textArea.nativeElement);
      } else if (
        command === 'undo' ||
        command === 'redo' ||
        command === 'bold' ||
        command === 'italic' ||
        command === 'underline' ||
        command === 'strikeThrough' ||
        command === 'subscript' ||
        command === 'superscript' ||
        command === 'justifyLeft' ||
        command === 'justifyCenter' ||
        command === 'justifyRight' ||
        command === 'justifyFull' ||
        command === 'indent' ||
        command === 'outdent' ||
        command === 'insertUnorderedList' ||
        command === 'insertOrderedList' ||
        command === 'block' ||
        command === 'unlink' ||
        command === 'insertHorizontalRule' ||
        command === 'removeFormat' ||
        command === 'toggleEditorMode'

      ) {
        this.editorService.executeCommand(command);
      } else if (this.changed) {
        this.editorService.executeCommand(command);
      }
      this.exec('new');
    }
  }

  /**
   * focus event
   */
  onTextAreaFocus(event: FocusEvent): void {
    if (this.focused) {
      event.stopPropagation();
      return;
    }
    this.focused = true;
    this.focusEvent.emit(event);
    if (!this.touched || !this.changed) {
      this.editorService.executeInNextQueueIteration(() => {
        this.configure();
        this.touched = true;
      });
    }
  }

  /**
   * @description fires when cursor leaves textarea
   */
  public onTextAreaMouseOut(event: MouseEvent): void {
    this.editorService.saveSelection();
    this.mouseOutEvent.emit('mouseOut');
  }

  /**
   * blur event
   */
  onTextAreaBlur(event: FocusEvent) {
    /**
     * save selection if focussed out
     */
    this.editorService.executeInNextQueueIteration(this.editorService.saveSelection);

    if (typeof this.onTouched === 'function') {
      this.onTouched();
    }
    this.setFontFaces();
    if (event.relatedTarget !== null) {
      const parent: any = (event.relatedTarget as HTMLElement).parentElement;
      if (!parent.classList.contains('angular-editor-toolbar-set') && !parent.classList.contains('ae-picker')) {
        const element = document.querySelector('.angular-editor-toolbar-set.color');
        if (this.stepObject?.isTableDataEntry && element) { } else {
          this.blurEvent.emit({ event: event, from: 'AngularEditor' });
          this.focused = false;
        }
      }
    } else { this.blurEvent.emit({ event: event, from: 'AngularEditor' }); }

  }

  /**
   *  focus the text area when the editor is focused
   */
  focus() {
    if (this.modeVisual) {
      this.textArea.nativeElement.focus();
      // this.addColor();
    } else {
      const sourceText = this.doc.getElementById('sourceText' + this.id);
      sourceText.focus();
      this.focused = true;
    }
  }

  addColor() {
    if (this.foreColor) {
      this.editorService.insertColor(this.foreColor, 'textColor', 'update');
    }
  }

  /**
   * Executed from the contenteditable section while the input property changes
   * @param element html element from contenteditable
   */
  onContentChange(element: HTMLElement): void {
    let html = '';
    if (this.modeVisual) {
      html = element.innerHTML;
    } else {
      html = element.innerText;
    }
    if ((!html || html === '<br>')) {
      html = '';
    }
    if (typeof this.onChange === 'function') {
      this.onChange(html);
      if ((!html) !== this.showPlaceholder) {
        this.togglePlaceholder(this.showPlaceholder);
      }
    }
    this.changed = true;
    if (this.textArea.nativeElement.innerHTML !== '') {
      if (this.isKeyNumeric(this.validNumberHtml?.key)) {
        if (this.config['onlyNumber'] && this.stepObject?.dgType == 'NumericDataEntry') {
          const selection = window.getSelection();
          const range = document.createRange();
          let inputValue = (this.removeHTMLTags(this.textArea.nativeElement.innerHTML) || "").toString().trim();
          let innerHtml = this.textArea.nativeElement.innerHTML;
          if (!!this.stepObject.decimal) {
            const [integerPart, decimalPart] = inputValue.split('.');
            if (decimalPart && decimalPart.length > this.stepObject.decimal) {
              this.textArea.nativeElement.innerHTML = this.validNumberHtml.html;
              this.stepObject.storeValue = this.validNumberHtml.html;
              range.selectNodeContents(this.textArea.nativeElement);
              range.collapse(false); // Move to the end
              selection?.removeAllRanges();
              selection?.addRange(range);
            }
          }
        }
      }
      this.updateView.emit(this.textArea.nativeElement.innerHTML);
    }
    this.selection = window.getSelection();
    if (this.selection && this.selection.rangeCount > 0) {
      this.range = this.selection.getRangeAt(0);
      this.parentNode = this.range.commonAncestorContainer.parentNode;
    }
    this.changed = true;
  }

  isKeyNumeric(key: any, currentValue: string = ''): boolean {
    if (/[0-9]/.test(key)) return true;
    if (key === '.' && !currentValue.includes('.') && currentValue.length != 0) return true;
    if (key === '-' && currentValue.length === 0) return true;
    return false;
  }

  // keypress event

  keyPressEvent(event: any) {
    if (this.config['maxLength'] || (this.stepObject?.Maxsize && ('Maxsize' in this.stepObject))) {
      this.config.maxLength = this.config['maxLength'] ? this.config['maxLength'] : Number(this.stepObject?.Maxsize)
      let valid = this.containsOnlyNumbers(event.key);
      return (event?.target?.innerText['length'] < this.config['maxLength'] && valid) ? true : false;
    }
    if (this.config['onlyNumber'] && this.stepObject?.dgType == 'NumericDataEntry') {
      return this.validate(event);
    }
    if (this.readonly) {
      return false;
    }
    return true;
  }
  pasteContent(event: any) {
    if (event?.type === 'paste') {
      if (!this.config['maxLengthEnabled'] && !this.config['onlyNumber']) {
        event.preventDefault();
        let text = event.clipboardData.getData('text/plain');
        let html: any = this.config.foreColor !== undefined ? `<font color="${this.config.foreColor}">${text}</font>` : text;
        this.editorService.insertHtml(html);
      }
      if (!this.config['maxLengthEnabled'] && this.config['onlyNumber']) {
        event.preventDefault();
        let text = event.clipboardData.getData('text/plain');
        if (this.containsOnlyNumbers(text)) {
          let html: any = this.config.foreColor !== undefined ? `<font color="${this.config.foreColor}">${text}</font>` : text;
          this.editorService.insertHtml(html);
        }
      }
    }
  }
  containsOnlyNumbers(str: string) {
    return /^-?\d+$/.test(str);
  }
  validate(event: any) {
    let theEvent = event || window.event;
    let key: string;
    if (theEvent.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      let keyCode = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(keyCode);
    }
    const inputValue = (this.removeHTMLTags(this.stepObject.storeValue) || "").toString().trim();
    const isMinusAtStart = key === '-' && inputValue.length === 0;
    const isValidDigit = /^[0-9]$/.test(key);
    const decimalPlaces = Number(this.stepObject?.decimal);
    const isSingleDot = key === '.' && !inputValue.includes('.') && inputValue.length != 0 && (!isNaN(decimalPlaces) && decimalPlaces > 0);
    const isValidKey = isMinusAtStart || isValidDigit || isSingleDot;
    if (!isValidKey) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
      return;
    }
    this.validNumberHtml = { html: this.textArea.nativeElement.innerHTML, key: key };
  }

  /**
   * Set the function to be called
   * when the control receives a change event.
   *
   * @param fn a function
   */
  registerOnChange(fn: any): void {
    this.onChange = e => (e === '<br>' ? fn('') : fn(e));
  }

  /**
   * Set the function to be called
   * when the control receives a touch event.
   *
   * @param fn a function
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Write a new value to the element.
   *
   * @param value value to be executed when there is a change in contenteditable
   */
  writeValue(value: any): void {

    if ((!value || value === '<br>' || value === '') !== this.showPlaceholder) {
      this.togglePlaceholder(this.showPlaceholder);
    }

    if (value === undefined || value === '' || value === '<br>') {
      value = null;
    }

    this.refreshView(value);
  }

  /**
   * refresh view/HTML of the editor
   *
   * @param value html string from the editor
   */
  refreshView(value: string): void {
    const normalizedValue = value === null ? '' : value;
    this.r.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);

    return;
  }

  /**
   * toggles placeholder based on input string
   *
   * @param value A HTML string from the editor
   */
  togglePlaceholder(value: boolean): void {
    if (!value) {
      this.r.addClass(this.editorWrapper.nativeElement, 'show-placeholder');
      this.showPlaceholder = true;

    } else {
      this.r.removeClass(this.editorWrapper.nativeElement, 'show-placeholder');
      this.showPlaceholder = false;
    }
  }

  /**
   * Implements disabled state for this element
   *
   * @param isDisabled Disabled flag
   */
  setDisabledState(isDisabled: boolean): void {
    const div = this.textArea.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    this.r[action](div, 'disabled');
    this.disabled = isDisabled;
  }

  /**
   * toggles editor mode based on bToSource bool
   *
   * @param bToSource A boolean value from the editor
   */
  toggleEditorMode(bToSource: boolean) {
    let oContent: any;
    const editableElement = this.textArea.nativeElement;

    if (bToSource) {
      oContent = this.r.createText(editableElement.innerHTML);
      this.r.setProperty(editableElement, 'innerHTML', '');
      this.r.setProperty(editableElement, 'contentEditable', false);

      const oPre = this.r.createElement('pre');
      this.r.setStyle(oPre, 'margin', '0');
      this.r.setStyle(oPre, 'outline', 'none');

      const oCode = this.r.createElement('code');
      this.r.setProperty(oCode, 'id', 'sourceText' + this.id);
      this.r.setStyle(oCode, 'display', 'block');
      this.r.setStyle(oCode, 'white-space', 'pre-wrap');
      this.r.setStyle(oCode, 'word-break', 'keep-all');
      this.r.setStyle(oCode, 'outline', 'none');
      this.r.setStyle(oCode, 'margin', '0');
      this.r.setStyle(oCode, 'background-color', '#fff5b9');
      this.r.setProperty(oCode, 'contentEditable', true);
      this.r.appendChild(oCode, oContent);
      this.focusInstance = this.r.listen(oCode, 'focus', (event) => this.onTextAreaFocus(event));
      this.blurInstance = this.r.listen(oCode, 'blur', (event) => this.onTextAreaBlur(event));
      this.r.appendChild(oPre, oCode);
      this.r.appendChild(editableElement, oPre);

      // ToDo move to service
      this.doc.execCommand('defaultParagraphSeparator', false, 'div');

      this.modeVisual = false;
      this.viewMode.emit(false);
      oCode.focus();
    } else {
      if (this.doc.querySelectorAll) {
        this.r.setProperty(editableElement, 'innerHTML', editableElement.innerText);
      } else {
        oContent = this.doc.createRange();
        oContent.selectNodeContents(editableElement.firstChild);
        this.r.setProperty(editableElement, 'innerHTML', oContent.toString());
      }
      this.r.setProperty(editableElement, 'contentEditable', true);
      this.modeVisual = true;
      this.viewMode.emit(true);
      this.onContentChange(editableElement);
      editableElement.focus();
    }
    if (this.editorToolbar)
      this.editorToolbar.setEditorMode(!this.modeVisual);
  }

  /**
   * toggles editor buttons when cursor moved or positioning
   *
   * Send a node array from the contentEditable of the editor
   */
  exec(type: any) {
    if (type == "updateButtons") {
      this.editorToolbar?.isSubOrSuperScriptActive();
    }
    // console.log(event);
    // if(event && (event.key == 'Delete' || event.key == 'Backspace')){
    //   event.preventDefault();
    // }
    if (this.editorToolbar)
      this.editorToolbar.triggerButtons();

    let userSelection;
    if (this.doc.getSelection) {
      userSelection = this.doc.getSelection();
      this.editorService.executeInNextQueueIteration(this.editorService.saveSelection);
    }

    let a = userSelection.focusNode;
    const els = [];
    while (a && a.id !== 'editor') {
      els.unshift(a);
      a = a.parentNode;
    }
    if (this.editorToolbar)
      this.editorToolbar.triggerBlocks(els);
  }

  private configure() {
    this.editorService.uploadUrl = this.config.uploadUrl;
    this.editorService.uploadWithCredentials = this.config.uploadWithCredentials;
    if (this.config.defaultParagraphSeparator) {
      this.editorService.setDefaultParagraphSeparator(this.config.defaultParagraphSeparator);
    }
    if (this.config.defaultFontName) {
      this.editorService.setFontName(this.config.defaultFontName);
    }
    if (this.config.defaultFontSize) {
      this.editorService.setFontSize(this.config.defaultFontSize);
    }
    if (this.signatureConfig == 'verificationStyles') {
      let styleObject = {
        fontcolor: this.config.foreColor,
        fontsize: this.config.defaultFontSize,
        fontfamily: this.config.defaultFontName
      }
      this.setStepobjectStyles(styleObject);
    } else {
      if (this.stepObject && "styleSet" in this.stepObject) {
        if (this.stepObject.dgType === 'SignatureDataEntry') {
          let styleObject;
          if (this.signatureConfig == 'signatureNotes') {
            styleObject = this.stepObject['notesStyleSet'];
          } else if (this.signatureConfig == 'signatureUserId') {
            styleObject = this.stepObject['userIdStyleSet'];
          } else {
            styleObject = this.stepObject['styleSet'];
          }
          this.setStepobjectStyles(styleObject);
        } else {
          this.setStepobjectStyles(this.stepObject['styleSet']);
        }
      }
    }
    if (this.config.foreColor && this.loaded) {
      this.editorService.insertColor(this.config.foreColor, 'textColor', 'update');
      this.loaded = false;
    }
    if (this.editorToolbar)
      this.editorToolbar.triggerButtons();
  }
  setStepobjectStyles(styleSet: any) {
    if (styleSet['textalign']) {
      let value = styleSet['textalign'] == 'center' ? 'Center' : (styleSet['textalign'] == 'left' ? 'Left' : 'Right');
      this.editorService.executeCommand('justify' + value);
    }
    if (styleSet['fontfamily']) {
      this.config.defaultFontName = styleSet['fontfamily'];
      if (this.signatureConfig == 'verificationStyles') {
        this.editorService.setFontName(styleSet['fontfamily']);
      } else {
        this.editorService.setFontName(this.stepObject['styleSet']['fontfamily']);
      }
    }
    if (styleSet['fontsize']) {
      this.config.defaultFontSize = styleSet['fontsize'];
      this.editorService.setFontSize(styleSet['fontsize']);
    }
    if (styleSet['fontcolor']) {
      let color: string = styleSet['fontcolor'];
      this.config.foreColor = color;
      this.editorService.insertColor(color, 'textColor', 'update');
    }
  }

  getFonts() {
    const fonts: any = this.config.fonts ? this.config.fonts : angularEditorConfig.fonts;
    return fonts.map((x: any) => {
      return { label: x.name, value: x.name };
    });
  }
  getCustomTags() {
    const tags = ['span'];
    this.config.customClasses.forEach((x: any) => {
      if (x.tag !== undefined) {
        if (!tags.includes(x.tag)) {
          tags.push(x.tag);
        }
      }
    });
    return tags.join(',');
  }

  ngOnDestroy() {
    this.changed = false;
    this.closeEvent.emit(this.textArea.nativeElement.innerHTML)
    if (this.blurInstance) {
      this.blurInstance();
    }
    if (this.focusInstance) {
      this.focusInstance();
    }
  }

  filterStyles(html: string): string {
    html = html.replace('position: fixed;', '');
    return html;
  }

  /*
  style="-webkit-user-select:text;" is needed for iPad

  */
  getCaretCharacterOffsetWithin(element: any) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != "Control") {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    } else {
      // caretOffset = this.setCaret(element);
    }
    return caretOffset;
  }


  setSelectionRange() {
    let range = document.createRange();
    let pos = this.textArea.nativeElement.lastChild.textContent.length;
    let sel = window.getSelection();
    console.log('el last child', this.textArea.nativeElement.lastChild.textContent.length, typeof (this.textArea.nativeElement.lastChild.textContent.length));
    range.setStart(this.textArea.nativeElement.lastChild, pos);
    range.collapse(true);
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }

  }
  showCaretPos(element: any) {
    if (element) {
      return this.getAbsPosition(this.getCaretCharacterOffsetWithin(element), element);
    }
    return null;
  }
  getAbsPosition(num: number, element: any) {
    let text = element.innerHTML;
    let pos = 0;
    let count = 0;
    let htmlIndexes = this.findHTMLIndexes(text);
    for (let index = 0; index < text.length; index++) {
      let state = false;
      for (let j = 0; j < htmlIndexes.length; j++) {
        if (index >= htmlIndexes[j].start && index <= htmlIndexes[j].end) {
          state = true;
          break;
        }
      }
      if (state) {
        continue;
      } else {
        ++count;
        if (count == num) {
          pos = index;
          break;
        }
      }
    }
    return pos;
  }
  findHTMLIndexes(htmlString: string) {
    let index = 0;
    let htmlIndexes = [];
    while (index < htmlString.length) {
      let start = htmlString.indexOf('<', index);
      if (start > -1) {
        let end = htmlString.indexOf('>', start + 1)
        htmlIndexes.push({
          start: start,
          end: end
        })
        index = end
      } else {
        index = htmlString.length
      }
    }
    return htmlIndexes;
  }

  //HYPER LINK CODE

  pasteHtmlAtCaret(html: any, selectPastedContent: any) {
    try {
      if (this.selection) {
        // IE9 and non-IE
        if (this.selection && this.selection.rangeCount) {
          //range  = this.getCaretCharacterRange(selectPastedContent);
          // range = sel.getRangeAt(0);
          this.range.deleteContents();
          // Range.createContextualFragment() would be useful here but is
          // only relatively recently standardized and is not supported in
          // some browsers (IE9, for one)
          var el = document.createElement("div");
          el.innerHTML = html;
          var frag = document.createDocumentFragment(), node, lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          var firstNode: ChildNode | null = frag.firstChild;
          this.range.insertNode(frag);
          // Preserve the selection
          if (lastNode) {
            this.range = this.range.cloneRange();
            this.range.setStartAfter(lastNode);
            if (selectPastedContent && firstNode) {
              this.range.setStartBefore(firstNode);
            } else {
              this.range.collapse(true);
            }
            this.selection.removeAllRanges();
            this.selection.addRange(this.range);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  tabTEvent(e: any) {
    this.tabEvent.emit(e);
  }

  updateChar(event: any) {
    var selectPastedContent = this.textArea.nativeElement.checked;
    this.pasteHtmlAtCaret('&#' + event, selectPastedContent);
  }

  resizeEvent(event: any) {
    this.stepObject['height'] = event.height;
    this.stepObjectChange.emit(this.stepObject);
  }

  setFontFaces() {
    const editor: HTMLElement | any = document.getElementById('cbp-editor');
    // editor.focus();
    const selection: any = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let fontNodesList = range.commonAncestorContainer.childNodes;
      if (fontNodesList?.length == 0) {
        fontNodesList = editor?.childNodes;
      }
      for (let i = 0; i < fontNodesList?.length; i++) {
        // console.log("## SET FONTS ##")
        if (fontNodesList[i] && fontNodesList[i]?.tagName?.toLowerCase() === 'font') {
          if (!fontNodesList[i].hasAttribute('face'))
            fontNodesList[i].setAttribute('face', 'Poppins');
        }
      }
    }
  }
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const parentElement = range.commonAncestorContainer.parentElement;
        if (parentElement) {
          const tagName = parentElement.tagName.toLowerCase();
          const trimmedContent = parentElement.textContent?.trim() ?? '';
          if ((tagName === 'sub' || tagName === 'sup') && trimmedContent?.length <= 1) {
            if (tagName === 'sub') {
              this.editorService.subScriptOption = false;
            } else if (tagName === 'sup') {
              this.editorService.superScriptOption = false;
            }
            if (this.editorToolbar) {
              const btn = tagName === 'sub' ? 'subscript' : 'superscript';
              this.editorToolbar.setSubOrSupScriptBtnsState(btn);
            }
          }
        }
      }
    }
  }
  removeHTMLTags(str: any) {
    try {
      if ((str === null) || (str === undefined) || (str === ''))
        return '';
      else {
        str = str.toString();
        let finalString = str.replace(/(<([^>]+)>)/ig, '');
        finalString = finalString.replace(/ /g, ' ');
        return finalString;
      }
    } catch (error: any) {
      console.log(error);
    }
  }
}
