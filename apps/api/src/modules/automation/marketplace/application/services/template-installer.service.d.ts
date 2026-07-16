import { ITemplateInstaller } from '../../domain/ports/template-installer.interface';
import { SignatureVerifierService } from './signature-verifier.service';
import { ExtendedPrismaClient } from '../../../../../infrastructure/database/prisma-extensions';
import { IEventBus } from '../../../application/ports/event-bus.interface';
export declare class TemplateInstallerService implements ITemplateInstaller {
    private readonly verifier;
    private readonly prisma;
    private readonly eventBus;
    constructor(verifier: SignatureVerifierService, prisma: ExtendedPrismaClient, eventBus: IEventBus);
    install(workspaceId: string, templateId: string, version: string, userId: string): Promise<any>;
    rollback(workspaceId: string, installationId: string, targetVersion: string): Promise<any>;
    private publishEvent;
}
