import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FuseNavigationService } from '../../navigation.service';
import { NavigationEnd, Router } from '@angular/router';
import { fuseAnimations } from '../../../../animations/index';
import * as _ from 'lodash';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
    selector: 'fuse-nav-vertical-collapse',
    templateUrl: './nav-vertical-collapse.component.html',
    styleUrls: ['./nav-vertical-collapse.component.scss'],
    animations: fuseAnimations
})
export class FuseNavVerticalCollapseComponent implements OnInit {
    @Input() item: any;
    @HostBinding('class') classes = 'nav-collapse nav-item';
    @HostBinding('class.open') public isOpen = false;

    constructor(
        private navigationService: FuseNavigationService, private sidebarService: FuseSidebarService,
        private router: Router
    ) {
        // Listen for route changes
        router.events.subscribe(
            (event) => {
                if (event instanceof NavigationEnd) {
                    // Check if the url can be found in
                    // one of the children of this item
                    if (this.isUrlInChildren(this.item, event.urlAfterRedirects)) {
                        this.expand();
                    }
                    else {
                        this.collapse();
                    }
                }
            }
        );

        // Listen for collapsing of any navigation item
        this.navigationService.onItemCollapsed
            .subscribe(
                (clickedItem) => {
                    if (clickedItem && clickedItem.children) {
                        // Check if the clicked item is one
                        // of the children of this item
                        if (this.isChildrenOf(this.item, clickedItem)) {
                            return;
                        }

                        // Check if the url can be found in
                        // one of the children of this item
                        if (this.isUrlInChildren(this.item, this.router.url)) {
                            return;
                        }

                        // If the clicked item is not this item, collapse...
                        if (this.item !== clickedItem) {
                            this.collapse();
                        }
                    }
                }
            );
    }
    sidebarAction() {
        this.sidebarService.getSidebar('navbar').toggleOpen();
    }
    ngOnInit() {
        // Check if the url can be found in
        // one of the children of this item
        if (this.isUrlInChildren(this.item, this.router.url)) {
            this.expand();
        }
        else {
            this.collapse();
        }
    }

    /**
     * Toggle collapse
     *
     * @param ev
     */
    toggleOpen(ev) {
        ev.preventDefault();

        this.isOpen = _.isNil(this.isOpen) ? false : !this.isOpen;
        //console.log('1:',this.isOpen)
        // Navigation collapse toggled...
        this.navigationService.onItemCollapsed.next(this.item);
        this.navigationService.onItemCollapseToggled.next();
    }

    /**
     * Expand the collapsable navigation
     */
    expand() {
        //console.log('2:',this.isOpen)
        if (this.isOpen) {
            return;
        }
        //console.log('3:',this.isOpen)
        this.isOpen = true;
        this.navigationService.onItemCollapseToggled.next();
    }

    /**
     * Collapse the collapsable navigation
     */
    collapse() {
        if (!this.isOpen) {
            return;
        }

        this.isOpen = false;
        this.navigationService.onItemCollapseToggled.next();
    }

    /**
     * Check if the given parent has the
     * given item in one of its children
     *
     * @param parent
     * @param item
     * @return {any}
     */
    isChildrenOf(parent, item) {
        if (!parent.children) {
            return false;
        }

        if (parent.children.indexOf(item) !== -1) {
            return true;
        }

        for (const children of parent.children) {
            if (children.children) {
                return this.isChildrenOf(children, item);
            }
        }
    }

    /**
     * Check if the given url can be found
     * in one of the given parent's children
     *
     * @param parent
     * @param url
     * @returns {any}
     */
    isUrlInChildren(parent, url) {
        if (!parent.children) {
            return false;
        }

        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i].children) {
                if (this.isUrlInChildren(parent.children[i], url)) {
                    return true;
                }
            }

            if (parent.children[i].url === url || url.includes(parent.children[i].url)) {
                return true;
            }
        }

        return false;
    }

}
