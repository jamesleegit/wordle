import { AfterContentInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GameAnalysisComponent } from './component/game-analysis/game-analysis.component';
import { GameShareComponent } from './component/game-share/game-share.component';
import { decodeToken, encodeToken } from './lib/util.lib';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {

  constructor(public _route: ActivatedRoute, public _matDialog: MatDialog, public _router: Router) {
    this._route.queryParams.subscribe((params: any)=> {
      if (params.s) {
        try {
          const str = decodeToken((params.s));
          const word = str.split(':')[0];
          const tag = str.split(':')[1];
          if(tag === '1' && word && word.length === 5 && word.split('').every(v=>v>="A" && v<="z")) {
            this.token = str;
            this.tempToken = this.token;
            localStorage.setItem(`$tokenbackup`, this.token);
          }
        } catch(e) {
          console.log(e);
        }
      }
    });
    this.tempToken = localStorage.getItem(`$tokenbackup`) || null;
    // this.onComplete({isSuccess: false, playTime: 1000 * 60 * 124 + 1000, answer : 'APPLE'});
  }

  _tempToken: string;
  get tempToken() {return this._tempToken;}
  set tempToken(v) { if (this._tempToken !== v) {this._tempToken = v; } if (v) {this.tempTokens = v.split(':'); } }
  tempTokens: any = [];

  token: string;
  start0() {
    const tag = this.tempToken.split(':')[1];
    if (tag === '1') {
      this._router.navigate(['/'], {queryParams: {s: encodeToken(this.tempToken)}});
    } else {
      this.token = this.tempToken;
    }
  }
  start1() {
    if (this.tempToken && !confirm('새로운 게임을 생성하시겠습니까?\n이전 게임은 초기화됩니다.')) {
      return;
    }
    this.token = `WORLD:${new Date().getTime()}`;
    this.tempToken = this.token;
    localStorage.setItem(`$tokenbackup`, this.token);
  }

  onMoveHome() {
    this.token = null;
    this._router.navigate(['/']);
  }
  onComplete(result: any) {
    try { 
      // 로컬스토리지를 바라봄으로서 영구저장뿐만 아니라,
      // 다른페이지에서 동시실행시 갱신된 내용을 반영할 수 있다.
      let history = [];
      const str = localStorage.getItem('$history');
      if (str) {
        history = JSON.parse(str);
      }
      history.unshift(result);
      if (history.length>200) {
        history.pop();
      } 
      localStorage.setItem('$history', JSON.stringify(history));
    } catch(e) {console.log(e);}
    
    const dialog = this._matDialog.open(GameAnalysisComponent);
    dialog.componentInstance.result = result;

    this._tempToken = null;
    localStorage.removeItem(`$tokenbackup`);
    localStorage.removeItem('$matrixbackup_' + result.token);
  }
  openAnalysis() {
    const dialog = this._matDialog.open(GameAnalysisComponent);
  }
  openShare() {
    const dialog = this._matDialog.open(GameShareComponent);
  }
}
