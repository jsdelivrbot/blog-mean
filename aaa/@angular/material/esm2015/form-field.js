/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, Inject, Input, NgModule, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { PlatformModule } from '@angular/cdk/platform';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MAT_LABEL_GLOBAL_OPTIONS, mixinColor } from '@angular/material/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { startWith } from 'rxjs/operators/startWith';
import { take } from 'rxjs/operators/take';
import { animate, state, style, transition, trigger } from '@angular/animations';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

let nextUniqueId = 0;
/**
 * Single error message to be shown underneath the form field.
 */
class MatError {
    constructor() {
        this.id = `mat-error-${nextUniqueId++}`;
    }
}
MatError.decorators = [
    { type: Directive, args: [{
                selector: 'mat-error',
                host: {
                    'class': 'mat-error',
                    'role': 'alert',
                    '[attr.id]': 'id',
                }
            },] },
];
/** @nocollapse */
MatError.ctorParameters = () => [];
MatError.propDecorators = {
    "id": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Animations used by the MatFormField.
 */
const matFormFieldAnimations = {
    /** Animation that transitions the form field's error and hint messages. */
    transitionMessages: trigger('transitionMessages', [
        // TODO(mmalerba): Use angular animations for label animation as well.
        state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
        transition('void => enter', [
            style({ opacity: 0, transform: 'translateY(-100%)' }),
            animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
        ]),
    ])
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * An interface which allows a control to work inside of a `MatFormField`.
 * @abstract
 */
class MatFormFieldControl {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * \@docs-private
 * @return {?}
 */
function getMatFormFieldPlaceholderConflictError() {
    return Error('Placeholder attribute and child element were both specified.');
}
/**
 * \@docs-private
 * @param {?} align
 * @return {?}
 */
function getMatFormFieldDuplicatedHintError(align) {
    return Error(`A hint was already declared for 'align="${align}"'.`);
}
/**
 * \@docs-private
 * @return {?}
 */
function getMatFormFieldMissingControlError() {
    return Error('mat-form-field must contain a MatFormFieldControl.');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

let nextUniqueId$2 = 0;
/**
 * Hint text to be shown underneath the form field control.
 */
class MatHint {
    constructor() {
        /**
         * Whether to align the hint label at the start or end of the line.
         */
        this.align = 'start';
        /**
         * Unique ID for the hint. Used for the aria-describedby on the form field control.
         */
        this.id = `mat-hint-${nextUniqueId$2++}`;
    }
}
MatHint.decorators = [
    { type: Directive, args: [{
                selector: 'mat-hint',
                host: {
                    'class': 'mat-hint',
                    '[class.mat-right]': 'align == "end"',
                    '[attr.id]': 'id',
                    // Remove align attribute to prevent it from interfering with layout.
                    '[attr.align]': 'null',
                }
            },] },
];
/** @nocollapse */
MatHint.ctorParameters = () => [];
MatHint.propDecorators = {
    "align": [{ type: Input },],
    "id": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * The floating label for a `mat-form-field`.
 */
class MatLabel {
}
MatLabel.decorators = [
    { type: Directive, args: [{
                selector: 'mat-label'
            },] },
];
/** @nocollapse */
MatLabel.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * The placeholder text for an `MatFormField`.
 */
class MatPlaceholder {
}
MatPlaceholder.decorators = [
    { type: Directive, args: [{
                selector: 'mat-placeholder'
            },] },
];
/** @nocollapse */
MatPlaceholder.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Prefix to be placed the the front of the form field.
 */
class MatPrefix {
}
MatPrefix.decorators = [
    { type: Directive, args: [{
                selector: '[matPrefix]',
            },] },
];
/** @nocollapse */
MatPrefix.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Suffix to be placed at the end of the form field.
 */
class MatSuffix {
}
MatSuffix.decorators = [
    { type: Directive, args: [{
                selector: '[matSuffix]',
            },] },
];
/** @nocollapse */
MatSuffix.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * \@docs-private
 */
class MatFormFieldBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatFormFieldMixinBase = mixinColor(MatFormFieldBase, 'primary');
let nextUniqueId$1 = 0;
/**
 * Container for form controls that applies Material Design styling and behavior.
 */
class MatFormField extends _MatFormFieldMixinBase {
    /**
     * @param {?} _elementRef
     * @param {?} _changeDetectorRef
     * @param {?} labelOptions
     */
    constructor(_elementRef, _changeDetectorRef, labelOptions) {
        super(_elementRef);
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Override for the logic that disables the label animation in certain cases.
         */
        this._showAlwaysAnimate = false;
        /**
         * State of the mat-hint and mat-error animations.
         */
        this._subscriptAnimationState = '';
        this._hintLabel = '';
        // Unique id for the hint label.
        this._hintLabelId = `mat-hint-${nextUniqueId$1++}`;
        this._labelOptions = labelOptions ? labelOptions : {};
        this.floatLabel = this._labelOptions.float || 'auto';
    }
    /**
     * @deprecated Use `color` instead.
     * \@deletion-target 6.0.0
     * @return {?}
     */
    get dividerColor() { return this.color; }
    /**
     * @param {?} value
     * @return {?}
     */
    set dividerColor(value) { this.color = value; }
    /**
     * Whether the required marker should be hidden.
     * @return {?}
     */
    get hideRequiredMarker() { return this._hideRequiredMarker; }
    /**
     * @param {?} value
     * @return {?}
     */
    set hideRequiredMarker(value) {
        this._hideRequiredMarker = coerceBooleanProperty(value);
    }
    /**
     * Whether the floating label should always float or not.
     * @return {?}
     */
    get _shouldAlwaysFloat() {
        return this._floatLabel === 'always' && !this._showAlwaysAnimate;
    }
    /**
     * Whether the label can float or not.
     * @return {?}
     */
    get _canLabelFloat() { return this._floatLabel !== 'never'; }
    /**
     * Text for the form field hint.
     * @return {?}
     */
    get hintLabel() { return this._hintLabel; }
    /**
     * @param {?} value
     * @return {?}
     */
    set hintLabel(value) {
        this._hintLabel = value;
        this._processHints();
    }
    /**
     * Whether the placeholder should always float, never float or float as the user types.
     * @deprecated Use floatLabel instead.
     * \@deletion-target 6.0.0
     * @return {?}
     */
    get floatPlaceholder() { return this._floatLabel; }
    /**
     * @param {?} value
     * @return {?}
     */
    set floatPlaceholder(value) { this.floatLabel = value; }
    /**
     * Whether the label should always float, never float or float as the user types.
     * @return {?}
     */
    get floatLabel() { return this._floatLabel; }
    /**
     * @param {?} value
     * @return {?}
     */
    set floatLabel(value) {
        if (value !== this._floatLabel) {
            this._floatLabel = value || this._labelOptions.float || 'auto';
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._validateControlChild();
        if (this._control.controlType) {
            this._elementRef.nativeElement.classList
                .add(`mat-form-field-type-${this._control.controlType}`);
        }
        // Subscribe to changes in the child control state in order to update the form field UI.
        this._control.stateChanges.pipe(startWith(/** @type {?} */ ((null)))).subscribe(() => {
            this._validatePlaceholders();
            this._syncDescribedByIds();
            this._changeDetectorRef.markForCheck();
        });
        let /** @type {?} */ ngControl = this._control.ngControl;
        if (ngControl && ngControl.valueChanges) {
            ngControl.valueChanges.subscribe(() => {
                this._changeDetectorRef.markForCheck();
            });
        }
        // Re-validate when the number of hints changes.
        this._hintChildren.changes.pipe(startWith(null)).subscribe(() => {
            this._processHints();
            this._changeDetectorRef.markForCheck();
        });
        // Update the aria-described by when the number of errors changes.
        this._errorChildren.changes.pipe(startWith(null)).subscribe(() => {
            this._syncDescribedByIds();
            this._changeDetectorRef.markForCheck();
        });
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        this._validateControlChild();
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // Avoid animations on load.
        this._subscriptAnimationState = 'enter';
        this._changeDetectorRef.detectChanges();
    }
    /**
     * Determines whether a class from the NgControl should be forwarded to the host element.
     * @param {?} prop
     * @return {?}
     */
    _shouldForward(prop) {
        let /** @type {?} */ ngControl = this._control ? this._control.ngControl : null;
        return ngControl && (/** @type {?} */ (ngControl))[prop];
    }
    /**
     * @return {?}
     */
    _hasPlaceholder() {
        return !!(this._control.placeholder || this._placeholderChild);
    }
    /**
     * @return {?}
     */
    _hasLabel() {
        return !!this._labelChild;
    }
    /**
     * @return {?}
     */
    _shouldLabelFloat() {
        return this._canLabelFloat && (this._control.shouldLabelFloat ||
            this._control.shouldPlaceholderFloat || this._shouldAlwaysFloat);
    }
    /**
     * @return {?}
     */
    _hideControlPlaceholder() {
        return !this._hasLabel() || !this._shouldLabelFloat();
    }
    /**
     * @return {?}
     */
    _hasFloatingLabel() {
        return this._hasLabel() || this._hasPlaceholder();
    }
    /**
     * Determines whether to display hints or errors.
     * @return {?}
     */
    _getDisplayedMessages() {
        return (this._errorChildren && this._errorChildren.length > 0 &&
            this._control.errorState) ? 'error' : 'hint';
    }
    /**
     * Animates the placeholder up and locks it in position.
     * @return {?}
     */
    _animateAndLockLabel() {
        if (this._hasFloatingLabel() && this._canLabelFloat) {
            this._showAlwaysAnimate = true;
            this._floatLabel = 'always';
            fromEvent(this._label.nativeElement, 'transitionend').pipe(take(1)).subscribe(() => {
                this._showAlwaysAnimate = false;
            });
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
     * or child element with the `mat-placeholder` directive).
     * @return {?}
     */
    _validatePlaceholders() {
        if (this._control.placeholder && this._placeholderChild) {
            throw getMatFormFieldPlaceholderConflictError();
        }
    }
    /**
     * Does any extra processing that is required when handling the hints.
     * @return {?}
     */
    _processHints() {
        this._validateHints();
        this._syncDescribedByIds();
    }
    /**
     * Ensure that there is a maximum of one of each `<mat-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     * @return {?}
     */
    _validateHints() {
        if (this._hintChildren) {
            let /** @type {?} */ startHint;
            let /** @type {?} */ endHint;
            this._hintChildren.forEach((hint) => {
                if (hint.align === 'start') {
                    if (startHint || this.hintLabel) {
                        throw getMatFormFieldDuplicatedHintError('start');
                    }
                    startHint = hint;
                }
                else if (hint.align === 'end') {
                    if (endHint) {
                        throw getMatFormFieldDuplicatedHintError('end');
                    }
                    endHint = hint;
                }
            });
        }
    }
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     * @return {?}
     */
    _syncDescribedByIds() {
        if (this._control) {
            let /** @type {?} */ ids = [];
            if (this._getDisplayedMessages() === 'hint') {
                let /** @type {?} */ startHint = this._hintChildren ?
                    this._hintChildren.find(hint => hint.align === 'start') : null;
                let /** @type {?} */ endHint = this._hintChildren ?
                    this._hintChildren.find(hint => hint.align === 'end') : null;
                if (startHint) {
                    ids.push(startHint.id);
                }
                else if (this._hintLabel) {
                    ids.push(this._hintLabelId);
                }
                if (endHint) {
                    ids.push(endHint.id);
                }
            }
            else if (this._errorChildren) {
                ids = this._errorChildren.map(error => error.id);
            }
            this._control.setDescribedByIds(ids);
        }
    }
    /**
     * Throws an error if the form field's control is missing.
     * @return {?}
     */
    _validateControlChild() {
        if (!this._control) {
            throw getMatFormFieldMissingControlError();
        }
    }
}
MatFormField.decorators = [
    { type: Component, args: [{// TODO(mmalerba): the input-container selectors and classes are deprecated and will be removed.
                selector: 'mat-input-container, mat-form-field',
                exportAs: 'matFormField',
                template: "<div class=\"mat-input-wrapper mat-form-field-wrapper\"><div class=\"mat-input-flex mat-form-field-flex\" #connectionContainer (click)=\"_control.onContainerClick && _control.onContainerClick($event)\"><div class=\"mat-input-prefix mat-form-field-prefix\" *ngIf=\"_prefixChildren.length\"><ng-content select=\"[matPrefix]\"></ng-content></div><div class=\"mat-input-infix mat-form-field-infix\" #inputContainer><ng-content></ng-content><span class=\"mat-form-field-label-wrapper mat-input-placeholder-wrapper mat-form-field-placeholder-wrapper\"><label class=\"mat-form-field-label mat-input-placeholder mat-form-field-placeholder\" [attr.for]=\"_control.id\" [attr.aria-owns]=\"_control.id\" [class.mat-empty]=\"_control.empty && !_shouldAlwaysFloat\" [class.mat-form-field-empty]=\"_control.empty && !_shouldAlwaysFloat\" [class.mat-accent]=\"color == 'accent'\" [class.mat-warn]=\"color == 'warn'\" #label *ngIf=\"_hasFloatingLabel()\" [ngSwitch]=\"_hasLabel()\"><ng-container *ngSwitchCase=\"false\"><ng-content select=\"mat-placeholder\"></ng-content>{{_control.placeholder}}</ng-container><ng-content select=\"mat-label\" *ngSwitchCase=\"true\"></ng-content><span class=\"mat-placeholder-required mat-form-field-required-marker\" aria-hidden=\"true\" *ngIf=\"!hideRequiredMarker && _control.required && !_control.disabled\">&nbsp;*</span></label></span></div><div class=\"mat-input-suffix mat-form-field-suffix\" *ngIf=\"_suffixChildren.length\"><ng-content select=\"[matSuffix]\"></ng-content></div></div><div class=\"mat-input-underline mat-form-field-underline\" #underline><span class=\"mat-input-ripple mat-form-field-ripple\" [class.mat-accent]=\"color == 'accent'\" [class.mat-warn]=\"color == 'warn'\"></span></div><div class=\"mat-input-subscript-wrapper mat-form-field-subscript-wrapper\" [ngSwitch]=\"_getDisplayedMessages()\"><div *ngSwitchCase=\"'error'\" [@transitionMessages]=\"_subscriptAnimationState\"><ng-content select=\"mat-error\"></ng-content></div><div class=\"mat-input-hint-wrapper mat-form-field-hint-wrapper\" *ngSwitchCase=\"'hint'\" [@transitionMessages]=\"_subscriptAnimationState\"><div *ngIf=\"hintLabel\" [id]=\"_hintLabelId\" class=\"mat-hint\">{{hintLabel}}</div><ng-content select=\"mat-hint:not([align='end'])\"></ng-content><div class=\"mat-input-hint-spacer mat-form-field-hint-spacer\"></div><ng-content select=\"mat-hint[align='end']\"></ng-content></div></div></div>",
                // MatInput is a directive and can't have styles, so we need to include its styles here.
                // The MatInput styles are fairly minimal so it shouldn't be a big deal for people who
                // aren't using MatInput.
                styles: [".mat-form-field{display:inline-block;position:relative;text-align:left}[dir=rtl] .mat-form-field{text-align:right}.mat-form-field-wrapper{position:relative}.mat-form-field-flex{display:inline-flex;align-items:baseline;width:100%}.mat-form-field-prefix,.mat-form-field-suffix{white-space:nowrap;flex:none}.mat-form-field-prefix .mat-icon,.mat-form-field-suffix .mat-icon{width:1em}.mat-form-field-prefix .mat-icon-button,.mat-form-field-suffix .mat-icon-button{font:inherit;vertical-align:baseline}.mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field-suffix .mat-icon-button .mat-icon{font-size:inherit}.mat-form-field-infix{display:block;position:relative;flex:auto;min-width:0;width:180px}.mat-form-field-label-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}.mat-form-field-label{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform:perspective(100px);-ms-transform:none;transform-origin:0 0;transition:transform .4s cubic-bezier(.25,.8,.25,1),color .4s cubic-bezier(.25,.8,.25,1),width .4s cubic-bezier(.25,.8,.25,1);display:none}[dir=rtl] .mat-form-field-label{transform-origin:100% 0;left:auto;right:0}.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-label,.mat-form-field-empty.mat-form-field-label{display:block}.mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:block;transition:none}.mat-input-server:focus+.mat-form-field-placeholder-wrapper .mat-form-field-placeholder,.mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-placeholder-wrapper .mat-form-field-placeholder{display:none}.mat-form-field-can-float .mat-input-server:focus+.mat-form-field-placeholder-wrapper .mat-form-field-placeholder,.mat-form-field-can-float .mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-placeholder-wrapper .mat-form-field-placeholder{display:block}.mat-form-field-label:not(.mat-form-field-empty){transition:none}.mat-form-field-underline{position:absolute;height:1px;width:100%}.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}.mat-form-field-underline .mat-form-field-ripple{position:absolute;top:0;left:0;width:100%;height:2px;transform-origin:50%;transform:scaleX(.5);visibility:hidden;opacity:0;transition:background-color .3s cubic-bezier(.55,0,.55,.2)}.mat-form-field-invalid:not(.mat-focused) .mat-form-field-underline .mat-form-field-ripple{height:1px}.mat-focused .mat-form-field-underline .mat-form-field-ripple,.mat-form-field-invalid .mat-form-field-underline .mat-form-field-ripple{visibility:visible;opacity:1;transform:scaleX(1);transition:transform .3s cubic-bezier(.25,.8,.25,1),opacity .1s cubic-bezier(.25,.8,.25,1),background-color .3s cubic-bezier(.25,.8,.25,1)}.mat-form-field-subscript-wrapper{position:absolute;width:100%;overflow:hidden}.mat-form-field-label-wrapper .mat-icon,.mat-form-field-subscript-wrapper .mat-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.mat-form-field-hint-wrapper{display:flex}.mat-form-field-hint-spacer{flex:1 0 1em}.mat-error{display:block} .mat-input-element{font:inherit;background:0 0;color:currentColor;border:none;outline:0;padding:0;margin:0;width:100%;max-width:100%;vertical-align:bottom;text-align:inherit}.mat-input-element:-moz-ui-invalid{box-shadow:none}.mat-input-element::-ms-clear,.mat-input-element::-ms-reveal{display:none}.mat-input-element[type=date]::after,.mat-input-element[type=datetime-local]::after,.mat-input-element[type=datetime]::after,.mat-input-element[type=month]::after,.mat-input-element[type=time]::after,.mat-input-element[type=week]::after{content:' ';white-space:pre;width:1px}.mat-input-element::placeholder{transition:color .4s .133s cubic-bezier(.25,.8,.25,1)}.mat-input-element::-moz-placeholder{transition:color .4s .133s cubic-bezier(.25,.8,.25,1)}.mat-input-element::-webkit-input-placeholder{transition:color .4s .133s cubic-bezier(.25,.8,.25,1)}.mat-input-element:-ms-input-placeholder{transition:color .4s .133s cubic-bezier(.25,.8,.25,1)}.mat-form-field-hide-placeholder .mat-input-element::placeholder{color:transparent!important;transition:none}.mat-form-field-hide-placeholder .mat-input-element::-moz-placeholder{color:transparent!important;transition:none}.mat-form-field-hide-placeholder .mat-input-element::-webkit-input-placeholder{color:transparent!important;transition:none}.mat-form-field-hide-placeholder .mat-input-element:-ms-input-placeholder{color:transparent!important;transition:none}textarea.mat-input-element{resize:vertical;overflow:auto}textarea.mat-autosize{resize:none}"],
                animations: [matFormFieldAnimations.transitionMessages],
                host: {
                    'class': 'mat-input-container mat-form-field',
                    '[class.mat-input-invalid]': '_control.errorState',
                    '[class.mat-form-field-invalid]': '_control.errorState',
                    '[class.mat-form-field-can-float]': '_canLabelFloat',
                    '[class.mat-form-field-should-float]': '_shouldLabelFloat()',
                    '[class.mat-form-field-hide-placeholder]': '_hideControlPlaceholder()',
                    '[class.mat-form-field-disabled]': '_control.disabled',
                    '[class.mat-focused]': '_control.focused',
                    '[class.ng-untouched]': '_shouldForward("untouched")',
                    '[class.ng-touched]': '_shouldForward("touched")',
                    '[class.ng-pristine]': '_shouldForward("pristine")',
                    '[class.ng-dirty]': '_shouldForward("dirty")',
                    '[class.ng-valid]': '_shouldForward("valid")',
                    '[class.ng-invalid]': '_shouldForward("invalid")',
                    '[class.ng-pending]': '_shouldForward("pending")',
                },
                inputs: ['color'],
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MatFormField.ctorParameters = () => [
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_LABEL_GLOBAL_OPTIONS,] },] },
];
MatFormField.propDecorators = {
    "dividerColor": [{ type: Input },],
    "hideRequiredMarker": [{ type: Input },],
    "hintLabel": [{ type: Input },],
    "floatPlaceholder": [{ type: Input },],
    "floatLabel": [{ type: Input },],
    "underlineRef": [{ type: ViewChild, args: ['underline',] },],
    "_connectionContainerRef": [{ type: ViewChild, args: ['connectionContainer',] },],
    "_inputContainerRef": [{ type: ViewChild, args: ['inputContainer',] },],
    "_label": [{ type: ViewChild, args: ['label',] },],
    "_control": [{ type: ContentChild, args: [MatFormFieldControl,] },],
    "_placeholderChild": [{ type: ContentChild, args: [MatPlaceholder,] },],
    "_labelChild": [{ type: ContentChild, args: [MatLabel,] },],
    "_errorChildren": [{ type: ContentChildren, args: [MatError,] },],
    "_hintChildren": [{ type: ContentChildren, args: [MatHint,] },],
    "_prefixChildren": [{ type: ContentChildren, args: [MatPrefix,] },],
    "_suffixChildren": [{ type: ContentChildren, args: [MatSuffix,] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatFormFieldModule {
}
MatFormFieldModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    MatError,
                    MatHint,
                    MatFormField,
                    MatPlaceholder,
                    MatPrefix,
                    MatSuffix,
                    MatLabel,
                ],
                imports: [
                    CommonModule,
                    PlatformModule,
                ],
                exports: [
                    MatError,
                    MatHint,
                    MatFormField,
                    MatPlaceholder,
                    MatPrefix,
                    MatSuffix,
                    MatLabel,
                ],
            },] },
];
/** @nocollapse */
MatFormFieldModule.ctorParameters = () => [];

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

export { MatFormFieldModule, MatError, MatFormFieldBase, _MatFormFieldMixinBase, MatFormField, MatFormFieldControl, getMatFormFieldPlaceholderConflictError, getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, MatHint, MatPlaceholder, MatPrefix, MatSuffix, MatLabel, matFormFieldAnimations };
//# sourceMappingURL=form-field.js.map
