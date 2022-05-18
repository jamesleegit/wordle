import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
import { ApiService } from './service/api.service';
import { GameComponent } from './component/game/game.component';
import { RouterModule } from '@angular/router';
import { GameAnalysisComponent } from './component/game-analysis/game-analysis.component';
import { PageNationComponent } from './component/page-nation/page-nation.component';
import { GameShareComponent } from './component/game-share/game-share.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PageNationComponent,
    GameAnalysisComponent,
    GameShareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    RouterModule,
    MatRippleModule,
    HttpClientModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
