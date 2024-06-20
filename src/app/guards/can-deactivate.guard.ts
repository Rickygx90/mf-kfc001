import { Injectable } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
/*
@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
} */



export const CanDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean => {
    return component.canDeactivate ? component.canDeactivate() : true;
    /* if (component.canDeactivate && component.canDeactivate()) {
       return true;
     } */
    /*if (!component.confirm()) {
       return confirm('Are you sure you want to leave this page? If you do, any unsaved changes will be lost.');
     } */
 }