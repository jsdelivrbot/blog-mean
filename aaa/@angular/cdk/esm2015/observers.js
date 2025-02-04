/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, EventEmitter, Injectable, Input, NgModule, NgZone, Output } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators/debounceTime';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Factory that creates a new MutationObserver and allows us to stub it out in unit tests.
 * \@docs-private
 */
class MutationObserverFactory {
    /**
     * @param {?} callback
     * @return {?}
     */
    create(callback) {
        return typeof MutationObserver === 'undefined' ? null : new MutationObserver(callback);
    }
}
MutationObserverFactory.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MutationObserverFactory.ctorParameters = () => [];
/**
 * Directive that triggers a callback whenever the content of
 * its associated element has changed.
 */
class CdkObserveContent {
    /**
     * @param {?} _mutationObserverFactory
     * @param {?} _elementRef
     * @param {?} _ngZone
     */
    constructor(_mutationObserverFactory, _elementRef, _ngZone) {
        this._mutationObserverFactory = _mutationObserverFactory;
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._disabled = false;
        /**
         * Event emitted for each change in the element's content.
         */
        this.event = new EventEmitter();
        /**
         * Used for debouncing the emitted values to the observeContent event.
         */
        this._debouncer = new Subject();
    }
    /**
     * Whether observing content is disabled. This option can be used
     * to disconnect the underlying MutationObserver until it is needed.
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        if (this.debounce > 0) {
            this._ngZone.runOutsideAngular(() => {
                this._debouncer.pipe(debounceTime(this.debounce))
                    .subscribe((mutations) => this.event.emit(mutations));
            });
        }
        else {
            this._debouncer.subscribe(mutations => this.event.emit(mutations));
        }
        this._observer = this._ngZone.runOutsideAngular(() => {
            return this._mutationObserverFactory.create((mutations) => {
                this._debouncer.next(mutations);
            });
        });
        if (!this.disabled) {
            this._enable();
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['disabled']) {
            changes['disabled'].currentValue ? this._disable() : this._enable();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._disable();
        this._debouncer.complete();
    }
    /**
     * @return {?}
     */
    _disable() {
        if (this._observer) {
            this._observer.disconnect();
        }
    }
    /**
     * @return {?}
     */
    _enable() {
        if (this._observer) {
            this._observer.observe(this._elementRef.nativeElement, {
                characterData: true,
                childList: true,
                subtree: true
            });
        }
    }
}
CdkObserveContent.decorators = [
    { type: Directive, args: [{
                selector: '[cdkObserveContent]',
                exportAs: 'cdkObserveContent',
            },] },
];
/** @nocollapse */
CdkObserveContent.ctorParameters = () => [
    { type: MutationObserverFactory, },
    { type: ElementRef, },
    { type: NgZone, },
];
CdkObserveContent.propDecorators = {
    "event": [{ type: Output, args: ['cdkObserveContent',] },],
    "disabled": [{ type: Input, args: ['cdkObserveContentDisabled',] },],
    "debounce": [{ type: Input },],
};
class ObserversModule {
}
ObserversModule.decorators = [
    { type: NgModule, args: [{
                exports: [CdkObserveContent],
                declarations: [CdkObserveContent],
                providers: [MutationObserverFactory]
            },] },
];
/** @nocollapse */
ObserversModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { CdkObserveContent as ObserveContent, MutationObserverFactory, CdkObserveContent, ObserversModule };
//# sourceMappingURL=observers.js.map
