/*
============================================
; Title: main-nav.component.ts
; Author: Professor Krasso
; Date: 29 March 2021
; Modified By: Arlix Sorto
; Description: Week 4
;===========================================
*/
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  showSidNav: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  mobile: boolean;

  constructor(private breakpointObserver: BreakpointObserver, private cookieService: CookieService, private router: Router) { }


  ngOnInit() {
    /**Show side navigation on desktop view */
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          console.log(state.matches);
          this.showSidNav = state.matches;
        } else {
          console.log(state.matches);
          this.showSidNav = state.matches;
        }
      });

  }
/**Show and hide side navigation */
  sideNavToggle() {
    if (this.showSidNav) {
      this.showSidNav = !this.showSidNav;
    }
    else {
      this.showSidNav = true;
    }

  }
  /**Log user out */
  logOut() {
    this.cookieService.deleteAll();
    this.router.navigate(['/session/login']);
  }


}
