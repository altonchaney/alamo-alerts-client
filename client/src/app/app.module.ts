import { NgModule }       from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';
import { LocationViewComponent }   from './location-view/location-view.component';
import { TwitterService }          from './twitter.service';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    LocationViewComponent
  ],
  providers: [ TwitterService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }