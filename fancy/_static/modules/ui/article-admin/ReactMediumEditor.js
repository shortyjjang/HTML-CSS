import React from 'react';
import ReactDOM from 'react-dom';
import MediumEditor from 'medium-editor';
import MediumEditorExtensionAnchor from './MediumEditorExt-Anchor';


var mediumEditor;
const EditorControl = {
    get() {
        return mediumEditor;
    },
    refresh(callback) {
        if (this.instance){
            this.instance.props.onChange(this.get().serialize().editable.value, null, callback);
        }
    },
    setInstance(instance) {
        this.instance = instance;
    },
    instance: null,
};
window.EditorControl = EditorControl;

const mediumEditorOptions = {
    toolbar: {
        buttons: [
            'bold', 'italic',
            'justifyLeft',
            'justifyCenter',
            'justifyRight',
            // Seperator
            {
                name: 'h2',
                action: null,
                aria: 'separator',
                tagNames: ['h2'],
                contentDefault: '<span>|</span>',
                classList: ['seperator'],
                attrs: {}
            },
            'anchor2',
        ]
    },
    anchor: {
        placeholderText: 'http://',
    },
    anchorPreview: false,
    imageDragging: false,
    extensions: {
        imageDragging() {}, // make noop extension to completely disable the extension
        // anchor2: new MediumEditor.extensions.anchor2
        anchor2: new MediumEditorExtensionAnchor
    },
    placeholder: {
        text: 'Type your text...',
        hideOnClick: false
    },
    paste: {
        // https://app.asana.com/0/0/791490914896024/f
        handleKeydown: function () { return true; }
    }
};

const MediumEditorExtensionQuote = MediumEditor.extensions.button.extend({
    name: 'quote2',
  
    action: 'blockquote2',
    aria: 'blockquote',
    tagNames: ['blockquote'],
    contentDefault: '<b>&ldquo;</b>',
    contentFA: '<i class="fa fa-quote-right"></i>',

    init() {
        MediumEditor.extensions.button.prototype.init.call(this);
    },
  
    handleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.toggleSelection();
        this.base.checkContentChanged();
    },

    getWrappingBlock() {
        const $sel = $(document.getSelection().baseNode).closest('blockquote');
        return $sel;
    },

    isActivated() {
        return this.getWrappingBlock().length > 0;
    },

    toggleSelection() {
        if (this.isActivated()) {
            document.execCommand('formatBlock', false, 'p');
            const $sel = $(document.getSelection().baseNode);
            let $stuff;
            if (!$sel.is('span')) {
                $stuff = $sel.closest('p > span');
            }
            $stuff.contents().unwrap();
            // FIXME: gotta fix this shit, but don't know how to trigger the lifecycle.
            $('.medium-editor-toolbar-actions .medium-editor-button-active[data-action="blockquote2"], .medium-editor-toolbar-actions .medium-editor-button-active[data-action="italic"]').removeClass('medium-editor-button-active');
        } else {
            EditorControl.get().execAction('append-blockquote');
            const $sel = $(document.getSelection().baseNode);
            let $stuff;
            if ($sel.is('blockquote')) {
                $stuff = $sel.prop('firstChild');
            } else {
                $stuff = $($sel.closest('blockquote').prop('firstChild'));
            }
            if ($stuff) {
                $stuff.wrap && $stuff.wrap('<span />');
            }
        }
    },

    useQueryState: false,

    queryCommandState: function() {
        return this.isActivated();
    },
});

// blockquote shit
if (window.isWhitelabelV2) {
    mediumEditorOptions.toolbar.buttons.push('quote2')
    mediumEditorOptions.extensions.quote2 = new MediumEditorExtensionQuote
} else {
    mediumEditorOptions.toolbar.buttons.push('quote')
}

const mediumInsertAddonOptions = {
    images: {
        fileUploadOptions: {
            url: '/_admin/image-upload-add.json',
            type: 'POST',
            formData(form) {
                return [{
                    name: 'file',
                    value: window.__SECRET__.data.files[0]
                }]
            }
        },
    }
};


