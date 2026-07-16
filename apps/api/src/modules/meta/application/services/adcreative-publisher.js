"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdCreativePublisher = void 0;
const common_1 = require("@nestjs/common");
const adcreative_publish_exceptions_1 = require("../../../../common/exceptions/adcreative-publish.exceptions");
let AdCreativePublisher = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdCreativePublisher = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AdCreativePublisher = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        graphClient;
        constructor(graphClient) {
            this.graphClient = graphClient;
        }
        async publish(adCreative, pageExternalId, instagramExternalId, accessToken, adAccountExternalId) {
            try {
                const cleanAdAccountId = adAccountExternalId.startsWith('act_')
                    ? adAccountExternalId
                    : `act_${adAccountExternalId}`;
                const payload = {
                    name: adCreative.name,
                };
                if (adCreative.creativeType === 'EXISTING_POST') {
                    payload.object_story_id = adCreative.mediaAssetId;
                }
                else {
                    const objectStorySpec = {
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
                    }
                    else if (adCreative.creativeType === 'VIDEO') {
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
                    }
                    else if (adCreative.creativeType === 'CAROUSEL') {
                        const spec = adCreative.creativeSpec;
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
                    }
                    else if (adCreative.creativeType === 'COLLECTION') {
                        const spec = adCreative.creativeSpec;
                        objectStorySpec.template_data = spec.template_data || {};
                    }
                    payload.object_story_spec = objectStorySpec;
                }
                const response = await this.graphClient.post(`${cleanAdAccountId}/adcreatives`, accessToken, payload);
                if (!response || !response.id) {
                    throw new adcreative_publish_exceptions_1.FacebookPublishException('Invalid empty Ad Creative response received from Meta Graph API');
                }
                return {
                    externalCreativeId: response.id,
                    rawResponse: response,
                };
            }
            catch (e) {
                throw new adcreative_publish_exceptions_1.FacebookPublishException(e.message || 'Error occurred during Graph API publish operation', e.response?.data);
            }
        }
    };
    return AdCreativePublisher = _classThis;
})();
exports.AdCreativePublisher = AdCreativePublisher;
//# sourceMappingURL=adcreative-publisher.js.map