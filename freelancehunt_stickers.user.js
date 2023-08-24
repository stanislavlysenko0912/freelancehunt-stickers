// ==UserScript==
// @name         Custom Sticker for Freelancehunt
// @description  Add a custom sticker to Freelancehunt mailbox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a custom sticker to Freelancehunt mailbox
// @author       stanislavlysenko0912
// @supportURL   https://github.com/stanislavlysenko0912/freelancehunt-stickers/issues
// @icon				 https://freelancehunt.com/static/images/apple-touch-icon.png
// @match        https://freelancehunt.com/mailbox/read/thread/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @updateURL      https://raw.githubusercontent.com/stanislavlysenko0912/freelancehunt-stickers/main/freelancehunt_stickers.user.js
// @downloadURL    https://raw.githubusercontent.com/stanislavlysenko0912/freelancehunt-stickers/main/freelancehunt_stickers.user.js
// ==/UserScript==

GM_addStyle(`
    .custom-sticker .remove-sticker {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: red;
        color: white;
        font-size: 12px;
        cursor: pointer;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        z-index: 1000;
    }
    .fr-command.add-sticker {
        height: auto;
        font-size: 12px;
    }
`);

var defaultStickers = [];

var stickers = GM_getValue("customStickers", defaultStickers);

function addCustomStickers() {
    $('.custom-sticker, .add-sticker').remove();

    stickers.forEach(function(stickerUrl, index) {
        var customSticker = $('<div class="fr-command fr-sticker custom-sticker" tabindex="-1" role="button" style="position:relative;"><img src="' + stickerUrl + '"><span class="remove-sticker" data-url="' + stickerUrl + '">X</span></div>');

        customSticker.on('click', function(e) {
            if (!$(e.target).hasClass('remove-sticker')) {
                $(document).trigger({
                    type: "sendSticker",
                    message: '<p><img src="' + stickerUrl + '" width="200" height="200"></p>'
                });
            }
        });

        customSticker.find('.remove-sticker').on('click', function(e) {
            e.stopPropagation();

            var stickerToRemove = $(this).data('url');

            stickers = stickers.filter(function(sticker) {
                return sticker !== stickerToRemove;
            });

            GM_setValue('customStickers', stickers);

            $(this).parent().remove();
        });

        $('.fr-sticker-popup .fr-sticker-list').prepend(customSticker);
    });

    var addButton = $('<div class="fr-command fr-sticker add-sticker" tabindex="-1" role="button">+</div>');

    addButton.on('click', function() {
        var newStickerUrl = prompt("Введите URL нового стикера:");
        if (newStickerUrl) {
            stickers.push(newStickerUrl);
            GM_setValue("customStickers", stickers);
            addCustomStickers();
        }
    });

    $('.fr-sticker-popup .fr-sticker-list').prepend(addButton);
}

$(document).ready(function() {
    var checkExist = setInterval(function() {
        if ($('.fr-sticker-popup .fr-sticker-list').length) {
            clearInterval(checkExist);
            addCustomStickers();
        }
    }, 100);
});
