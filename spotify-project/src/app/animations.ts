import {
  animation, trigger, animateChild, group,
  transition, animate, style, query
} from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('Dashboard <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], {optional: true}),
      query(':enter', [
        style({ left: '-100%' })
      ]),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [
          animate('400ms ease-out', style({ left: '100%' }))
        ], {optional: true}),
        query(':enter', [
          animate('400ms ease-out', style({ left: '0%' }))
        ])
      ]),
      query(':enter', animateChild()),
    ])
  ]);