import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AboutMethodologyBlock } from '@/blocks/AboutMethodology/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CapabilitiesBlock } from '@/blocks/Capabilities/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { LogoGridBlock } from '@/blocks/LogoGrid/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MethodologyBlock } from '@/blocks/Methodology/Component'
import { POVArticlesBlock } from '@/blocks/POVArticles/Component'
import { WorkBlock } from '@/blocks/Work/Component'
import { Work2Block } from '@/blocks/Work2/Component'
import { WorkWithUsBlock } from '@/blocks/WorkWithUs/Component'
import { FullWidthBackgroundBlock } from '@/blocks/FullWidthBackground/Component'

const blockComponents = {
  aboutMethodology: AboutMethodologyBlock,
  archive: ArchiveBlock,
  capabilities: CapabilitiesBlock,
  fullWidthBackground: FullWidthBackgroundBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faq: FAQBlock,
  formBlock: FormBlock,
  logoGrid: LogoGridBlock,
  mediaBlock: MediaBlock,
  methodology: MethodologyBlock,
  povArticles: POVArticlesBlock,
  work: WorkBlock,
  work2: Work2Block,
  workWithUs: WorkWithUsBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const anchorId = 'blockName' in block && typeof block.blockName === 'string' && block.blockName
                ? block.blockName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                : undefined

              return (
                <div
                  key={index}
                  className={`block-${blockType}`}
                  {...(anchorId ? { id: anchorId, style: { scrollMarginTop: '150px' } } : {})}
                >
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
