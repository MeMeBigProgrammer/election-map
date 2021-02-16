import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { ResultsTooltipComponent } from './results-tooltip/results-tooltip.component';

@NgModule({
	declarations: [AppComponent, MapComponent, ResultsTooltipComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		MatSelectModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
