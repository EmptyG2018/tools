import { useEffect, useRef } from 'react';
import { placeholder } from '@codemirror/view';
import { MergeView } from '@codemirror/merge';
import { basicSetup } from 'codemirror';
import docTheme from '../shared/codemirror.theme.doc';

function DiffText() {
  const editorRef = useRef(null);
  const viewRef = useRef<MergeView>(null);

  useEffect(() => {
    if (editorRef.current) {
      viewRef.current = new MergeView({
        orientation: 'a-b',
        revertControls: 'a-to-b',
        a: {
          extensions: [basicSetup, placeholder('请输入内容'), docTheme()],
        },
        b: {
          extensions: [basicSetup, placeholder('请输入内容'), docTheme()],
        },
        parent: editorRef.current,
      });
    }

    return () => {
      viewRef.current?.destroy();
    };
  }, []);

  return <div ref={editorRef} />;
}

export default DiffText;
