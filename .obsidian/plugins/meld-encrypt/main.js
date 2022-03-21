'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class DecryptModal extends obsidian.Modal {
    constructor(app, title, text = '') {
        super(app);
        this.decryptInPlace = false;
        this.text = text;
        this.titleEl.innerText = title;
    }
    onOpen() {
        let { contentEl } = this;
        const textEl = contentEl.createDiv().createEl('textarea', { text: this.text });
        textEl.style.width = '100%';
        textEl.style.height = '100%';
        textEl.rows = 10;
        textEl.readOnly = true;
        //textEl.focus(); // Doesn't seem to work here...
        setTimeout(() => { textEl.focus(); }, 100); //... but this does
        const btnContainerEl = contentEl.createDiv('');
        const decryptInPlaceBtnEl = btnContainerEl.createEl('button', { text: 'Decrypt in-place' });
        decryptInPlaceBtnEl.addEventListener('click', () => {
            this.decryptInPlace = true;
            this.close();
        });
        const cancelBtnEl = btnContainerEl.createEl('button', { text: 'Close' });
        cancelBtnEl.addEventListener('click', () => {
            this.close();
        });
    }
}

class PasswordModal extends obsidian.Modal {
    constructor(app, isEncrypting, confirmPassword, defaultPassword = null, hint) {
        super(app);
        this.password = null;
        this.hint = null;
        this.defaultPassword = null;
        this.defaultPassword = defaultPassword;
        this.confirmPassword = confirmPassword;
        this.isEncrypting = isEncrypting;
        this.hint = hint;
    }
    onOpen() {
        var _a, _b, _c;
        let { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('meld-e-password');
        if (obsidian.Platform.isMobile) {
            contentEl.addClass('meld-e-platform-mobile');
        }
        else if (obsidian.Platform.isDesktop) {
            contentEl.addClass('meld-e-platform-desktop');
        }
        /* Main password input row */
        const inputPwContainerEl = contentEl.createDiv({ cls: 'meld-e-row' });
        inputPwContainerEl.createSpan({ cls: 'meld-e-icon', text: '🔑' });
        const pwInputEl = inputPwContainerEl.createEl('input', { type: 'password', value: (_a = this.defaultPassword) !== null && _a !== void 0 ? _a : '' });
        pwInputEl.placeholder = 'Enter your password';
        pwInputEl.focus();
        if (obsidian.Platform.isMobile) {
            // Add 'Next' button for mobile
            const inputInputNextBtnEl = inputPwContainerEl.createEl('button', {
                text: '→',
                cls: 'meld-e-button-next'
            });
            inputInputNextBtnEl.addEventListener('click', (ev) => {
                inputPasswordHandler();
            });
        }
        /* End Main password input row */
        /* Confirm password input row */
        const confirmPwShown = this.confirmPassword;
        const confirmPwContainerEl = contentEl.createDiv({ cls: 'meld-e-row' });
        confirmPwContainerEl.createSpan({ cls: 'meld-e-icon', text: '🔑' });
        const pwConfirmInputEl = confirmPwContainerEl.createEl('input', {
            type: 'password',
            value: (_b = this.defaultPassword) !== null && _b !== void 0 ? _b : ''
        });
        pwConfirmInputEl.placeholder = 'Confirm your password';
        const messageEl = contentEl.createDiv({ cls: 'meld-e-message' });
        messageEl.hide();
        if (obsidian.Platform.isMobile) {
            // Add 'Next' button for mobile
            const confirmInputNextBtnEl = confirmPwContainerEl.createEl('button', {
                text: '→',
                cls: 'meld-e-button-next'
            });
            confirmInputNextBtnEl.addEventListener('click', (ev) => {
                confirmPasswordHandler();
            });
        }
        if (!confirmPwShown) {
            confirmPwContainerEl.hide();
        }
        /* End Confirm password input row */
        /* Hint input row */
        const hintInputShown = this.isEncrypting;
        const inputHintContainerEl = contentEl.createDiv({ cls: 'meld-e-row' });
        inputHintContainerEl.createSpan({ cls: 'meld-e-icon', text: '💡' });
        const hintInputEl = inputHintContainerEl.createEl('input', { type: 'text', value: this.hint });
        hintInputEl.placeholder = 'Enter an optional password hint';
        if (obsidian.Platform.isMobile) {
            // Add 'Next' button for mobile
            const hintInputNextBtnEl = inputHintContainerEl.createEl('button', {
                text: '→',
                cls: 'meld-e-button-next'
            });
            hintInputNextBtnEl.addEventListener('click', (ev) => {
                hintPasswordHandler();
            });
        }
        if (!hintInputShown) {
            inputHintContainerEl.hide();
        }
        /* End Hint input row */
        /* Hint text row */
        const spanHintContainerEl = contentEl.createDiv({ cls: 'meld-e-row' });
        spanHintContainerEl.createSpan({ cls: 'meld-e-icon', text: '💡' });
        spanHintContainerEl.createSpan({ cls: 'meld-e-hint', text: `Hint: '${this.hint}'` });
        if (hintInputShown || ((_c = this.hint) !== null && _c !== void 0 ? _c : '').length == 0) {
            spanHintContainerEl.hide();
        }
        /* END Hint text row */
        const confirmPwButtonEl = contentEl.createEl('button', {
            text: 'Confirm',
            cls: 'meld-e-button-confirm'
        });
        confirmPwButtonEl.addEventListener('click', (ev) => {
            if (validate()) {
                this.close();
            }
            else {
                pwInputEl.focus();
            }
        });
        const validate = () => {
            if (confirmPwShown) {
                if (pwInputEl.value != pwConfirmInputEl.value) {
                    // passwords don't match
                    messageEl.setText('Passwords don\'t match');
                    messageEl.show();
                    return false;
                }
            }
            this.password = pwInputEl.value;
            this.hint = hintInputEl.value;
            return true;
        };
        const inputPasswordHandler = () => {
            if (confirmPwShown) {
                pwConfirmInputEl.focus();
                return;
            }
            if (hintInputShown) {
                hintInputEl.focus();
                return;
            }
            if (validate()) {
                this.close();
            }
        };
        const confirmPasswordHandler = () => {
            if (validate()) {
                if (hintInputShown) {
                    hintInputEl.focus();
                }
                else {
                    this.close();
                }
            }
        };
        const hintPasswordHandler = () => {
            if (validate()) {
                this.close();
            }
            else {
                pwInputEl.focus();
            }
        };
        hintInputEl.addEventListener('keypress', (ev) => {
            if ((ev.code === 'Enter' || ev.code === 'NumpadEnter')
                && pwInputEl.value.length > 0) {
                ev.preventDefault();
                hintPasswordHandler();
            }
        });
        pwConfirmInputEl.addEventListener('keypress', (ev) => {
            if ((ev.code === 'Enter' || ev.code === 'NumpadEnter')
                && pwConfirmInputEl.value.length > 0) {
                ev.preventDefault();
                confirmPasswordHandler();
            }
        });
        pwInputEl.addEventListener('keypress', (ev) => {
            if ((ev.code === 'Enter' || ev.code === 'NumpadEnter')
                && pwInputEl.value.length > 0) {
                ev.preventDefault();
                inputPasswordHandler();
            }
        });
    }
}

const vectorSize = 16;
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
const iterations = 1000;
const salt = utf8Encoder.encode('XHWnDAT6ehMVY2zD');
class CryptoHelperV2 {
    deriveKey(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = utf8Encoder.encode(password);
            const key = yield crypto.subtle.importKey('raw', buffer, { name: 'PBKDF2' }, false, ['deriveKey']);
            const privateKey = crypto.subtle.deriveKey({
                name: 'PBKDF2',
                hash: { name: 'SHA-256' },
                iterations,
                salt
            }, key, {
                name: 'AES-GCM',
                length: 256
            }, false, ['encrypt', 'decrypt']);
            return privateKey;
        });
    }
    encryptToBase64(text, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.deriveKey(password);
            const textBytesToEncrypt = utf8Encoder.encode(text);
            const vector = crypto.getRandomValues(new Uint8Array(vectorSize));
            // encrypt into bytes
            const encryptedBytes = new Uint8Array(yield crypto.subtle.encrypt({ name: 'AES-GCM', iv: vector }, key, textBytesToEncrypt));
            const finalBytes = new Uint8Array(vector.byteLength + encryptedBytes.byteLength);
            finalBytes.set(vector, 0);
            finalBytes.set(encryptedBytes, vector.byteLength);
            //convert array to base64
            const base64Text = btoa(String.fromCharCode(...finalBytes));
            return base64Text;
        });
    }
    stringToArray(str) {
        var result = [];
        for (var i = 0; i < str.length; i++) {
            result.push(str.charCodeAt(i));
        }
        return new Uint8Array(result);
    }
    decryptFromBase64(base64Encoded, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let bytesToDecode = this.stringToArray(atob(base64Encoded));
                // extract iv
                const vector = bytesToDecode.slice(0, vectorSize);
                // extract encrypted text
                const encryptedTextBytes = bytesToDecode.slice(vectorSize);
                const key = yield this.deriveKey(password);
                // decrypt into bytes
                let decryptedBytes = yield crypto.subtle.decrypt({ name: 'AES-GCM', iv: vector }, key, encryptedTextBytes);
                // convert bytes to text
                let decryptedText = utf8Decoder.decode(decryptedBytes);
                return decryptedText;
            }
            catch (e) {
                //console.error(e);
                return null;
            }
        });
    }
}
const algorithmObsolete = {
    name: 'AES-GCM',
    iv: new Uint8Array([196, 190, 240, 190, 188, 78, 41, 132, 15, 220, 84, 211]),
    tagLength: 128
};
class CryptoHelperObsolete {
    buildKey(password) {
        return __awaiter(this, void 0, void 0, function* () {
            let utf8Encode = new TextEncoder();
            let passwordBytes = utf8Encode.encode(password);
            let passwordDigest = yield crypto.subtle.digest({ name: 'SHA-256' }, passwordBytes);
            let key = yield crypto.subtle.importKey('raw', passwordDigest, algorithmObsolete, false, ['encrypt', 'decrypt']);
            return key;
        });
    }
    encryptToBase64(text, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let key = yield this.buildKey(password);
            let utf8Encode = new TextEncoder();
            let bytesToEncrypt = utf8Encode.encode(text);
            // encrypt into bytes
            let encryptedBytes = new Uint8Array(yield crypto.subtle.encrypt(algorithmObsolete, key, bytesToEncrypt));
            //convert array to base64
            let base64Text = btoa(String.fromCharCode(...encryptedBytes));
            return base64Text;
        });
    }
    stringToArray(str) {
        var result = [];
        for (var i = 0; i < str.length; i++) {
            result.push(str.charCodeAt(i));
        }
        return new Uint8Array(result);
    }
    decryptFromBase64(base64Encoded, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // convert base 64 to array
                let bytesToDecrypt = this.stringToArray(atob(base64Encoded));
                let key = yield this.buildKey(password);
                // decrypt into bytes
                let decryptedBytes = yield crypto.subtle.decrypt(algorithmObsolete, key, bytesToDecrypt);
                // convert bytes to text
                let utf8Decode = new TextDecoder();
                let decryptedText = utf8Decode.decode(decryptedBytes);
                return decryptedText;
            }
            catch (e) {
                return null;
            }
        });
    }
}

class MeldEncryptSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Meld Encrypt' });
        new obsidian.Setting(containerEl)
            .setName('Expand selection to whole line?')
            .setDesc('Partial selections will get expanded to the whole line.')
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.expandToWholeLines)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.expandToWholeLines = value;
                yield this.plugin.saveSettings();
                //this.updateSettingsUi();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName('Confirm password?')
            .setDesc('Confirm password when encrypting.')
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.confirmPassword)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.confirmPassword = value;
                yield this.plugin.saveSettings();
                this.updateSettingsUi();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName('Remember password?')
            .setDesc('Remember the last used password for this session.')
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.rememberPassword)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.rememberPassword = value;
                yield this.plugin.saveSettings();
                this.updateSettingsUi();
            }));
        });
        this.pwTimeoutSetting = new obsidian.Setting(containerEl)
            .setName(this.buildPasswordTimeoutSettingName())
            .setDesc('The number of minutes to remember the last used password.')
            .addSlider(slider => {
            slider
                .setLimits(0, 120, 5)
                .setValue(this.plugin.settings.rememberPasswordTimeout)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.rememberPasswordTimeout = value;
                yield this.plugin.saveSettings();
                this.updateSettingsUi();
            }));
        });
        this.updateSettingsUi();
    }
    updateSettingsUi() {
        this.pwTimeoutSetting.setName(this.buildPasswordTimeoutSettingName());
        if (this.plugin.settings.rememberPassword) {
            this.pwTimeoutSetting.settingEl.show();
        }
        else {
            this.pwTimeoutSetting.settingEl.hide();
        }
    }
    buildPasswordTimeoutSettingName() {
        const value = this.plugin.settings.rememberPasswordTimeout;
        let timeoutString = `${value} minutes`;
        if (value == 0) {
            timeoutString = 'Never forget';
        }
        return `Remember Password Timeout (${timeoutString})`;
    }
}

