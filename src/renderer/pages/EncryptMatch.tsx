import { useState } from 'react';
import { Typography, Button, Input, Collapse } from 'antd';
import { styled } from 'styled-components';

const Wrapper = styled.div`
  padding: 24px;

  .input {
    margin-bottom: 24px;
  }

  .input-tips {
    position: relative;
    top: 4px;
  }

  .encrypt-card {
    margin-bottom: 20px;

    .encrypt-title {
      margin-bottom: 8px;
      padding-inline: 16px;
      font-weight: 600;
    }

    .encrypt-collapse {
      background-color: #f5f5f5;
      border: 1px solid rgba(5, 5, 5, 0.06);
      border-radius: 8px;
    }
  }
`;

const encryptList = [
  {
    key: 'md5',
    label: 'MD5',
    children: [
      {
        key: 'md5_default',
        label: 'MD5（32位）',
        regx: /^[a-fA-F0-9]{32}$/,
      },
      {
        key: 'md5_mini',
        label: 'MD5（16位）',
        regx: /^[a-fA-F0-9]{16}$/,
      },
    ],
  },
  {
    key: 'sha',
    label: 'SHA',
    children: [
      {
        key: 'sha_1',
        label: 'SHA1',
        regx: /^[a-fA-F0-9]{40}$/,
      },
      {
        key: 'sha_224',
        label: 'SHA224',
        regx: /^[a-fA-F0-9]{56}$/,
      },
      {
        key: 'sha_256',
        label: 'SHA256',
        regx: /^[a-fA-F0-9]{64}$/,
      },
      {
        key: 'sha_384',
        label: 'SHA384',
        regx: /^[a-fA-F0-9]{96}$/,
      },
      {
        key: 'sha_512',
        label: 'SHA512',
        regx: /^[a-fA-F0-9]{128}$/,
      },
    ],
  },
  {
    key: 'base64',
    label: 'Base64',
    regx: /^[A-Za-z0-9+/]+={0,2}$/,
    eval: (v: string) => v.length % 4 === 0,
  },
];

const encryptItemRender = (encrypt: any) => {
  const list = encrypt.children || [encrypt];
  return (
    <>
      <div className="encrypt-card">
        {!!encrypt.children && (
          <div className="encrypt-title">• {encrypt.label}</div>
        )}
        <div className="encrypt-collapse">
          <Collapse
            items={list.map((it: any) => ({
              key: it.key,
              label: it.label,
              children: <p>this is demo.</p>,
              extra: <Button size="small">go</Button>,
            }))}
            ghost
          />
        </div>
      </div>
    </>
  );
};

const EncryptMatch = () => {
  const [value, setValue] = useState('');

  const encryptListRender = (v: string) => {
    return encryptList.map((it) => {
      // prettier-ignore
      const flag = (it: any) => it.regx?.test(v) && (typeof it.eval === 'function' ? it.eval(v) : true)
      if (it.children?.length) {
        const matched = it.children.filter((it2) => flag(it2));
        if (!matched.length) return '';

        return encryptItemRender({
          ...it,
          children: matched,
        });
      }

      if (flag(it))
        return encryptItemRender({
          ...it,
        });

      return '';
    });
  };

  return (
    <Wrapper>
      <div className="input">
        <Input.TextArea
          value={value}
          size="large"
          placeholder="请输入加密后的字符串"
          autoSize={{ minRows: 2, maxRows: 6 }}
          autoFocus
          showCount={{
            formatter: ({ count }) => (
              <Typography.Text type="secondary" className='input-tips'>{count} / ∞</Typography.Text>
            ),
          }}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Typography.Title level={5}>加密算法可能是这些：</Typography.Title>
      {encryptListRender(value)}
    </Wrapper>
  );
};

export default EncryptMatch;
