import { Fragment, useState, useEffect } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import versions from '@/versions.json'

function Fence({ children, language }) {
  let [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 1500)
      return () => clearTimeout(t)
    }
  }, [copied])

  // XXX: Hack... to render the version number in the
  // code block. TODO, figure out how to pre-process
  // with Markdoc since the default `fence` supports
  // `process=true` to render tags within the block.
  if (typeof children === 'object') {
    children = children
      .map((child) => {
        if (child.type?.name === 'Version') {
          return versions[child.props.name] || ''
        } else {
          return child
        }
      })
      .join('')
  }

  return (
    <div className="group relative">
      <Highlight {...defaultProps} code={children.trimEnd()} language={language} theme={undefined}>
        {({ className, style, tokens, getTokenProps }) => (
          <pre className={className} style={style}>
            <code className="peer pr-16">
              {tokens.map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {line
                    .filter((token) => !token.empty)
                    .map((token, tokenIndex) => (
                      <span key={tokenIndex} {...getTokenProps({ token })} />
                    ))}
                  {'\n'}
                </Fragment>
              ))}
            </code>
          </pre>
        )}
      </Highlight>

      <CopyToClipboard text={children.trimEnd()} onCopy={() => setCopied(true)}>
        <button className="invisible absolute top-0 right-0 rounded-tr-xl bg-gray-800 px-4 py-2 text-xs uppercase text-sky-500 group-hover:visible">
          {copied ? '🎉 copied!' : 'copy'}
        </button>
      </CopyToClipboard>
    </div>
  )
}

export default {
  render: Fence,
  attributes: {
    language: {
      type: String,
    },
  },
}