const _PREFIX = '%%🔐';
const _PREFIX_OBSOLETE = _PREFIX + ' ';
const _PREFIX_A = _PREFIX + 'α ';
const _SUFFIX = ' 🔐%%';
const _HINT = '💡';
const DEFAULT_SETTINGS = {
    expandToWholeLines: true,
    confirmPassword: true,
    rememberPassword: true,
    rememberPasswordTimeout: 30
};
class MeldEncrypt extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.addSettingTab(new MeldEncryptSettingsTab(this.app, this));
            this.addCommand({
                id: 'meld-encrypt',
                name: 'Encrypt/Decrypt',
                editorCheckCallback: (checking, editor, view) => this.processEncryptDecryptCommand(checking, editor, view, false)
            });
            this.addCommand({
                id: 'meld-encrypt-in-place',
                name: 'Encrypt/Decrypt In-place',
                editorCheckCallback: (checking, editor, view) => this.processEncryptDecryptCommand(checking, editor, view, true)
            });
            this.addCommand({
                id: 'meld-encrypt-note',
                name: 'Encrypt/Decrypt Whole Note',
                editorCheckCallback: (checking, editor, view) => this.processEncryptDecryptWholeNoteCommand(checking, editor, view)
            });
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    isSettingsModalOpen() {
        return document.querySelector('.mod-settings') !== null;
    }
    processEncryptDecryptWholeNoteCommand(checking, editor, view) {
        if (checking && this.isSettingsModalOpen()) {
            // Settings is open, ensures this command can show up in other
            // plugins which list commands e.g. customizable-sidebar
            return true;
        }
        const startPos = editor.offsetToPos(0);
        const endPos = { line: editor.lastLine(), ch: editor.getLine(editor.lastLine()).length };
        const selectionText = editor.getRange(startPos, endPos).trim();
        return this.processSelection(checking, editor, selectionText, startPos, endPos, true);
    }
    processEncryptDecryptCommand(checking, editor, view, decryptInPlace) {
        if (checking && this.isSettingsModalOpen()) {
            // Settings is open, ensures this command can show up in other
            // plugins which list commands e.g. customizable-sidebar
            return true;
        }
        let startPos = editor.getCursor('from');
        let endPos = editor.getCursor('to');
        if (this.settings.expandToWholeLines) {
            const startLine = startPos.line;
            startPos = { line: startLine, ch: 0 }; // want the start of the first line
            const endLine = endPos.line;
            const endLineText = editor.getLine(endLine);
            endPos = { line: endLine, ch: endLineText.length }; // want the end of last line
        }
        else {
            if (!editor.somethingSelected()) {
                // nothing selected, assume user wants to decrypt, expand to start and end markers
                startPos = this.getClosestPrevTextCursorPos(editor, _PREFIX, startPos);
                endPos = this.getClosestNextTextCursorPos(editor, _SUFFIX, endPos);
            }
        }
        const selectionText = editor.getRange(startPos, endPos);
        return this.processSelection(checking, editor, selectionText, startPos, endPos, decryptInPlace);
    }
    getClosestPrevTextCursorPos(editor, text, defaultValue) {
        const initOffset = editor.posToOffset(editor.getCursor("from"));
        for (let offset = initOffset; offset >= 0; offset--) {
            const offsetPos = editor.offsetToPos(offset);
            const textEndOffset = offset + text.length;
            const prefixEndPos = editor.offsetToPos(textEndOffset);
            const testText = editor.getRange(offsetPos, prefixEndPos);
            if (testText == text) {
                return offsetPos;
            }
        }
        return defaultValue;
    }
    getClosestNextTextCursorPos(editor, text, defaultValue) {
        const initOffset = editor.posToOffset(editor.getCursor("from"));
        let maxOffset = editor.posToOffset({ line: editor.lastLine(), ch: Number.MAX_VALUE });
        for (let offset = initOffset; offset <= maxOffset - text.length; offset++) {
            const offsetPos = editor.offsetToPos(offset);
            const textEndOffset = offset + text.length;
            const prefixEndPos = editor.offsetToPos(textEndOffset);
            const testText = editor.getRange(offsetPos, prefixEndPos);
            if (testText == text) {
                return prefixEndPos;
            }
        }
        return defaultValue;
    }
    analyseSelection(selectionText) {
        const result = new SelectionAnalysis();
        result.isEmpty = selectionText.length === 0;
        result.hasObsoleteEncryptedPrefix = selectionText.startsWith(_PREFIX_OBSOLETE);
        result.hasEncryptedPrefix = result.hasObsoleteEncryptedPrefix || selectionText.startsWith(_PREFIX_A);
        result.hasDecryptSuffix = selectionText.endsWith(_SUFFIX);
        result.containsEncryptedMarkers =
            selectionText.contains(_PREFIX_OBSOLETE)
                || selectionText.contains(_PREFIX_A)
                || selectionText.contains(_SUFFIX);
        result.canDecrypt = result.hasEncryptedPrefix && result.hasDecryptSuffix;
        result.canEncrypt = !result.hasEncryptedPrefix && !result.containsEncryptedMarkers;
        if (result.canDecrypt) {
            result.decryptable = this.parseDecryptableContent(selectionText);
            if (result.decryptable == null) {
                result.canDecrypt = false;
            }
        }
        return result;
    }
    processSelection(checking, editor, selectionText, finalSelectionStart, finalSelectionEnd, decryptInPlace) {
        var _a;
        const selectionAnalysis = this.analyseSelection(selectionText);
        if (selectionAnalysis.isEmpty) {
            if (!checking) {
                new obsidian.Notice('Nothing to Encrypt.');
            }
            return false;
        }
        if (!selectionAnalysis.canDecrypt && !selectionAnalysis.canEncrypt) {
            if (!checking) {
                new obsidian.Notice('Unable to Encrypt or Decrypt that.');
            }
            return false;
        }
        if (checking) {
            return true;
        }
        // Fetch password from user
        // determine default password
        const isRememberPasswordExpired = !this.settings.rememberPassword
            || (this.passwordLastUsedExpiry != null
                && Date.now() > this.passwordLastUsedExpiry);
        const confirmPassword = selectionAnalysis.canEncrypt && this.settings.confirmPassword;
        if (isRememberPasswordExpired || confirmPassword) {
            // forget password
            this.passwordLastUsed = '';
        }
        const pwModal = new PasswordModal(this.app, selectionAnalysis.canEncrypt, confirmPassword, this.passwordLastUsed, (_a = selectionAnalysis.decryptable) === null || _a === void 0 ? void 0 : _a.hint);
        pwModal.onClose = () => {
            var _a;
            const pw = (_a = pwModal.password) !== null && _a !== void 0 ? _a : '';
            if (pw.length == 0) {
                return;
            }
            const hint = pwModal.hint;
            // remember password?
            if (this.settings.rememberPassword) {
                this.passwordLastUsed = pw;
                this.passwordLastUsedExpiry =
                    this.settings.rememberPasswordTimeout == 0
                        ? null
                        : Date.now() + this.settings.rememberPasswordTimeout * 1000 * 60 // new expiry
                ;
            }
            if (selectionAnalysis.canEncrypt) {
                const encryptable = new Encryptable();
                encryptable.text = selectionText;
                encryptable.hint = hint;
                this.encryptSelection(editor, encryptable, pw, finalSelectionStart, finalSelectionEnd);
            }
            else {
                if (selectionAnalysis.decryptable.version == 1) {
                    this.decryptSelection_a(editor, selectionAnalysis.decryptable, pw, finalSelectionStart, finalSelectionEnd, decryptInPlace);
                }
                else {
                    this.decryptSelectionObsolete(editor, selectionAnalysis.decryptable, pw, finalSelectionStart, finalSelectionEnd, decryptInPlace);
                }
            }
        };
        pwModal.open();
        return true;
    }
    encryptSelection(editor, encryptable, password, finalSelectionStart, finalSelectionEnd) {
        return __awaiter(this, void 0, void 0, function* () {
            //encrypt
            const crypto = new CryptoHelperV2();
            const encodedText = this.encodeEncryption(yield crypto.encryptToBase64(encryptable.text, password), encryptable.hint);
            editor.setSelection(finalSelectionStart, finalSelectionEnd);
            editor.replaceSelection(encodedText);
        });
    }
    decryptSelection_a(editor, decryptable, password, selectionStart, selectionEnd, decryptInPlace) {
        return __awaiter(this, void 0, void 0, function* () {
            // decrypt
            const crypto = new CryptoHelperV2();
            const decryptedText = yield crypto.decryptFromBase64(decryptable.base64CipherText, password);
            if (decryptedText === null) {
                new obsidian.Notice('❌ Decryption failed!');
            }
            else {
                if (decryptInPlace) {
                    editor.setSelection(selectionStart, selectionEnd);
                    editor.replaceSelection(decryptedText);
                }
                else {
                    const decryptModal = new DecryptModal(this.app, '🔓', decryptedText);
                    decryptModal.onClose = () => {
                        editor.focus();
                        if (decryptModal.decryptInPlace) {
                            editor.setSelection(selectionStart, selectionEnd);
                            editor.replaceSelection(decryptedText);
                        }
                    };
                    decryptModal.open();
                }
            }
        });
    }
    decryptSelectionObsolete(editor, decryptable, password, selectionStart, selectionEnd, decryptInPlace) {
        return __awaiter(this, void 0, void 0, function* () {
            // decrypt
            const base64CipherText = this.removeMarkers(decryptable.base64CipherText);
            const crypto = new CryptoHelperObsolete();
            const decryptedText = yield crypto.decryptFromBase64(base64CipherText, password);
            if (decryptedText === null) {
                new obsidian.Notice('❌ Decryption failed!');
            }
            else {
                if (decryptInPlace) {
                    editor.setSelection(selectionStart, selectionEnd);
                    editor.replaceSelection(decryptedText);
                }
                else {
                    const decryptModal = new DecryptModal(this.app, '🔓', decryptedText);
                    decryptModal.onClose = () => {
                        editor.focus();
                        if (decryptModal.decryptInPlace) {
                            editor.setSelection(selectionStart, selectionEnd);
                            editor.replaceSelection(decryptedText);
                        }
                    };
                    decryptModal.open();
                }
            }
        });
    }
    parseDecryptableContent(text) {
        const result = new Decryptable();
        let content = text;
        if (content.startsWith(_PREFIX_A) && content.endsWith(_SUFFIX)) {
            result.version = 1;
            content = content.replace(_PREFIX_A, '').replace(_SUFFIX, '');
        }
        else if (content.startsWith(_PREFIX_OBSOLETE) && content.endsWith(_SUFFIX)) {
            result.version = 0;
            content = content.replace(_PREFIX_OBSOLETE, '').replace(_SUFFIX, '');
        }
        else {
            return null; // invalid format
        }
        // check if there is a hint
        //console.table(content);
        if (content.substr(0, _HINT.length) == _HINT) {
            const endHintMarker = content.indexOf(_HINT, _HINT.length);
            if (endHintMarker < 0) {
                return null; // invalid format
            }
            result.hint = content.substring(_HINT.length, endHintMarker);
            result.base64CipherText = content.substring(endHintMarker + _HINT.length);
        }
        else {
            result.base64CipherText = content;
        }
        //console.table(result);
        return result;
    }
    removeMarkers(text) {
        if (text.startsWith(_PREFIX_A) && text.endsWith(_SUFFIX)) {
            return text.replace(_PREFIX_A, '').replace(_SUFFIX, '');
        }
        if (text.startsWith(_PREFIX_OBSOLETE) && text.endsWith(_SUFFIX)) {
            return text.replace(_PREFIX_OBSOLETE, '').replace(_SUFFIX, '');
        }
        return text;
    }
    encodeEncryption(encryptedText, hint) {
        if (!encryptedText.contains(_PREFIX_OBSOLETE) && !encryptedText.contains(_PREFIX_A) && !encryptedText.contains(_SUFFIX)) {
            if (hint) {
                return _PREFIX_A.concat(_HINT, hint, _HINT, encryptedText, _SUFFIX);
            }
            return _PREFIX_A.concat(encryptedText, _SUFFIX);
        }
        return encryptedText;
    }
}
class SelectionAnalysis {
}
class Encryptable {
}
class Decryptable {
}

