import { Component, input, output } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'app-search-autocomplete',
  imports: [
    AutoComplete,
  ],
  templateUrl: './search-autocomplete.component.html',
  styles: ``
})
export class SearchAutocompleteComponent {

  placeholder = input<string>();
  suggestions = input.required<any[]>();

  onCompleteMethod = output<string>();
  onSelect = output<any>();
  
}
