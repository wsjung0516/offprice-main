import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-progress',
    imports: [CommonModule],
template: `
        <div class="form-group" *ngIf="progress > 0">
            <div class="progress">
                <div class="progress-bar" [style.width.%]="progress" >{{progress}}%
                </div>
            </div>
        </div>
    `,
    styles: [`
        .progress {
            position: relative;
            top: 10px;
            height: 15px;
        }
        .progress-bar {
            background-color: #5cb85c;
        }
    `]
})
export class ProgressComponent {
    @Input() progress = 0;
}