module.exports = MeldEncrypt;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uL3NyYy9EZWNyeXB0TW9kYWwudHMiLCIuLi9zcmMvUGFzc3dvcmRNb2RhbC50cyIsIi4uL3NyYy9DcnlwdG9IZWxwZXIudHMiLCIuLi9zcmMvTWVsZEVuY3J5cHRTZXR0aW5nc1RhYi50cyIsIi4uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwLCBNb2RhbCB9IGZyb20gJ29ic2lkaWFuJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlY3J5cHRNb2RhbCBleHRlbmRzIE1vZGFsIHtcclxuXHR0ZXh0OiBzdHJpbmc7XHJcblx0ZGVjcnlwdEluUGxhY2U6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIHRpdGxlOiBzdHJpbmcsIHRleHQ6IHN0cmluZyA9ICcnKSB7XHJcblx0XHRzdXBlcihhcHApO1xyXG5cdFx0dGhpcy50ZXh0ID0gdGV4dDtcclxuXHRcdHRoaXMudGl0bGVFbC5pbm5lclRleHQgPSB0aXRsZTtcclxuXHR9XHJcblxyXG5cdG9uT3BlbigpIHtcclxuXHRcdGxldCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcclxuXHJcblx0XHRjb25zdCB0ZXh0RWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KCkuY3JlYXRlRWwoJ3RleHRhcmVhJywgeyB0ZXh0OiB0aGlzLnRleHQgfSk7XHJcblx0XHR0ZXh0RWwuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcblx0XHR0ZXh0RWwuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG5cdFx0dGV4dEVsLnJvd3MgPSAxMDtcclxuXHRcdHRleHRFbC5yZWFkT25seSA9IHRydWU7XHJcblx0XHQvL3RleHRFbC5mb2N1cygpOyAvLyBEb2Vzbid0IHNlZW0gdG8gd29yayBoZXJlLi4uXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHsgdGV4dEVsLmZvY3VzKCkgfSwxMDApOyAvLy4uLiBidXQgdGhpcyBkb2VzXHJcblxyXG5cclxuXHRcdGNvbnN0IGJ0bkNvbnRhaW5lckVsID0gY29udGVudEVsLmNyZWF0ZURpdignJyk7XHJcblxyXG5cdFx0Y29uc3QgZGVjcnlwdEluUGxhY2VCdG5FbCA9IGJ0bkNvbnRhaW5lckVsLmNyZWF0ZUVsKCdidXR0b24nLCB7IHRleHQ6ICdEZWNyeXB0IGluLXBsYWNlJyB9KTtcclxuXHRcdGRlY3J5cHRJblBsYWNlQnRuRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuZGVjcnlwdEluUGxhY2UgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmNsb3NlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRjb25zdCBjYW5jZWxCdG5FbCA9IGJ0bkNvbnRhaW5lckVsLmNyZWF0ZUVsKCdidXR0b24nLCB7IHRleHQ6ICdDbG9zZScgfSk7XHJcblx0XHRjYW5jZWxCdG5FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcbn0iLCJpbXBvcnQgeyBBcHAsIE1vZGFsLCBQbGF0Zm9ybSB9IGZyb20gJ29ic2lkaWFuJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhc3N3b3JkTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XHJcblx0cGFzc3dvcmQ6IHN0cmluZyA9IG51bGw7XHJcblx0aGludDogc3RyaW5nID0gbnVsbDtcclxuXHRkZWZhdWx0UGFzc3dvcmQ6IHN0cmluZyA9IG51bGw7XHJcblx0Y29uZmlybVBhc3N3b3JkOiBib29sZWFuO1xyXG5cdGlzRW5jcnlwdGluZzogYm9vbGVhbjtcclxuXHJcblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIGlzRW5jcnlwdGluZzpib29sZWFuLCBjb25maXJtUGFzc3dvcmQ6IGJvb2xlYW4sIGRlZmF1bHRQYXNzd29yZDogc3RyaW5nID0gbnVsbCwgaGludDpzdHJpbmcgKSB7XHJcblx0XHRzdXBlcihhcHApO1xyXG5cdFx0dGhpcy5kZWZhdWx0UGFzc3dvcmQgPSBkZWZhdWx0UGFzc3dvcmQ7XHJcblx0XHR0aGlzLmNvbmZpcm1QYXNzd29yZCA9IGNvbmZpcm1QYXNzd29yZDtcclxuXHRcdHRoaXMuaXNFbmNyeXB0aW5nID0gaXNFbmNyeXB0aW5nO1xyXG5cdFx0dGhpcy5oaW50ID0gaGludDtcclxuXHR9XHJcblxyXG5cdG9uT3BlbigpIHtcclxuXHRcdGxldCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcclxuXHJcblx0XHRjb250ZW50RWwuZW1wdHkoKTtcclxuXHJcblx0XHRjb250ZW50RWwuYWRkQ2xhc3MoICdtZWxkLWUtcGFzc3dvcmQnICk7XHJcblx0XHRpZiAoUGxhdGZvcm0uaXNNb2JpbGUpe1xyXG5cdFx0XHRjb250ZW50RWwuYWRkQ2xhc3MoICdtZWxkLWUtcGxhdGZvcm0tbW9iaWxlJyApO1xyXG5cdFx0fWVsc2UgaWYgKFBsYXRmb3JtLmlzRGVza3RvcCl7XHJcblx0XHRcdGNvbnRlbnRFbC5hZGRDbGFzcyggJ21lbGQtZS1wbGF0Zm9ybS1kZXNrdG9wJyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qIE1haW4gcGFzc3dvcmQgaW5wdXQgcm93ICovXHJcblx0XHRjb25zdCBpbnB1dFB3Q29udGFpbmVyRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KCB7IGNsczonbWVsZC1lLXJvdycgfSApO1xyXG5cdFx0aW5wdXRQd0NvbnRhaW5lckVsLmNyZWF0ZVNwYW4oeyBjbHM6J21lbGQtZS1pY29uJywgdGV4dDogJ/CflJEnIH0pO1xyXG5cdFx0XHJcblx0XHRjb25zdCBwd0lucHV0RWwgPSBpbnB1dFB3Q29udGFpbmVyRWwuY3JlYXRlRWwoJ2lucHV0JywgeyB0eXBlOiAncGFzc3dvcmQnLCB2YWx1ZTogdGhpcy5kZWZhdWx0UGFzc3dvcmQgPz8gJycgfSk7XHJcblxyXG5cdFx0cHdJbnB1dEVsLnBsYWNlaG9sZGVyID0gJ0VudGVyIHlvdXIgcGFzc3dvcmQnO1xyXG5cdFx0cHdJbnB1dEVsLmZvY3VzKCk7XHJcblxyXG5cdFx0aWYgKFBsYXRmb3JtLmlzTW9iaWxlKXtcclxuXHRcdFx0Ly8gQWRkICdOZXh0JyBidXR0b24gZm9yIG1vYmlsZVxyXG5cdFx0XHRjb25zdCBpbnB1dElucHV0TmV4dEJ0bkVsID0gaW5wdXRQd0NvbnRhaW5lckVsLmNyZWF0ZUVsKCdidXR0b24nLCB7XHJcblx0XHRcdFx0dGV4dDogJ+KGkicsXHJcblx0XHRcdFx0Y2xzOidtZWxkLWUtYnV0dG9uLW5leHQnXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRpbnB1dElucHV0TmV4dEJ0bkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7XHJcblx0XHRcdFx0aW5wdXRQYXNzd29yZEhhbmRsZXIoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyogRW5kIE1haW4gcGFzc3dvcmQgaW5wdXQgcm93ICovXHJcblxyXG5cdFx0LyogQ29uZmlybSBwYXNzd29yZCBpbnB1dCByb3cgKi9cclxuXHRcdGNvbnN0IGNvbmZpcm1Qd1Nob3duID0gdGhpcy5jb25maXJtUGFzc3dvcmQ7XHJcblx0XHRjb25zdCBjb25maXJtUHdDb250YWluZXJFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoIHsgY2xzOidtZWxkLWUtcm93JyB9ICk7XHJcblx0XHRjb25maXJtUHdDb250YWluZXJFbC5jcmVhdGVTcGFuKCB7IGNsczonbWVsZC1lLWljb24nLCB0ZXh0OiAn8J+UkScgfSApO1xyXG5cdFx0XHJcblx0XHRjb25zdCBwd0NvbmZpcm1JbnB1dEVsID0gY29uZmlybVB3Q29udGFpbmVyRWwuY3JlYXRlRWwoICdpbnB1dCcsIHtcclxuXHRcdFx0dHlwZTogJ3Bhc3N3b3JkJyxcclxuXHRcdFx0dmFsdWU6IHRoaXMuZGVmYXVsdFBhc3N3b3JkID8/ICcnXHJcblx0XHR9KTtcclxuXHRcdHB3Q29uZmlybUlucHV0RWwucGxhY2Vob2xkZXIgPSAnQ29uZmlybSB5b3VyIHBhc3N3b3JkJztcclxuXHJcblx0XHRjb25zdCBtZXNzYWdlRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOidtZWxkLWUtbWVzc2FnZScgfSk7XHJcblx0XHRtZXNzYWdlRWwuaGlkZSgpO1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdGlmIChQbGF0Zm9ybS5pc01vYmlsZSl7XHJcblx0XHRcdC8vIEFkZCAnTmV4dCcgYnV0dG9uIGZvciBtb2JpbGVcclxuXHRcdFx0Y29uc3QgY29uZmlybUlucHV0TmV4dEJ0bkVsID0gY29uZmlybVB3Q29udGFpbmVyRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcclxuXHRcdFx0XHR0ZXh0OiAn4oaSJyxcclxuXHRcdFx0XHRjbHM6J21lbGQtZS1idXR0b24tbmV4dCdcclxuXHRcdFx0fSk7XHJcblx0XHRcdGNvbmZpcm1JbnB1dE5leHRCdG5FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4ge1xyXG5cdFx0XHRcdGNvbmZpcm1QYXNzd29yZEhhbmRsZXIoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmICghY29uZmlybVB3U2hvd24pIHtcclxuXHRcdFx0Y29uZmlybVB3Q29udGFpbmVyRWwuaGlkZSgpO1xyXG5cdFx0fVxyXG5cdFx0LyogRW5kIENvbmZpcm0gcGFzc3dvcmQgaW5wdXQgcm93ICovXHJcblxyXG5cdFx0LyogSGludCBpbnB1dCByb3cgKi9cclxuXHRcdGNvbnN0IGhpbnRJbnB1dFNob3duID0gdGhpcy5pc0VuY3J5cHRpbmc7XHJcblx0XHRjb25zdCBpbnB1dEhpbnRDb250YWluZXJFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoIHsgY2xzOidtZWxkLWUtcm93JyB9ICk7XHJcblx0XHRpbnB1dEhpbnRDb250YWluZXJFbC5jcmVhdGVTcGFuKHsgY2xzOidtZWxkLWUtaWNvbicsIHRleHQ6ICfwn5KhJyB9KTtcclxuXHRcdGNvbnN0IGhpbnRJbnB1dEVsID0gaW5wdXRIaW50Q29udGFpbmVyRWwuY3JlYXRlRWwoJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIHZhbHVlOiB0aGlzLmhpbnQgfSk7XHJcblx0XHRoaW50SW5wdXRFbC5wbGFjZWhvbGRlciA9ICdFbnRlciBhbiBvcHRpb25hbCBwYXNzd29yZCBoaW50JztcclxuXHRcdGlmIChQbGF0Zm9ybS5pc01vYmlsZSl7XHJcblx0XHRcdC8vIEFkZCAnTmV4dCcgYnV0dG9uIGZvciBtb2JpbGVcclxuXHRcdFx0Y29uc3QgaGludElucHV0TmV4dEJ0bkVsID0gaW5wdXRIaW50Q29udGFpbmVyRWwuY3JlYXRlRWwoJ2J1dHRvbicsIHtcclxuXHRcdFx0XHR0ZXh0OiAn4oaSJyxcclxuXHRcdFx0XHRjbHM6J21lbGQtZS1idXR0b24tbmV4dCdcclxuXHRcdFx0fSk7XHJcblx0XHRcdGhpbnRJbnB1dE5leHRCdG5FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4ge1xyXG5cdFx0XHRcdGhpbnRQYXNzd29yZEhhbmRsZXIoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRpZiAoIWhpbnRJbnB1dFNob3duKXtcclxuXHRcdFx0aW5wdXRIaW50Q29udGFpbmVyRWwuaGlkZSgpO1xyXG5cdFx0fVxyXG5cdFx0LyogRW5kIEhpbnQgaW5wdXQgcm93ICovXHJcblxyXG5cdFx0LyogSGludCB0ZXh0IHJvdyAqL1xyXG5cdFx0Y29uc3Qgc3BhbkhpbnRDb250YWluZXJFbCA9IGNvbnRlbnRFbC5jcmVhdGVEaXYoIHsgY2xzOidtZWxkLWUtcm93JyB9ICk7XHJcblx0XHRzcGFuSGludENvbnRhaW5lckVsLmNyZWF0ZVNwYW4oeyBjbHM6J21lbGQtZS1pY29uJywgdGV4dDogJ/CfkqEnIH0pO1xyXG5cdFx0c3BhbkhpbnRDb250YWluZXJFbC5jcmVhdGVTcGFuKCB7Y2xzOiAnbWVsZC1lLWhpbnQnLCB0ZXh0OmBIaW50OiAnJHt0aGlzLmhpbnR9J2B9KTtcclxuXHJcblx0XHRpZiAoaGludElucHV0U2hvd24gfHwgKHRoaXMuaGludCA/PyAnJykubGVuZ3RoPT0wKXtcclxuXHRcdFx0c3BhbkhpbnRDb250YWluZXJFbC5oaWRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyogRU5EIEhpbnQgdGV4dCByb3cgKi9cclxuXHJcblx0XHRjb25zdCBjb25maXJtUHdCdXR0b25FbCA9IGNvbnRlbnRFbC5jcmVhdGVFbCggJ2J1dHRvbicsIHtcclxuXHRcdFx0dGV4dDonQ29uZmlybScsXHJcblx0XHRcdGNsczonbWVsZC1lLWJ1dHRvbi1jb25maXJtJ1xyXG5cdFx0fSk7XHJcblx0XHRjb25maXJtUHdCdXR0b25FbC5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoZXYpID0+e1xyXG5cdFx0XHRpZiAodmFsaWRhdGUoKSl7XHJcblx0XHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRwd0lucHV0RWwuZm9jdXMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRjb25zdCB2YWxpZGF0ZSA9ICgpIDogYm9vbGVhbiA9PiB7XHJcblx0XHRcdGlmIChjb25maXJtUHdTaG93bil7XHJcblx0XHRcdFx0aWYgKHB3SW5wdXRFbC52YWx1ZSAhPSBwd0NvbmZpcm1JbnB1dEVsLnZhbHVlKXtcclxuXHRcdFx0XHRcdC8vIHBhc3N3b3JkcyBkb24ndCBtYXRjaFxyXG5cdFx0XHRcdFx0bWVzc2FnZUVsLnNldFRleHQoJ1Bhc3N3b3JkcyBkb25cXCd0IG1hdGNoJyk7XHJcblx0XHRcdFx0XHRtZXNzYWdlRWwuc2hvdygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5wYXNzd29yZCA9IHB3SW5wdXRFbC52YWx1ZTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuaGludCA9IGhpbnRJbnB1dEVsLnZhbHVlO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgaW5wdXRQYXNzd29yZEhhbmRsZXIgPSAoKSA9PntcclxuXHRcdFx0aWYgKGNvbmZpcm1Qd1Nob3duKXtcclxuXHRcdFx0XHRwd0NvbmZpcm1JbnB1dEVsLmZvY3VzKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaGludElucHV0U2hvd24pe1xyXG5cdFx0XHRcdGhpbnRJbnB1dEVsLmZvY3VzKCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHZhbGlkYXRlKCkgKXtcclxuXHRcdFx0XHR0aGlzLmNsb3NlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBjb25maXJtUGFzc3dvcmRIYW5kbGVyID0gKCkgPT4ge1xyXG5cdFx0XHRpZiAoIHZhbGlkYXRlKCkgKXtcclxuXHRcdFx0XHRpZiAoaGludElucHV0U2hvd24pe1xyXG5cdFx0XHRcdFx0aGludElucHV0RWwuZm9jdXMoKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBoaW50UGFzc3dvcmRIYW5kbGVyID0gKCkgPT4ge1xyXG5cdFx0XHRpZiAodmFsaWRhdGUoKSl7XHJcblx0XHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRwd0lucHV0RWwuZm9jdXMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRoaW50SW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIChldikgPT4ge1xyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0KCBldi5jb2RlID09PSAnRW50ZXInIHx8IGV2LmNvZGUgPT09ICdOdW1wYWRFbnRlcicgKVxyXG5cdFx0XHRcdCYmIHB3SW5wdXRFbC52YWx1ZS5sZW5ndGggPiAwXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aGludFBhc3N3b3JkSGFuZGxlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRwd0NvbmZpcm1JbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgKGV2KSA9PiB7XHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHQoIGV2LmNvZGUgPT09ICdFbnRlcicgfHwgZXYuY29kZSA9PT0gJ051bXBhZEVudGVyJyApXHJcblx0XHRcdFx0JiYgcHdDb25maXJtSW5wdXRFbC52YWx1ZS5sZW5ndGggPiAwXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0Y29uZmlybVBhc3N3b3JkSGFuZGxlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0cHdJbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgKGV2KSA9PiB7XHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHQoIGV2LmNvZGUgPT09ICdFbnRlcicgfHwgZXYuY29kZSA9PT0gJ051bXBhZEVudGVyJyApXHJcblx0XHRcdFx0JiYgcHdJbnB1dEVsLnZhbHVlLmxlbmd0aCA+IDBcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRpbnB1dFBhc3N3b3JkSGFuZGxlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxufSIsImNvbnN0IHZlY3RvclNpemVcdD0gMTY7XHJcbmNvbnN0IHV0ZjhFbmNvZGVyXHQ9IG5ldyBUZXh0RW5jb2RlcigpO1xyXG5jb25zdCB1dGY4RGVjb2Rlclx0PSBuZXcgVGV4dERlY29kZXIoKTtcclxuY29uc3QgaXRlcmF0aW9uc1x0PSAxMDAwO1xyXG5jb25zdCBzYWx0XHRcdFx0PSB1dGY4RW5jb2Rlci5lbmNvZGUoJ1hIV25EQVQ2ZWhNVlkyekQnKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBDcnlwdG9IZWxwZXJWMiB7XHJcblxyXG5cdHByaXZhdGUgYXN5bmMgZGVyaXZlS2V5KHBhc3N3b3JkOnN0cmluZykgOlByb21pc2U8Q3J5cHRvS2V5PiB7XHJcblx0XHRjb25zdCBidWZmZXIgICAgID0gdXRmOEVuY29kZXIuZW5jb2RlKHBhc3N3b3JkKTtcclxuXHRcdGNvbnN0IGtleSAgICAgICAgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmltcG9ydEtleSgncmF3JywgYnVmZmVyLCB7bmFtZTogJ1BCS0RGMid9LCBmYWxzZSwgWydkZXJpdmVLZXknXSk7XHJcblx0XHRjb25zdCBwcml2YXRlS2V5ID0gY3J5cHRvLnN1YnRsZS5kZXJpdmVLZXkoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuYW1lOiAnUEJLREYyJyxcclxuXHRcdFx0XHRoYXNoOiB7bmFtZTogJ1NIQS0yNTYnfSxcclxuXHRcdFx0XHRpdGVyYXRpb25zLFxyXG5cdFx0XHRcdHNhbHRcclxuXHRcdFx0fSxcclxuXHRcdFx0a2V5LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bmFtZTogJ0FFUy1HQ00nLFxyXG5cdFx0XHRcdGxlbmd0aDogMjU2XHJcblx0XHRcdH0sXHJcblx0XHRcdGZhbHNlLFxyXG5cdFx0XHRbJ2VuY3J5cHQnLCAnZGVjcnlwdCddXHJcblx0XHQpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gcHJpdmF0ZUtleTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhc3luYyBlbmNyeXB0VG9CYXNlNjQodGV4dDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHJcblx0XHRjb25zdCBrZXkgPSBhd2FpdCB0aGlzLmRlcml2ZUtleShwYXNzd29yZCk7XHJcblx0XHRcclxuXHRcdGNvbnN0IHRleHRCeXRlc1RvRW5jcnlwdCA9IHV0ZjhFbmNvZGVyLmVuY29kZSh0ZXh0KTtcclxuXHRcdGNvbnN0IHZlY3RvciA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkodmVjdG9yU2l6ZSkpO1xyXG5cdFx0XHJcblx0XHQvLyBlbmNyeXB0IGludG8gYnl0ZXNcclxuXHRcdGNvbnN0IGVuY3J5cHRlZEJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoXHJcblx0XHRcdGF3YWl0IGNyeXB0by5zdWJ0bGUuZW5jcnlwdChcclxuXHRcdFx0XHR7bmFtZTogJ0FFUy1HQ00nLCBpdjogdmVjdG9yfSxcclxuXHRcdFx0XHRrZXksXHJcblx0XHRcdFx0dGV4dEJ5dGVzVG9FbmNyeXB0XHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0XHRcclxuXHRcdGNvbnN0IGZpbmFsQnl0ZXMgPSBuZXcgVWludDhBcnJheSggdmVjdG9yLmJ5dGVMZW5ndGggKyBlbmNyeXB0ZWRCeXRlcy5ieXRlTGVuZ3RoICk7XHJcblx0XHRmaW5hbEJ5dGVzLnNldCggdmVjdG9yLCAwICk7XHJcblx0XHRmaW5hbEJ5dGVzLnNldCggZW5jcnlwdGVkQnl0ZXMsIHZlY3Rvci5ieXRlTGVuZ3RoICk7XHJcblxyXG5cdFx0Ly9jb252ZXJ0IGFycmF5IHRvIGJhc2U2NFxyXG5cdFx0Y29uc3QgYmFzZTY0VGV4dCA9IGJ0b2EoIFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uZmluYWxCeXRlcykgKTtcclxuXHJcblx0XHRyZXR1cm4gYmFzZTY0VGV4dDtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc3RyaW5nVG9BcnJheShzdHI6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0cmVzdWx0LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ldyBVaW50OEFycmF5KHJlc3VsdCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgZGVjcnlwdEZyb21CYXNlNjQoYmFzZTY0RW5jb2RlZDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHRcdHRyeSB7XHJcblxyXG5cdFx0XHRsZXQgYnl0ZXNUb0RlY29kZSA9IHRoaXMuc3RyaW5nVG9BcnJheShhdG9iKGJhc2U2NEVuY29kZWQpKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIGV4dHJhY3QgaXZcclxuXHRcdFx0Y29uc3QgdmVjdG9yID0gYnl0ZXNUb0RlY29kZS5zbGljZSgwLHZlY3RvclNpemUpO1xyXG5cclxuXHRcdFx0Ly8gZXh0cmFjdCBlbmNyeXB0ZWQgdGV4dFxyXG5cdFx0XHRjb25zdCBlbmNyeXB0ZWRUZXh0Qnl0ZXMgPSBieXRlc1RvRGVjb2RlLnNsaWNlKHZlY3RvclNpemUpO1xyXG5cclxuXHRcdFx0Y29uc3Qga2V5ID0gYXdhaXQgdGhpcy5kZXJpdmVLZXkocGFzc3dvcmQpO1xyXG5cclxuXHRcdFx0Ly8gZGVjcnlwdCBpbnRvIGJ5dGVzXHJcblx0XHRcdGxldCBkZWNyeXB0ZWRCeXRlcyA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGVjcnlwdChcclxuXHRcdFx0XHR7bmFtZTogJ0FFUy1HQ00nLCBpdjogdmVjdG9yfSxcclxuXHRcdFx0XHRrZXksXHJcblx0XHRcdFx0ZW5jcnlwdGVkVGV4dEJ5dGVzXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHQvLyBjb252ZXJ0IGJ5dGVzIHRvIHRleHRcclxuXHRcdFx0bGV0IGRlY3J5cHRlZFRleHQgPSB1dGY4RGVjb2Rlci5kZWNvZGUoZGVjcnlwdGVkQnl0ZXMpO1xyXG5cdFx0XHRyZXR1cm4gZGVjcnlwdGVkVGV4dDtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Ly9jb25zb2xlLmVycm9yKGUpO1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59XHJcblxyXG5jb25zdCBhbGdvcml0aG1PYnNvbGV0ZSA9IHtcclxuXHRuYW1lOiAnQUVTLUdDTScsXHJcblx0aXY6IG5ldyBVaW50OEFycmF5KFsxOTYsIDE5MCwgMjQwLCAxOTAsIDE4OCwgNzgsIDQxLCAxMzIsIDE1LCAyMjAsIDg0LCAyMTFdKSxcclxuXHR0YWdMZW5ndGg6IDEyOFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ3J5cHRvSGVscGVyT2Jzb2xldGUge1xyXG5cclxuXHRwcml2YXRlIGFzeW5jIGJ1aWxkS2V5KHBhc3N3b3JkOiBzdHJpbmcpIHtcclxuXHRcdGxldCB1dGY4RW5jb2RlID0gbmV3IFRleHRFbmNvZGVyKCk7XHJcblx0XHRsZXQgcGFzc3dvcmRCeXRlcyA9IHV0ZjhFbmNvZGUuZW5jb2RlKHBhc3N3b3JkKTtcclxuXHJcblx0XHRsZXQgcGFzc3dvcmREaWdlc3QgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdCh7IG5hbWU6ICdTSEEtMjU2JyB9LCBwYXNzd29yZEJ5dGVzKTtcclxuXHJcblx0XHRsZXQga2V5ID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoXHJcblx0XHRcdCdyYXcnLFxyXG5cdFx0XHRwYXNzd29yZERpZ2VzdCxcclxuXHRcdFx0YWxnb3JpdGhtT2Jzb2xldGUsXHJcblx0XHRcdGZhbHNlLFxyXG5cdFx0XHRbJ2VuY3J5cHQnLCAnZGVjcnlwdCddXHJcblx0XHQpO1xyXG5cclxuXHRcdHJldHVybiBrZXk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgZW5jcnlwdFRvQmFzZTY0KHRleHQ6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcblx0XHRsZXQga2V5ID0gYXdhaXQgdGhpcy5idWlsZEtleShwYXNzd29yZCk7XHJcblxyXG5cdFx0bGV0IHV0ZjhFbmNvZGUgPSBuZXcgVGV4dEVuY29kZXIoKTtcclxuXHRcdGxldCBieXRlc1RvRW5jcnlwdCA9IHV0ZjhFbmNvZGUuZW5jb2RlKHRleHQpO1xyXG5cclxuXHRcdC8vIGVuY3J5cHQgaW50byBieXRlc1xyXG5cdFx0bGV0IGVuY3J5cHRlZEJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXdhaXQgY3J5cHRvLnN1YnRsZS5lbmNyeXB0KFxyXG5cdFx0XHRhbGdvcml0aG1PYnNvbGV0ZSwga2V5LCBieXRlc1RvRW5jcnlwdFxyXG5cdFx0KSk7XHJcblxyXG5cdFx0Ly9jb252ZXJ0IGFycmF5IHRvIGJhc2U2NFxyXG5cdFx0bGV0IGJhc2U2NFRleHQgPSBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uZW5jcnlwdGVkQnl0ZXMpKTtcclxuXHJcblx0XHRyZXR1cm4gYmFzZTY0VGV4dDtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc3RyaW5nVG9BcnJheShzdHI6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0cmVzdWx0LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5ldyBVaW50OEFycmF5KHJlc3VsdCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgZGVjcnlwdEZyb21CYXNlNjQoYmFzZTY0RW5jb2RlZDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdC8vIGNvbnZlcnQgYmFzZSA2NCB0byBhcnJheVxyXG5cdFx0XHRsZXQgYnl0ZXNUb0RlY3J5cHQgPSB0aGlzLnN0cmluZ1RvQXJyYXkoYXRvYihiYXNlNjRFbmNvZGVkKSk7XHJcblxyXG5cdFx0XHRsZXQga2V5ID0gYXdhaXQgdGhpcy5idWlsZEtleShwYXNzd29yZCk7XHJcblxyXG5cdFx0XHQvLyBkZWNyeXB0IGludG8gYnl0ZXNcclxuXHRcdFx0bGV0IGRlY3J5cHRlZEJ5dGVzID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5kZWNyeXB0KGFsZ29yaXRobU9ic29sZXRlLCBrZXksIGJ5dGVzVG9EZWNyeXB0KTtcclxuXHJcblx0XHRcdC8vIGNvbnZlcnQgYnl0ZXMgdG8gdGV4dFxyXG5cdFx0XHRsZXQgdXRmOERlY29kZSA9IG5ldyBUZXh0RGVjb2RlcigpO1xyXG5cdFx0XHRsZXQgZGVjcnlwdGVkVGV4dCA9IHV0ZjhEZWNvZGUuZGVjb2RlKGRlY3J5cHRlZEJ5dGVzKTtcclxuXHRcdFx0cmV0dXJuIGRlY3J5cHRlZFRleHQ7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCBNZWxkRW5jcnlwdCBmcm9tIFwiLi9tYWluXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZWxkRW5jcnlwdFNldHRpbmdzVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XHJcblx0cGx1Z2luOiBNZWxkRW5jcnlwdDtcclxuXHJcblx0cHdUaW1lb3V0U2V0dGluZzpTZXR0aW5nO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBNZWxkRW5jcnlwdCkge1xyXG5cdFx0c3VwZXIoYXBwLCBwbHVnaW4pO1xyXG5cdFx0dGhpcy5wbHVnaW4gPSBwbHVnaW47XHJcblx0fVxyXG5cclxuXHRkaXNwbGF5KCk6IHZvaWQge1xyXG5cdFx0bGV0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XHJcblxyXG5cdFx0Y29udGFpbmVyRWwuZW1wdHkoKTtcclxuXHRcdFxyXG5cdFx0Y29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywge3RleHQ6ICdTZXR0aW5ncyBmb3IgTWVsZCBFbmNyeXB0J30pO1xyXG5cclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ0V4cGFuZCBzZWxlY3Rpb24gdG8gd2hvbGUgbGluZT8nKVxyXG5cdFx0XHQuc2V0RGVzYygnUGFydGlhbCBzZWxlY3Rpb25zIHdpbGwgZ2V0IGV4cGFuZGVkIHRvIHRoZSB3aG9sZSBsaW5lLicpXHJcblx0XHRcdC5hZGRUb2dnbGUoIHRvZ2dsZSA9PntcclxuXHRcdFx0XHR0b2dnbGVcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5leHBhbmRUb1dob2xlTGluZXMpXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoIGFzeW5jIHZhbHVlID0+e1xyXG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5leHBhbmRUb1dob2xlTGluZXMgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHRcdC8vdGhpcy51cGRhdGVTZXR0aW5nc1VpKCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0O1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnQ29uZmlybSBwYXNzd29yZD8nKVxyXG5cdFx0XHQuc2V0RGVzYygnQ29uZmlybSBwYXNzd29yZCB3aGVuIGVuY3J5cHRpbmcuJylcclxuXHRcdFx0LmFkZFRvZ2dsZSggdG9nZ2xlID0+e1xyXG5cdFx0XHRcdHRvZ2dsZVxyXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1QYXNzd29yZClcclxuXHRcdFx0XHRcdC5vbkNoYW5nZSggYXN5bmMgdmFsdWUgPT57XHJcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1QYXNzd29yZCA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVTZXR0aW5nc1VpKCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHR9KVxyXG5cdFx0O1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnUmVtZW1iZXIgcGFzc3dvcmQ/JylcclxuXHRcdFx0LnNldERlc2MoJ1JlbWVtYmVyIHRoZSBsYXN0IHVzZWQgcGFzc3dvcmQgZm9yIHRoaXMgc2Vzc2lvbi4nKVxyXG5cdFx0XHQuYWRkVG9nZ2xlKCB0b2dnbGUgPT57XHJcblx0XHRcdFx0dG9nZ2xlXHJcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVtZW1iZXJQYXNzd29yZClcclxuXHRcdFx0XHRcdC5vbkNoYW5nZSggYXN5bmMgdmFsdWUgPT57XHJcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbWVtYmVyUGFzc3dvcmQgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlU2V0dGluZ3NVaSgpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdDtcclxuXHJcblx0XHR0aGlzLnB3VGltZW91dFNldHRpbmcgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoIHRoaXMuYnVpbGRQYXNzd29yZFRpbWVvdXRTZXR0aW5nTmFtZSgpIClcclxuXHRcdFx0LnNldERlc2MoJ1RoZSBudW1iZXIgb2YgbWludXRlcyB0byByZW1lbWJlciB0aGUgbGFzdCB1c2VkIHBhc3N3b3JkLicpXHJcblx0XHRcdC5hZGRTbGlkZXIoIHNsaWRlciA9PiB7XHJcblx0XHRcdFx0c2xpZGVyXHJcblx0XHRcdFx0XHQuc2V0TGltaXRzKDAsIDEyMCwgNSlcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW1lbWJlclBhc3N3b3JkVGltZW91dClcclxuXHRcdFx0XHRcdC5vbkNoYW5nZSggYXN5bmMgdmFsdWUgPT4ge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW1lbWJlclBhc3N3b3JkVGltZW91dCA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVTZXR0aW5nc1VpKCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdDtcclxuXHRcdFx0XHRcclxuXHRcdFx0fSlcclxuXHRcdDtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZVNldHRpbmdzVWkoKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZVNldHRpbmdzVWkoKTp2b2lke1xyXG5cdFx0dGhpcy5wd1RpbWVvdXRTZXR0aW5nLnNldE5hbWUodGhpcy5idWlsZFBhc3N3b3JkVGltZW91dFNldHRpbmdOYW1lKCkpO1xyXG5cclxuXHJcblx0XHRpZiAoIHRoaXMucGx1Z2luLnNldHRpbmdzLnJlbWVtYmVyUGFzc3dvcmQgKXtcclxuXHRcdFx0dGhpcy5wd1RpbWVvdXRTZXR0aW5nLnNldHRpbmdFbC5zaG93KCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhpcy5wd1RpbWVvdXRTZXR0aW5nLnNldHRpbmdFbC5oaWRlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRidWlsZFBhc3N3b3JkVGltZW91dFNldHRpbmdOYW1lKCk6c3RyaW5ne1xyXG5cdFx0Y29uc3QgdmFsdWUgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5yZW1lbWJlclBhc3N3b3JkVGltZW91dDtcclxuXHRcdGxldCB0aW1lb3V0U3RyaW5nID0gYCR7dmFsdWV9IG1pbnV0ZXNgO1xyXG5cdFx0aWYodmFsdWUgPT0gMCl7XHJcblx0XHRcdHRpbWVvdXRTdHJpbmcgPSAnTmV2ZXIgZm9yZ2V0JztcclxuXHRcdH1cclxuXHRcdHJldHVybiBgUmVtZW1iZXIgUGFzc3dvcmQgVGltZW91dCAoJHt0aW1lb3V0U3RyaW5nfSlgO1xyXG5cdH1cclxufSIsImltcG9ydCB7IE5vdGljZSwgUGx1Z2luLCBNYXJrZG93blZpZXcsIEVkaXRvciwgRWRpdG9yUG9zaXRpb24gfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCBEZWNyeXB0TW9kYWwgZnJvbSAnLi9EZWNyeXB0TW9kYWwnO1xyXG5pbXBvcnQgUGFzc3dvcmRNb2RhbCBmcm9tICcuL1Bhc3N3b3JkTW9kYWwnO1xyXG5pbXBvcnQgeyBDcnlwdG9IZWxwZXJWMiwgQ3J5cHRvSGVscGVyT2Jzb2xldGV9IGZyb20gJy4vQ3J5cHRvSGVscGVyJztcclxuaW1wb3J0IE1lbGRFbmNyeXB0U2V0dGluZ3NUYWIgZnJvbSAnLi9NZWxkRW5jcnlwdFNldHRpbmdzVGFiJztcclxuXHJcbmNvbnN0IF9QUkVGSVg6IHN0cmluZyA9ICclJfCflJAnO1xyXG5jb25zdCBfUFJFRklYX09CU09MRVRFOiBzdHJpbmcgPSBfUFJFRklYICsgJyAnO1xyXG5jb25zdCBfUFJFRklYX0E6IHN0cmluZyA9IF9QUkVGSVggKyAnzrEgJztcclxuY29uc3QgX1NVRkZJWDogc3RyaW5nID0gJyDwn5SQJSUnO1xyXG5cclxuY29uc3QgX0hJTlQ6IHN0cmluZyA9ICfwn5KhJztcclxuXHJcbmludGVyZmFjZSBNZWxkRW5jcnlwdFBsdWdpblNldHRpbmdzIHtcclxuXHRleHBhbmRUb1dob2xlTGluZXM6IGJvb2xlYW4sXHJcblx0Y29uZmlybVBhc3N3b3JkOiBib29sZWFuO1xyXG5cdHJlbWVtYmVyUGFzc3dvcmQ6IGJvb2xlYW47XHJcblx0cmVtZW1iZXJQYXNzd29yZFRpbWVvdXQ6IG51bWJlcjtcclxufVxyXG5cclxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogTWVsZEVuY3J5cHRQbHVnaW5TZXR0aW5ncyA9IHtcclxuXHRleHBhbmRUb1dob2xlTGluZXM6IHRydWUsXHJcblx0Y29uZmlybVBhc3N3b3JkOiB0cnVlLFxyXG5cdHJlbWVtYmVyUGFzc3dvcmQ6IHRydWUsXHJcblx0cmVtZW1iZXJQYXNzd29yZFRpbWVvdXQ6IDMwXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbGRFbmNyeXB0IGV4dGVuZHMgUGx1Z2luIHtcclxuXHJcblx0c2V0dGluZ3M6IE1lbGRFbmNyeXB0UGx1Z2luU2V0dGluZ3M7XHJcblx0cGFzc3dvcmRMYXN0VXNlZEV4cGlyeTogbnVtYmVyXHJcblx0cGFzc3dvcmRMYXN0VXNlZDogc3RyaW5nO1xyXG5cclxuXHRhc3luYyBvbmxvYWQoKSB7XHJcblxyXG5cdFx0YXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcclxuXHJcblx0XHR0aGlzLmFkZFNldHRpbmdUYWIobmV3IE1lbGRFbmNyeXB0U2V0dGluZ3NUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogJ21lbGQtZW5jcnlwdCcsXHJcblx0XHRcdG5hbWU6ICdFbmNyeXB0L0RlY3J5cHQnLFxyXG5cdFx0XHRlZGl0b3JDaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcsIGVkaXRvciwgdmlldykgPT4gdGhpcy5wcm9jZXNzRW5jcnlwdERlY3J5cHRDb21tYW5kKGNoZWNraW5nLCBlZGl0b3IsIHZpZXcsIGZhbHNlKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcclxuXHRcdFx0aWQ6ICdtZWxkLWVuY3J5cHQtaW4tcGxhY2UnLFxyXG5cdFx0XHRuYW1lOiAnRW5jcnlwdC9EZWNyeXB0IEluLXBsYWNlJyxcclxuXHRcdFx0ZWRpdG9yQ2hlY2tDYWxsYmFjazogKGNoZWNraW5nLCBlZGl0b3IsIHZpZXcpID0+IHRoaXMucHJvY2Vzc0VuY3J5cHREZWNyeXB0Q29tbWFuZChjaGVja2luZywgZWRpdG9yLCB2aWV3LCB0cnVlKVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcclxuXHRcdFx0aWQ6ICdtZWxkLWVuY3J5cHQtbm90ZScsXHJcblx0XHRcdG5hbWU6ICdFbmNyeXB0L0RlY3J5cHQgV2hvbGUgTm90ZScsXHJcblx0XHRcdGVkaXRvckNoZWNrQ2FsbGJhY2s6IChjaGVja2luZywgZWRpdG9yLCB2aWV3KSA9PiB0aGlzLnByb2Nlc3NFbmNyeXB0RGVjcnlwdFdob2xlTm90ZUNvbW1hbmQoY2hlY2tpbmcsIGVkaXRvciwgdmlldylcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcclxuXHRcdHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG5cdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cdGlzU2V0dGluZ3NNb2RhbE9wZW4oKSA6IGJvb2xlYW57XHJcblx0XHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZC1zZXR0aW5ncycpICE9PSBudWxsO1xyXG5cdH0gXHJcblxyXG5cdHByb2Nlc3NFbmNyeXB0RGVjcnlwdFdob2xlTm90ZUNvbW1hbmQoY2hlY2tpbmc6IGJvb2xlYW4sIGVkaXRvcjogRWRpdG9yLCB2aWV3OiBNYXJrZG93blZpZXcpOiBib29sZWFuIHtcclxuXHJcblx0XHRpZiAoIGNoZWNraW5nICYmIHRoaXMuaXNTZXR0aW5nc01vZGFsT3BlbigpICl7XHJcblx0XHRcdC8vIFNldHRpbmdzIGlzIG9wZW4sIGVuc3VyZXMgdGhpcyBjb21tYW5kIGNhbiBzaG93IHVwIGluIG90aGVyXHJcblx0XHRcdC8vIHBsdWdpbnMgd2hpY2ggbGlzdCBjb21tYW5kcyBlLmcuIGN1c3RvbWl6YWJsZS1zaWRlYmFyXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHN0YXJ0UG9zID0gZWRpdG9yLm9mZnNldFRvUG9zKDApO1xyXG5cdFx0Y29uc3QgZW5kUG9zID0geyBsaW5lOiBlZGl0b3IubGFzdExpbmUoKSwgY2g6IGVkaXRvci5nZXRMaW5lKGVkaXRvci5sYXN0TGluZSgpKS5sZW5ndGggfTtcclxuXHJcblx0XHRjb25zdCBzZWxlY3Rpb25UZXh0ID0gZWRpdG9yLmdldFJhbmdlKHN0YXJ0UG9zLCBlbmRQb3MpLnRyaW0oKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5wcm9jZXNzU2VsZWN0aW9uKFxyXG5cdFx0XHRjaGVja2luZyxcclxuXHRcdFx0ZWRpdG9yLFxyXG5cdFx0XHRzZWxlY3Rpb25UZXh0LFxyXG5cdFx0XHRzdGFydFBvcyxcclxuXHRcdFx0ZW5kUG9zLFxyXG5cdFx0XHR0cnVlXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0cHJvY2Vzc0VuY3J5cHREZWNyeXB0Q29tbWFuZChjaGVja2luZzogYm9vbGVhbiwgZWRpdG9yOiBFZGl0b3IsIHZpZXc6IE1hcmtkb3duVmlldywgZGVjcnlwdEluUGxhY2U6IGJvb2xlYW4pOiBib29sZWFuIHtcclxuXHRcdGlmICggY2hlY2tpbmcgJiYgdGhpcy5pc1NldHRpbmdzTW9kYWxPcGVuKCkgKXtcclxuXHRcdFx0Ly8gU2V0dGluZ3MgaXMgb3BlbiwgZW5zdXJlcyB0aGlzIGNvbW1hbmQgY2FuIHNob3cgdXAgaW4gb3RoZXJcclxuXHRcdFx0Ly8gcGx1Z2lucyB3aGljaCBsaXN0IGNvbW1hbmRzIGUuZy4gY3VzdG9taXphYmxlLXNpZGViYXJcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHN0YXJ0UG9zID0gZWRpdG9yLmdldEN1cnNvcignZnJvbScpO1xyXG5cdFx0bGV0IGVuZFBvcyA9IGVkaXRvci5nZXRDdXJzb3IoJ3RvJyk7XHJcblxyXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MuZXhwYW5kVG9XaG9sZUxpbmVzKXtcclxuXHRcdFx0Y29uc3Qgc3RhcnRMaW5lID0gc3RhcnRQb3MubGluZTtcclxuXHRcdFx0c3RhcnRQb3MgPSB7IGxpbmU6IHN0YXJ0TGluZSwgY2g6IDAgfTsgLy8gd2FudCB0aGUgc3RhcnQgb2YgdGhlIGZpcnN0IGxpbmVcclxuXHJcblx0XHRcdGNvbnN0IGVuZExpbmUgPSBlbmRQb3MubGluZTtcclxuXHRcdFx0Y29uc3QgZW5kTGluZVRleHQgPSBlZGl0b3IuZ2V0TGluZShlbmRMaW5lKTtcclxuXHRcdFx0ZW5kUG9zID0geyBsaW5lOiBlbmRMaW5lLCBjaDogZW5kTGluZVRleHQubGVuZ3RoIH07IC8vIHdhbnQgdGhlIGVuZCBvZiBsYXN0IGxpbmVcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRpZiAoICFlZGl0b3Iuc29tZXRoaW5nU2VsZWN0ZWQoKSApe1xyXG5cdFx0XHRcdC8vIG5vdGhpbmcgc2VsZWN0ZWQsIGFzc3VtZSB1c2VyIHdhbnRzIHRvIGRlY3J5cHQsIGV4cGFuZCB0byBzdGFydCBhbmQgZW5kIG1hcmtlcnNcclxuXHRcdFx0XHRzdGFydFBvcyA9IHRoaXMuZ2V0Q2xvc2VzdFByZXZUZXh0Q3Vyc29yUG9zKGVkaXRvciwgX1BSRUZJWCwgc3RhcnRQb3MgKTtcclxuXHRcdFx0XHRlbmRQb3MgPSB0aGlzLmdldENsb3Nlc3ROZXh0VGV4dEN1cnNvclBvcyhlZGl0b3IsIF9TVUZGSVgsIGVuZFBvcyApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgc2VsZWN0aW9uVGV4dCA9IGVkaXRvci5nZXRSYW5nZShzdGFydFBvcywgZW5kUG9zKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5wcm9jZXNzU2VsZWN0aW9uKFxyXG5cdFx0XHRjaGVja2luZyxcclxuXHRcdFx0ZWRpdG9yLFxyXG5cdFx0XHRzZWxlY3Rpb25UZXh0LFxyXG5cdFx0XHRzdGFydFBvcyxcclxuXHRcdFx0ZW5kUG9zLFxyXG5cdFx0XHRkZWNyeXB0SW5QbGFjZVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0Q2xvc2VzdFByZXZUZXh0Q3Vyc29yUG9zKGVkaXRvcjogRWRpdG9yLCB0ZXh0OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTpFZGl0b3JQb3NpdGlvbiApOiBFZGl0b3JQb3NpdGlvbntcclxuXHRcdGNvbnN0IGluaXRPZmZzZXQgPSBlZGl0b3IucG9zVG9PZmZzZXQoIGVkaXRvci5nZXRDdXJzb3IoXCJmcm9tXCIpICk7XHJcblxyXG5cdFx0Zm9yIChsZXQgb2Zmc2V0ID0gaW5pdE9mZnNldDsgb2Zmc2V0ID49IDA7IG9mZnNldC0tKSB7XHJcblx0XHRcdGNvbnN0IG9mZnNldFBvcyA9IGVkaXRvci5vZmZzZXRUb1BvcyhvZmZzZXQpO1xyXG5cdFx0XHRjb25zdCB0ZXh0RW5kT2Zmc2V0ID0gb2Zmc2V0ICsgdGV4dC5sZW5ndGg7XHJcblx0XHRcdGNvbnN0IHByZWZpeEVuZFBvcyA9IGVkaXRvci5vZmZzZXRUb1Bvcyh0ZXh0RW5kT2Zmc2V0KTtcclxuXHRcdFx0XHJcblx0XHRcdGNvbnN0IHRlc3RUZXh0ID0gZWRpdG9yLmdldFJhbmdlKCBvZmZzZXRQb3MsIHByZWZpeEVuZFBvcyApO1xyXG5cdFx0XHRpZiAodGVzdFRleHQgPT0gdGV4dCl7XHJcblx0XHRcdFx0cmV0dXJuIG9mZnNldFBvcztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkZWZhdWx0VmFsdWU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldENsb3Nlc3ROZXh0VGV4dEN1cnNvclBvcyhlZGl0b3I6IEVkaXRvciwgdGV4dDogc3RyaW5nLCBkZWZhdWx0VmFsdWU6RWRpdG9yUG9zaXRpb24gKTogRWRpdG9yUG9zaXRpb257XHJcblx0XHRjb25zdCBpbml0T2Zmc2V0ID0gZWRpdG9yLnBvc1RvT2Zmc2V0KCBlZGl0b3IuZ2V0Q3Vyc29yKFwiZnJvbVwiKSApO1xyXG5cdFx0XHJcblx0XHRsZXQgbWF4T2Zmc2V0ID0gZWRpdG9yLnBvc1RvT2Zmc2V0KCB7bGluZTplZGl0b3IubGFzdExpbmUoKSwgY2g6TnVtYmVyLk1BWF9WQUxVRX0gKTtcclxuXHJcblx0XHRmb3IgKGxldCBvZmZzZXQgPSBpbml0T2Zmc2V0OyBvZmZzZXQgPD0gbWF4T2Zmc2V0IC0gdGV4dC5sZW5ndGg7IG9mZnNldCsrKSB7XHJcblx0XHRcdGNvbnN0IG9mZnNldFBvcyA9IGVkaXRvci5vZmZzZXRUb1BvcyhvZmZzZXQpO1xyXG5cdFx0XHRjb25zdCB0ZXh0RW5kT2Zmc2V0ID0gb2Zmc2V0ICsgdGV4dC5sZW5ndGg7XHJcblx0XHRcdGNvbnN0IHByZWZpeEVuZFBvcyA9IGVkaXRvci5vZmZzZXRUb1Bvcyh0ZXh0RW5kT2Zmc2V0KTtcclxuXHRcdFx0XHJcblx0XHRcdGNvbnN0IHRlc3RUZXh0ID0gZWRpdG9yLmdldFJhbmdlKCBvZmZzZXRQb3MsIHByZWZpeEVuZFBvcyApO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHRlc3RUZXh0ID09IHRleHQpe1xyXG5cdFx0XHRcdHJldHVybiBwcmVmaXhFbmRQb3M7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGRlZmF1bHRWYWx1ZTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgYW5hbHlzZVNlbGVjdGlvbiggc2VsZWN0aW9uVGV4dDogc3RyaW5nICk6U2VsZWN0aW9uQW5hbHlzaXN7XHJcblx0XHRcclxuXHRcdGNvbnN0IHJlc3VsdCA9IG5ldyBTZWxlY3Rpb25BbmFseXNpcygpO1xyXG5cclxuXHRcdHJlc3VsdC5pc0VtcHR5ID0gc2VsZWN0aW9uVGV4dC5sZW5ndGggPT09IDA7XHJcblxyXG5cdFx0cmVzdWx0Lmhhc09ic29sZXRlRW5jcnlwdGVkUHJlZml4ID0gc2VsZWN0aW9uVGV4dC5zdGFydHNXaXRoKF9QUkVGSVhfT0JTT0xFVEUpO1xyXG5cdFx0cmVzdWx0Lmhhc0VuY3J5cHRlZFByZWZpeCA9IHJlc3VsdC5oYXNPYnNvbGV0ZUVuY3J5cHRlZFByZWZpeCB8fCBzZWxlY3Rpb25UZXh0LnN0YXJ0c1dpdGgoX1BSRUZJWF9BKTtcclxuXHJcblx0XHRyZXN1bHQuaGFzRGVjcnlwdFN1ZmZpeCA9IHNlbGVjdGlvblRleHQuZW5kc1dpdGgoX1NVRkZJWCk7XHJcblxyXG5cdFx0cmVzdWx0LmNvbnRhaW5zRW5jcnlwdGVkTWFya2VycyA9XHJcblx0XHRcdHNlbGVjdGlvblRleHQuY29udGFpbnMoX1BSRUZJWF9PQlNPTEVURSlcclxuXHRcdFx0fHwgc2VsZWN0aW9uVGV4dC5jb250YWlucyhfUFJFRklYX0EpXHJcblx0XHRcdHx8IHNlbGVjdGlvblRleHQuY29udGFpbnMoX1NVRkZJWClcclxuXHRcdDtcclxuXHJcblx0XHRyZXN1bHQuY2FuRGVjcnlwdCA9IHJlc3VsdC5oYXNFbmNyeXB0ZWRQcmVmaXggJiYgcmVzdWx0Lmhhc0RlY3J5cHRTdWZmaXg7XHJcblx0XHRyZXN1bHQuY2FuRW5jcnlwdCA9ICFyZXN1bHQuaGFzRW5jcnlwdGVkUHJlZml4ICYmICFyZXN1bHQuY29udGFpbnNFbmNyeXB0ZWRNYXJrZXJzO1xyXG5cdFx0XHJcblx0XHRpZiAocmVzdWx0LmNhbkRlY3J5cHQpe1xyXG5cdFx0XHRyZXN1bHQuZGVjcnlwdGFibGUgPSB0aGlzLnBhcnNlRGVjcnlwdGFibGVDb250ZW50KHNlbGVjdGlvblRleHQpO1xyXG5cdFx0XHRpZiAocmVzdWx0LmRlY3J5cHRhYmxlID09IG51bGwpe1xyXG5cdFx0XHRcdHJlc3VsdC5jYW5EZWNyeXB0ID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBwcm9jZXNzU2VsZWN0aW9uKFxyXG5cdFx0Y2hlY2tpbmc6IGJvb2xlYW4sXHJcblx0XHRlZGl0b3I6IEVkaXRvcixcclxuXHRcdHNlbGVjdGlvblRleHQ6IHN0cmluZyxcclxuXHRcdGZpbmFsU2VsZWN0aW9uU3RhcnQ6IENvZGVNaXJyb3IuUG9zaXRpb24sXHJcblx0XHRmaW5hbFNlbGVjdGlvbkVuZDogQ29kZU1pcnJvci5Qb3NpdGlvbixcclxuXHRcdGRlY3J5cHRJblBsYWNlOiBib29sZWFuXHJcblx0KXtcclxuXHJcblx0XHRjb25zdCBzZWxlY3Rpb25BbmFseXNpcyA9IHRoaXMuYW5hbHlzZVNlbGVjdGlvbihzZWxlY3Rpb25UZXh0KTtcclxuXHJcblx0XHRpZiAoc2VsZWN0aW9uQW5hbHlzaXMuaXNFbXB0eSkge1xyXG5cdFx0XHRpZiAoIWNoZWNraW5nKXtcclxuXHRcdFx0XHRuZXcgTm90aWNlKCdOb3RoaW5nIHRvIEVuY3J5cHQuJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghc2VsZWN0aW9uQW5hbHlzaXMuY2FuRGVjcnlwdCAmJiAhc2VsZWN0aW9uQW5hbHlzaXMuY2FuRW5jcnlwdCkge1xyXG5cdFx0XHRpZiAoIWNoZWNraW5nKXtcclxuXHRcdFx0XHRuZXcgTm90aWNlKCdVbmFibGUgdG8gRW5jcnlwdCBvciBEZWNyeXB0IHRoYXQuJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChjaGVja2luZykge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBGZXRjaCBwYXNzd29yZCBmcm9tIHVzZXJcclxuXHJcblx0XHQvLyBkZXRlcm1pbmUgZGVmYXVsdCBwYXNzd29yZFxyXG5cdFx0Y29uc3QgaXNSZW1lbWJlclBhc3N3b3JkRXhwaXJlZCA9XHJcblx0XHRcdCF0aGlzLnNldHRpbmdzLnJlbWVtYmVyUGFzc3dvcmRcclxuXHRcdFx0fHwgKFxyXG5cdFx0XHRcdHRoaXMucGFzc3dvcmRMYXN0VXNlZEV4cGlyeSAhPSBudWxsXHJcblx0XHRcdFx0JiYgRGF0ZS5ub3coKSA+IHRoaXMucGFzc3dvcmRMYXN0VXNlZEV4cGlyeVxyXG5cdFx0XHQpXHJcblx0XHQ7XHJcblxyXG5cdFx0Y29uc3QgY29uZmlybVBhc3N3b3JkID0gc2VsZWN0aW9uQW5hbHlzaXMuY2FuRW5jcnlwdCAmJiB0aGlzLnNldHRpbmdzLmNvbmZpcm1QYXNzd29yZDtcclxuXHJcblx0XHRpZiAoIGlzUmVtZW1iZXJQYXNzd29yZEV4cGlyZWQgfHwgY29uZmlybVBhc3N3b3JkICkge1xyXG5cdFx0XHQvLyBmb3JnZXQgcGFzc3dvcmRcclxuXHRcdFx0dGhpcy5wYXNzd29yZExhc3RVc2VkID0gJyc7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcHdNb2RhbCA9IG5ldyBQYXNzd29yZE1vZGFsKFxyXG5cdFx0XHR0aGlzLmFwcCxcclxuXHRcdFx0c2VsZWN0aW9uQW5hbHlzaXMuY2FuRW5jcnlwdCxcclxuXHRcdFx0Y29uZmlybVBhc3N3b3JkLFxyXG5cdFx0XHR0aGlzLnBhc3N3b3JkTGFzdFVzZWQsXHJcblx0XHRcdHNlbGVjdGlvbkFuYWx5c2lzLmRlY3J5cHRhYmxlPy5oaW50XHJcblx0XHQpO1xyXG5cdFx0cHdNb2RhbC5vbkNsb3NlID0gKCkgPT4ge1xyXG5cdFx0XHRjb25zdCBwdyA9IHB3TW9kYWwucGFzc3dvcmQgPz8gJydcclxuXHRcdFx0aWYgKHB3Lmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IGhpbnQgPSBwd01vZGFsLmhpbnQ7XHJcblxyXG5cdFx0XHQvLyByZW1lbWJlciBwYXNzd29yZD9cclxuXHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MucmVtZW1iZXJQYXNzd29yZCkge1xyXG5cdFx0XHRcdHRoaXMucGFzc3dvcmRMYXN0VXNlZCA9IHB3O1xyXG5cdFx0XHRcdHRoaXMucGFzc3dvcmRMYXN0VXNlZEV4cGlyeSA9XHJcblx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLnJlbWVtYmVyUGFzc3dvcmRUaW1lb3V0ID09IDBcclxuXHRcdFx0XHRcdFx0PyBudWxsXHJcblx0XHRcdFx0XHRcdDogRGF0ZS5ub3coKSArIHRoaXMuc2V0dGluZ3MucmVtZW1iZXJQYXNzd29yZFRpbWVvdXQgKiAxMDAwICogNjAvLyBuZXcgZXhwaXJ5XHJcblx0XHRcdFx0XHQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChzZWxlY3Rpb25BbmFseXNpcy5jYW5FbmNyeXB0KSB7XHJcblx0XHRcdFx0Y29uc3QgZW5jcnlwdGFibGUgPSBuZXcgRW5jcnlwdGFibGUoKTtcclxuXHRcdFx0XHRlbmNyeXB0YWJsZS50ZXh0ID0gc2VsZWN0aW9uVGV4dDtcclxuXHRcdFx0XHRlbmNyeXB0YWJsZS5oaW50ID0gaGludDtcclxuXHJcblx0XHRcdFx0dGhpcy5lbmNyeXB0U2VsZWN0aW9uKFxyXG5cdFx0XHRcdFx0ZWRpdG9yLFxyXG5cdFx0XHRcdFx0ZW5jcnlwdGFibGUsXHJcblx0XHRcdFx0XHRwdyxcclxuXHRcdFx0XHRcdGZpbmFsU2VsZWN0aW9uU3RhcnQsXHJcblx0XHRcdFx0XHRmaW5hbFNlbGVjdGlvbkVuZFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdGlmIChzZWxlY3Rpb25BbmFseXNpcy5kZWNyeXB0YWJsZS52ZXJzaW9uID09IDEpe1xyXG5cdFx0XHRcdFx0dGhpcy5kZWNyeXB0U2VsZWN0aW9uX2EoXHJcblx0XHRcdFx0XHRcdGVkaXRvcixcclxuXHRcdFx0XHRcdFx0c2VsZWN0aW9uQW5hbHlzaXMuZGVjcnlwdGFibGUsXHJcblx0XHRcdFx0XHRcdHB3LFxyXG5cdFx0XHRcdFx0XHRmaW5hbFNlbGVjdGlvblN0YXJ0LFxyXG5cdFx0XHRcdFx0XHRmaW5hbFNlbGVjdGlvbkVuZCxcclxuXHRcdFx0XHRcdFx0ZGVjcnlwdEluUGxhY2VcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR0aGlzLmRlY3J5cHRTZWxlY3Rpb25PYnNvbGV0ZShcclxuXHRcdFx0XHRcdFx0ZWRpdG9yLFxyXG5cdFx0XHRcdFx0XHRzZWxlY3Rpb25BbmFseXNpcy5kZWNyeXB0YWJsZSxcclxuXHRcdFx0XHRcdFx0cHcsXHJcblx0XHRcdFx0XHRcdGZpbmFsU2VsZWN0aW9uU3RhcnQsXHJcblx0XHRcdFx0XHRcdGZpbmFsU2VsZWN0aW9uRW5kLFxyXG5cdFx0XHRcdFx0XHRkZWNyeXB0SW5QbGFjZVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHB3TW9kYWwub3BlbigpO1xyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBhc3luYyBlbmNyeXB0U2VsZWN0aW9uKFxyXG5cdFx0ZWRpdG9yOiBFZGl0b3IsXHJcblx0XHRlbmNyeXB0YWJsZTogRW5jcnlwdGFibGUsXHJcblx0XHRwYXNzd29yZDogc3RyaW5nLFxyXG5cdFx0ZmluYWxTZWxlY3Rpb25TdGFydDogQ29kZU1pcnJvci5Qb3NpdGlvbixcclxuXHRcdGZpbmFsU2VsZWN0aW9uRW5kOiBDb2RlTWlycm9yLlBvc2l0aW9uLFxyXG5cdCkge1xyXG5cdFx0Ly9lbmNyeXB0XHJcblx0XHRjb25zdCBjcnlwdG8gPSBuZXcgQ3J5cHRvSGVscGVyVjIoKTtcclxuXHRcdGNvbnN0IGVuY29kZWRUZXh0ID0gdGhpcy5lbmNvZGVFbmNyeXB0aW9uKFxyXG5cdFx0XHRhd2FpdCBjcnlwdG8uZW5jcnlwdFRvQmFzZTY0KGVuY3J5cHRhYmxlLnRleHQsIHBhc3N3b3JkKSxcclxuXHRcdFx0ZW5jcnlwdGFibGUuaGludFxyXG5cdFx0KTtcclxuXHRcdGVkaXRvci5zZXRTZWxlY3Rpb24oZmluYWxTZWxlY3Rpb25TdGFydCwgZmluYWxTZWxlY3Rpb25FbmQpO1xyXG5cdFx0ZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24oZW5jb2RlZFRleHQpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBhc3luYyBkZWNyeXB0U2VsZWN0aW9uX2EoXHJcblx0XHRlZGl0b3I6IEVkaXRvcixcclxuXHRcdGRlY3J5cHRhYmxlOiBEZWNyeXB0YWJsZSxcclxuXHRcdHBhc3N3b3JkOiBzdHJpbmcsXHJcblx0XHRzZWxlY3Rpb25TdGFydDogQ29kZU1pcnJvci5Qb3NpdGlvbixcclxuXHRcdHNlbGVjdGlvbkVuZDogQ29kZU1pcnJvci5Qb3NpdGlvbixcclxuXHRcdGRlY3J5cHRJblBsYWNlOiBib29sZWFuXHJcblx0KSB7XHJcblx0XHQvLyBkZWNyeXB0XHJcblxyXG5cdFx0Y29uc3QgY3J5cHRvID0gbmV3IENyeXB0b0hlbHBlclYyKCk7XHJcblx0XHRjb25zdCBkZWNyeXB0ZWRUZXh0ID0gYXdhaXQgY3J5cHRvLmRlY3J5cHRGcm9tQmFzZTY0KGRlY3J5cHRhYmxlLmJhc2U2NENpcGhlclRleHQsIHBhc3N3b3JkKTtcclxuXHRcdGlmIChkZWNyeXB0ZWRUZXh0ID09PSBudWxsKSB7XHJcblx0XHRcdG5ldyBOb3RpY2UoJ+KdjCBEZWNyeXB0aW9uIGZhaWxlZCEnKTtcclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRpZiAoZGVjcnlwdEluUGxhY2UpIHtcclxuXHRcdFx0XHRlZGl0b3Iuc2V0U2VsZWN0aW9uKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpO1xyXG5cdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKGRlY3J5cHRlZFRleHQpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnN0IGRlY3J5cHRNb2RhbCA9IG5ldyBEZWNyeXB0TW9kYWwodGhpcy5hcHAsICfwn5STJywgZGVjcnlwdGVkVGV4dCk7XHJcblx0XHRcdFx0ZGVjcnlwdE1vZGFsLm9uQ2xvc2UgPSAoKSA9PiB7XHJcblx0XHRcdFx0XHRlZGl0b3IuZm9jdXMoKTtcclxuXHRcdFx0XHRcdGlmIChkZWNyeXB0TW9kYWwuZGVjcnlwdEluUGxhY2UpIHtcclxuXHRcdFx0XHRcdFx0ZWRpdG9yLnNldFNlbGVjdGlvbihzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKTtcclxuXHRcdFx0XHRcdFx0ZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24oZGVjcnlwdGVkVGV4dCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRlY3J5cHRNb2RhbC5vcGVuKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgYXN5bmMgZGVjcnlwdFNlbGVjdGlvbk9ic29sZXRlKFxyXG5cdFx0ZWRpdG9yOiBFZGl0b3IsXHJcblx0XHRkZWNyeXB0YWJsZTogRGVjcnlwdGFibGUsXHJcblx0XHRwYXNzd29yZDogc3RyaW5nLFxyXG5cdFx0c2VsZWN0aW9uU3RhcnQ6IENvZGVNaXJyb3IuUG9zaXRpb24sXHJcblx0XHRzZWxlY3Rpb25FbmQ6IENvZGVNaXJyb3IuUG9zaXRpb24sXHJcblx0XHRkZWNyeXB0SW5QbGFjZTogYm9vbGVhblxyXG5cdCkge1xyXG5cdFx0Ly8gZGVjcnlwdFxyXG5cdFx0Y29uc3QgYmFzZTY0Q2lwaGVyVGV4dCA9IHRoaXMucmVtb3ZlTWFya2VycyhkZWNyeXB0YWJsZS5iYXNlNjRDaXBoZXJUZXh0KTtcclxuXHRcdGNvbnN0IGNyeXB0byA9IG5ldyBDcnlwdG9IZWxwZXJPYnNvbGV0ZSgpO1xyXG5cdFx0Y29uc3QgZGVjcnlwdGVkVGV4dCA9IGF3YWl0IGNyeXB0by5kZWNyeXB0RnJvbUJhc2U2NChiYXNlNjRDaXBoZXJUZXh0LCBwYXNzd29yZCk7XHJcblx0XHRpZiAoZGVjcnlwdGVkVGV4dCA9PT0gbnVsbCkge1xyXG5cdFx0XHRuZXcgTm90aWNlKCfinYwgRGVjcnlwdGlvbiBmYWlsZWQhJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0aWYgKGRlY3J5cHRJblBsYWNlKSB7XHJcblx0XHRcdFx0ZWRpdG9yLnNldFNlbGVjdGlvbihzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKTtcclxuXHRcdFx0XHRlZGl0b3IucmVwbGFjZVNlbGVjdGlvbihkZWNyeXB0ZWRUZXh0KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zdCBkZWNyeXB0TW9kYWwgPSBuZXcgRGVjcnlwdE1vZGFsKHRoaXMuYXBwLCAn8J+UkycsIGRlY3J5cHRlZFRleHQpO1xyXG5cdFx0XHRcdGRlY3J5cHRNb2RhbC5vbkNsb3NlID0gKCkgPT4ge1xyXG5cdFx0XHRcdFx0ZWRpdG9yLmZvY3VzKCk7XHJcblx0XHRcdFx0XHRpZiAoZGVjcnlwdE1vZGFsLmRlY3J5cHRJblBsYWNlKSB7XHJcblx0XHRcdFx0XHRcdGVkaXRvci5zZXRTZWxlY3Rpb24oc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCk7XHJcblx0XHRcdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKGRlY3J5cHRlZFRleHQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkZWNyeXB0TW9kYWwub3BlbigpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHBhcnNlRGVjcnlwdGFibGVDb250ZW50KHRleHQ6IHN0cmluZykgOiBEZWNyeXB0YWJsZXtcclxuXHRcdGNvbnN0IHJlc3VsdCA9IG5ldyBEZWNyeXB0YWJsZSgpO1xyXG5cclxuXHRcdGxldCBjb250ZW50ID0gdGV4dDtcclxuXHRcdGlmIChjb250ZW50LnN0YXJ0c1dpdGgoX1BSRUZJWF9BKSAmJiBjb250ZW50LmVuZHNXaXRoKF9TVUZGSVgpKSB7XHJcblx0XHRcdHJlc3VsdC52ZXJzaW9uPTE7XHJcblx0XHRcdGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoX1BSRUZJWF9BLCAnJykucmVwbGFjZShfU1VGRklYLCAnJyk7XHJcblx0XHR9ZWxzZSBpZiAoY29udGVudC5zdGFydHNXaXRoKF9QUkVGSVhfT0JTT0xFVEUpICYmIGNvbnRlbnQuZW5kc1dpdGgoX1NVRkZJWCkpIHtcclxuXHRcdFx0cmVzdWx0LnZlcnNpb249MDtcclxuXHRcdFx0Y29udGVudCA9IGNvbnRlbnQucmVwbGFjZShfUFJFRklYX09CU09MRVRFLCAnJykucmVwbGFjZShfU1VGRklYLCAnJyk7XHJcblx0XHR9ZWxzZSB7XHJcblx0XHRcdHJldHVybiBudWxsOyAvLyBpbnZhbGlkIGZvcm1hdFxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNoZWNrIGlmIHRoZXJlIGlzIGEgaGludFxyXG5cdFx0Ly9jb25zb2xlLnRhYmxlKGNvbnRlbnQpO1xyXG5cdFx0aWYgKGNvbnRlbnQuc3Vic3RyKDAsX0hJTlQubGVuZ3RoKSA9PSBfSElOVCl7XHJcblx0XHRcdGNvbnN0IGVuZEhpbnRNYXJrZXIgPSBjb250ZW50LmluZGV4T2YoX0hJTlQsX0hJTlQubGVuZ3RoKTtcclxuXHRcdFx0aWYgKGVuZEhpbnRNYXJrZXI8MCl7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7IC8vIGludmFsaWQgZm9ybWF0XHJcblx0XHRcdH1cclxuXHRcdFx0cmVzdWx0LmhpbnQgPSBjb250ZW50LnN1YnN0cmluZyhfSElOVC5sZW5ndGgsZW5kSGludE1hcmtlcilcclxuXHRcdFx0cmVzdWx0LmJhc2U2NENpcGhlclRleHQgPSBjb250ZW50LnN1YnN0cmluZyhlbmRIaW50TWFya2VyK19ISU5ULmxlbmd0aCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmVzdWx0LmJhc2U2NENpcGhlclRleHQgPSBjb250ZW50O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvL2NvbnNvbGUudGFibGUocmVzdWx0KTtcclxuXHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgcmVtb3ZlTWFya2Vycyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdFx0aWYgKHRleHQuc3RhcnRzV2l0aChfUFJFRklYX0EpICYmIHRleHQuZW5kc1dpdGgoX1NVRkZJWCkpIHtcclxuXHRcdFx0cmV0dXJuIHRleHQucmVwbGFjZShfUFJFRklYX0EsICcnKS5yZXBsYWNlKF9TVUZGSVgsICcnKTtcclxuXHRcdH1cclxuXHRcdGlmICh0ZXh0LnN0YXJ0c1dpdGgoX1BSRUZJWF9PQlNPTEVURSkgJiYgdGV4dC5lbmRzV2l0aChfU1VGRklYKSkge1xyXG5cdFx0XHRyZXR1cm4gdGV4dC5yZXBsYWNlKF9QUkVGSVhfT0JTT0xFVEUsICcnKS5yZXBsYWNlKF9TVUZGSVgsICcnKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0ZXh0O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBlbmNvZGVFbmNyeXB0aW9uKCBlbmNyeXB0ZWRUZXh0OiBzdHJpbmcsIGhpbnQ6IHN0cmluZyApOiBzdHJpbmcge1xyXG5cdFx0aWYgKCFlbmNyeXB0ZWRUZXh0LmNvbnRhaW5zKF9QUkVGSVhfT0JTT0xFVEUpICYmICFlbmNyeXB0ZWRUZXh0LmNvbnRhaW5zKF9QUkVGSVhfQSkgJiYgIWVuY3J5cHRlZFRleHQuY29udGFpbnMoX1NVRkZJWCkpIHtcclxuXHRcdFx0aWYgKGhpbnQpe1xyXG5cdFx0XHRcdHJldHVybiBfUFJFRklYX0EuY29uY2F0KF9ISU5ULCBoaW50LCBfSElOVCwgZW5jcnlwdGVkVGV4dCwgX1NVRkZJWCk7XHRcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gX1BSRUZJWF9BLmNvbmNhdChlbmNyeXB0ZWRUZXh0LCBfU1VGRklYKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBlbmNyeXB0ZWRUZXh0O1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIFNlbGVjdGlvbkFuYWx5c2lze1xyXG5cdGlzRW1wdHk6IGJvb2xlYW47XHJcblx0aGFzT2Jzb2xldGVFbmNyeXB0ZWRQcmVmaXg6IGJvb2xlYW47XHJcblx0aGFzRW5jcnlwdGVkUHJlZml4OiBib29sZWFuO1xyXG5cdGhhc0RlY3J5cHRTdWZmaXg6IGJvb2xlYW47XHJcblx0Y2FuRGVjcnlwdDogYm9vbGVhbjtcclxuXHRjYW5FbmNyeXB0OiBib29sZWFuO1xyXG5cdGNvbnRhaW5zRW5jcnlwdGVkTWFya2VyczogYm9vbGVhbjtcclxuXHRkZWNyeXB0YWJsZSA6IERlY3J5cHRhYmxlO1xyXG59XHJcblxyXG5jbGFzcyBFbmNyeXB0YWJsZXtcclxuXHR0ZXh0OnN0cmluZztcclxuXHRoaW50OnN0cmluZztcclxufVxyXG5cclxuY2xhc3MgRGVjcnlwdGFibGV7XHJcblx0dmVyc2lvbjogbnVtYmVyO1xyXG5cdGJhc2U2NENpcGhlclRleHQ6c3RyaW5nO1xyXG5cdGhpbnQ6c3RyaW5nO1xyXG59Il0sIm5hbWVzIjpbIk1vZGFsIiwiUGxhdGZvcm0iLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIlBsdWdpbiIsIk5vdGljZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFB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
