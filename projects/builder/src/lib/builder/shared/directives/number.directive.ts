import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
    selector: "[numeric]"
})
export class NumericDirective {
    @Input("decimals") decimals:any = 0;

    private check(value: string) {
        if (this.decimals <= 0) {
            return String(value).match(new RegExp(/^\d+$/));
        } else {
            var regExpString =
                "^\\s*((\\d+(\\.\\d{0," +
                this.decimals +
                "})?)|((\\d*(\\.\\d{1," +
                this.decimals +
                "}))))\\s*$";
            return String(value).match(new RegExp(regExpString));
        }
    }

    private run(oldValue:any) {
        setTimeout(() => {
            let currentValue: string = this.el.nativeElement.value;
            if (currentValue !== '' && !this.check(currentValue)) {
                this.el.nativeElement.value = oldValue;
            }
        });
    }

    constructor(private el: ElementRef) {}

    @HostListener("keydown", ["$event"])
    onKeyDown(event: KeyboardEvent) {
        this.run(this.el.nativeElement.value);
    }

    @HostListener("paste", ["$event"])
    onPaste(event: ClipboardEvent) {
        this.run(this.el.nativeElement.value);
    }

}

// How to Use above directive
/**
 * If you want your feld should support numeric and decimal to the input fields, you can simply add the selector
 * basic examplem it will not allow you enter text in the input field:
 * <input type="text" numeric>
 *
 * example with decimal: decimals after number, just add count to the decimals selector:
 * <input type="text" numeric [decimals]="2">
 * means: your number should support 2 decimals after your number,.. ex: 23.34, 5.78 etc
 *
 */
