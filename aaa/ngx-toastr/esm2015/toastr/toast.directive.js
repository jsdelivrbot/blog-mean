/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, ElementRef, NgModule, } from '@angular/core';
export class ToastContainerDirective {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
    }
    /**
     * @return {?}
     */
    getContainerElement() {
        return this.el.nativeElement;
    }
}
ToastContainerDirective.decorators = [
    { type: Directive, args: [{
                selector: '[toastContainer]',
                exportAs: 'toastContainer',
            },] },
];
/** @nocollapse */
ToastContainerDirective.ctorParameters = () => [
    { type: ElementRef, },
];
function ToastContainerDirective_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ToastContainerDirective.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ToastContainerDirective.ctorParameters;
    /** @type {?} */
    ToastContainerDirective.prototype.el;
}
export class ToastContainerModule {
}
ToastContainerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ToastContainerDirective],
                exports: [ToastContainerDirective],
            },] },
];
function ToastContainerModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ToastContainerModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ToastContainerModule.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXRvYXN0ci8iLCJzb3VyY2VzIjpbInRvYXN0ci90b2FzdC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQU12QixNQUFNOzs7O0lBQ0osWUFBb0IsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7S0FBSzs7OztJQUN2QyxtQkFBbUI7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO0tBQzlCOzs7WUFSRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsUUFBUSxFQUFFLGdCQUFnQjthQUMzQjs7OztZQVBDLFVBQVU7Ozs7Ozs7Ozs7Ozs7QUFtQlosTUFBTTs7O1lBSkwsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLHVCQUF1QixDQUFDO2dCQUN2QyxPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQzthQUNuQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgTmdNb2R1bGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbdG9hc3RDb250YWluZXJdJyxcbiAgZXhwb3J0QXM6ICd0b2FzdENvbnRhaW5lcicsXG59KVxuZXhwb3J0IGNsYXNzIFRvYXN0Q29udGFpbmVyRGlyZWN0aXZlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZikgeyB9XG4gIGdldENvbnRhaW5lckVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbVG9hc3RDb250YWluZXJEaXJlY3RpdmVdLFxuICBleHBvcnRzOiBbVG9hc3RDb250YWluZXJEaXJlY3RpdmVdLFxufSlcbmV4cG9ydCBjbGFzcyBUb2FzdENvbnRhaW5lck1vZHVsZSB7fVxuIl19