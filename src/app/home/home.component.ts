import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="container">
      <div class="p-5 mt-3 bg-blue-100 rounded">
        <div class="text-3xl">Home</div>
        <p class=>
          {{name}}
        </p>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class HomeComponent implements OnInit {
  // list$: Observable<any[]>;
  name: string ="";
  constructor() { }

  ngOnInit(): void {
  }

}

