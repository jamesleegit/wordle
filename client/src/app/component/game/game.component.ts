import { AfterContentInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnDestroy, AfterContentInit {
  @ViewChild('layoutDom') layoutDom: ElementRef;

  constructor(public _api: ApiService) {
    this.interval1 = setInterval(()=>{ this.fitHeight(); }, 500);
    this.interval2 = setInterval(()=>{ this.nowTime = new Date().getTime(); }, 50);
    this.setAnswer('WORLD');
  }
  
  nowTime = new Date().getTime();
  calcTime(ms: number) {
    ms = Number(ms);
    const str = Math.floor(ms / (1000 * 60)).toString().padStart(2, '0') + '분 ' + Math.floor(ms % (1000 * 60) / 1000).toString().padStart(2, '0') + '초';
    return str;
  }

  interval1: any;
  interval2: any;
  ngOnDestroy() {
    clearInterval(this.interval1);
    clearInterval(this.interval2);
  }

  fitHeight() {
    if (this.layoutDom && this.layoutDom.nativeElement) {
      this.layoutDom.nativeElement.style.height = window.innerHeight + 'px';
    }
  }
  ngAfterContentInit() {
    this.fitHeight();
  }
  
  startTime: number;

  _token: string;
  get token() { return this._token; }
  @Input('token') set token(v: any) {
    if (v !== this._token) {
      const answer = v.split(':')[0];    
      this.setAnswer(answer);
      try {
        if (localStorage.getItem('$matrixbackup_' + v)) {
          const obj = JSON.parse(localStorage.getItem('$matrixbackup_' + v));
          this.matrix = obj.matrix;
          this.nowMatrixIndex = obj.nowMatrixIndex;
          this.startTime = obj.startTime;
          this.updateFounds();
        }
      } catch(e) { console.log(e);  }
      this._token = v;
    }
  } 
  setAnswer(v: string) {
    v = v.toUpperCase();
    this.answer = v;
    this._answer = v.split('');
    [...this.keyboardLine1, ...this.keyboardLine2, ...this.keyboardLine3].forEach(v=>{  this.founds[v] = null; });
  }

  result: any;
  resultPlayTime: any;

  answer = '';
  _answer: any = [];
  founds: {[char: string]: 'green' | 'yellow'} = {};

  matrix: any = [
    [null,null,null,null,null],
    [null,null,null,null,null],
    [null,null,null,null,null],
    [null,null,null,null,null],
    [null,null,null,null,null]
  ];
  nowMatrixIndex = 0;
  get nowMatrixLine() { return this.matrix[this.nowMatrixIndex]; }
  get nowMatrixLineLength() { return this.nowMatrixLine ? this.nowMatrixLine.filter((v: any)=>!!v).length : null; }

  saveMatrix() {
    try { localStorage.setItem('$matrixbackup_' + this._token, JSON.stringify({matrix: this.matrix, nowMatrixIndex: this.nowMatrixIndex, startTime: this.startTime})); }
    catch(e) {console.log(e); }
  }

  updateFounds() {
    for (let i = 0; i < this.nowMatrixIndex; i ++ ) {
      if (!this.matrix[i]) {
        break;
      }
      this.matrix[i].forEach((v: any, i: any)=>{
        if (this.founds[v] === 'green') {
          return;
        }
        if (this._answer[i] === v) {
          this.founds[v] = 'green';
        }
        else if (this.answer.includes(v)) {
          this.founds[v] = 'yellow';
        }
      });
    }
  }

  // 단어정보 가져오는 [비동기작업] 중, 유저컨트롤을 제한하기 위한 플래그. 
  isRequestingGame = false;
  pressChar(v: string) {
    if (this.isRequestingGame) {  return;  }
    if (this.nowMatrixLineLength > 5) {  return;  }
    const arr = this.nowMatrixLine;
    for (let i = 0 ; i < arr.length; i++) {
      const item = arr[i];
      if (!item) { arr[i] = v; break; }
    }
    if (!this.startTime) { this.startTime = new Date().getTime(); } // 시작시각설정
    this.saveMatrix();
  }
  pressBackspace() {
    if (this.isRequestingGame) {  return;  }
    if (this.nowMatrixLineLength === 0) {  return;  }
    this.nowMatrixLine[this.nowMatrixLineLength - 1] = null;
    this.saveMatrix();
  }
  async pressEnter() {
    if (this.isRequestingGame) {  return;  }
    if (this.nowMatrixLineLength !== 5) {
      this.doErrorAnimation();
      alert('단어는 5글자 입니다.');
      return;
    }
    this.isRequestingGame = true;
    try {
      const word = this.nowMatrixLine.join('');
      const res = await this._api.getWordInformation({word });
      this.nowMatrixIndex += 1;
      this.updateFounds();
      this.saveMatrix();
      
      // 결과정산
      let isSuccess = this.answer === word;
      const result = { token: this.token, isSuccess, startTime: this.startTime, playTime: new Date().getTime() - new Date(Number(this.startTime)).getTime(), answer: this.answer };
      this.resultPlayTime = result.playTime;
      if (this.nowMatrixIndex === 5 || isSuccess) {
        setTimeout(()=>{
            this.result = result;
            this.onComplete.emit(result);
            this.isRequestingGame = false;
        }, 1300);
      } else {
        this.isRequestingGame = false;
      }
    } catch(e) {
      this.doErrorAnimation();
      alert('단어를 찾을 수 없습니다.');
      this.isRequestingGame = false;
    }
  }

  // 글자라인 shake애니메이션 처리
  errorAnimationIndex: number = null;
  isDoingErrorAnimation = false;
  doErrorAnimation() {
    if (this.isDoingErrorAnimation) return;
    this.isDoingErrorAnimation = true;
    this.errorAnimationIndex = this.nowMatrixIndex;
    setTimeout(()=>{
      this.errorAnimationIndex=null;
      this.isDoingErrorAnimation = false;
    }, 600);
  }

  keyboardLine1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  keyboardLine2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  keyboardLine3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  ////

  moveHome(v = true) {
    if (v && !confirm('메인페이지로 이동하겠습니까?\n현재 게임내용은 저장됩니다.')) {
      return;
    }
    this.onMoveHome.emit();
  }
  @Output() onMoveHome = new EventEmitter();
  @Output() onComplete = new EventEmitter();
}
