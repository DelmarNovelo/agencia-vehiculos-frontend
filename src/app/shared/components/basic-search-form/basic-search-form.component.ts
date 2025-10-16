import { NgIf } from '@angular/common';
import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-basic-search-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    Button,
    InputGroup,
    InputGroupAddon,
    InputText,
  ],
  templateUrl: './basic-search-form.component.html',
  styles: ``
})
export class BasicSearchFormComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  searchTermFormControl = new FormControl('');

  showButton = input<boolean>(false);
  buttonText = input<string>('Text Button');

  onClick$ = output<void>({ alias: 'onClick' });
  onSearch$ = output<string>({ alias: 'onSearch' });

  ngOnInit(): void {
    this.searchTermValueChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchTermValueChanges() {
    this.searchTermFormControl.valueChanges.pipe(takeUntil(this.unsubscribe$), debounceTime(300))
      .subscribe(value => this.onSearch$.emit(value!));
  }

}