// https://github.com/wangzuo/react-medium-editor/pull/36
export default class ReactMediumEditor extends React.Component {
    static defaultProps = {
        tag: 'div'
    };

    constructor(props) {
        super(props);

        this.state = {
            content: this.props.content
        };

        $('.article.edit').on('click', 'p a, blockquote a', function(){
            const href = this.getAttribute('href')
            if (href === '' || href === '#') {
                return;
            }
            MediumEditor.selection.selectNode(this, document)
            mediumEditor.getExtensionByName('anchor2').showForm()
        })

        $(document).on('click', '#medium-editor-toolbar-1 .medium-editor-toolbar-actions', function(evt){
            if ($(evt.currentTarget).is('.medium-editor-toolbar-actions')) { // misclick
                const tb = mediumEditor.getExtensionByName('toolbar')
                if (tb) {
                    tb.hideToolbar()
                }
            }
        })
    }

    componentDidMount() {
        const dom = ReactDOM.findDOMNode(this);
        EditorControl.setInstance(this);
        mediumEditor = new MediumEditor(dom, mediumEditorOptions);
        $(dom).mediumInsert({
            editor: mediumEditor,
            addons: mediumInsertAddonOptions
        });

        function handleBlockquoteInput(event, editable, content, $bq) {
            // autofix
            if ($bq.find('> span').length === 0 && $bq.text().trim().length !== 0) {
                const t = $bq.text();
                const $span = $('<span />');
                $span.text(t)
                $bq.empty();
                $bq.append($span);
            }
            return content
        }

        function handleContent(event, editable, content) {
            const selection = document.getSelection();
            const selectedNode = selection.anchorNode;
            const $bq = $(selectedNode).closest('blockquote');
            if ($bq.length !== 0) {
                content = handleBlockquoteInput(event, editable, content, $bq);
            }
            return content
        }

        mediumEditor.subscribe('editableInput', (event, editable) => {
            this._updated = true;
            this.change(handleContent(event, editable, dom.innerHTML));
        });
        // prevent deletion of first line
        mediumEditor.subscribe("editableKeydown", e => {
            if (e.keyCode === 8) {
                const selection = document.getSelection();
                const $selectedNode = $(selection.anchorNode).closest('.description.more >');
                const onelineStatus = $('.description.more').children().length <= 2;
                const onelineEmpty = $selectedNode.text().trim() === '';

                if (onelineStatus && onelineEmpty) {
                    setTimeout(() => {
                        $('.description.more').prepend('<p class="medium-insert-active"><br></p>');
                        EditorControl.refresh();
                    }, 0)
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }
        });

        if (window.isWhitelabelV2) {
            // close image toolbar when showing content toolbar
            mediumEditor.subscribe('showToolbar', (event, editable) => {
                const d = $('.description.more').data('plugin_mediumInsertImages');
                if (d) {
                    d.unselectImage();
                }
                setTimeout(function() {
                    const mi = $('.description.more').data('plugin_mediumInsert');
                    const submenuOpened = $('.insert-text:visible,.insert-image:visible,.insert-product:visible').length > 0;
                    if (mi && !submenuOpened) {
                        mi.hideOptionPopupV2();
                    }
                }, 200);
            });
        }
    }

    change = (content) => {
        this._editorText = content;
        this.setState({ content });
        if (this.props.onChange) {
            this.props.onChange(content, mediumEditor);
        }
    }

    componentDidUpdate() {
      mediumEditor.restoreSelection();
    }

    componentWillUnmount() {
      mediumEditor.destroy();
      this._editorText = null;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.content !== this._editorText) {
        this.setState({ content: nextProps.content });
      }
      if (this._updated) {
         this._updated = false;
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.style === this.props.style &&
            this._editorText === nextState.content
        ) {
            return false;
        }
        return true;
    }

    render() {
        if (mediumEditor) {
            mediumEditor.saveSelection();
        }
        const Tag = this.props.tag;
        return <Tag {...this.props} dangerouslySetInnerHTML={{ __html: this.state.content }} />
    }
}
