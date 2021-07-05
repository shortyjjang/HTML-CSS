import MediumEditor from 'medium-editor';

const Anchor = MediumEditor.extensions.form.extend({
    /* Anchor Form Options */

    /* customClassOption: [string]  (previously options.anchorButton + options.anchorButtonClass)
      * Custom class name the user can optionally have added to their created links (ie 'button').
      * If passed as a non-empty string, a checkbox will be displayed allowing the user to choose
      * whether to have the class added to the created link or not.
      */
    customClassOption: null,

    /* customClassOptionText: [string]
      * text to be shown in the checkbox when the __customClassOption__ is being used.
      */
    customClassOptionText: 'Button',

    /* linkValidation: [boolean]  (previously options.checkLinkFormat)
      * enables/disables check for common URL protocols on anchor links.
      */
    linkValidation: false,

    /* placeholderText: [string]  (previously options.anchorInputPlaceholder)
      * text to be shown as placeholder of the anchor input.
      */
    placeholderText: 'http://',

    /* targetCheckbox: [boolean]  (previously options.anchorTarget)
      * enables/disables displaying a "Open in new window" checkbox, which when checked
      * changes the `target` attribute of the created link.
      */
    targetCheckbox: false,

    /* targetCheckboxText: [string]  (previously options.anchorInputCheckboxLabel)
      * text to be shown in the checkbox enabled via the __targetCheckbox__ option.
      */
    targetCheckboxText: 'Open in new window',

    // Options for the Button base class
    name: 'anchor2',
    action: 'createLink',
    aria: 'link',
    tagNames: ['a'],
    contentDefault: '<b>#</b>',
    contentFA: '<i class="fa fa-link"></i>',

    activeAnchor: null,

    init: function () {
        MediumEditor.extensions.form.prototype.init.apply(this, arguments);

        this.subscribe('editableKeydown', this.handleKeydown.bind(this));
        this.subscribe('hideToolbar', this.handleHideToolbar.bind(this));
    },

    handleHideToolbar() {
        var val = this.getInput().value
        if (val.trim() === '') {
            if (this.activeAnchor) {
                var parent = this.activeAnchor.parentElement;
                if (parent) {
                    $(this.activeAnchor).replaceWith(this.activeAnchor.textContent)
                    parent.normalize()
                    this.activeAnchor.remove()
                }
                this.activeAnchor = null
            }
        } else {
            this.activeAnchor.setAttribute('href', this.checkLinkFormat(val))
            this.activeAnchor.className = ''
            this.activeAnchor = null
        }
    },
    // Called when the button the toolbar is clicked
    // Overrides ButtonExtension.handleClick
    handleClick: function (event) {
        event.preventDefault();
        event.stopPropagation();
        if ($('.medium-editor-action-quote2.medium-editor-button-active').length > 0) {
            return false;
        }

        var range = MediumEditor.selection.getSelectionRange(this.document);
        if (range.startOffset === range.endOffset) { // Nothing selected.
            this.base.restoreSelection();
            range = MediumEditor.selection.getSelectionRange(this.document);
        }

        if (range.startContainer.nodeName.toLowerCase() === 'a' ||
            range.endContainer.nodeName.toLowerCase() === 'a' ||
            MediumEditor.util.getClosestTag(MediumEditor.selection.getSelectedParentElement(range), 'a')) {
            // return this.execAction('unlink');
            this.initiatedFormDisplay(true);
        }

        if (!this.isDisplayed()) {
            this.initiatedFormDisplay(false);
        }

        return false;
    },

    initiatedFormDisplay(edit) {
        if (edit) {
            var $editing = $('.medium-insert-active a')
            this.showForm({ value: $editing.attr('href') });
            this.base.restoreSelection(); // this part is overrided from original
            $editing.addClass('active-anchor');
        } else {
            this.showForm();
            this.base.restoreSelection(); // this part is overrided from original
            this.base.createLink(this.createTempOpt())
        }
        this.activeAnchor = null;
        this.activeAnchor = this.getActiveAnchor();
    },

    activeAnchorClassName: 'active-anchor',
    createTempOpt() {
        var opts = this.getFormOpts('#')
        opts.buttonClass = this.activeAnchorClassName
        return opts
    },

    getActiveAnchor() {
        return this.activeAnchor || this.document.querySelector('.' + this.activeAnchorClassName);
    },

    // Called when user hits the defined shortcut (CTRL / COMMAND + K)
    handleKeydown: function (event) {
        if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.K) && MediumEditor.util.isMetaCtrlKey(event) && !event.shiftKey) {
            this.handleClick(event);
        }
    },

    // Called by medium-editor to append form to the toolbar
    getForm: function () {
        if (!this.form) {
            this.form = this.createForm();
        }
        return this.form;
    },

    getTemplate: function () {
        var template = [
            '<input type="text" class="medium-editor-toolbar-input" placeholder="', this.placeholderText, '">'
        ];

        template.push(
            '<a href="#" class="medium-editor-toolbar-save">',
            this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-check"></i>' : this.formSaveLabel,
            '</a>'
        );

        template.push('<a href="#" class="medium-editor-toolbar-close">',
            this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel,
            '</a>');

        // both of these options are slightly moot with the ability to
        // override the various form buildup/serialize functions.

        if (this.targetCheckbox) {
            // fixme: ideally, this targetCheckboxText would be a formLabel too,
            // figure out how to deprecate? also consider `fa-` icon default implcations.
            template.push(
                '<div class="medium-editor-toolbar-form-row">',
                '<input type="checkbox" class="medium-editor-toolbar-anchor-target">',
                '<label>',
                this.targetCheckboxText,
                '</label>',
                '</div>'
            );
        }

        if (this.customClassOption) {
            // fixme: expose this `Button` text as a formLabel property, too
            // and provide similar access to a `fa-` icon default.
            template.push(
                '<div class="medium-editor-toolbar-form-row">',
                '<input type="checkbox" class="medium-editor-toolbar-anchor-button">',
                '<label>',
                this.customClassOptionText,
                '</label>',
                '</div>'
            );
        }

        return template.join('');

    },

    // Used by medium-editor when the default toolbar is to be displayed
    isDisplayed: function () {
        return MediumEditor.extensions.form.prototype.isDisplayed.apply(this);
    },

    hideToolbarDefaultActions: function () {
        var toolbar = this.base.getExtensionByName('toolbar');
        if (toolbar) {
            toolbar.hideToolbarDefaultActions();
        }
    },

    hideForm: function () {
        MediumEditor.extensions.form.prototype.hideForm.apply(this);
        this.getInput().value = '';
    },

    showForm: function (opts) {
        var input = this.getInput(),
            targetCheckbox = this.getAnchorTargetCheckbox(),
            buttonCheckbox = this.getAnchorButtonCheckbox();

        opts = opts || { value: '' };
        // TODO: This is for backwards compatability
        // We don't need to support the 'string' argument in 6.0.0
        if (typeof opts === 'string') {
            opts = {
                value: opts
            };
        }

        this.base.saveSelection();
        this.hideToolbarDefaultActions();
        MediumEditor.extensions.form.prototype.showForm.apply(this);
        this.setToolbarPosition();

        input.value = opts.value;
        // input.focus();

        // If we have a target checkbox, we want it to be checked/unchecked
        // based on whether the existing link has target=_blank
        if (targetCheckbox) {
            targetCheckbox.checked = opts.target === '_blank';
        }

        // If we have a custom class checkbox, we want it to be checked/unchecked
        // based on whether an existing link already has the class
        if (buttonCheckbox) {
            var classList = opts.buttonClass ? opts.buttonClass.split(' ') : [];
            buttonCheckbox.checked = (classList.indexOf(this.customClassOption) !== -1);
        }

        input.focus();
    },

    // Called by core when tearing down medium-editor (destroy)
    destroy: function () {
        if (!this.form) {
            return false;
        }

        if (this.form.parentNode) {
            this.form.parentNode.removeChild(this.form);
        }

        delete this.form;
    },

    // core methods

    getFormOpts: function (valueOverride) {
        // no notion of private functions? wanted `_getFormOpts`
        var targetCheckbox = this.getAnchorTargetCheckbox(),
            buttonCheckbox = this.getAnchorButtonCheckbox(),
            opts = {
                value: valueOverride || this.getInput().value.trim()
            };

        if (this.linkValidation) {
            opts.value = this.checkLinkFormat(opts.value);
        }

        opts.target = '_self';
        if (targetCheckbox && targetCheckbox.checked) {
            opts.target = '_blank';
        }

        if (buttonCheckbox && buttonCheckbox.checked) {
            opts.buttonClass = this.customClassOption;
        }

        return opts;
    },

    doFormSave: function () {
        var opts = this.getFormOpts();
        this.completeFormSave(opts);
    },

    completeFormSave: function (opts) {
        this.base.restoreSelection();
        this.execAction(this.action, opts);
        this.base.checkSelection();
    },

    ensureEncodedUri: function (str) {
        return str === decodeURI(str) ? encodeURI(str) : str;
    },

    ensureEncodedUriComponent: function (str) {
        return str === decodeURIComponent(str) ? encodeURIComponent(str) : str;
    },

    ensureEncodedParam: function (param) {
        var split = param.split('='),
            key = split[0],
            val = split[1];

        return key + (val === undefined ? '' : '=' + this.ensureEncodedUriComponent(val));
    },

    ensureEncodedQuery: function (queryString) {
        return queryString.split('&').map(this.ensureEncodedParam.bind(this)).join('&');
    },

    checkLinkFormat: function (value) {
        // Matches any alphabetical characters followed by ://
        // Matches protocol relative "//"
        // Matches common external protocols "mailto:" "tel:" "maps:"
        // Matches relative hash link, begins with "#"
        var urlSchemeRegex = /^([a-z]+:)?\/\/|^(mailto|tel|maps):|^\#/i,
            // telRegex is a regex for checking if the string is a telephone number
            telRegex = /^\+?\s?\(?(?:\d\s?\-?\)?){3,20}$/,
            urlParts = value.match(/^(.*?)(?:\?(.*?))?(?:#(.*))?$/),
            path = urlParts[1],
            query = urlParts[2],
            fragment = urlParts[3];

        if (telRegex.test(value)) {
            return 'tel:' + value;
        } else {
            // Check for URL scheme and default to http:// if none found
            return (urlSchemeRegex.test(value) ? '' : 'http://') +
                // Ensure path is encoded
                this.ensureEncodedUri(path) +
                // Ensure query is encoded
                (query === undefined ? '' : '?' + this.ensureEncodedQuery(query)) +
                // Include fragment unencoded as encodeUriComponent is too
                // heavy handed for the many characters allowed in a fragment
                (fragment === undefined ? '' : '#' + fragment);
        }
    },

    doFormCancel: function () {
        this.getInput().value = '';
        this.getInput().focus();
        // this.base.restoreSelection();
        // this.base.checkSelection();
    },

    // form creation and event handling
    attachFormEvents: function (form) {
        var close = form.querySelector('.medium-editor-toolbar-close'),
            save = form.querySelector('.medium-editor-toolbar-save'),
            input = form.querySelector('.medium-editor-toolbar-input');

        // Handle clicks on the form itself
        this.on(form, 'click', this.handleFormClick.bind(this));

        // Handle typing in the textbox
        this.on(input, 'keyup', this.handleTextboxKeyup.bind(this));

        // Handle close button clicks
        this.on(close, 'click', this.handleCloseClick.bind(this));

        // Handle save button clicks (capture)
        this.on(save, 'click', this.handleSaveClick.bind(this), true);
    },

    createForm: function () {
        var doc = this.document,
            form = doc.createElement('div');

        // Anchor Form (div)
        form.className = 'medium-editor-toolbar-form';
        form.id = 'medium-editor-toolbar-form-anchor-' + this.getEditorId();
        form.innerHTML = this.getTemplate();
        this.attachFormEvents(form);

        return form;
    },

    getInput: function () {
        return this.getForm().querySelector('input.medium-editor-toolbar-input');
    },

    getAnchorTargetCheckbox: function () {
        return this.getForm().querySelector('.medium-editor-toolbar-anchor-target');
    },

    getAnchorButtonCheckbox: function () {
        return this.getForm().querySelector('.medium-editor-toolbar-anchor-button');
    },

    handleTextboxKeyup: function (event) {
        // For ENTER -> create the anchor
        if (event.keyCode === MediumEditor.util.keyCode.ENTER) {
            event.preventDefault();
            this.doFormSave();
            return;
        }

        // For ESCAPE -> close the form
        if (event.keyCode === MediumEditor.util.keyCode.ESCAPE) {
            event.preventDefault();
            this.doFormCancel();
        }
    },

    handleFormClick: function (event) {
        // make sure not to hide form when clicking inside the form
        event.stopPropagation();
    },

    handleSaveClick: function (event) {
        // Clicking Save -> create the anchor
        event.preventDefault();
        this.doFormSave();
    },

    handleCloseClick: function (event) {
        // Click Close -> close the form
        event.preventDefault();
        this.doFormCancel();
    }
});

export default Anchor;
