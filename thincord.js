// ==UserScript==
// @name            Thincord
// @description     Hides the gaming/music status of Discord users unless you have DMs open with them. Always hides avatar decorations.
// @version         1.1.1
// @author          polymegos
// @namespace       https://github.com/polymegos/thincord
// @supportURL      https://github.com/polymegos/thincord/issues
// @license         MIT
// @match           *://discord.com/*
// @run-at          document-start
// @grant           none
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS styles
    const style = document.createElement('style');
    style.textContent = `
        div[class*='nowPlayingColumn'] {
            display: none !important;
        }

        svg[class^='avatarDecoration'],
        img[class^='avatarDecoration'] {
            display: none !important;
        }
    `;

    const head = document.head || document.documentElement;
    if (head) {
        head.appendChild(style);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            (document.head || document.documentElement).appendChild(style);
        });
    }

    // Check if an element contains the specific gaming controller SVG
    function containsTargetSVG(div) {
        const svg = div.querySelector('svg.icon_c9d15c');
        if (!svg) return false;

        const path = svg.querySelector('path');
        return path && path.getAttribute('d')?.startsWith('M20.97 4.06');
    }

    function hideTargetContainers() {
        const containers = document.querySelectorAll('div.container_c9d15c.textWithIconContainer_c9d15c');
        containers.forEach(div => {
            if (containsTargetSVG(div)) {
                div.style.display = 'none';
            }
        });
    }

    const observer = new MutationObserver(() => {
        hideTargetContainers();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    document.addEventListener('DOMContentLoaded', hideTargetContainers);
})();
