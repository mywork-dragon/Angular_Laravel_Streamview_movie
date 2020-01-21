import { Component, Input, AfterViewInit } from '@angular/core'
declare const FWDEVPlayer: any;
@Component({
    selector: 'fwd',
    template: `
    <div [id]="parentId"></div>`
})
export class Player implements AfterViewInit {
    @Input('parentId') parentId: string;
    @Input('opts') videoOpts: any;
    ngAfterViewInit() {
        if (this.parentId && this.videoOpts) {
            const defaultOpts = {
                parentId: this.parentId
            }
            const Opts = Object.assign( this.videoOpts, defaultOpts)
            console.log(Opts);
            new FWDEVPlayer(Opts);
        }
    }
}