import { ComponentRef, Injector, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Overlay } from '../overlay/overlay';
import { ToastRef } from './toast-injector';
import { ToastToken } from './toast-token';
import { ToastContainerDirective } from './toast.directive';
import { GlobalConfig, IndividualConfig } from './toastr-config';
export interface ActiveToast<C> {
    /** Your Toast ID. Use this to close it individually */
    toastId: number;
    /** the message of your toast. Stored to prevent duplicates */
    message: string;
    /** a reference to the component see portal.ts */
    portal: ComponentRef<C>;
    /** a reference to your toast */
    toastRef: ToastRef<C>;
    /** triggered when toast is active */
    onShown: Observable<any>;
    /** triggered when toast is destroyed */
    onHidden: Observable<any>;
    /** triggered on toast click */
    onTap: Observable<any>;
    /** available for your use in custom toast */
    onAction: Observable<any>;
}
export declare class ToastrService {
    private overlay;
    private _injector;
    private sanitizer;
    private ngZone;
    toastrConfig: GlobalConfig;
    currentlyActive: number;
    toasts: ActiveToast<any>[];
    overlayContainer: ToastContainerDirective;
    previousToastMessage: string | undefined;
    private index;
    constructor(token: ToastToken, overlay: Overlay, _injector: Injector, sanitizer: DomSanitizer, ngZone: NgZone);
    /** show toast */
    show(message?: string, title?: string, override?: Partial<IndividualConfig>, type?: string): ActiveToast<any>;
    /** show successful toast */
    success(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any>;
    /** show error toast */
    error(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any>;
    /** show info toast */
    info(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any>;
    /** show warning toast */
    warning(message?: string, title?: string, override?: Partial<IndividualConfig>): ActiveToast<any>;
    /**
     * Remove all or a single toast by id
     */
    clear(toastId?: number): void;
    /**
     * Remove and destroy a single toast by id
     */
    remove(toastId: number): boolean;
    /**
     * Determines if toast message is already shown
     */
    isDuplicate(message: string): boolean;
    /** create a clone of global config and apply individual settings */
    private applyConfig(override?);
    /**
     * Find toast object by id
     */
    private _findToast(toastId);
    /**
     * Determines the need to run inside angular's zone then builds the toast
     */
    private _preBuildNotification(toastType, message, title, config);
    /**
     * Creates and attaches toast data to component
     * returns null if toast is duplicate and preventDuplicates == True
     */
    private _buildNotification(toastType, message, title, config);
}
