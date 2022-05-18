import { Component, OnInit } from '@angular/core';
import { encodeToken } from 'src/app/lib/util.lib';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-game-share',
  templateUrl: './game-share.component.html',
  styleUrls: ['./game-share.component.scss']
})
export class GameShareComponent implements OnInit {

  constructor(public _api: ApiService) { }

  ngOnInit(): void {
  }
  word = '';
  isSubmitting = false;
  shareLink: string;
  async submit() {
    if (this.isSubmitting) {
      return;
    }
    if(!this.word || this.word.length !== 5 || !this.word.split('').every(v=>v>="A" && v<="z")) {
      (<any>window).nativeAlert('5글자의 영어단어를 입력해주세요.');
      return;
    }
    const word = this.word = this.word.toUpperCase();

    this.isSubmitting = true;
    try {
      await this._api.getWordInformation({word: word});
      const token = encodeToken(`${word}:1`);
      this.shareLink = `${location.origin}?s=${token}`;
    } catch(e) { 
      (<any>window).nativeAlert('올바른 단어가 아닌 것 같습니다.\n다른 단어로 입력해주시겠습니까?');
      console.log(e);
    }
    this.isSubmitting = false;
  }
  copy() {
    (<any>window).copyToClipboard(this.shareLink);
    (<any>window).nativeAlert('공유링크가 복사되었습니다!');
  }
}
