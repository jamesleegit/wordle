import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-analysis',
  templateUrl: './game-analysis.component.html',
  styleUrls: ['./game-analysis.component.scss']
})
export class GameAnalysisComponent implements OnInit {

  constructor() {
    try {
      const str = localStorage.getItem('$history')
      if (str) {
        this.history = JSON.parse(str);
      }

      this.updateSummary();
      this.updateHistoryForDisplay();
    } catch(e) {console.log(e);}
  }

  playCount: number;
  winCount: number;

  history: any = [];
  ngOnInit(): void {
  }

  result: any;
  calcTime(ms: number) {
    ms = Number(ms);
    const str = Math.floor(ms / (1000 * 60)).toString().padStart(2, '0') + '분 ' + Math.floor(ms % (1000 * 60) / 1000).toString().padStart(2, '0') + '초';
    return str;
  }

  removeAll() {
    if (!confirm('지금까지 플레이한 모든 기록이 삭제됩니다.\n진행하시겠습니까?')){
      return;
    }
    localStorage.removeItem('$history');
    this.history = [];
    this.start = 0;
    this.updateSummary();
    this.updateHistoryForDisplay();
  }

  start = 0;
  limit = 10;
  historyForDisplay: any;

  updateSummary() {
    if (!this.history) {
      this.playCount = 0;
      this.winCount = 0;
      return;
    }
    let playCount = 0;
    let winCount = 0;
    this.history.forEach((v: any) => {
      playCount += 1;
      if(v.isSuccess) {
        winCount += 1;
      }
      v.$createTime = new Date(Number(v.token.split(':')[1])).getTime();
      v.$answer = v.answer.split('');
    });
    this.playCount = playCount;
    this.winCount = winCount;
  }
  updateHistoryForDisplay() {
    if (!this.history) {
      return;
    }
    this.historyForDisplay = this.history.slice(this.start, this.start + this.limit);
  }
}
