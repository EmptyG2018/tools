import { useState, useEffect, useRef } from 'react';
import {
  message,
  Button,
  Typography,
  Select,
  Checkbox,
  Form,
  Flex,
  Space,
  Divider,
} from 'antd';
import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { styled } from 'styled-components';
import javascriptTheme from '../shared/codemirror.theme.javascript';

const Wrapper = styled.div`
  display: flex;
  height: 100vh;

  .editor {
    position: relative;
    flex: 1 0 0;
    width: 0;
    height: 100%;

    .editor-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      .cm-editor {
        box-sizing: border-box;
        height: 100%;
      }
    }
  }

  .aside {
    display: flex;
    flex-direction: column;
    width: 240px;
    padding: 12px;
    background-color: #f5f5f5;
    border-left: 1px solid #ddd;
  }

  .aside-content {
    flex: 1 0 0;
    height: 0;
  }
`;

const DEFAULT_BEAUTIFIER_CONFIG = {
  indent_size: '4',
  indent_char: ' ',
  max_preserve_newlines: '5',
  preserve_newlines: true,
  keep_array_indentation: false,
  break_chained_methods: false,
  indent_scripts: 'normal',
  brace_style: 'collapse',
  space_before_conditional: true,
  unescape_strings: false,
  jslint_happy: false,
  end_with_newline: false,
  wrap_line_length: '0',
  indent_inner_html: false,
  comma_first: false,
  e4x: false,
  indent_empty_lines: false,
};

const indentSizeOptions = [
  { value: '\t_1', label: '制表符缩进' },
  { value: ' _2', label: '缩进2个空格' },
  { value: ' _4', label: '缩进4个空格' },
  { value: ' _6', label: '缩进6个空格' },
  { value: ' _8', label: '缩进8个空格' },
];

const maxPreserveNewlinesOptions = [
  { value: '-1', label: '不保留换行' },
  { value: '1', label: '允许标签之间有1个换行符' },
  { value: '2', label: '允许标签之间有2个换行符' },
  { value: '5', label: '允许标签之间有5个换行符' },
  { value: '10', label: '允许标签之间有10个换行符' },
  { value: '0', label: '允许标签之间有无限个换行符' },
];

const wrapLineLengthOptions = [
  { value: '0', label: '不换行' },
  { value: '50', label: '超50个字符换行' },
  { value: '100', label: '超100个字符换行' },
  { value: '150', label: '超150个字符换行' },
  { value: '200', label: '超200个字符换行' },
];

function EditableTrueEditor({ editorView, show }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const state = EditorState.create({
        doc: '',
        extensions: [basicSetup, javascript(), javascriptTheme()],
      });
      editorView.current = new EditorView({
        state,
        parent: editorRef.current,
      });
    }

    return () => {
      editorView.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (show && editorView.current) {
      editorView.current.focus();
    }
  }, [show])

  return (
    <div
      className="editor-view"
      style={{ display: show ? 'block' : 'none' }}
      ref={editorRef}
    />
  );
}

let pressTimer: any = null;
const LONG_PRESS_DURATION = 500;

function EditableFalseEditor({ editorView, show, onDblclick, onLongPress }) {
  const editorRef = useRef(null);

  const customDoubleClickHandler = EditorView.domEventHandlers({
    mousedown: (event, ...args) => {
      pressTimer = setTimeout(() => {
        onLongPress?.(event, ...args);
      }, LONG_PRESS_DURATION);
    },
    mouseup: () => {
      clearTimeout(pressTimer);
    },
    mouseleave: () => {
      clearTimeout(pressTimer);
    },

    dblclick: (event, ...args) => {
      onDblclick?.(event, ...args);
      event.preventDefault();
      return true;
    },
  });

  useEffect(() => {
    if (editorRef.current) {
      const state = EditorState.create({
        doc: '',
        extensions: [
          basicSetup,
          EditorState.readOnly.of(true),
          customDoubleClickHandler,
          javascript(),
          javascriptTheme(),
        ],
      });
      editorView.current = new EditorView({
        state,
        parent: editorRef.current,
      });
    }

    return () => {
      editorView.current?.destroy();
    };
  }, []);

  return (
    <div
      className="editor-view"
      style={{ display: show ? 'block' : 'none' }}
      ref={editorRef}
    />
  );
}

function Beautifier() {
  const [form] = Form.useForm();
  const [editShow, setEditShow] = useState(true);
  const beautify = useRef<any>(null);
  const editableTrueEditorView = useRef<EditorView>();
  const editableFalseEditorView = useRef<EditorView>();

  useEffect(() => {
    import('./beautify.min.js')
      .then((res) => {
        beautify.current = res.js_beautify;
        return '';
      })
      .catch(() => {});

    return () => {
      beautify.current = null;
    };
  }, []);

  const onFormat = () => {
    if (
      !editableTrueEditorView.current ||
      !editableFalseEditorView.current ||
      !beautify.current
    )
      return;

    const { indent_size, ...rest } = form.getFieldsValue();
    const doc = editableTrueEditorView.current.state.doc.toString();

    const formatted = beautify.current(doc, {
      ...DEFAULT_BEAUTIFIER_CONFIG,
      indent_size: indent_size.split('_')[1],
      indent_char: indent_size.split('_')[0],
      ...rest,
    });

    const to = editableFalseEditorView.current.state.doc.length;
    const transaction = editableFalseEditorView.current.state.update({
      changes: { from: 0, to, insert: formatted },
    });
    editableFalseEditorView.current.dispatch(transaction);
    setEditShow(false);
  };

  return (
    <Wrapper>
      <div className="editor">
        <EditableTrueEditor
          editorView={editableTrueEditorView}
          show={editShow}
        />
        <EditableFalseEditor
          editorView={editableFalseEditorView}
          show={!editShow}
          onDblclick={() => {
            setEditShow(true);
          }}
          onLongPress={(_, eidtorView) => {
            const doc = eidtorView.state.doc.toString();
            navigator.clipboard.writeText(doc).then(() => {
              message.success('复制成功！');
            });
          }}
        />
      </div>
      <div className="aside">
        <div className="aside-content">
          <Typography.Title level={5}>选项</Typography.Title>
          <Form
            form={form}
            initialValues={{
              indent_size: ' _2',
              max_preserve_newlines: '2',
              wrap_line_length: '0',
              unescape_strings: true,
              jslint_happy: false,
            }}
          >
            <Form.Item name="indent_size">
              <Select options={indentSizeOptions} />
            </Form.Item>
            <Form.Item name="max_preserve_newlines">
              <Select options={maxPreserveNewlinesOptions} />
            </Form.Item>
            <Form.Item name="wrap_line_length">
              <Select options={wrapLineLengthOptions} />
            </Form.Item>
            <Form.Item name="unescape_strings" valuePropName="checked">
              <Checkbox>解转义\xNN 或 \uNNNN</Checkbox>
            </Form.Item>
            <Form.Item name="jslint_happy" valuePropName="checked">
              <Checkbox>启用JSLint严格检查模式</Checkbox>
            </Form.Item>
          </Form>
        </div>
        <Flex style={{ marginBottom: 12 }} justify="center">
          <Space split={<Divider type="vertical" />}>
            <Typography.Text type="secondary">双击编辑代码</Typography.Text>
            <Typography.Text type="secondary">长按复制代码</Typography.Text>
          </Space>
        </Flex>
        <Button type="primary" block size="large" onClick={onFormat}>
          格式化
        </Button>
      </div>
    </Wrapper>
  );
}

export default Beautifier;
