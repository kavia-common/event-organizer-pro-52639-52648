import { Component, Input } from '@angular/core';

type IconName =
  | 'calendar'
  | 'list'
  | 'plus'
  | 'bell'
  | 'search'
  | 'x'
  | 'logout'
  | 'edit'
  | 'trash'
  | 'chevron-left'
  | 'chevron-right';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      class="icon"
      [attr.viewBox]="viewBox"
      [attr.width]="size"
      [attr.height]="size"
      aria-hidden="true"
      focusable="false"
    >
      <path [attr.d]="path" fill="currentColor" />
    </svg>
  `,
  styles: [
    `
      .icon {
        display: inline-block;
        vertical-align: middle;
      }
    `,
  ],
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  @Input() size = 18;

  get viewBox(): string {
    return '0 0 24 24';
  }

  get path(): string {
    switch (this.name) {
      case 'calendar':
        return 'M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm12 8H5v10h14V10z';
      case 'list':
        return 'M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z';
      case 'plus':
        return 'M11 5h2v14h-2V5zm-6 6h14v2H5v-2z';
      case 'bell':
        return 'M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2z';
      case 'search':
        return 'M10 2a8 8 0 1 0 4.9 14.3l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z';
      case 'x':
        return 'M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4z';
      case 'logout':
        return 'M10 17v-2h4v-2h-4v-2l-3 3 3 3zm9-15H9a2 2 0 0 0-2 2v3h2V4h10v16H9v-3H7v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z';
      case 'edit':
        return 'M3 17.3V21h3.7L17.8 9.9l-3.7-3.7L3 17.3zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7L20.7 7z';
      case 'trash':
        return 'M6 7h12l-1 14H7L6 7zm3-3h6l1 2H8l1-2z';
      case 'chevron-left':
        return 'M15.4 7.4 10.8 12l4.6 4.6-1.4 1.4L8 12l6-6 1.4 1.4z';
      case 'chevron-right':
        return 'M8.6 16.6 13.2 12 8.6 7.4 10 6l6 6-6 6-1.4-1.4z';
      default:
        return '';
    }
  }
}
