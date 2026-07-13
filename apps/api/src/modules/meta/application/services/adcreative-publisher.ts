import { Injectable } from '@nestjs/common';
import { AdCreative } from '@prisma/client';
import { IAdCreativePublisher, IMetaAdCreativePublishResult } from './adcreative-publisher.interface';
import { MetaGraphClient } from '../../infrastructure/oauth/meta-graph-client';
import { FacebookPublishException } from '../../../../common/exceptions/adcreative-publish.exceptions';

@Injectable()
export class AdCreativePublisher implements IAdCreativePublisher {
  constructor(private readonly graphClient: MetaGraphClient) {}

  async publish(
    adCreative: AdCreative,
    pageExternalId: string,
    instagramExternalId: string | null,
    accessToken: string,
    adAccountExternalId: string,
  ): Promise<IMetaAdCreativePublishResult> {
    try {
      const cleanAdAccountId = adAccountExternalId.startsWith('act_')
        ? adAccountExternalId
        : `act_${adAccountExternalId}`;

      const payload: Record<string, any> = {
        name: adCreative.name,
      };

      if (adCreative.creativeType === 'EXISTING_POST') {
        payload.object_story_id = adCreative.mediaAssetId;
      } else {
        const objectStorySpec: Record<string, any> = {
          page_id: pageExternalId,
        };

        if (instagramExternalId) {
          objectStorySpec.instagram_actor_id = instagramExternalId;
        }

        if (adCreative.creativeType === 'IMAGE') {
          objectStorySpec.link_data = {
            link: adCreative.destinationUrl,
            message: adCreative.primaryText,
            name: adCreative.headline,
            caption: adCreative.displayLink || adCreative.caption || undefined,
            description: adCreative.description || undefined,
            image_hash: adCreative.mediaAssetId,
            call_to_action: {
              type: adCreative.callToAction,
              value: {
                link: adCreative.destinationUrl,
              },
            },
          };
        } else if (adCreative.creativeType === 'VIDEO') {
          objectStorySpec.video_data = {
            video_id: adCreative.mediaAssetId,
            message: adCreative.primaryText,
            title: adCreative.headline,
            call_to_action: {
              type: adCreative.callToAction,
              value: {
                link: adCreative.destinationUrl,
              },
            },
          };
        } else if (adCreative.creativeType === 'CAROUSEL') {
          const spec = adCreative.creativeSpec as any;
          objectStorySpec.link_data = {
            link: adCreative.destinationUrl,
            message: adCreative.primaryText,
            call_to_action: {
              type: adCreative.callToAction,
              value: {
                link: adCreative.destinationUrl,
              },
            },
            child_attachments: spec.cards || [],
          };
        } else if (adCreative.creativeType === 'COLLECTION') {
          const spec = adCreative.creativeSpec as any;
          objectStorySpec.template_data = spec.template_data || {};
        }

        payload.object_story_spec = objectStorySpec;
      }

      const response = await this.graphClient.post<any>(
        `${cleanAdAccountId}/adcreatives`,
        accessToken,
        payload,
      );

      if (!response || !response.id) {
        throw new FacebookPublishException('Invalid empty Ad Creative response received from Meta Graph API');
      }

      return {
        externalCreativeId: response.id,
        rawResponse: response,
      };
    } catch (e: any) {
      throw new FacebookPublishException(e.message || 'Error occurred during Graph API publish operation', e.response?.data);
    }
  }
}
